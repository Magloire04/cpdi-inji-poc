"use client";

import { useState, useEffect } from 'react';
import { Camera, CreditCard, ShieldCheck } from 'lucide-react';
import * as jose from 'jose';
import { useLanguage } from '@/components/LanguageContext';

export default function WalletPage() {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState([]);
  const [pastedToken, setPastedToken] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('inji_wallet_credentials');
    if (stored) {
      setCredentials(JSON.parse(stored));
    }
  }, []);

  const handleSimulateScan = () => {
    if (!pastedToken) return;
    try {
      const decoded = jose.decodeJwt(pastedToken);
      if (!decoded.vc) throw new Error("Format Invalide");

      const newCred = {
        id: new Date().getTime(),
        token: pastedToken,
        data: decoded.vc.credentialSubject,
        issuer: decoded.vc.issuer,
        date: decoded.vc.issuanceDate
      };

      const updated = [...credentials, newCred];
      setCredentials(updated);
      localStorage.setItem('inji_wallet_credentials', JSON.stringify(updated));
      setPastedToken('');
      setShowScanner(false);
    } catch (e) {
      alert(t('wallet', 'invalidData'));
    }
  };

  const handleClear = () => {
    localStorage.removeItem('inji_wallet_credentials');
    setCredentials([]);
  };

  return (
    <main className="container" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      
      {/* Mobile Phone Mockup */}
      <div style={{ width: '375px', height: '812px', background: '#000', borderRadius: '40px', padding: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }}>
        <div style={{ background: 'var(--background)', width: '100%', height: '100%', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ height: '44px', background: 'var(--cdpi-blue)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', fontSize: '12px', fontWeight: 'bold' }}>
            <span>9:41</span>
            <div style={{ display: 'flex', gap: '4px' }}><span>5G</span><span>100%</span></div>
          </div>

          <div style={{ padding: '20px', background: 'var(--cdpi-blue)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <a href="/" style={{ color: 'white', textDecoration: 'none' }}>{t('wallet', 'quit')}</a>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{t('wallet', 'title')}</h2>
              <ShieldCheck size={24} color="var(--success)" />
            </div>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            
            {credentials.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
                <CreditCard size={48} style={{ margin: '0 auto', opacity: 0.5, marginBottom: '16px' }} />
                <h3>{t('wallet', 'empty')}</h3>
                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>{t('wallet', 'emptyDesc')}</p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>{t('wallet', 'myIdentities')}</h3>
                {credentials.map(c => (
                  <div key={c.id} style={{ background: 'linear-gradient(135deg, var(--cdpi-blue), #1a365d)', borderRadius: '16px', padding: '20px', color: 'white', marginBottom: '16px', boxShadow: '0 10px 20px rgba(10,37,64,0.3)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><ShieldCheck size={120} /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--cdpi-gold)' }}>{t('wallet', 'republic')}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>ID: {c.data.id.split(':').pop()}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', overflow: 'hidden' }}>
                        {c.data.photoUri ? <img src={c.data.photoUri} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{width:'100%', height:'100%', background:'#eee'}}></div>}
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0, textTransform: 'uppercase' }}>{c.data.nom}</h2>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'normal', margin: 0 }}>{c.data.prenom}</h3>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>{t('wallet', 'genderAbbr')}: {c.data.genre}</p>
                      </div>
                    </div>

                    <a href="/verify" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'var(--cdpi-gold)', color: 'var(--cdpi-blue)', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '24px' }}>
                      {t('wallet', 'share')}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {showScanner && (
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{t('wallet', 'scanTitle')}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{t('wallet', 'scanDesc')}</p>
                <textarea className="form-control" rows="4" value={pastedToken} onChange={e => setPastedToken(e.target.value)} style={{ fontSize: '0.7rem', fontFamily: 'monospace' }} />
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleSimulateScan}>{t('wallet', 'btnImport')}</button>
              </div>
            )}

          </div>

          <div style={{ height: '80px', background: 'white', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--cdpi-blue)', cursor: 'pointer' }}>
              <CreditCard size={24} />
              <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>{t('wallet', 'tabs').cards}</span>
            </div>
            
            <div onClick={() => setShowScanner(!showScanner)} style={{ width: '56px', height: '56px', background: 'var(--cdpi-blue)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-20px)', cursor: 'pointer', boxShadow: '0 4px 12px rgba(10,37,64,0.3)' }}>
              <Camera size={28} />
            </div>

            <div onClick={handleClear} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>⚙️</span>
              <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>{t('wallet', 'tabs').reset}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
