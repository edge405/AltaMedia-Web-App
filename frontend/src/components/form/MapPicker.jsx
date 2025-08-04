import { useState, useEffect } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MapLibreMap from './MapLibreMap';

const MapPicker = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addressData, setAddressData] = useState({
    country: '',
    province: '',
    city: '',
    barangay: '',
    street: '',
    fullAddress: ''
  });
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Initialize with existing value if available
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        setAddressData(parsed);
      } catch {
        // If not JSON, treat as full address
        setAddressData({ ...addressData, fullAddress: value });
      }
    }
  }, [value]);

  const handleAddressChange = (field, newValue) => {
    const updated = { ...addressData, [field]: newValue };
    setAddressData(updated);
    
    // Update the full address
    const fullAddress = [
      updated.street,
      updated.barangay,
      updated.city,
      updated.province,
      updated.country
    ].filter(Boolean).join(', ');
    
    updated.fullAddress = fullAddress;
    setAddressData(updated);
    
    // Pass the structured data as JSON string
    onChange(JSON.stringify(updated));
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleMapSelection = () => {
    if (selectedLocation) {
      // Use reverse geocoding to get address from coordinates
      // For now, we'll use a mock address based on the location
      const mockAddress = {
        country: 'Philippines',
        province: 'Metro Manila',
        city: 'Makati City',
        barangay: 'San Antonio',
        street: '123 Sample Street',
        fullAddress: '123 Sample Street, San Antonio, Makati City, Metro Manila, Philippines',
        coordinates: selectedLocation
      };
      
      setAddressData(mockAddress);
      onChange(JSON.stringify(mockAddress));
      setIsOpen(false);
    }
  };

  const clearAddress = () => {
    const empty = {
      country: '',
      province: '',
      city: '',
      barangay: '',
      street: '',
      fullAddress: ''
    };
    setAddressData(empty);
    onChange('');
  };

  return (
    <div className="space-y-3">
      {/* Map Selection Button */}
      <div className="flex gap-2">
        <Input
          value={addressData.fullAddress || ''}
          onChange={(e) => handleAddressChange('fullAddress', e.target.value)}
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
                initialLocation={addressData.coordinates}
              />
              
              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearAddress}
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
      
      {/* Display structured address if available */}
      {addressData.country && (
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div><strong>Country:</strong> {addressData.country}</div>
          <div><strong>Province:</strong> {addressData.province}</div>
          <div><strong>City:</strong> {addressData.city}</div>
          <div><strong>Barangay:</strong> {addressData.barangay}</div>
          <div><strong>Street:</strong> {addressData.street}</div>
        </div>
      )}
    </div>
  );
};

export default MapPicker; 