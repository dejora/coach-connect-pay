
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDataProvider } from '@/services/data/DataContext';
import Layout from '@/components/Layout';
import { Coach } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CoachProfileView from '@/components/CoachProfileView';

const CoachProfile: React.FC = () => {
  const { coachId } = useParams<{ coachId: string }>();
  const { t } = useTranslation();
  const { dataProvider } = useDataProvider();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadCoach = async () => {
      if (!coachId) return;
      
      setLoading(true);
      try {
        const coachData = await dataProvider.users.getCoachById(coachId);
        setCoach(coachData);
        if (!coachData) {
          setError(t('coach.notFound'));
        }
      } catch (err) {
        console.error('Error loading coach:', err);
        setError(t('errors.loadingCoach'));
      } finally {
        setLoading(false);
      }
    };
    
    loadCoach();
  }, [coachId, dataProvider, t]);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/coaches" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('coach.backToList')}
          </Link>
          
          <h1 className="text-3xl font-bold">
            {coach ? coach.name : t('coach.coachProfile')}
          </h1>
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-800">
            <p>{error}</p>
            <Link to="/coaches">
              <Button variant="outline" className="mt-4">
                {t('coach.backToList')}
              </Button>
            </Link>
          </div>
        ) : coach ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <CoachProfileView 
                coachData={coach} 
                onEditClick={() => {}} // Pas d'édition pour les visiteurs
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">{t('coach.bookSession')}</h2>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">{t('coach.bookingInstructions')}</p>
                  
                  <Link to={`/book/${coach.id}`}>
                    <Button size="lg" className="w-full md:w-auto">
                      {t('coach.scheduleSession')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('coach.notFound')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoachProfile;
