
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-2xl text-brand-blue">Coach<span className="text-brand-teal">Connect</span></span>
            </Link>
            <p className="mt-4 text-gray-500">
              {t('footer.connect')}
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-medium text-lg mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-brand-teal transition-colors">Home</Link></li>
              <li><Link to="/coaches" className="text-gray-500 hover:text-brand-teal transition-colors">Browse Coaches</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-brand-teal transition-colors">Pricing</Link></li>
              <li><Link to="/how-it-works" className="text-gray-500 hover:text-brand-teal transition-colors">How It Works</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-medium text-lg mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-500 hover:text-brand-teal transition-colors">{t('footer.termsOfService')}</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-brand-teal transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-brand-teal transition-colors">{t('footer.cookiePolicy')}</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-medium text-lg mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2">
              <li className="text-gray-500">support@coachconnect.com</li>
              <li className="text-gray-500">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} CoachConnect. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
