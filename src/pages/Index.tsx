
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Users, DollarSign, Shield, Globe, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-ride-green-500 to-ride-blue-500 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464219222984-937eb48483da')] bg-cover bg-center opacity-20"></div>
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Share rides, save money, and reduce your carbon footprint
              </h1>
              <p className="text-xl mb-8 opacity-90 animate-slide-up">
                Connect with fellow travelers for a more affordable, sustainable, and social way to travel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
                <Button 
                  size="lg" 
                  className="bg-white text-ride-green-600 hover:bg-gray-100"
                  onClick={() => navigate('/search')}
                >
                  Find a Ride
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/offer')}
                >
                  Offer a Ride
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Search Form Section */}
        <section className="py-10 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 -mt-20 relative z-20 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-6 text-center">Find Your Next Ride</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="From" 
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="To" 
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="date" 
                      className="pl-10" 
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="number" 
                      placeholder="Passengers" 
                      min="1"
                      className="pl-10" 
                    />
                  </div>
                  <Button 
                    className="h-10 gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/search');
                    }}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connecting drivers with empty seats to passengers looking for a ride is easy with RideTogether
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-ride-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-ride-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Search for Rides</h3>
                <p className="text-gray-600">
                  Enter your departure and arrival locations and your travel date to find available rides.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-ride-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-ride-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Book Your Seat</h3>
                <p className="text-gray-600">
                  Choose the ride that works best for you and book your seat in just a few clicks.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-ride-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-ride-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Travel Together</h3>
                <p className="text-gray-600">
                  Meet your driver at the agreed pick-up location and enjoy your shared journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose RideTogether</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our carpooling platform offers benefits for both drivers and passengers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5">
                <DollarSign className="h-10 w-10 text-ride-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Save Money</h3>
                <p className="text-gray-600">
                  Share travel costs and significantly reduce your transportation expenses.
                </p>
              </div>
              
              <div className="p-5">
                <Globe className="h-10 w-10 text-ride-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Eco-Friendly</h3>
                <p className="text-gray-600">
                  Reduce your carbon footprint by sharing rides instead of driving alone.
                </p>
              </div>
              
              <div className="p-5">
                <Users className="h-10 w-10 text-ride-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Meet New People</h3>
                <p className="text-gray-600">
                  Connect with like-minded travelers and make your journeys more social.
                </p>
              </div>
              
              <div className="p-5">
                <Shield className="h-10 w-10 text-ride-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
                <p className="text-gray-600">
                  Our verification process and rating system ensures a safe experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-ride-blue-600 to-ride-green-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who are already saving money and reducing their carbon footprint.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-ride-green-600 hover:bg-gray-100"
                onClick={() => navigate('/register')}
              >
                Sign Up Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
