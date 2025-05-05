import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';

// Define the props interface
interface ProfileEditFormProps {
  userData: any;
  isCoach: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ 
  userData,
  isCoach,
  onCancel, 
  onSubmit
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define the form schema based on user role
  const formSchema = isCoach 
    ? z.object({
        name: z.string().min(2, t('form.errors.nameRequired')),
        email: z.string().email(t('form.errors.emailInvalid')),
        bio: z.string().optional(),
        expertise: z.string(),
        hourlyRate: z.coerce.number().positive(t('form.errors.ratePositive')),
      })
    : z.object({
        name: z.string().min(2, t('form.errors.nameRequired')),
        email: z.string().email(t('form.errors.emailInvalid')),
        interests: z.string().optional(),
      });

  // Initialize the form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name || '',
      email: userData.email || '',
      bio: userData.bio || '',
      expertise: isCoach ? userData.expertise?.join(', ') || '' : undefined,
      hourlyRate: isCoach ? userData.hourlyRate || 0 : undefined,
      interests: !isCoach ? userData.interests?.join(', ') || '' : undefined,
    }
  });

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, you'd make an API call to update the profile
      console.log('Form values:', values);
      
      // Show success message
      toast.success(t('profile.updateSuccess'), {
        description: t('profile.updateSuccessMessage'),
      });
      
      // Call the parent component's onSubmit function
      onSubmit();
    } catch (error) {
      toast.error(t('profile.updateFailed'), {
        description: t('profile.updateFailedMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.editProfile')}</CardTitle>
        <CardDescription>{t('profile.editProfileDescription')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isCoach && (
              <>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.bio')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('form.bioPlaceholder')}
                          className="resize-none min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.expertise')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.expertisePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        {t('form.separateWithCommas')}
                      </p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.hourlyRate')}</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {!isCoach && (
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.interests')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.interestsPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      {t('form.separateWithCommas')}
                    </p>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.saving') : t('common.saveChanges')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProfileEditForm;