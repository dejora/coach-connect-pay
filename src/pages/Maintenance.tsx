import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Wrench } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-brand-teal/10 rounded-full flex items-center justify-center">
              <Wrench className="h-12 w-12 text-brand-teal" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-brand-blue">
            {t('maintenance.title', 'Site Under Maintenance')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            {t('maintenance.description', 'We are currently performing scheduled maintenance to improve your experience. Please check back soon.')}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              {t('maintenance.estimatedTime', 'Estimated completion time:')}
            </p>
            <p className="font-semibold text-brand-teal">
              {t('maintenance.timeFrame', 'Next 1-2 hours')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;