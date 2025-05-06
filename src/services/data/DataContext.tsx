
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataProvider } from './types';
import { mockDataProvider } from './mock/mockDataProvider';
import { supabaseDataProvider } from './supabase/supabaseDataProvider';

// Define data source options
export type DataSource = 'mock' | 'supabase';

// Create context
interface DataContextValue {
  dataProvider: DataProvider;
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  isConnected: boolean;
  isLoading: boolean;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProviderContext: React.FC<{
  children: React.ReactNode;
  initialDataSource?: DataSource;
}> = ({ children, initialDataSource = 'mock' }) => {
  const [dataSource, setDataSource] = useState<DataSource>(initialDataSource);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get the appropriate data provider based on the selected data source
  const dataProvider: DataProvider = 
    dataSource === 'supabase' ? supabaseDataProvider : mockDataProvider;

  // Check connection on mount and when data source changes
  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      try {
        const connected = await dataProvider.isConnected();
        setIsConnected(connected);
      } catch (error) {
        console.error('Error checking data provider connection:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [dataSource]);

  return (
    <DataContext.Provider
      value={{ dataProvider, dataSource, setDataSource, isConnected, isLoading }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Hook for using the data context
export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProviderContext');
  }
  return context;
};
