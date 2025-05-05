import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import StudentProfile from '@/components/StudentProfile';
import CoachProfileView from '@/components/CoachProfileView';
import ProfileEditForm from '@/components/ProfileEditForm';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <p>{t('profile.loginRequired')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isCoach = user.role === 'coach';

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{t('profile.title')}</h1>
        
        {isCoach ? (
          <CoachProfileTabs 
            user={user} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
          />
        ) : (
          <StudentProfileTabs 
            user={user} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
          />
        )}
      </div>
    </Layout>
  );
};

const CoachProfileTabs = ({ user, isEditing, setIsEditing }) => {
  const { t } = useTranslation();
  
  // Mock coach data - in a real app, you would fetch this from your API
  const coachData = {
    ...user,
    bio: 'I am a professional coach with expertise in helping students excel in mathematics and science.',
    expertise: ['Mathematics', 'Physics', 'Chemistry'],
    hourlyRate: 50,
    rating: 4.8,
    availability: [],
    upcomingSessions: [],
    transactions: []
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left column - Profile info */}
      <div className="md:w-1/3">
        <CoachProfileView 
          coachData={coachData} 
          onEditClick={() => setIsEditing(true)} 
        />
      </div>

      {/* Right column - Tabs or edit form */}
      <div className="md:w-2/3">
        {isEditing ? (
          <ProfileEditForm 
            userData={coachData}
            isCoach={true}
            onCancel={() => setIsEditing(false)}
            onSubmit={() => setIsEditing(false)}
          />
        ) : (
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="appointments">{t('profile.tabs.appointments')}</TabsTrigger>
              <TabsTrigger value="earnings">{t('profile.tabs.earnings')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('profile.tabs.reviews')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments">
              <AppointmentsTab />
            </TabsContent>
            
            <TabsContent value="earnings">
              <EarningsTab />
            </TabsContent>
            
            <TabsContent value="reviews">
              <ReviewsTab />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

const StudentProfileTabs = ({ user, isEditing, setIsEditing }) => {
  const { t } = useTranslation();
  
  // Mock student data - in a real app, you would fetch this from your API
  const studentData = {
    ...user,
    interests: ['Mathematics', 'Computer Science'],
    sessionHistory: [],
    paymentMethods: []
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left column - Profile info */}
      <div className="md:w-1/3">
        <StudentProfile 
          studentData={studentData} 
          onEditClick={() => setIsEditing(true)} 
        />
      </div>

      {/* Right column - Tabs or edit form */}
      <div className="md:w-2/3">
        {isEditing ? (
          <ProfileEditForm 
            userData={studentData}
            isCoach={false}
            onCancel={() => setIsEditing(false)}
            onSubmit={() => setIsEditing(false)}
          />
        ) : (
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="sessions">{t('profile.tabs.sessions')}</TabsTrigger>
              <TabsTrigger value="payments">{t('profile.tabs.payments')}</TabsTrigger>
              <TabsTrigger value="favorites">{t('profile.tabs.favorites')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions">
              <SessionsTab />
            </TabsContent>
            
            <TabsContent value="payments">
              <PaymentsTab />
            </TabsContent>
            
            <TabsContent value="favorites">
              <FavoritesTab />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

// Tab components
const AppointmentsTab = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">{t('profile.upcomingAppointments')}</h2>
      <p className="text-gray-500">{t('profile.noAppointments')}</p>
    </div>
  );
};

const EarningsTab = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">{t('profile.earnings')}</h2>
      <p className="text-gray-500">{t('profile.noEarnings')}</p>
    </div>
  );
};

const ReviewsTab = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">{t('profile.reviews')}</h2>
      <p className="text-gray-500">{t('profile.noReviews')}</p>
    </div>
  );
};

const SessionsTab = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">{t('profile.sessionHistory')}</h2>
      <p className="text-gray-500">{t('profile.noSessions')}</p>
    </div>
  );
};

const PaymentsTab = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">{t('profile.paymentHistory')}</h2>
      <p className="text-gray-500">{t('profile.noPayments')}</p>
    </div>
  );
};

const FavoritesTab = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">{t('profile.favoriteCoaches')}</h2>
      <p className="text-gray-500">{t('profile.noFavorites')}</p>
    </div>
  );
};

export default Profile;