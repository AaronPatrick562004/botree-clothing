"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Botree Clothing store location (Pune - Dhankawadi)
const storeLocation = {
  lat: 18.4589,  // Latitude for Dhankawadi, Pune
  lng: 73.8497   // Longitude for Dhankawadi, Pune
};

export default function MapLeaflet() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    fixLeafletIcons();

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([storeLocation.lat, storeLocation.lng], 17);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add a marker with your full address in the popup
      L.marker([storeLocation.lat, storeLocation.lng])
        .addTo(map)
        .bindPopup(`
          <b>Botree Clothing</b><br>
          1st floor, Megh Malhar Bungalow<br>
          Sr. No. 30,31, plot No. 10<br>
          Pune - Satara Rd, New Nurses Town Co Operative Society<br>
          Dhankawadi, Pune<br>
          Maharashtra 411043
        `)
        .openPopup();

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full min-h-100 rounded-lg" />;
}