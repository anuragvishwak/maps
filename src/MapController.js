import { useEffect } from "react";
import { useMapEvent } from "react-leaflet";

function MapController({ selectedLocation, sourceCoords, destinationCoords, setSuggestions }) {
  const map = useMapEvent("moveend", () => {
    setSuggestions([]); 
  });

  useEffect(() => {
    if (sourceCoords && destinationCoords) {
      // Fit both source and destination inside the map with animation
      const bounds = [
        [sourceCoords.lat, sourceCoords.lon],
        [destinationCoords.lat, destinationCoords.lon],
      ];
      map.flyToBounds(bounds, { padding: [50, 50], duration: 2 });
    } else if (selectedLocation) {
      // Fly to selected location
      map.flyTo([selectedLocation.lat, selectedLocation.lon], 13, { animate: true, duration: 2 });
    }
  }, [selectedLocation, sourceCoords, destinationCoords, map]);

  return null;
}

export default MapController;
