"use client";

import { useLanguage } from '@/components/LanguageContext';

export default function Header() {
  const { lang, changeLanguage } = useLanguage();

  return (
    <header className="header" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" className="header-logo">
          <span className="logo-accent">C</span>
          CDPI - Trust Framework
        </a>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${lang === 'en' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '6px 12px' }}
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button 
            className={`btn ${lang === 'fr' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '6px 12px' }}
            onClick={() => changeLanguage('fr')}
          >
            FR
          </button>
        </div>
      </div>
    </header>
  );
}
