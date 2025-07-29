import { Loader } from '@googlemaps/js-api-loader';

export class MapsService {
  private static loader: Loader;
  private static isLoaded = false;

  static async initialize(): Promise<void> {
    if (this.isLoaded) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'demo_google_maps_key') {
      console.warn('Google Maps API key not configured. Using mock location services.');
      this.isLoaded = true;
      return;
    }

    this.loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    try {
      await this.loader.load();
      this.isLoaded = true;
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  }

  static async getCurrentLocation(): Promise<{ lat: number; lng: number; address: string } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await this.reverseGeocode(latitude, longitude);
          
          resolve({
            lat: latitude,
            lng: longitude,
            address: address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }

  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      await this.initialize();
      
      if (!this.isLoaded || !window.google) {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }

      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results[0]) {
        return response.results[0].formatted_address;
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      await this.initialize();
      
      if (!this.isLoaded || !window.google) {
        return null;
      }

      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ address });

      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        return {
          lat: location.lat(),
          lng: location.lng(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static async getDirections(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<any> {
    try {
      await this.initialize();
      
      if (!this.isLoaded || !window.google) {
        return null;
      }

      const directionsService = new google.maps.DirectionsService();
      
      return new Promise((resolve, reject) => {
        directionsService.route({
          origin: new google.maps.LatLng(origin.lat, origin.lng),
          destination: new google.maps.LatLng(destination.lat, destination.lng),
          travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Directions error:', error);
      return null;
    }
  }
}