
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t('homepage.features.findExpertCoaches.title'),
      description: t('homepage.features.findExpertCoaches.description'),
      icon: '🎓',
    },
    {
      title: t('homepage.features.scheduleSessions.title'),
      description: t('homepage.features.scheduleSessions.description'),
      icon: '📅',
    },
    {
      title: t('homepage.features.securePayments.title'),
      description: t('homepage.features.securePayments.description'),
      icon: '💳',
    },
    {
      title: t('homepage.features.learnAndGrow.title'),
      description: t('homepage.features.learnAndGrow.description'),
      icon: '🚀',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: t('appointment.student'),
      content: 'CoachConnect helped me find the perfect math tutor. My grades improved significantly!',
    },
    {
      name: 'Michael Chen',
      role: t('appointment.coach'),
      content: 'As a coach, this platform makes it easy to manage my schedule and connect with students.',
    },
    {
      name: 'Emily Rodriguez',
      role: t('appointment.student'),
      content: 'The booking process is straightforward, and payments are hassle-free.',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="hero">
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                {t('homepage.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-slide-up">
                {t('homepage.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" variant="secondary">
                    {t('homepage.hero.signupNow')}
                  </Button>
                </Link>
                <Link to="/coaches">
                  <Button size="lg" variant="outline">
                    {t('homepage.hero.browseCoaches')}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="section bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-blue mb-4">{t('homepage.howItWorks.title')}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t('homepage.howItWorks.description')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-teal/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    <span className="text-brand-teal text-2xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('homepage.howItWorks.step1Title')}</h3>
                  <p className="text-gray-600">
                    {t('homepage.howItWorks.step1Description')}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-teal/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    <span className="text-brand-teal text-2xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('homepage.howItWorks.step2Title')}</h3>
                  <p className="text-gray-600">
                    {t('homepage.howItWorks.step2Description')}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-teal/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    <span className="text-brand-teal text-2xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('homepage.howItWorks.step3Title')}</h3>
                  <p className="text-gray-600">
                    {t('homepage.howItWorks.step3Description')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="section bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-blue mb-4">{t('homepage.features.title')}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t('homepage.features.description')}
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
                <h2 className="text-3xl font-bold text-brand-blue mb-4">{t('homepage.testimonials.title')}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t('homepage.testimonials.description')}
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
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">{t('homepage.cta.title')}</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                {t('homepage.cta.description')}
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary">
                    {t('homepage.hero.signupNow')}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    {t('navigation.login')}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default Index;
