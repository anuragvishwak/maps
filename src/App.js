import { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchBar from "./SearchBar";
import { MdLocationPin } from "react-icons/md";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import MapController from "./MapController";

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
  // const [suggestionBox, setsuggestionBox] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Mumbai, India",
    lat: 19.076,
    lon: 72.8777,
  });

  const handleSelect = (place) => {
    setSelectedLocation({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    });
    localStorage.setItem("recent location", "something to written here");
    // setOpeningSearchBar(false);
  };

  const fetchLocations = async (input) => {
    if (!input) return setSuggestions([]);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
    );
    const data = await response.json();
    setSuggestions(data);
  };

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
        <button className="absolute m-7  bg-white p-2 z-10 rounded-full bottom-0">
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
        setSuggestions={setSuggestions}
        center={[selectedLocation.lat, selectedLocation.lon]}
        zoom={13}
        zoomControl={false}
        className="h-screen z-0 w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[selectedLocation.lat, selectedLocation.lon]}
          icon={customIcon}
        >
          <Popup>{selectedLocation.name}</Popup>
        </Marker>

        <MapController
          selectedLocation={selectedLocation}
          setSuggestions={setSuggestions}
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
        />
      )}
    </div>
  );
}

export default App;
