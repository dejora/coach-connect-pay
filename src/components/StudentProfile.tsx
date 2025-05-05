import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface StudentProfileProps {
  studentData: {
    name: string;
    email: string;
    interests?: string[];
  };
  onEditClick: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ 
  studentData, 
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
          <div className="w-24 h-24 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-3xl font-bold mb-4">
            {studentData.name?.substring(0, 1) || 'S'}
          </div>
          <h2 className="text-xl font-semibold">{studentData.name}</h2>
          <p className="text-gray-500">{studentData.email}</p>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">{t('student.interests')}</h3>
          {studentData.interests && studentData.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {studentData.interests.map((interest, index) => (
                <span 
                  key={index} 
                  className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('profile.noInterests')}</p>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">{t('student.stats')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <p className="text-gray-500 text-sm">{t('student.totalSessions')}</p>
              <p className="text-2xl font-bold text-brand-blue">0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <p className="text-gray-500 text-sm">{t('student.favoriteCoaches')}</p>
              <p className="text-2xl font-bold text-brand-blue">0</p>
            </div>
          </div>
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

export default StudentProfile;