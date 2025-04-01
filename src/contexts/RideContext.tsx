
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define types for our rides and context
export type Ride = {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  driverRating?: number;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  departureTime: string;
  availableSeats: number;
  price: number;
  description?: string;
  passengers: string[];
  createdAt: string;
};

type RideContextType = {
  rides: Ride[];
  userRides: Ride[];
  loading: boolean;
  createRide: (rideData: Omit<Ride, 'id' | 'createdAt'>) => Promise<boolean>;
  bookRide: (rideId: string, userId: string) => Promise<boolean>;
  cancelRide: (rideId: string, userId: string) => Promise<boolean>;
  getUserRides: (userId: string) => Ride[];
};

// Create the context with a default value
const RideContext = createContext<RideContextType | undefined>(undefined);

// Mock rides data for demo purposes
const MOCK_RIDES: Ride[] = [
  {
    id: '1',
    driverId: '1',
    driverName: 'John Doe',
    driverAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    driverRating: 4.5,
    origin: {
      address: 'San Francisco, CA',
      lat: 37.7749,
      lng: -122.4194
    },
    destination: {
      address: 'Los Angeles, CA',
      lat: 34.0522,
      lng: -118.2437
    },
    departureTime: '2023-12-15T08:00:00Z',
    availableSeats: 3,
    price: 45,
    description: 'Driving to LA for the weekend. Can accommodate 3 passengers.',
    passengers: [],
    createdAt: '2023-12-01T10:30:00Z'
  },
  {
    id: '2',
    driverId: '2',
    driverName: 'Jane Smith',
    driverAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    driverRating: 4.8,
    origin: {
      address: 'Boston, MA',
      lat: 42.3601,
      lng: -71.0589
    },
    destination: {
      address: 'New York, NY',
      lat: 40.7128,
      lng: -74.0060
    },
    departureTime: '2023-12-20T14:30:00Z',
    availableSeats: 2,
    price: 35,
    description: 'Comfortable ride with good music. No smoking please.',
    passengers: [],
    createdAt: '2023-12-05T09:15:00Z'
  },
  {
    id: '3',
    driverId: '1',
    driverName: 'John Doe',
    driverAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    driverRating: 4.5,
    origin: {
      address: 'Seattle, WA',
      lat: 47.6062,
      lng: -122.3321
    },
    destination: {
      address: 'Portland, OR',
      lat: 45.5051,
      lng: -122.6750
    },
    departureTime: '2023-12-18T10:00:00Z',
    availableSeats: 4,
    price: 30,
    description: 'Taking the scenic route. Will stop for coffee on the way.',
    passengers: [],
    createdAt: '2023-12-03T15:45:00Z'
  }
];

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [userRides, setUserRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load rides from localStorage or use mock data
    const storedRides = localStorage.getItem('rideTogetherRides');
    if (storedRides) {
      try {
        setRides(JSON.parse(storedRides));
      } catch (error) {
        console.error('Failed to parse stored rides:', error);
        setRides(MOCK_RIDES);
      }
    } else {
      setRides(MOCK_RIDES);
      localStorage.setItem('rideTogetherRides', JSON.stringify(MOCK_RIDES));
    }
    setLoading(false);
  }, []);

  const createRide = async (rideData: Omit<Ride, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRide: Ride = {
        ...rideData,
        id: `${rides.length + 1}`,
        createdAt: new Date().toISOString()
      };
      
      const updatedRides = [...rides, newRide];
      setRides(updatedRides);
      localStorage.setItem('rideTogetherRides', JSON.stringify(updatedRides));
      
      toast.success('Ride created successfully!');
      return true;
    } catch (error) {
      console.error('Create ride error:', error);
      toast.error('Failed to create ride');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async (rideId: string, userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRides = rides.map(ride => {
        if (ride.id === rideId && ride.availableSeats > 0) {
          return {
            ...ride,
            availableSeats: ride.availableSeats - 1,
            passengers: [...ride.passengers, userId]
          };
        }
        return ride;
      });
      
      setRides(updatedRides);
      localStorage.setItem('rideTogetherRides', JSON.stringify(updatedRides));
      
      toast.success('Ride booked successfully!');
      return true;
    } catch (error) {
      console.error('Book ride error:', error);
      toast.error('Failed to book ride');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async (rideId: string, userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRides = rides.map(ride => {
        if (ride.id === rideId && ride.passengers.includes(userId)) {
          return {
            ...ride,
            availableSeats: ride.availableSeats + 1,
            passengers: ride.passengers.filter(id => id !== userId)
          };
        }
        return ride;
      });
      
      setRides(updatedRides);
      localStorage.setItem('rideTogetherRides', JSON.stringify(updatedRides));
      
      toast.success('Booking cancelled successfully!');
      return true;
    } catch (error) {
      console.error('Cancel ride error:', error);
      toast.error('Failed to cancel booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserRides = (userId: string): Ride[] => {
    // Get rides where user is either driver or passenger
    return rides.filter(ride => 
      ride.driverId === userId || ride.passengers.includes(userId)
    );
  };

  return (
    <RideContext.Provider value={{ 
      rides, 
      userRides, 
      loading, 
      createRide, 
      bookRide, 
      cancelRide, 
      getUserRides 
    }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRides = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
};
