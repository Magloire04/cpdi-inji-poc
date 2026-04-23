"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function VerifyPage() {
  const { t } = useLanguage();
  const [tokenToVerify, setTokenToVerify] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('inji_wallet_credentials');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) {
        setTokenToVerify(parsed[0].token);
      }
    }
  }, []);

  const handleVerify = async () => {
    if (!tokenToVerify) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: tokenToVerify })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ valid: false, error: "Erreur réseau / Network Error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div style={{ marginBottom: '24px' }}>
        <a href="/" style={{ color: 'var(--cdpi-blue)', textDecoration: 'none', fontWeight: '600' }}>{t('common', 'back')}</a>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title">{t('verify', 'title')}</h1>
        <p className="page-subtitle">{t('verify', 'subtitle')}</p>
      </div>

      <div className="grid-2">
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--cdpi-blue)' }}>{t('verify', 'waitTitle')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{t('verify', 'waitDesc')}</p>

          <div className="form-group">
            <label>{t('verify', 'jwtLabel')}</label>
            <textarea className="form-control" rows="6" value={tokenToVerify} onChange={e => setTokenToVerify(e.target.value)} placeholder="eyJhbGciOiJFUzI1NiIs..." style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleVerify} disabled={!tokenToVerify || loading}>
            {loading ? t('verify', 'btnLoading') : t('verify', 'btnVerify')}
          </button>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {result && (
            <div className="glass" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                {result.valid ? (
                   <>
                    <ShieldCheck size={64} color="var(--success)" style={{ margin: '0 auto', marginBottom: '16px' }} />
                    <h2 style={{ color: 'var(--success)' }}>{t('verify', 'authTitle')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{t('verify', 'authDesc')}</p>
                   </>
                ) : (
                   <>
                    <ShieldAlert size={64} color="var(--danger)" style={{ margin: '0 auto', marginBottom: '16px' }} />
                    <h2 style={{ color: 'var(--danger)' }}>{t('verify', 'invalidTitle')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{t('verify', 'invalidDesc')}</p>
                   </>
                )}
              </div>

              {result.valid && (
                <div style={{ background: 'rgba(255,255,255,0.8)', padding: '24px', borderRadius: '16px', border: '1px solid #eee' }}>
                  <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>{t('verify', 'dataTitle')}</h3>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: '#ccc', overflow:'hidden' }}>
                       {result.decodedPayload.credentialSubject.photoUri && <img src={result.decodedPayload.credentialSubject.photoUri} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--cdpi-blue)' }}>{result.decodedPayload.credentialSubject.nom} {result.decodedPayload.credentialSubject.prenom}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{t('verify', 'genderAbbr')}: {result.decodedPayload.credentialSubject.genre}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>{t('verify', 'npiAbbr')}: <strong>{result.decodedPayload.credentialSubject.npi}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              <div className="dev-panel glass-dark" style={{ textAlign: 'left', marginTop: 'auto', paddingTop: '20px' }}>
                <h3 style={{ color: 'var(--cdpi-accent)' }}>{t('verify', 'devTitle')}</h3>
                <p style={{ marginBottom: '8px', color: '#ccc', fontSize: '0.8rem' }}>Algorithm: ES256</p>
                {result.valid ? (
                   <div className="code-block" style={{ fontSize: '11px', maxHeight: '150px' }}>
                    <code style={{color: 'var(--success)'}}>{JSON.stringify(result.header, null, 2)}</code><br/>
                    <code>Verification_Status = SUCCESS</code>
                   </div>
                ) : (
                   <div className="code-block" style={{ fontSize: '11px', maxHeight: '150px' }}>
                    <code style={{color: 'var(--danger)'}}>Error: {result.error}</code>
                   </div>
                )}
                
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}
