
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coach } from '@/types';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CoachesTableProps {
  coaches: Coach[];
  onStatusChange?: (coach: Coach, isActive: boolean) => Promise<void>;
  isAdmin?: boolean;
}

const CoachesTable: React.FC<CoachesTableProps> = ({ 
  coaches, 
  onStatusChange,
  isAdmin = false
}) => {
  const { t } = useTranslation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (coach: Coach, isActive: boolean) => {
    if (!onStatusChange) return;
    
    try {
      setUpdatingId(coach.id);
      await onStatusChange(coach, isActive);
      toast.success(
        isActive 
          ? t('coaches.activateSuccess', { name: coach.name }) 
          : t('coaches.deactivateSuccess', { name: coach.name })
      );
    } catch (error) {
      console.error('Error updating coach status:', error);
      toast.error(t('coaches.updateError'));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Table>
      <TableCaption>{t('coaches.tableCaption')}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t('coaches.name')}</TableHead>
          <TableHead>{t('coaches.expertise')}</TableHead>
          <TableHead className="text-right">{t('coaches.hourlyRate')}</TableHead>
          <TableHead className="text-center">{t('coaches.rating')}</TableHead>
          {isAdmin && <TableHead className="text-center">{t('coaches.active')}</TableHead>}
          <TableHead className="text-center">{t('coaches.profile')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coaches.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-6 text-muted-foreground">
              {t('coaches.noCoaches')}
            </TableCell>
          </TableRow>
        ) : (
          coaches.map((coach) => (
            <TableRow key={coach.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {coach.profileImage ? (
                    <div 
                      className="w-8 h-8 rounded-full bg-center bg-cover" 
                      style={{ backgroundImage: `url(${coach.profileImage})` }} 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {coach.name?.substring(0, 1) || 'C'}
                    </div>
                  )}
                  <span className="font-medium">{coach.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {coach.expertise?.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  )) || '—'}
                </div>
              </TableCell>
              <TableCell className="text-right">
                ${coach.hourlyRate || 0}/hr
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span>{coach.rating?.toFixed(1) || '—'}</span>
                </div>
              </TableCell>
              {isAdmin && (
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch
                      checked={coach.isActive}
                      disabled={updatingId === coach.id}
                      onCheckedChange={(checked) => handleStatusChange(coach, checked)}
                    />
                  </div>
                </TableCell>
              )}
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Link 
                    to={`/coach/${coach.id}`}
                    className="text-primary hover:text-primary-dark"
                    title={t('coaches.viewProfile')}
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CoachesTable;
