import React, { useState } from "react";
import { FaSearch, FaSearchLocation } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";

function SearchBar({ setopeningSearchBar, setSelectedLocation }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

    setopeningSearchBar(false);
  };

  return (
    <div className="bg-black z-50 flex flex-col justify-center items-center fixed inset-0 bg-opacity-70">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white overflow-auto w-full sm:w-auto h-screen sm:h-[600px] p-4 sm:rounded"
        >
          <div className="flex items-center justify-between">
            <p className="text-2xl text-[#333333] font-bold">
              Search Locations
            </p>
            <button onClick={() => setopeningSearchBar(false)}>
              <RxCross2 size={30} />
            </button>
          </div>

          <div className="flex my-4 items-start w-full space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchLocations(e.target.value);
              }}
              placeholder="Search Locations"
              className="border border-gray-400 rounded-full py-1 px-3 w-full sm:w-96"
            />
            <button
              onClick={() => setopeningSearchBar(false)}
              className="bg-[#333333] text-white p-2.5 rounded-full"
            >
              <div>
                <FaSearch size={16} />
              </div>
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="mt-2 border rounded-lg bg-white shadow-lg ">
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
