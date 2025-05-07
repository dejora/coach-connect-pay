
import React, { useEffect } from 'react';
import { useSitePreferences } from '@/hooks/useSitePreferences';
import Layout from './Layout';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MaintenanceModeProps {
  children: React.ReactNode;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ children }) => {
  const { isLoading, isMaintenanceMode } = useSitePreferences();
  const { t } = useTranslation();
  const inMaintenanceMode = isMaintenanceMode();

  // Si le site est en mode maintenance, afficher une page spécifique
  if (inMaintenanceMode && !isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold">
              {t('maintenance.title', 'Site en maintenance')}
            </AlertTitle>
            <AlertDescription className="text-lg mt-2">
              {t('maintenance.message', 'Notre site est actuellement en maintenance. Veuillez réessayer plus tard.')}
            </AlertDescription>
          </Alert>
          <div className="mt-8 text-center text-gray-500">
            <p>
              {t('maintenance.contactInfo', 'Pour toute question urgente, veuillez nous contacter à support@coachconnect.app')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Si les préférences sont en cours de chargement, on pourrait afficher un spinner
  if (isLoading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue"></div>
        </div>
      </Layout>
    );
  }

  // Si tout va bien, afficher le contenu normal
  return <>{children}</>;
};

export default MaintenanceMode;
