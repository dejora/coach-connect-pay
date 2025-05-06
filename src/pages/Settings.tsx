
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSelector from '@/components/LanguageSelector';
import DataSourceSwitcher from '@/components/DataSourceSwitcher';
import { useTranslation } from 'react-i18next';
import { useData } from '@/services/data/DataContext';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { dataSource, setDataSource } = useData();
  
  // Save data source preference to local storage when it changes
  React.useEffect(() => {
    localStorage.setItem('preferredDataSource', dataSource);
  }, [dataSource]);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">{t('navigation.settings')}</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.preferences')}</CardTitle>
              <CardDescription>
                {t('settings.preferencesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{t('settings.language')}</h3>
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.dataSource')}</CardTitle>
              <CardDescription>
                {t('settings.dataSourceDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataSourceSwitcher />
              <p className="mt-4 text-sm text-gray-500">
                {dataSource === 'mock' 
                  ? t('settings.usingMockData') 
                  : t('settings.usingSupabaseData')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
