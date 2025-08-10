import { useEffect, useRef } from "react";
import { Donor } from "@shared/schema";
import * as L from "leaflet";

declare global {
  interface Window {
    L: typeof L;
  }
}

interface InteractiveMapProps {
  donors: Donor[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function InteractiveMap({ 
  donors, 
  center = [19.0760, 72.8777], // Mumbai coordinates
  zoom = 12,
  height = "400px"
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize map
    mapInstanceRef.current = window.L.map(mapRef.current).setView(center, zoom);

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Add markers for donors
    donors.forEach((donor, index) => {
      if (donor.latitude && donor.longitude) {
        const lat = parseFloat(donor.latitude);
        const lng = parseFloat(donor.longitude);
        
        // Create custom icon based on availability
        const iconColor = donor.isAvailable ? '#00FF88' : '#FF6B6B';
        
        const marker = window.L.marker([lat, lng])
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-gray-900">${donor.fullName}</h3>
              <p class="text-sm text-gray-600">Blood Type: ${donor.bloodType}</p>
              <p class="text-sm text-gray-600">Rating: ${donor.rating || "4.5"}⭐</p>
              <p class="text-sm ${donor.isAvailable ? 'text-green-600' : 'text-red-600'}">
                ${donor.isAvailable ? 'Available' : 'Not Available'}
              </p>
            </div>
          `);

        // Add bounce animation on hover
        marker.on('mouseover', function(this: L.Marker) {
          this.setOpacity(0.8);
        });
        
        marker.on('mouseout', function(this: L.Marker) {
          this.setOpacity(1);
        });
      }
    });

    // Add a few sample blood bank markers
    const bloodBanks = [
      { name: "City Blood Bank", lat: 19.0896, lng: 72.8656 },
      { name: "Metro Hospital Blood Center", lat: 19.0544, lng: 72.8324 },
      { name: "Emergency Blood Bank", lat: 19.1197, lng: 72.9061 }
    ];

    bloodBanks.forEach(bank => {
      window.L.marker([bank.lat, bank.lng])
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-gray-900">${bank.name}</h3>
            <p class="text-sm text-gray-600">Blood Bank</p>
            <p class="text-sm text-green-600">Open 24/7</p>
            <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs">
              Get Directions
            </button>
          </div>
        `);
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [donors, center, zoom]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        style={{ height }}
        className="rounded-xl overflow-hidden"
        data-testid="interactive-map"
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
        <button 
          className="bg-dark-300 hover:bg-dark-400 p-3 rounded-lg transition-colors border border-dark-400"
          onClick={() => mapInstanceRef.current?.zoomIn()}
          data-testid="button-zoom-in"
        >
          <i className="fas fa-plus text-white"></i>
        </button>
        <button 
          className="bg-dark-300 hover:bg-dark-400 p-3 rounded-lg transition-colors border border-dark-400"
          onClick={() => mapInstanceRef.current?.zoomOut()}
          data-testid="button-zoom-out"
        >
          <i className="fas fa-minus text-white"></i>
        </button>
        <button 
          className="bg-dark-300 hover:bg-dark-400 p-3 rounded-lg transition-colors border border-dark-400"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                mapInstanceRef.current?.setView([latitude, longitude], 14);
              });
            }
          }}
          data-testid="button-locate"
        >
          <i className="fas fa-location-arrow text-white"></i>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-dark-300/90 backdrop-blur-sm rounded-lg p-3 border border-dark-400 z-[1000]">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent-green rounded-full mr-2"></div>
            <span className="text-gray-300">Available Donors</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent-coral rounded-full mr-2"></div>
            <span className="text-gray-300">Blood Banks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
