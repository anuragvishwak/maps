import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapAnimator({ sourceCoords, destinationCoords }) {
  const map = useMap();

  useEffect(() => {
    if (sourceCoords && destinationCoords) {
      // Fly to midpoint with zoom
      const midLat = (sourceCoords.lat + destinationCoords.lat) / 2;
      const midLon = (sourceCoords.lon + destinationCoords.lon) / 2;
      map.flyTo([midLat, midLon], 13, { duration: 2 });
    } else if (sourceCoords) {
      // Fly to source if only source is set
      map.flyTo([sourceCoords.lat, sourceCoords.lon], 13, { duration: 2 });
    } else if (destinationCoords) {
      // Fly to destination if only destination is set
      map.flyTo([destinationCoords.lat, destinationCoords.lon], 13, { duration: 2 });
    }
  }, [sourceCoords, destinationCoords, map]);

  return null; // No UI, only side effect
}

export default MapAnimator;
