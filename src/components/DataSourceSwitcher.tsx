
import React from 'react';
import { useData } from '@/services/data/DataContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export const DataSourceSwitcher: React.FC = () => {
  const { dataSource, setDataSource, isConnected, isLoading } = useData();
  const { t } = useTranslation();

  const toggleDataSource = () => {
    setDataSource(dataSource === 'mock' ? 'supabase' : 'mock');
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg my-4 border shadow-sm">
      <div className="flex items-center space-x-2">
        <Label htmlFor="data-source-switch" className="font-medium text-gray-700">
          {t('common.dataSource')}
        </Label>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <Switch
              id="data-source-switch"
              checked={dataSource === 'supabase'}
              onCheckedChange={toggleDataSource}
              disabled={isLoading}
            />
            <span className="font-medium">
              {dataSource === 'mock' ? 'Mock Data' : 'PostgreSQL (Supabase)'}
            </span>
          </div>
          {isLoading ? (
            <Badge variant="outline" className="mt-1 animate-pulse">
              Checking connection...
            </Badge>
          ) : dataSource === 'supabase' ? (
            <Badge
              variant={isConnected ? 'success' : 'destructive'}
              className="mt-1"
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  );
};
