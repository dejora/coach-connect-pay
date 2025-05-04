
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface CalendarHeaderProps {
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  handlePrevWeek, 
  handleNextWeek 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">{t('calendar.myCalendar')}</h2>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={handlePrevWeek}>{t('calendar.previousWeek')}</Button>
        <Button variant="outline" onClick={handleNextWeek}>{t('calendar.nextWeek')}</Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
