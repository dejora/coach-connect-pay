
import React from 'react';
import { useData } from '@/services/data/DataContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Info } from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const DataSourceSwitcher = () => {
  const { dataSource, setDataSource, isConnected } = useData();
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
          {dataSource === 'mock' && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="mock-credentials">
                <AccordionTrigger className="text-sm text-blue-500">
                  <span className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Mock Login Credentials
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 bg-gray-50 p-3 rounded-md text-sm">
                    <div>
                      <p><strong>Coach Login:</strong></p>
                      <p>Email: coach@example.com</p>
                      <p>Password: any password will work</p>
                      <p>Role: Coach</p>
                    </div>
                    <div className="mt-2">
                      <p><strong>Student Login:</strong></p>
                      <p>Email: student@example.com</p>
                      <p>Password: any password will work</p>
                      <p>Role: Student</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
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
