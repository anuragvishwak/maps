import React, { useEffect, useState } from "react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";

function SearchBar({
  setSourceCoords,
  setDestinationCoords,
  setopeningSearchBar, 
  setQuery,
  sourceCoords,
  destinationCoords,
  selectedLocation,
}) {
  const [source, setSource] = useState(selectedLocation?.name || "");
  const [destination, setdestination] = useState(selectedLocation?.name || "");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);


  const fetchLocations = async (input, field) => {
    if (!input) {
      if (field === "source") setSourceSuggestions([]);
      else setDestinationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          input
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (field === "source") setSourceSuggestions(data);
      else setDestinationSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            setSource(data.display_name);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const calculateDistance = (sourceCoords, destinationCoords) => {
    if (!sourceCoords || !destinationCoords) return null;

    const R = 6371;
    const dLat = ((destinationCoords.lat - sourceCoords.lat) * Math.PI) / 180;
    const dLon = ((destinationCoords.lon - sourceCoords.lon) * Math.PI) / 180;

    const lat1 = (sourceCoords.lat * Math.PI) / 180;
    const lat2 = (destinationCoords.lat * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(2);
  };

  const handleSelect = (place, field) => {
    const coords = {
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    };

    if (field === "source") {
      setSource(place.display_name);
      setSourceCoords(coords);
      setSourceSuggestions([]);
    } else if (field === "destination") {
      setdestination(place.display_name);
      setDestinationCoords(coords);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    setSource(selectedLocation?.name || "");
    setdestination(selectedLocation?.name || "");
  }, [selectedLocation]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white overflow-auto absolute top-0 sm:top-24 left-0 sm:left-10 z-10 shadow-2xl w-full sm:w-[640px] sm:h-96 h-screen p-4 sm:rounded"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center mb-5 space-x-2">
            <p className="text-xl text-[#333333] font-bold">Source</p>
            <FaArrowRightArrowLeft className="text-[#333333]" size={18} />
            <p className="text-xl text-[#333333] font-bold">Destination</p>
          </div>
          <button onClick={() => setopeningSearchBar(false)}>
            <RxCross2 size={30} />
          </button>
        </div>

        <div className="sm:flex sm:space-x-3 w-full">
          <div className="w-full">
            <input
              value={source}
              onChange={(e) => {
                const value = e.target.value;
                setSource(value);
                setQuery(value);
                fetchLocations(value, "source");
              }}
              placeholder="Source"
              className="border mb-2 sm:mb-0 font-semibold px-2.5 py-1.5 rounded w-full border-gray-400"
            />

            <ul>
              {sourceSuggestions.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handleSelect(place, "source")}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          </div>

          <FaArrowRightArrowLeft
            className="text-[#333333] hidden sm:block mt-2"
            size={30}
          />

          <div className="w-full">
            <input
              value={destination}
              onChange={(e) => {
                const value = e.target.value;
                setdestination(value);
                setQuery(value);
                fetchLocations(value, "destination");
              }}
              placeholder="Destination"
              className="border font-semibold px-2.5 py-1.5 rounded w-full border-gray-400"
            />

            <ul>
              {destinationSuggestions.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handleSelect(place, "destination")}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 text-center text-lg font-semibold">
            {sourceCoords && destinationCoords && (
              <p>
                Distance: {calculateDistance(sourceCoords, destinationCoords)}{" "}
                km
              </p>
            )}
          </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SearchBar;
