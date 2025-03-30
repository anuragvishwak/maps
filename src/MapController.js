import { useEffect } from "react";
import { useMapEvent } from "react-leaflet";

function MapController({ selectedLocation, setSuggestions }) {
  const map = useMapEvent("moveend", () => {
    setSuggestions([]); 
  });

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lon], 13, {
        animate: true,
        duration: 2,
      });
    }
  }, [selectedLocation, map]);

  return null;
}

export default MapController;
