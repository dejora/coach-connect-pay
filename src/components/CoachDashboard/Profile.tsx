
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Separator } from '@/components/ui/separator';
import { Coach } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  expertise: z.string(),
  hourlyRate: z.coerce.number().positive('Rate must be positive'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const CoachProfile: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This would be populated from your backend in a real application
  const [coachData, setCoachData] = useState<Partial<Coach>>({
    name: user?.name || '',
    bio: 'I am a professional coach with expertise in helping students excel in mathematics and science.',
    expertise: ['Mathematics', 'Physics', 'Chemistry'],
    hourlyRate: 50,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: coachData.name || '',
      bio: coachData.bio || '',
      expertise: coachData.expertise?.join(', ') || '',
      hourlyRate: coachData.hourlyRate || 0,
    }
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, you'd update this in your database
      setCoachData({
        ...coachData,
        name: values.name,
        bio: values.bio,
        expertise: values.expertise.split(',').map(item => item.trim()),
        hourlyRate: values.hourlyRate,
      });

      // Show success message
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your coach profile information</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell students about yourself, your experience, and teaching style..."
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
                    <FormLabel>Areas of Expertise</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mathematics, Physics, Chemistry" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Separate multiple areas with commas
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Preview</CardTitle>
          <CardDescription>This is how students will see your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-2xl font-bold">
              {coachData.name?.substring(0, 1) || 'C'}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{coachData.name || 'Your Name'}</h3>
              <p className="text-gray-500">Coach</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-gray-600">{coachData.bio || 'No biography provided.'}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {coachData.expertise?.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-brand-teal/10 text-brand-teal px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Hourly Rate</h4>
            <p className="text-xl font-bold text-brand-blue">${coachData.hourlyRate}/hr</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachProfile;
