
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Github, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-10 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">
                <span className="text-ride-green-600">Ride</span>
                <span className="text-ride-blue-600">Together</span>
              </span>
            </div>
            <p className="text-gray-600 max-w-xs">
              Connect with fellow travelers for a greener, more affordable way to travel. Share rides, split costs, and reduce your carbon footprint.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-ride-blue-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-ride-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-ride-blue-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-ride-blue-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-primary transition-colors">Find Rides</Link>
              </li>
              <li>
                <Link to="/offer" className="text-gray-600 hover:text-primary transition-colors">Offer a Ride</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-600 hover:text-primary transition-colors">Safety Guidelines</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-600">support@ridetogether.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 mt-8 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} RideTogether. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 sm:mt-0">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            {' · '}
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            {' · '}
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
