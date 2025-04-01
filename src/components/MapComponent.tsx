
import React, { useCallback, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

interface MapComponentProps {
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  height?: string;
  onPlaceSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

// This would be a real API key in a production app
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";

const MapComponent: React.FC<MapComponentProps> = ({ 
  origin, 
  destination, 
  height = "400px",
  onPlaceSelect 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 37.7749, lng: -122.4194 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Create directions if origin and destination are provided
    if (origin && destination) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [origin, destination]);

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (!onPlaceSelect || !e.latLng) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: e.latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        onPlaceSelect({
          lat: e.latLng!.lat(),
          lng: e.latLng!.lng(),
          address: results[0].formatted_address
        });
      }
    });
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center" style={{ height }}>Loading map...</div>;
  }

  return (
    <div style={{ height, width: '100%' }}>
      <GoogleMap
        center={center}
        zoom={12}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={onMapLoad}
        onClick={onPlaceSelect ? handleClick : undefined}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {origin && !directions && (
          <Marker position={origin} />
        )}
        {destination && !directions && (
          <Marker 
            position={destination} 
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#22c55e',
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
