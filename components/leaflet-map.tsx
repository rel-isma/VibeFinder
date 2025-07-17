import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  lat: number;
  lng: number;
}

export default function LeafletMap({ lat, lng }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);

    return () => {
      map.remove();
    };
  }, [lat, lng]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
} 