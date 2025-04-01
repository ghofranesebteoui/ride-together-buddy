
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapComponent from '@/components/MapComponent';
import { useAuth } from '@/contexts/AuthContext';
import { useRides } from '@/contexts/RideContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { MapPin, Calendar, Clock, Users, DollarSign, Info } from 'lucide-react';

const OfferRide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRide } = useRides();
  
  const [origin, setOrigin] = useState({ address: '', lat: 0, lng: 0 });
  const [destination, setDestination] = useState({ address: '', lat: 0, lng: 0 });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('3');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [mapMode, setMapMode] = useState<'origin' | 'destination'>('origin');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle map location selection
  const handlePlaceSelect = (location: { lat: number; lng: number; address: string }) => {
    if (mapMode === 'origin') {
      setOrigin(location);
    } else {
      setDestination(location);
    }
  };

  const handleSetMapMode = (mode: 'origin' | 'destination') => {
    setMapMode(mode);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!origin.address || !destination.address || !date || !time || !seats || !price) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      // Combine date and time into a single ISO string
      const dateTime = new Date(`${date}T${time}`).toISOString();
      
      const rideData = {
        driverId: user.id,
        driverName: user.name,
        driverAvatar: user.avatar,
        driverRating: user.ratings,
        origin,
        destination,
        departureTime: dateTime,
        availableSeats: parseInt(seats),
        price: parseFloat(price),
        description,
        passengers: []
      };
      
      const success = await createRide(rideData);
      
      if (success) {
        toast.success('Your ride has been created successfully!');
        navigate('/my-rides');
      }
    } catch (error) {
      console.error('Error creating ride:', error);
      setFormError('An error occurred while creating your ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container-custom py-12 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                You need to sign in before you can offer a ride
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/login')}>Sign In</Button>
            </CardFooter>
          </Card>
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Offer a Ride</h1>
            
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Column */}
                <div className="space-y-6">
                  {/* Locations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Route</CardTitle>
                      <CardDescription>
                        Set your departure and arrival locations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="origin">From</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="origin"
                              placeholder="Departure location"
                              className="pl-10"
                              value={origin.address}
                              onChange={(e) => setOrigin({ ...origin, address: e.target.value })}
                              readOnly
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => handleSetMapMode('origin')}
                          >
                            Set
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="destination">To</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="destination"
                              placeholder="Arrival location"
                              className="pl-10"
                              value={destination.address}
                              onChange={(e) => setDestination({ ...destination, address: e.target.value })}
                              readOnly
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => handleSetMapMode('destination')}
                          >
                            Set
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Date and Time */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Date & Time</CardTitle>
                      <CardDescription>
                        When are you planning to depart?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="date"
                              type="date"
                              className="pl-10"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="time"
                              type="time"
                              className="pl-10"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ride Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ride Details</CardTitle>
                      <CardDescription>
                        Provide some information about your ride
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="seats">Available Seats</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="seats"
                              type="number"
                              min="1"
                              max="8"
                              className="pl-10"
                              value={seats}
                              onChange={(e) => setSeats(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="price">Price per Seat ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="price"
                              type="number"
                              min="1"
                              step="0.01"
                              className="pl-10"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Add any additional information about your ride (comfort, stops, luggage space, etc.)"
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Section */}
                  <div className="space-y-4">
                    {formError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start gap-2">
                        <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span>{formError}</span>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Creating ride...' : 'Publish your ride'}
                    </Button>
                  </div>
                </div>

                {/* Map Column */}
                <div>
                  <Card className="h-[600px]">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {mapMode === 'origin' ? 'Select Departure Location' : 'Select Arrival Location'}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Click on the map to select a location
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 h-[550px]">
                      <MapComponent 
                        height="550px"
                        onPlaceSelect={handlePlaceSelect}
                        origin={origin.lat ? origin : undefined}
                        destination={destination.lat ? destination : undefined}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OfferRide;
