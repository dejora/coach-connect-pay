import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataProvider } from './types';
import { mockDataProvider } from './mock/mockDataProvider';
import { supabaseDataProvider } from './supabase/supabaseDataProvider';
import { postgresqlDataProvider } from './postgresql/postgresqlDataProvider';
import { toast } from 'sonner';

// Define data source options
export type DataSource = 'mock' | 'supabase' | 'postgresql';

// Create context
interface DataContextValue {
  dataProvider: DataProvider;
  dataSource: DataSource;
  setDataSource: (source: DataSource) => Promise<void>;
  isConnected: () => Promise<boolean>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const getDataProvider = (source: DataSource): DataProvider => {
  switch (source) {
    case 'supabase':
      return supabaseDataProvider;
    case 'postgresql':
      return postgresqlDataProvider;
    case 'mock':
    default:
      return mockDataProvider;
  }
};

export const DataProviderContext: React.FC<{
  children: React.ReactNode;
  initialDataSource?: DataSource;
}> = ({ children, initialDataSource = 'mock' }) => {
  const [dataSource, setDataSourceState] = useState<DataSource>(initialDataSource);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentProvider, setCurrentProvider] = useState<DataProvider>(getDataProvider(initialDataSource));

  // Fonction pour changer de provider
  const setDataSource = async (newSource: DataSource) => {
    setIsLoading(true);
    try {
      // Nettoyage de l'ancien provider
      await currentProvider.cleanup();

      // Initialisation du nouveau provider
      const newProvider = getDataProvider(newSource);
      await newProvider.initialize();
      
      // Vérification de la connexion
      const connected = await newProvider.isConnected();
      if (!connected) {
        throw new Error('Could not connect to the new data source');
      }

      // Mise à jour du state
      setCurrentProvider(newProvider);
      setDataSourceState(newSource);
      setIsConnected(true);
      
      // Sauvegarde de la préférence
      localStorage.setItem('preferredDataSource', newSource);
      
      toast.success('Data source changed successfully');
    } catch (error: any) {
      console.error('Error changing data source:', error);
      toast.error('Failed to change data source', {
        description: error.message
      });
      
      // Retour au mock provider en cas d'erreur
      if (newSource !== 'mock') {
        const mockProvider = getDataProvider('mock');
        await mockProvider.initialize();
        setCurrentProvider(mockProvider);
        setDataSourceState('mock');
        setIsConnected(true);
        localStorage.setItem('preferredDataSource', 'mock');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialisation au montage
  useEffect(() => {
    const initProvider = async () => {
      setIsLoading(true);
      try {
        await currentProvider.initialize();
        const connected = await currentProvider.isConnected();
        setIsConnected(connected);
      } catch (error) {
        console.error('Error initializing data provider:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    initProvider();

    // Cleanup au démontage
    return () => {
      currentProvider.cleanup();
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        dataProvider: currentProvider,
        dataSource,
        setDataSource,
        isConnected: currentProvider.isConnected,
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Hook pour utiliser le data context
export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProviderContext');
  }
  return context;
};

// This is what we were missing
export const useDataProvider = useData;
