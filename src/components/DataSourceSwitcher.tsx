
import React from 'react';
import { useDataProvider } from '@/services/data/DataContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const DataSourceSwitcher = () => {
  const { dataSource, setDataSource, isConnected } = useDataProvider();
  const [checking, setChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);

  const toggleDataSource = () => {
    const newSource = dataSource === 'mock' ? 'supabase' : 'mock';
    setDataSource(newSource);
    toast.success(`Switched to ${newSource === 'mock' ? 'mock data' : 'Supabase database'}`);
  };

  const checkConnection = async () => {
    setChecking(true);
    setConnectionStatus(null);
    try {
      const connected = await isConnected();
      setConnectionStatus(connected);
      if (connected) {
        toast.success('Successfully connected to Supabase');
      } else {
        toast.error('Failed to connect to Supabase');
      }
    } catch (error) {
      setConnectionStatus(false);
      toast.error('Error checking Supabase connection');
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Source</CardTitle>
        <CardDescription>Choose between mock data and Supabase database</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="data-source">Use Supabase Database</Label>
          <Switch
            id="data-source"
            checked={dataSource === 'supabase'}
            onCheckedChange={toggleDataSource}
          />
        </div>
        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-2">
            {dataSource === 'mock' 
              ? 'Using mock data for development' 
              : 'Using Supabase database for persistent data'}
          </p>
          {dataSource === 'supabase' && (
            <Button
              onClick={checkConnection}
              variant={connectionStatus === false ? "destructive" : "outline"}
              disabled={checking}
              className="mt-2"
            >
              {checking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking connection...
                </>
              ) : (
                <>
                  {connectionStatus === null && "Check connection"}
                  {connectionStatus === true && "Connection successful"}
                  {connectionStatus === false && "Connection failed"}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceSwitcher;
