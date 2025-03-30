import { useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchBar from "./SearchBar";
import { MdLocationPin } from "react-icons/md";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import MapController from "./MapController";
import { Polyline } from "react-leaflet";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function App() {
  const [openingSearchBar, setOpeningSearchBar] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);


  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({
            name: "Your Current Location",
            lat: latitude,
            lon: longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSelect = (place) => {
    setSelectedLocation({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    });
    localStorage.setItem("recent location", "something to written here");
  };

  const fetchLocations = async (input) => {
    if (!input) return setSuggestions([]);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
    );
    const data = await response.json();
    setSuggestions(data);
  };

  useEffect(() => {
    if (sourceCoords && destinationCoords) {
      if (window.innerWidth < 768) {
        setOpeningSearchBar(false);
      }
    }
  }, [sourceCoords, destinationCoords]);

  return (
    <div className="">
      <div className="flex absolute sm:w-5/12 bg-white py-2 px-2 rounded-full shadow-2xl sm:left-10 sm:top-5 m-4 sm:m-0 z-10 items-center space-x-2">
        <input
          onChange={(e) => {
            setQuery(e.target.value);
            fetchLocations(e.target.value);
          }}
          placeholder="Search locations..."
          className="py-1.5 px-4 w-60 sm:w-full rounded-full border border-gray-300"
        />
        <button
          onClick={() => setOpeningSearchBar(true)}
          className="text-white bg-[#333333] rounded-full font-semibold py-1.5 px-4"
        >
          Travel
        </button>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleCurrentLocation}
          className="absolute m-7  bg-white p-2 z-10 rounded-full bottom-0"
        >
          <MdLocationPin size={30} />
        </button>
      </div>

      <div
        className={`absolute top-16 sm:top-20 left-4 sm:left-10 w-[335px] sm:w-[640px] z-10 ${
          openingSearchBar === true ? "hidden" : "block"
        }`}
      >
        {suggestions.length > 0 && (
          <ul className="mt-5 border bg-white p-5 h-96 overflow-auto rounded-2xl shadow-lg">
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                onClick={() => handleSelect(place)}
                className="py-1 cursor-pointer hover:bg-gray-200"
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <MapContainer
          center={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : [20, 0]} 
          zoom={selectedLocation ? 13 : 2} // Zoom out initially
        
        zoomControl={false}
        className="h-screen z-0 w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

{selectedLocation && selectedLocation.lat && selectedLocation.lon && (
  <Marker position={[selectedLocation.lat, selectedLocation.lon]} icon={customIcon}>
    <Popup>{selectedLocation.name || "Selected Location"}</Popup>
  </Marker>
)}


        {sourceCoords && (
          <Marker
            position={[sourceCoords.lat, sourceCoords.lon]}
            icon={customIcon}
          >
            <Popup>Source: {sourceCoords.name || "Selected Source"}</Popup>
          </Marker>
        )}

        {destinationCoords && (
          <Marker
            position={[destinationCoords.lat, destinationCoords.lon]}
            icon={customIcon}
          >
            <Popup>
              Destination: {destinationCoords.name || "Selected Destination"}
            </Popup>
          </Marker>
        )}

        {sourceCoords && destinationCoords && (
          <Polyline
            positions={[
              [sourceCoords.lat, sourceCoords.lon],
              [destinationCoords.lat, destinationCoords.lon],
            ]}
            color="blue"
          />
        )}

        <MapController
          selectedLocation={selectedLocation}
          setSuggestions={setSuggestions}
          sourceCoords={sourceCoords}
          destinationCoords={destinationCoords}
        />
      </MapContainer>

      {openingSearchBar && (
        <SearchBar
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setopeningSearchBar={setOpeningSearchBar}
          setSuggestions={setSuggestions}
          suggestions={suggestions}
          query={query}
          setQuery={setQuery}
          fetchLocations={fetchLocations}
          setSourceCoords={setSourceCoords}
          setDestinationCoords={setDestinationCoords}
          sourceCoords={sourceCoords}
          destinationCoords={destinationCoords}
        />
      )}
    </div>
  );
}

export default App;
