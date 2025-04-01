
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RideCard from '@/components/RideCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRides, Ride } from '@/contexts/RideContext';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Car, Plus, UserCheck } from 'lucide-react';

const MyRides = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rides, cancelRide, getUserRides } = useRides();
  
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [offeredRides, setOfferedRides] = useState<Ride[]>([]);
  const [bookedRides, setBookedRides] = useState<Ride[]>([]);

  useEffect(() => {
    if (user) {
      const userRides = getUserRides(user.id);
      setMyRides(userRides);
      
      // Separate rides into offered and booked
      setOfferedRides(userRides.filter(ride => ride.driverId === user.id));
      setBookedRides(userRides.filter(ride => ride.driverId !== user.id && ride.passengers.includes(user.id)));
    }
  }, [user, rides, getUserRides]);

  const handleCancelBooking = async (rideId: string) => {
    if (!user) return;
    
    const success = await cancelRide(rideId, user.id);
    if (success) {
      // Update the ride lists
      const userRides = getUserRides(user.id);
      setMyRides(userRides);
      setOfferedRides(userRides.filter(ride => ride.driverId === user.id));
      setBookedRides(userRides.filter(ride => ride.driverId !== user.id && ride.passengers.includes(user.id)));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container-custom py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
            <p className="text-gray-600 mb-6">You need to sign in to view your rides</p>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Rides</h1>
            <Button onClick={() => navigate('/offer')}>
              <Plus className="mr-2 h-4 w-4" />
              Offer a Ride
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="relative px-4">
                All Rides
                {myRides.length > 0 && (
                  <span className="ml-2 text-xs bg-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {myRides.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="offered" className="relative px-4">
                <Car className="mr-2 h-4 w-4" />
                Rides Offered
                {offeredRides.length > 0 && (
                  <span className="ml-2 text-xs bg-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {offeredRides.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="booked" className="relative px-4">
                <UserCheck className="mr-2 h-4 w-4" />
                Rides Booked
                {bookedRides.length > 0 && (
                  <span className="ml-2 text-xs bg-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {bookedRides.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {myRides.length > 0 ? (
                <div className="space-y-4">
                  {myRides.map(ride => (
                    <RideCard 
                      key={ride.id} 
                      ride={ride}
                      onCancel={handleCancelBooking}
                      isBooked={ride.driverId !== user.id && ride.passengers.includes(user.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No rides yet</h3>
                  <p className="text-gray-500 mb-6">You haven't offered or booked any rides yet</p>
                  <Button onClick={() => navigate('/offer')}>
                    Offer a Ride
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="offered">
              {offeredRides.length > 0 ? (
                <div className="space-y-4">
                  {offeredRides.map(ride => (
                    <RideCard 
                      key={ride.id} 
                      ride={ride}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No rides offered</h3>
                  <p className="text-gray-500 mb-6">You haven't offered any rides yet</p>
                  <Button onClick={() => navigate('/offer')}>
                    Offer a Ride
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="booked">
              {bookedRides.length > 0 ? (
                <div className="space-y-4">
                  {bookedRides.map(ride => (
                    <RideCard 
                      key={ride.id} 
                      ride={ride}
                      onCancel={handleCancelBooking}
                      isBooked={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No rides booked</h3>
                  <p className="text-gray-500 mb-6">You haven't booked any rides yet</p>
                  <Button onClick={() => navigate('/search')}>
                    Find a Ride
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyRides;
