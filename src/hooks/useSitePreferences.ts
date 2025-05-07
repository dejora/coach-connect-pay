
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useData } from '@/services/data/DataContext';

export function useSitePreferences() {
  const { dataProvider } = useData();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['site-preferences'],
    queryFn: () => dataProvider.preferences.getAll(),
  });

  const updatePreference = useMutation({
    mutationFn: ({ key, value }: { key: string, value: any }) => 
      dataProvider.preferences.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-preferences'] });
    },
  });

  const getPreference = (key: string) => {
    if (!preferences) return undefined;
    const preference = preferences.find(p => p.key === key);
    return preference?.value;
  };

  const isMaintenanceMode = () => {
    return getPreference('maintenance_mode') === true;
  };

  const getSiteUrl = () => {
    return getPreference('site_url') || 'https://coachconnect.app';
  };

  const getDefaultLanguage = () => {
    return getPreference('default_language') || 'en';
  };

  return {
    preferences,
    isLoading,
    getPreference,
    updatePreference: (key: string, value: any) => updatePreference.mutate({ key, value }),
    isMaintenanceMode,
    getSiteUrl,
    getDefaultLanguage,
  };
}
