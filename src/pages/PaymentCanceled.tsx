
import React from 'react';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const PaymentCanceled: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              {t('payment.canceled.title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('payment.canceled.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-center">
                {t('payment.canceled.message')}
              </p>
              <div className="flex flex-col space-y-2">
                <Button asChild>
                  <Link to="/book">{t('payment.tryAgain')}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">{t('navigation.backToDashboard')}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentCanceled;
