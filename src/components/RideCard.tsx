
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Ride } from '@/contexts/RideContext';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface RideCardProps {
  ride: Ride;
  onBook?: (rideId: string) => void;
  onCancel?: (rideId: string) => void;
  isBooked?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onBook, onCancel, isBooked }) => {
  const { user } = useAuth();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const isFull = ride.availableSeats === 0;
  const isUserDriver = user && user.id === ride.driverId;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-slide-up">
      <CardContent className="p-0">
        <div className="p-4">
          {/* Route */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-ride-green-500"></div>
                <div className="h-[2px] w-3 bg-gray-300"></div>
                <div className="flex-1 h-[2px] border-t border-dashed border-gray-300"></div>
                <div className="h-[2px] w-3 bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-ride-blue-500"></div>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-sm font-medium">{ride.origin.address.split(',')[0]}</div>
                <div className="text-sm font-medium">{ride.destination.address.split(',')[0]}</div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{formatDate(ride.departureTime)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{formatTime(ride.departureTime)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">
                {ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'} available
              </span>
              {isFull && <Badge variant="outline" className="ml-2 text-xs">Full</Badge>}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">${ride.price} per seat</span>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={ride.driverAvatar} alt={ride.driverName} />
              <AvatarFallback>{ride.driverName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{ride.driverName}</div>
              {ride.driverRating && (
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs ml-1">{ride.driverRating}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Posted {timeAgo(ride.createdAt)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t border-gray-200 flex justify-between">
        <Link to={`/ride/${ride.id}`} className="text-xs text-ride-blue-600 hover:underline">
          View details
        </Link>
        {!isUserDriver && user && (
          isBooked ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCancel && onCancel(ride.id)}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              Cancel booking
            </Button>
          ) : (
            <Button 
              size="sm" 
              disabled={isFull || !onBook}
              onClick={() => !isFull && onBook && onBook(ride.id)}
            >
              Book now
            </Button>
          )
        )}
        {isUserDriver && (
          <Badge variant="outline" className="bg-ride-green-50 text-ride-green-700 border-ride-green-200">
            Your ride
          </Badge>
        )}
        {!user && (
          <Link to="/login">
            <Button size="sm">Sign in to book</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default RideCard;
