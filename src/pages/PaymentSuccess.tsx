
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { verifyPayment } from '@/services/stripe';
import { useTranslation } from 'react-i18next';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!sessionId) {
        setError(t('payment.noSessionId'));
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyPayment(sessionId);
        // The verification is handled by the edge function
        // We just need to show the success page
        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying payment:', error);
        setError(t('payment.verificationError'));
        setIsVerifying(false);
      }
    };

    checkPaymentStatus();
  }, [sessionId, t]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              {t('payment.success.title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('payment.success.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isVerifying ? (
              <p className="text-center text-gray-500">{t('payment.verifying')}</p>
            ) : error ? (
              <div className="space-y-4">
                <p className="text-center text-red-500">{error}</p>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link to="/dashboard">{t('navigation.backToDashboard')}</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-center">
                  {t('payment.success.confirmation')}
                </p>
                <div className="flex flex-col space-y-2">
                  <Button asChild>
                    <Link to="/appointments">{t('navigation.viewAppointments')}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">{t('navigation.backToDashboard')}</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
