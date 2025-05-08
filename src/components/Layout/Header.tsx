
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import DataSourceSwitcher from '@/components/DataSourceSwitcher';

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Users, UserCircle, Calendar, Settings, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  const isLoggedIn = !!user;
  const isCoach = user?.role === 'coach';
  const isAdmin = user?.role === 'admin';

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-brand-blue">
            CoachConnect
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-brand-blue">
              {t('nav.home')}
            </Link>
            
            <Link to="/coaches" className="text-gray-600 hover:text-brand-blue">
              {t('nav.coaches')}
            </Link>
            
            {isLoggedIn && (
              <Link to="/dashboard" className="text-gray-600 hover:text-brand-blue">
                {t('nav.dashboard')}
              </Link>
            )}
            
            {isLoggedIn && (
              <Link to="/appointments" className="text-gray-600 hover:text-brand-blue">
                {t('nav.appointments')}
              </Link>
            )}
            
            {isCoach && (
              <Link to="/calendar" className="text-gray-600 hover:text-brand-blue">
                {t('nav.calendar')}
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <DataSourceSwitcher />
          <LanguageSelector />
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback className="bg-brand-blue/10 text-brand-blue">
                      {user.name?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    {t('nav.profile')}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <Menu className="mr-2 h-4 w-4" />
                    {t('nav.dashboard')}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/appointments" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('nav.appointments')}
                  </Link>
                </DropdownMenuItem>
                
                {(isAdmin || isCoach) && (
                  <DropdownMenuItem asChild>
                    <Link to="/coaches" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      {t('nav.coaches')}
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('nav.settings')}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">{t('nav.signup')}</Link>
              </Button>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
