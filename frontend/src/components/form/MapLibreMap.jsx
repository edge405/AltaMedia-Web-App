import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapLibreMap = ({ onLocationSelect, initialLocation = null, useCurrentLocation = false }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Helper function to place marker - defined outside useEffect to persist
  const placeMarker = useCallback((lng, lat) => {
    if (!map.current) {
      console.warn('Map not initialized, cannot place marker');
      return;
    }

    try {
      console.log('Placing marker at:', lng, lat);

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

      // Add marker drag event
      marker.current.on('dragend', () => {
        const lngLat = marker.current.getLngLat();
        const location = { longitude: lngLat.lng, latitude: lngLat.lat };
        setSelectedLocation(location);
        onLocationSelect(location);
      });

      // Update selected location
      const location = { longitude: lng, latitude: lat };
      setSelectedLocation(location);
      onLocationSelect(location);
    } catch (error) {
      console.error('Error placing marker:', error);
    }
  }, [onLocationSelect]);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    const initializeMap = (centerLng, centerLat) => {
      try {
        // Check if container exists
        if (!mapContainer.current) {
          console.error('Map container not found');
          return;
        }

        // Validate coordinates
        const validLng = typeof centerLng === 'number' && !isNaN(centerLng) ? centerLng : 122.5642;
        const validLat = typeof centerLat === 'number' && !isNaN(centerLat) ? centerLat : 10.7203;

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
          center: [validLng, validLat],
          zoom: 10
        });

        // Wait for map to load before adding controls and events
        map.current.on('load', () => {
          console.log('Map loaded successfully');
          setIsMapLoaded(true);

          // Add navigation controls
          map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

          // Add click event to place marker
          map.current.on('click', (e) => {
            console.log('Map clicked at:', e.lngLat);
            const { lng, lat } = e.lngLat;
            placeMarker(lng, lat);
          });

          // If initial location is provided, add marker after map loads
          if (initialLocation &&
            typeof initialLocation.longitude === 'number' &&
            typeof initialLocation.latitude === 'number' &&
            initialLocation.latitude >= -90 && initialLocation.latitude <= 90 &&
            initialLocation.longitude >= -180 && initialLocation.longitude <= 180) {
            placeMarker(initialLocation.longitude, initialLocation.latitude);
          }
        });

        // Handle map errors
        map.current.on('error', (e) => {
          console.error('Map error:', e);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        // Fallback to Iloilo coordinates if map initialization fails
        if (map.current) {
          map.current.remove();
        }
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
          center: [122.5642, 10.7203], // Iloilo, Philippines
          zoom: 10
        });
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
          // Fallback to default location (Iloilo, Philippines)
          initializeMap(122.5642, 10.7203);
        }
      );
    } else {
      // Use default location (Iloilo, Philippines) without geolocation
      initializeMap(122.5642, 10.7203);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Handle initial location changes separately
  useEffect(() => {
    if (map.current && isMapLoaded && initialLocation &&
      typeof initialLocation.longitude === 'number' &&
      typeof initialLocation.latitude === 'number' &&
      initialLocation.latitude >= -90 && initialLocation.latitude <= 90 &&
      initialLocation.longitude >= -180 && initialLocation.longitude <= 180) {
      placeMarker(initialLocation.longitude, initialLocation.latitude);
    }
  }, [initialLocation, isMapLoaded, placeMarker]);

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-600"
        style={{ minHeight: '400px' }}
      />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLibreMap; 