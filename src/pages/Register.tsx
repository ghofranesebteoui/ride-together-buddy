
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Car, Loader2, User } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();

  // Step 1: Role selection
  const [role, setRole] = useState<"passenger" | "driver" | "">("");
  const [error, setError] = useState('');

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Passenger-specific
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Driver-specific
  const [name, setName] = useState('');

  const handleRoleSelect = (selectedRole: "passenger" | "driver") => {
    setRole(selectedRole);
    setError('');
    // Reset inputs when role changes
    setFirstName('');
    setLastName('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (role === 'passenger') {
      if (!firstName || !lastName || !email || !phone) {
        setError('Please fill in all fields');
        return;
      }
      // Password flow for passengers can be added, currently omitted for simplicity
      // Register passenger with combined name
      const success = await signUp(`${firstName} ${lastName}`, email, 'password123'); // Replace with real password logic
      if (success) {
        navigate('/');
      }
    } else if (role === 'driver') {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      const success = await signUp(name, email, password);
      if (success) {
        // After signup, you can add logic to redirect to "Offer a Ride" page for driver setup
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">
              <span className="text-ride-green-600">Ride</span>
              <span className="text-ride-blue-600">Together</span>
            </span>
          </Link>
        </div>

        {!role ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Select your role to begin:</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => handleRoleSelect('passenger')}>
                <User className="h-5 w-5" /> I am a Passenger
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => handleRoleSelect('driver')}>
                <Car className="h-5 w-5" /> I am a Driver
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up as {role === 'passenger' ? 'Passenger' : 'Driver'}</CardTitle>
              <CardDescription>
                {role === 'passenger'
                  ? "Passengers can quickly join and book rides."
                  : "Drivers can offer rides and manage their vehicle."}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {role === 'passenger' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Jane"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div className="text-sm text-red-500">
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-ride-blue-600 hover:underline">
                    Sign in
                  </Link>
                </div>
                <div className="text-center">
                  <Button variant="link" type="button" className="text-sm w-full" onClick={() => setRole("")}>Back</Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Register;
