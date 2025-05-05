
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import LanguageSelector from '../LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <div className="fixed bottom-5 right-5 z-50 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
        <LanguageSelector />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
