
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RideCard from '@/components/RideCard';
import MapComponent from '@/components/MapComponent';
import { useAuth } from '@/contexts/AuthContext';
import { useRides, Ride } from '@/contexts/RideContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Search as SearchIcon, MapPin, Calendar, Filter, Users, DollarSign } from 'lucide-react';

const Search = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rides, bookRide } = useRides();
  
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [showMap, setShowMap] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [sortType, setSortType] = useState('date');

  // Initialize with all rides
  useEffect(() => {
    setFilteredRides(rides);
  }, [rides]);

  // Handle search filter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    let results = [...rides];
    
    if (fromLocation) {
      results = results.filter(ride => 
        ride.origin.address.toLowerCase().includes(fromLocation.toLowerCase())
      );
    }
    
    if (toLocation) {
      results = results.filter(ride => 
        ride.destination.address.toLowerCase().includes(toLocation.toLowerCase())
      );
    }
    
    if (date) {
      const searchDate = new Date(date).toDateString();
      results = results.filter(ride => 
        new Date(ride.departureTime).toDateString() === searchDate
      );
    }
    
    const seats = parseInt(passengers);
    if (!isNaN(seats)) {
      results = results.filter(ride => ride.availableSeats >= seats);
    }
    
    setFilteredRides(results);
    
    if (results.length === 0) {
      toast.info('No rides found matching your criteria');
    }
  };

  // Handle sorting
  const handleSort = (type: string) => {
    setSortType(type);
    
    let sorted = [...filteredRides];
    
    switch (type) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'date':
        sorted.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
        break;
      case 'seats':
        sorted.sort((a, b) => b.availableSeats - a.availableSeats);
        break;
      default:
        break;
    }
    
    setFilteredRides(sorted);
  };

  // Handle booking
  const handleBookRide = async (rideId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const success = await bookRide(rideId, user.id);
    if (success) {
      navigate(`/ride/${rideId}`);
    }
  };

  // Show ride on map
  const handleShowOnMap = (ride: Ride) => {
    setSelectedRide(ride);
    setShowMap(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container-custom">
          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="From" 
                      className="pl-10"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="To" 
                      className="pl-10"
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="date" 
                      className="pl-10"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="number" 
                      placeholder="Passengers" 
                      min="1"
                      className="pl-10"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="h-10 gap-2">
                    <SearchIcon className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Results Panel */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {filteredRides.length} {filteredRides.length === 1 ? 'Ride' : 'Rides'} Available
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <Select value={sortType} onValueChange={handleSort}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Earliest departure</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="seats">Available seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredRides.length > 0 ? (
                <div className="space-y-4">
                  {filteredRides.map((ride) => (
                    <RideCard 
                      key={ride.id} 
                      ride={ride} 
                      onBook={handleBookRide}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No rides found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search filters or date</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setFromLocation('');
                      setToLocation('');
                      setDate('');
                      setPassengers('1');
                      setFilteredRides(rides);
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </div>

            {/* Map Panel */}
            <div className="hidden lg:block">
              <Card className="h-[600px] sticky top-20">
                <CardContent className="p-0 h-full">
                  {selectedRide ? (
                    <MapComponent 
                      origin={selectedRide.origin}
                      destination={selectedRide.destination}
                      height="600px"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                      Select a ride to view on map
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
