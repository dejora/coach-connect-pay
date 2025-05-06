
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';

type AuthFormProps = {
  type: 'login' | 'signup';
};

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['coach', 'student', 'admin'] as const),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  passwordConfirm: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ['passwordConfirm'], 
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'student'
    }
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      role: 'student'
    }
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await login(values.email, values.password, values.role);
      toast({
        title: "Login successful!",
        description: `Welcome back to CoachConnect`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    try {
      setIsSubmitting(true);
      await signup(values.email, values.password, values.name, values.role);
      toast({
        title: "Account created successfully!",
        description: `Welcome to CoachConnect, ${values.name}!`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>{type === 'login' ? 'Log In' : 'Create an Account'}</CardTitle>
        <CardDescription>
          {type === 'login'
            ? 'Enter your credentials to access your account'
            : 'Fill out the form below to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {type === 'login' ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I am a:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="student" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Student
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="coach" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Coach
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="admin" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Admin
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I want to join as a:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="student" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Student
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="coach" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Coach
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="admin" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Admin
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {type === 'login' ? (
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
              Log in
            </Button>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
