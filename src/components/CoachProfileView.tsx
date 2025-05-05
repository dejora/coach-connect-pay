import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CoachProfileViewProps {
  coachData: {
    name: string;
    email: string;
    bio?: string;
    expertise?: string[];
    hourlyRate?: number;
    rating?: number;
  };
  onEditClick: () => void;
}

const CoachProfileView: React.FC<CoachProfileViewProps> = ({ 
  coachData, 
  onEditClick 
}) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.yourProfile')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-3xl font-bold mb-4">
            {coachData.name?.substring(0, 1) || 'C'}
          </div>
          <h2 className="text-xl font-semibold">{coachData.name}</h2>
          <p className="text-gray-500">{coachData.email}</p>
          <div className="mt-2 flex items-center">
            {coachData.rating && (
              <>
                <span className="text-yellow-500">★</span>
                <span className="ml-1 font-medium">{coachData.rating.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">{t('coach.about')}</h3>
          <p className="text-gray-600">{coachData.bio || t('profile.noBio')}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">{t('coach.expertise')}</h3>
          {coachData.expertise && coachData.expertise.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {coachData.expertise.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-brand-teal/10 text-brand-teal px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('profile.noExpertise')}</p>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">{t('coach.hourlyRate')}</h3>
          {coachData.hourlyRate ? (
            <p className="text-xl font-bold text-brand-blue">${coachData.hourlyRate}/hr</p>
          ) : (
            <p className="text-gray-500">{t('profile.noRate')}</p>
          )}
        </div>

        <Button 
          onClick={onEditClick} 
          className="w-full mt-4"
        >
          {t('profile.editProfile')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoachProfileView;