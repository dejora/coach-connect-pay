
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useDataProvider } from '@/services/data/DataContext';
import Layout from '@/components/Layout';
import CoachesTable from '@/components/CoachesTable';
import { Coach } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';

const Coaches: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dataProvider } = useDataProvider();
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  
  // Utiliser React Query pour la gestion du cache et du rechargement
  const { data: coaches = [], refetch, isLoading } = useQuery({
    queryKey: ['coaches', showActiveOnly],
    queryFn: () => dataProvider.users.getCoaches(undefined, showActiveOnly),
  });

  const isAdmin = user?.role === 'admin';

  const handleToggleCoachActive = async (coach: Coach, isActive: boolean) => {
    await dataProvider.users.toggleCoachActive(coach.id, isActive);
    // Recharger les données
    refetch();
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('coaches.title')}</h1>
            <p className="text-gray-500 mt-1">{t('coaches.subtitle')}</p>
          </div>

          {isAdmin && (
            <div className="flex items-center space-x-2">
              <Switch
                id="active-filter"
                checked={showActiveOnly}
                onCheckedChange={setShowActiveOnly}
              />
              <Label htmlFor="active-filter">{t('coaches.showActiveOnly')}</Label>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <CoachesTable 
              coaches={coaches}
              onStatusChange={isAdmin ? handleToggleCoachActive : undefined}
              isAdmin={isAdmin} 
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Coaches;
