import { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchBar from "./SearchBar";
import { MdLocationPin } from "react-icons/md";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function MapController({ selectedLocation }) {
  const map = useMap();
  if (selectedLocation) {
    map.flyTo([selectedLocation.lat, selectedLocation.lon], 13, {
      animate: true,
      duration: 2,
    });
  }
  return null;
}

function App() {
  const [openingSearchBar, setOpeningSearchBar] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Mumbai, India",
    lat: 19.076,
    lon: 72.8777,
  });

  return (
    <div className="">
      <div className="flex absolute left-16 top-5 z-10 items-center space-x-2">
        <input
          onClick={() => setOpeningSearchBar(true)}
          placeholder="Search locations..."
          className="py-1.5 px-4 w-60 sm:w-80 rounded-full border border-gray-300"
        />
        <button className="bg-[#333333] text-white p-2 rounded-full">
          <FaSearchLocation size={20} />
        </button>
      </div>
     <div className="flex justify-end">
     <button className="absolute m-7 bg-white p-2 z-10 rounded-full bottom-0">
        <MdLocationPin size={30} />
      </button>
     </div>

      <MapContainer
        center={[selectedLocation.lat, selectedLocation.lon]}
        zoom={13}
        className="h-screen w-full z-0 rounded-lg border"
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

        <MapController selectedLocation={selectedLocation} />
      </MapContainer>

      

      {openingSearchBar && (
        <SearchBar
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setopeningSearchBar={setOpeningSearchBar}
        />
      )}
    </div>
  );
}

export default App;
