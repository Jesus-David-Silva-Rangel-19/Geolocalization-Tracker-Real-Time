
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Loader2 } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

const LocationTracker = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [routeInfo, setRouteInfo] = useState<string>('');

  useEffect(() => {
    // Initialize map
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdHVzZXIiLCJhIjoiY2thbXBib3BmMDBtYTJ4bngwMTIwanM4byJ9.YZ8Q-1qpk4R-H4S6uTG1Pg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 15,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async position => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Update location state
          setLocation(newLocation);

          // Update map center
          map.current?.flyTo({
            center: [newLocation.lng, newLocation.lat],
            essential: true
          });

          // Update or create marker
          if (!marker.current) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.innerHTML = `
              <div class="w-4 h-4 bg-accent rounded-full animate-pulse-dot shadow-lg"></div>
              <div class="w-8 h-8 bg-accent/30 rounded-full absolute -inset-2"></div>
            `;
            
            marker.current = new mapboxgl.Marker(el)
              .setLngLat([newLocation.lng, newLocation.lat])
              .addTo(map.current);
          } else {
            marker.current.setLngLat([newLocation.lng, newLocation.lat]);
          }

          // Get address
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${newLocation.lng},${newLocation.lat}.json?access_token=${mapboxgl.accessToken}`
            );
            const data = await response.json();
            if (data.features && data.features[0]) {
              setLocation(prev => ({
                ...prev!,
                address: data.features[0].place_name
              }));
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }

          setLoading(false);
        },
        error => {
          setError('Error al obtener la ubicación. Por favor, active los servicios de localización.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError('La geolocalización no está soportada en este navegador.');
      setLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-alegreya font-extrabold text-4xl md:text-5xl mb-4 text-center">
          Sistema de Rastreo en Tiempo Real
        </h1>
        
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="text-accent font-labrada text-center p-4">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div ref={mapContainer} className="w-full h-[60vh] rounded-lg shadow-xl overflow-hidden" />
            </div>
            
            <div className="space-y-6 font-labrada">
              <div className="bg-secondary/10 p-6 rounded-lg backdrop-blur-sm">
                <h2 className="font-alegreya font-bold text-xl mb-4">Información de Ubicación</h2>
                {location?.address && (
                  <p className="text-sm leading-relaxed">
                    {location.address}
                  </p>
                )}
                <div className="mt-4 text-sm">
                  <p>Latitud: {location?.lat.toFixed(6)}</p>
                  <p>Longitud: {location?.lng.toFixed(6)}</p>
                </div>
              </div>

              <div className="bg-secondary/10 p-6 rounded-lg backdrop-blur-sm">
                <h2 className="font-alegreya font-bold text-xl mb-4">Estado del Rastreo</h2>
                <p className="text-sm">
                  Estado: <span className="text-accent">Activo</span>
                </p>
                <p className="text-sm mt-2">
                  Última actualización: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTracker;
