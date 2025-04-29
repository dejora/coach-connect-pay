
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-2xl text-brand-blue">Coach<span className="text-brand-teal">Connect</span></span>
            </Link>
            <p className="mt-4 text-gray-500">
              Connecting students with professional coaches for personalized learning experiences.
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-medium text-lg mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-brand-teal transition-colors">Home</Link></li>
              <li><Link to="/coaches" className="text-gray-500 hover:text-brand-teal transition-colors">Browse Coaches</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-brand-teal transition-colors">Pricing</Link></li>
              <li><Link to="/how-it-works" className="text-gray-500 hover:text-brand-teal transition-colors">How It Works</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-500 hover:text-brand-teal transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-brand-teal transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-brand-teal transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-medium text-lg mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-500">support@coachconnect.com</li>
              <li className="text-gray-500">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} CoachConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
