"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 16, {
      animate: true,
    });

    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
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
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-2xl bg-rose-50 p-6 text-center text-base font-bold text-rose-800">
        সঠিক Latitude এবং Longitude পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="h-[340px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-lg md:h-[420px]">
      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom
        zoomControl
        className="h-full w-full"
        style={{
          height: "100%",
          width: "100%",
          minHeight: "340px",
        }}
      >
        <RecenterMap lat={lat} lng={lng} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[lat, lng]}
          icon={markerIcon}
        >
          <Popup>
            <strong>{label}</strong>
            <br />
            Latitude: {lat.toFixed(6)}
            <br />
            Longitude: {lng.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}