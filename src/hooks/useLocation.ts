import { useState, useEffect } from 'react';
import { MapsService } from '../services/maps';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      const locationData = await MapsService.getCurrentLocation();
      
      if (!locationData) {
        setError('Unable to retrieve location. Please enable location services.');
        return null;
      }

      setLocation(locationData);
      setLoading(false);
      return locationData;
    } catch (err) {
      console.error('Location error:', err);
      setError('Unable to retrieve location. Please enable location services.');
      setLoading(false);
      return null;
    }
  };

  const geocodeAddress = async (address: string): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      const coords = await MapsService.geocodeAddress(address);
      if (!coords) {
        setError('Unable to find location for the provided address.');
        return null;
      }

      const locationData: LocationData = {
        lat: coords.lat,
        lng: coords.lng,
        address,
      };

      setLocation(locationData);
      setLoading(false);
      return locationData;
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Unable to geocode address.');
      setLoading(false);
      return null;
    }
  };
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    return MapsService.calculateDistance(lat1, lng1, lat2, lng2);
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    geocodeAddress,
    calculateDistance,
  };
};