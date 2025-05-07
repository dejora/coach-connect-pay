
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataSourceSwitcher from '@/components/DataSourceSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import PreferencesManager from '@/components/Admin/PreferencesManager';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isAdmin = user?.role === 'admin';

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t('settings.title', 'Paramètres')}</h1>

        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">{t('settings.tabs.general', 'Général')}</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin">{t('settings.tabs.admin', 'Administration')}</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.dataSource.title', 'Source de données')}</CardTitle>
                  <CardDescription>
                    {t('settings.dataSource.description', 'Configurer la source de données pour l\'application')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataSourceSwitcher />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <div className="grid gap-6">
                <PreferencesManager />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
