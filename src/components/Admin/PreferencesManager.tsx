
import React, { useState } from 'react';
import { useSitePreferences } from '@/hooks/useSitePreferences';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const PreferencesManager: React.FC = () => {
  const { preferences, isLoading, updatePreference } = useSitePreferences();
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});
  const { t } = useTranslation();

  const handleInputChange = (key: string, value: any) => {
    setEditingValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = (key: string, value: any) => {
    updatePreference(key, value);
    toast.success(t('admin.preferences.saved', 'Préférence enregistrée'));
    
    // Réinitialiser l'état d'édition
    setEditingValues(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  // Détermine la valeur à afficher (soit la valeur en cours d'édition, soit la valeur actuelle)
  const getDisplayValue = (key: string, currentValue: any) => {
    return key in editingValues ? editingValues[key] : currentValue;
  };

  // Rendu d'un champ selon son type de valeur
  const renderField = (preference: any) => {
    const { key, value, description } = preference;
    const currentValue = getDisplayValue(key, value);
    
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`pref-${key}`}
            checked={currentValue}
            onCheckedChange={(checked) => {
              handleInputChange(key, checked);
              handleSave(key, checked);
            }}
          />
          <label htmlFor={`pref-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {description || key}
          </label>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <label htmlFor={`pref-${key}`} className="text-sm font-medium">
          {description || key}
        </label>
        <div className="flex space-x-2">
          <Input 
            id={`pref-${key}`}
            value={currentValue} 
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={() => handleSave(key, currentValue)}
            size="sm"
          >
            {t('common.save', 'Enregistrer')}
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4">Chargement des préférences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.preferences.title', 'Préférences du site')}</CardTitle>
        <CardDescription>
          {t('admin.preferences.description', 'Configuration des paramètres globaux du site')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {preferences?.map((preference) => (
            <div key={preference.key} className="border-b pb-4 last:border-0">
              {renderField(preference)}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        {t('admin.preferences.lastUpdated', 'Dernière mise à jour')}: {
          preferences?.length 
            ? new Date(Math.max(...preferences.map(p => new Date(p.updatedAt).getTime()))).toLocaleString() 
            : '-'
        }
      </CardFooter>
    </Card>
  );
};

export default PreferencesManager;
