
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 flex items-center justify-center">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('language.changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
          {t('language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('fr')} className="cursor-pointer">
          {t('language.french')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('es')} className="cursor-pointer">
          {t('language.spanish')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
