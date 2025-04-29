
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const Index: React.FC = () => {
  const features = [
    {
      title: 'Find Expert Coaches',
      description: 'Connect with experienced coaches in your field of interest.',
      icon: '🎓',
    },
    {
      title: 'Schedule Sessions',
      description: 'Book appointments at times that work for your schedule.',
      icon: '📅',
    },
    {
      title: 'Secure Payments',
      description: 'Pay safely and securely through our integrated payment system.',
      icon: '💳',
    },
    {
      title: 'Learn & Grow',
      description: 'Achieve your goals with personalized coaching sessions.',
      icon: '🚀',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      content: 'CoachConnect helped me find the perfect math tutor. My grades improved significantly!',
    },
    {
      name: 'Michael Chen',
      role: 'Coach',
      content: 'As a coach, this platform makes it easy to manage my schedule and connect with students.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student',
      content: 'The booking process is straightforward, and payments are hassle-free.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Connect with Expert Coaches
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-slide-up">
              Book one-on-one sessions with professional coaches to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/coaches">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Coaches
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-blue mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                CoachConnect makes it easy to find and book sessions with expert coaches
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-teal/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-brand-teal text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up as a student or coach to get started with our platform.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-teal/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-brand-teal text-2xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book or Create Sessions</h3>
                <p className="text-gray-600">
                  Students can book available slots, while coaches manage their schedule.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-teal/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-brand-teal text-2xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect and Learn</h3>
                <p className="text-gray-600">
                  Meet at your scheduled time and make the most of your coaching session.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-blue mb-4">Platform Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need for effective coaching sessions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-blue mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from students and coaches who use our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-brand-blue">
                        {testimonial.name.substring(0, 1)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-brand-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join CoachConnect today and take the next step in your learning journey.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
