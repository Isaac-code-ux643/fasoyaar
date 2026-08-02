"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

export type MapMarker = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  price?: number | null;
};

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38"><path fill="#dc2626" stroke="#ffffff" stroke-width="1.5" d="M15 1C7.8 1 2 6.8 2 14c0 9.8 13 23 13 23s13-13.2 13-23C28 6.8 22.2 1 15 1z"/><circle cx="15" cy="14" r="5" fill="#ffffff"/></svg>`;

export default function MapView({
  markers,
  center,
  zoom = 13,
  height = "h-[420px]",
}: {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersKey = markers
    .map((m) => `${m.id}:${m.latitude},${m.longitude}`)
    .join("|");

  useEffect(() => {
    let map: LeafletMap | null = null;
    let disposed = false;

    async function init() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (disposed || !containerRef.current) return;

      const defaultCenter: [number, number] =
        center ?? (markers.length > 0 ? [markers[0].latitude, markers[0].longitude] : [12.3714, -1.5197]);

      map = L.map(containerRef.current, {
        center: defaultCenter,
        zoom,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      for (const m of markers) {
        const icon = L.divIcon({
          html: PIN_SVG,
          className: "",
          iconSize: [30, 38],
          iconAnchor: [15, 38],
          popupAnchor: [0, -34],
        });
        const popupLines = [`<b>${escapeHtml(m.name)}</b>`, escapeHtml(m.address)];
        if (m.price != null) popupLines.push(`<b>${new Intl.NumberFormat("fr-FR").format(m.price)} FCFA</b>`);
        L.marker([m.latitude, m.longitude], { icon })
          .addTo(map)
          .bindPopup(popupLines.join("<br>"));
      }

      setTimeout(() => map?.invalidateSize(), 50);
    }

    void init();

    return () => {
      disposed = true;
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersKey, center, zoom]);

  return <div ref={containerRef} className={`${height} w-full overflow-hidden rounded-2xl`} />;
}
