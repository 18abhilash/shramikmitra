import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Job } from '../../types';
import { MapsService } from '../../services/maps';

interface JobMapProps {
  jobs: Job[];
  userLocation?: { lat: number; lng: number };
  selectedJob?: Job | null;
  onJobSelect?: (job: Job) => void;
  onGetDirections?: (job: Job) => void;
}

export const JobMap: React.FC<JobMapProps> = ({
  jobs,
  userLocation,
  selectedJob,
  onJobSelect,
  onGetDirections,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (map && jobs.length > 0) {
      updateMarkers();
    }
  }, [map, jobs]);

  const initializeMap = async () => {
    try {
      await MapsService.initialize();
      
      if (!mapRef.current || !window.google) {
        // Fallback to static map for demo
        setIsLoaded(true);
        return;
      }

      const defaultCenter = userLocation || { lat: 40.7128, lng: -74.0060 };
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      setMap(mapInstance);
      setIsLoaded(true);

      // Add user location marker if available
      if (userLocation) {
        new google.maps.Marker({
          position: userLocation,
          map: mapInstance,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#2563EB" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
          },
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoaded(true);
    }
  };

  const updateMarkers = () => {
    if (!map || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers = jobs.map((job, index) => {
      const marker = new google.maps.Marker({
        position: { lat: job.location.lat, lng: job.location.lng },
        map,
        title: job.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C10.48 2 6 6.48 6 12C6 20 16 30 16 30C16 30 26 20 26 12C26 6.48 21.52 2 16 2Z" fill="${job.urgent ? '#DC2626' : '#059669'}" stroke="white" stroke-width="2"/>
              <circle cx="16" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      marker.addListener('click', () => {
        onJobSelect?.(job);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.fitBounds(bounds);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      construction: '#F97316',
      agriculture: '#059669',
      household: '#2563EB',
      transportation: '#7C3AED',
      other: '#6B7280',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (!isLoaded || !window.google) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Interactive Map
          </h3>
          <p className="text-gray-600 mb-6">
            Configure Google Maps API to see job locations on an interactive map.
          </p>
          
          {/* Static job list as fallback */}
          <div className="space-y-4">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getCategoryColor(job.category) }}
                  />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.location.address}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onJobSelect?.(job)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-gray-200"
      />
      
      {selectedJob && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedJob.title}</h3>
                <p className="text-sm text-gray-600">{selectedJob.location.address}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ${selectedJob.payRate}/{selectedJob.payType === 'hourly' ? 'hr' : selectedJob.payType === 'daily' ? 'day' : 'job'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onGetDirections?.(selectedJob)}
                className="flex items-center gap-2"
              >
                <Navigation size={16} />
                Directions
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`tel:${selectedJob.employer.phone}`)}
                className="flex items-center gap-2"
              >
                <Phone size={16} />
                Call
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};