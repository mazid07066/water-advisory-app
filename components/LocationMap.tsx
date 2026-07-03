"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 16, {
      animate: true,
    });
  }, [lat, lng, map]);

  return null;
}

export default function LocationMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 shadow-lg">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom={true}
        zoomControl={true}
        style={{ height: "300px", width: "100%" }}
      >
        <RecenterMap lat={lat} lng={lng} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>
            <strong>{label}</strong>
            <br />
            Lat: {lat.toFixed(6)}
            <br />
            Lng: {lng.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}