
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataProvider } from '@/services/data/DataContext';
import { Coach } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BookAppointment: React.FC = () => {
  const { t } = useTranslation();
  const { dataProvider } = useDataProvider();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Get unique expertise areas from coaches
  const expertiseAreas = Array.from(
    new Set(coaches.flatMap(coach => coach.expertise || []))
  ).sort();
  
  // Filter coaches by expertise if one is selected
  const filteredCoaches = selectedExpertise
    ? coaches.filter(coach => coach.expertise?.includes(selectedExpertise))
    : coaches;
  
  useEffect(() => {
    const loadCoaches = async () => {
      setLoading(true);
      setError(null);
      try {
        // Only load active coaches
        const loadedCoaches = await dataProvider.users.getCoaches(undefined, true);
        setCoaches(loadedCoaches);
      } catch (err) {
        console.error('Error loading coaches:', err);
        setError(t('errors.loadingCoaches'));
      } finally {
        setLoading(false);
      }
    };
    
    loadCoaches();
  }, [dataProvider, t]);
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800 mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('bookSession.filterByExpertise')}
        </label>
        <Select
          value={selectedExpertise}
          onValueChange={setSelectedExpertise}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('bookSession.selectExpertise')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              {t('bookSession.allExpertise')}
            </SelectItem>
            {expertiseAreas.map((expertise) => (
              <SelectItem key={expertise} value={expertise}>
                {expertise}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p>{t('common.loading')}</p>
        </div>
      ) : filteredCoaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => (
            <Card key={coach.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {coach.profileImage ? (
                    <div 
                      className="w-12 h-12 rounded-full bg-center bg-cover" 
                      style={{ backgroundImage: `url(${coach.profileImage})` }} 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {coach.name?.substring(0, 1) || 'C'}
                    </div>
                  )}
                  <div>
                    <CardTitle>{coach.name}</CardTitle>
                    <div className="flex items-center mt-1 text-sm text-yellow-500">
                      <span className="mr-1">★</span>
                      <span>{coach.rating?.toFixed(1) || '—'}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {coach.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{coach.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {coach.expertise?.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  )) || '—'}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">${coach.hourlyRate}/hr</div>
                  <Link to={`/book/${coach.id}`}>
                    <Button size="sm">
                      {t('bookSession.bookNow')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">
              {selectedExpertise 
                ? t('bookSession.noCoachesForExpertise', { expertise: selectedExpertise })
                : t('bookSession.noCoaches')}
            </p>
            {selectedExpertise && (
              <Button 
                variant="outline"
                onClick={() => setSelectedExpertise('')}
              >
                {t('bookSession.clearFilter')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookAppointment;
