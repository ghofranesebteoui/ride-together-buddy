
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapComponent from '@/components/MapComponent';
import { useAuth } from '@/contexts/AuthContext';
import { useRides, Ride } from '@/contexts/RideContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  MessageCircle, 
  Star, 
  Phone, 
  Mail,
  AlertCircle,
  Check
} from 'lucide-react';

const RideDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rides, bookRide, cancelRide } = useRides();
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const found = rides.find(r => r.id === id);
      setRide(found || null);
      
      if (user && found) {
        setIsBooked(found.passengers.includes(user.id));
      }
    }
  }, [id, rides, user]);

  if (!ride) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container-custom py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Ride not found</h2>
            <p className="text-gray-600 mb-6">The ride you're looking for doesn't exist or has been removed</p>
            <Button onClick={() => navigate('/search')}>Back to Search</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const handleBookRide = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const success = await bookRide(ride.id, user.id);
    if (success) {
      setIsBooked(true);
      setIsBookingModalOpen(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!user) return;
    
    const success = await cancelRide(ride.id, user.id);
    if (success) {
      setIsBooked(false);
      setIsCancelModalOpen(false);
    }
  };

  const isUserDriver = user && user.id === ride.driverId;
  const isFull = ride.availableSeats === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ride Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        {ride.origin.address.split(',')[0]} to {ride.destination.address.split(',')[0]}
                      </CardTitle>
                      <CardDescription>
                        {formatDate(ride.departureTime)} • {formatTime(ride.departureTime)}
                      </CardDescription>
                    </div>
                    <Badge variant={isFull ? "outline" : "default"} className={isFull ? "bg-gray-100" : ""}>
                      {isFull ? "Full" : `${ride.availableSeats} seats left`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Route Visualization */}
                  <div className="rounded-lg overflow-hidden h-[200px] border">
                    <MapComponent 
                      origin={ride.origin}
                      destination={ride.destination}
                      height="200px"
                    />
                  </div>
                  
                  {/* Locations */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 h-8 w-8 rounded-full bg-ride-green-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-ride-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Pickup Location</h4>
                        <p className="text-gray-600">{ride.origin.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="mt-1 h-8 w-8 rounded-full bg-ride-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-ride-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Drop-off Location</h4>
                        <p className="text-gray-600">{ride.destination.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ride Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-b">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-medium">{formatDate(ride.departureTime)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Departure time</div>
                        <div className="font-medium">{formatTime(ride.departureTime)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Available seats</div>
                        <div className="font-medium">{ride.availableSeats}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {ride.description && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Trip details</h3>
                      <p className="text-gray-600">{ride.description}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="text-2xl font-bold text-ride-green-600">
                    ${ride.price}
                    <span className="text-sm font-normal text-gray-500 ml-1">per seat</span>
                  </div>

                  {!isUserDriver && user && (
                    isBooked ? (
                      <Button 
                        variant="outline" 
                        className="text-red-500 border-red-500 hover:bg-red-50"
                        onClick={() => setIsCancelModalOpen(true)}
                      >
                        Cancel booking
                      </Button>
                    ) : (
                      <Button 
                        disabled={isFull}
                        onClick={() => setIsBookingModalOpen(true)}
                      >
                        Book seat
                      </Button>
                    )
                  )}

                  {isUserDriver && (
                    <Badge variant="outline" className="bg-ride-green-50 text-ride-green-700 border-ride-green-200 px-3 py-1">
                      Your ride
                    </Badge>
                  )}

                  {!user && (
                    <Button onClick={() => navigate('/login')}>
                      Sign in to book
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            {/* Driver Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Driver</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={ride.driverAvatar} alt={ride.driverName} />
                      <AvatarFallback>{ride.driverName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{ride.driverName}</h3>
                      {ride.driverRating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm">{ride.driverRating} rating</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact info - only show if booked or is driver */}
                  {(isBooked || isUserDriver) && (
                    <div className="space-y-3 pt-3 border-t">
                      <h4 className="font-medium">Contact information</h4>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">driver@example.com</span>
                      </div>
                    </div>
                  )}

                  {/* Message button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!isBooked && !isUserDriver}
                    onClick={() => toast.info('Messaging functionality not implemented in this demo')}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                    {!isBooked && !isUserDriver && " (book first)"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Booking Confirmation Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm your booking</DialogTitle>
            <DialogDescription>
              You're about to book a seat from {ride.origin.address.split(',')[0]} to {ride.destination.address.split(',')[0]}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Date:</span>
              <span>{formatDate(ride.departureTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Time:</span>
              <span>{formatTime(ride.departureTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Cost:</span>
              <span className="font-bold">${ride.price}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
            <Button onClick={handleBookRide}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel your booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your seat booking?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-gray-600">
              If you cancel, your seat will be made available to other travelers. 
              You can always book again if seats are available.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>Keep booking</Button>
            <Button variant="destructive" onClick={handleCancelBooking}>Cancel booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RideDetails;
