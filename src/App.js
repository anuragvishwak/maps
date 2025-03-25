import { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for missing marker icons in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    name: "No location selected",
    lat: 51.505, // Default to London
    lon: -0.09,
  });

  const fetchLocations = async (input) => {
    if (!input) return setSuggestions([]);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
    );
    const data = await response.json();
    setSuggestions(data);
  };

  const handleSelect = (place) => {
    setSelectedLocation({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    });
    setSuggestions([]);
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchLocations(e.target.value);
          }}
          placeholder="Search locations..."
          className="py-1.5 px-4 w-80 rounded-full border border-gray-300"
        />
        <button className="bg-[#333333] text-white p-2 rounded-full">
          <FaSearchLocation size={20} />
        </button>
      </div>

     
      <div className="absolute z-50">
      {suggestions.length > 0 && (
        <ul className="mt-2 border rounded-lg bg-white shadow-lg w-80">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
      </div>

      <p className="mt-4">Selected Location: {selectedLocation.name}</p>

     <div className="">
     <MapContainer
        center={[selectedLocation.lat, selectedLocation.lon]}
        zoom={13}
        className="h-96 w-full mt-4 rounded-lg border"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[selectedLocation.lat, selectedLocation.lon]} icon={customIcon}>
          <Popup>{selectedLocation.name}</Popup>
        </Marker>
      </MapContainer>
     </div>
    </div>
  );
}

export default App;
