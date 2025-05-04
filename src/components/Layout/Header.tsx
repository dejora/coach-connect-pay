
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl text-brand-blue">Coach<span className="text-brand-teal">Connect</span></span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {!user ? (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline">{t('navigation.login')}</Button>
              </Link>
              <Link to="/signup">
                <Button>{t('navigation.signup')}</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline">{t('navigation.dashboard')}</Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
                    <Avatar>
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">{t('navigation.profile')}</Link>
                  </DropdownMenuItem>
                  {user.role === 'coach' && (
                    <DropdownMenuItem>
                      <Link to="/calendar" className="w-full">{t('navigation.calendar')}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link to="/appointments" className="w-full">{t('navigation.appointments')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    {t('navigation.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
