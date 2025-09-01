import { useState, useEffect } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MapLibreMap from './MapLibreMap';

const MapPicker = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Initialize with existing value if available
  useEffect(() => {
    if (value) {
      try {
        // If value is already a string (address), use it directly
        if (typeof value === 'string') {
          setPlaceName(value);
        } else if (typeof value === 'object' && value !== null) {
          // If it's an object, extract the address
          setPlaceName(value.address || value.placeName || value.fullAddress || JSON.stringify(value));
          if (value.coordinates && typeof value.coordinates.latitude === 'number' && typeof value.coordinates.longitude === 'number') {
            setSelectedLocation(value.coordinates);
          }
        } else {
          // Try to parse as JSON
          const parsed = JSON.parse(value);
          setPlaceName(parsed.address || parsed.placeName || parsed.fullAddress || value);
          if (parsed.coordinates && typeof parsed.coordinates.latitude === 'number' && typeof parsed.coordinates.longitude === 'number') {
            setSelectedLocation(parsed.coordinates);
          }
        }
      } catch (error) {
        console.warn('Error parsing location value:', error);
        // If not JSON, treat as place name
        setPlaceName(value);
      }
    } else {
      // Clear state when value is empty
      setPlaceName('');
      setSelectedLocation(null);
    }
  }, [value]);

  const handlePlaceNameChange = (newValue) => {
    setPlaceName(newValue);
    // Store as simple string for place name
    onChange(newValue);
  };

  const handleLocationSelect = (location) => {
    // Validate coordinates before setting
    if (location &&
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number' &&
      location.latitude >= -90 && location.latitude <= 90 &&
      location.longitude >= -180 && location.longitude <= 180) {
      setSelectedLocation(location);
    } else {
      console.warn('Invalid coordinates received:', location);
    }
  };

  const handleMapSelection = async () => {
    if (selectedLocation) {
      try {
        // Use reverse geocoding to get place name from coordinates
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.latitude}&lon=${selectedLocation.longitude}&zoom=18&addressdetails=1`
        );

        if (response.ok) {
          const data = await response.json();
          const placeName = data.display_name || 'Selected Location';

          setPlaceName(placeName);
          onChange(placeName);
        } else {
          // Fallback to a generic place name with coordinates
          const fallbackName = `Selected Location (${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)})`;
          setPlaceName(fallbackName);
          onChange(fallbackName);
        }
      } catch (error) {
        console.error('Error getting place name:', error);
        // Fallback to a generic place name with coordinates
        const fallbackName = `Selected Location (${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)})`;
        setPlaceName(fallbackName);
        onChange(fallbackName);
      }

      setIsOpen(false);
    }
  };

  const clearLocation = () => {
    setPlaceName('');
    setSelectedLocation(null);
    onChange('');
  };

  return (
    <div className="space-y-3">
      {/* Location Input and Map Button */}
      <div className="flex gap-2">
        <Input
          value={placeName}
          onChange={(e) => handlePlaceNameChange(e.target.value)}
          placeholder={placeholder || "Enter your primary location"}
          className="flex-1"
        />

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Map
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Select Location on Map</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Map Component */}
              <MapLibreMap
                onLocationSelect={handleLocationSelect}
                initialLocation={selectedLocation}
                useCurrentLocation={false}
              />

              {/* Instructions */}
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p>💡 <strong>How to use:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Click anywhere on the map to place a marker</li>
                  <li>Drag the marker to adjust the exact location</li>
                  <li>Use the navigation controls to zoom and pan</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearLocation}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
                <Button
                  type="button"
                  onClick={handleMapSelection}
                  disabled={!selectedLocation}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm Location
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MapPicker; 