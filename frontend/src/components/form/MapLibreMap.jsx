import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapLibreMap = ({ onLocationSelect, initialLocation = null, useCurrentLocation = false }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    const initializeMap = (centerLng, centerLat) => {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [centerLng, centerLat],
        zoom: 10
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add click event to place marker
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;

        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
        }

        // Add new marker
        marker.current = new maplibregl.Marker({
          color: '#3B82F6',
          draggable: true
        })
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Update selected location
        const location = { longitude: lng, latitude: lat };
        setSelectedLocation(location);
        onLocationSelect(location);
      });

      // Add marker drag event
      map.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          const location = { longitude: lngLat.lng, latitude: lngLat.lat };
          setSelectedLocation(location);
          onLocationSelect(location);
        }
      });

      // If initial location is provided, add marker
      if (initialLocation) {
        marker.current = new maplibregl.Marker({
          color: '#3B82F6',
          draggable: true
        })
          .setLngLat([initialLocation.longitude, initialLocation.latitude])
          .addTo(map.current);
      }
    };

    if (useCurrentLocation) {
      // Get user's current location only if explicitly requested
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          initializeMap(longitude, latitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location (Manila, Philippines)
          initializeMap(120.9842, 14.5995);
        }
      );
    } else {
      // Use default location (Manila, Philippines) without geolocation
      initializeMap(120.9842, 14.5995);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onLocationSelect, initialLocation, useCurrentLocation]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-600"
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapLibreMap; 