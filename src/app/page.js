"use client";

import Link from 'next/link';
import { ShieldCheck, Smartphone, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="container">
      <div style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }} className="animate-fade-in">
        <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('home', 'title')}</h1>
        <p className="page-subtitle" style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          {t('home', 'subtitle')}
        </p>
      </div>

      <div className="grid-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Module Certify */}
        <Link href="/certify" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
             <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(10, 37, 64, 0.1)', color: 'var(--cdpi-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <ShieldCheck size={32} />
             </div>
             <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Inji Certify</h2>
             <h3 style={{ fontSize: '0.9rem', color: 'var(--cdpi-gold)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 'bold' }}>{t('home', 'issuer')}</h3>
             <p style={{ color: 'var(--text-muted)', flex: 1 }}>
               {t('home', 'certifyDesc')}
             </p>
             <div className="btn btn-outline" style={{ marginTop: '24px', width: '100%' }}>{t('home', 'access')}</div>
          </div>
        </Link>

        {/* Module Wallet */}
        <Link href="/wallet" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
             <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--cdpi-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Smartphone size={32} />
             </div>
             <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Inji Wallet</h2>
             <h3 style={{ fontSize: '0.9rem', color: 'var(--cdpi-gold)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 'bold' }}>{t('home', 'holder')}</h3>
             <p style={{ color: 'var(--text-muted)', flex: 1 }}>
               {t('home', 'walletDesc')}
             </p>
             <div className="btn btn-outline" style={{ marginTop: '24px', width: '100%' }}>{t('home', 'access')}</div>
          </div>
        </Link>

        {/* Module Verify */}
        <Link href="/verify" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
             <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <CheckCircle size={32} />
             </div>
             <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Inji Verify</h2>
             <h3 style={{ fontSize: '0.9rem', color: 'var(--cdpi-gold)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 'bold' }}>{t('home', 'verifier')}</h3>
             <p style={{ color: 'var(--text-muted)', flex: 1 }}>
               {t('home', 'verifyDesc')}
             </p>
             <div className="btn btn-outline" style={{ marginTop: '24px', width: '100%' }}>{t('home', 'access')}</div>
          </div>
        </Link>

      </div>
    </main>
  );
}
