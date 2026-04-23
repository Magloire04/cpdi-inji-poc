"use client";

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useLanguage } from '@/components/LanguageContext';

export default function CertifyPage() {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    npi: '',
    nom: '',
    prenom: '',
    genre: 'M',
    photoUri: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("Image trop grande / Image too large (< 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUri: reader.result }); // Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/certify/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      try {
        // Sauvegarde temporaire pour le scan cross-device
        const blobRes = await fetch('https://jsonblob.com/api/jsonBlob', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ token: data.credentialToken })
        });
        const loc = blobRes.headers.get('Location');
        if (loc) {
          data.blobId = loc.split('/').pop();
        }
      } catch (err) {
        console.warn("JsonBlob upload failed", err);
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      alert(t('certify', 'errorInternal'));
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
        <h1 className="page-title">{t('certify', 'title')}</h1>
        <p className="page-subtitle">{t('certify', 'subtitle')}</p>
      </div>

      <div className="grid-2">
        {/* Formulaire */}
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'var(--cdpi-blue)' }}>{t('certify', 'formTitle')}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('certify', 'npi')}</label>
              <input type="text" className="form-control" name="npi" value={formData.npi} onChange={handleChange} required placeholder={t('certify', 'placeholderNpi')} />
            </div>
            
            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label>{t('certify', 'lastName')}</label>
                <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleChange} required placeholder={t('certify', 'placeholderNom')} />
              </div>
              <div className="form-group">
                <label>{t('certify', 'firstName')}</label>
                <input type="text" className="form-control" name="prenom" value={formData.prenom} onChange={handleChange} required placeholder={t('certify', 'placeholderPrenom')} />
              </div>
            </div>

            <div className="form-group">
              <label>{t('certify', 'gender')}</label>
              <select className="form-control form-select" name="genre" value={formData.genre} onChange={handleChange}>
                <option value="M">{t('certify', 'male')}</option>
                <option value="F">{t('certify', 'female')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('certify', 'photoUpload')}</label>
              <input type="file" accept="image/*" className="form-control" onChange={handlePhotoUpload} />
              {formData.photoUri && (
                <div style={{ marginTop: '8px', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
                   <img src={formData.photoUri} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
              {loading ? t('certify', 'btnLoading') : t('certify', 'btnEmit')}
            </button>
          </form>
        </div>

        {/* Résultat / QR Code */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {result ? (
            <div className="glass" style={{ padding: '32px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>{t('certify', 'success')}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                {t('certify', 'successDesc')}
              </p>
              
              <div style={{ background: 'white', padding: '16px', borderRadius: '16px', display: 'inline-block', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {/* Simulation de l'offre OpenID4VCI avec un ID de session externe */}
                <QRCodeCanvas value={result.blobId ? `inji://vc?id=${result.blobId}` : `mosip:test`} size={256} />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(result.credentialToken);
                    alert("Jeton JWT copié dans le presse-papier ! / Token copied !");
                  }}
                >
                  📄 Copier le Jeton pour l'importer dans le Wallet
                </button>
              </div>

              {/* Dev Panel */}
              <div className="dev-panel glass-dark" style={{ textAlign: 'left', marginTop: 'auto' }}>
                <h3 style={{ color: 'var(--cdpi-accent)' }}>{t('certify', 'devTitle')}</h3>
                <p style={{ marginBottom: '8px', color: '#ccc' }}><strong>W3C Verifiable Credential (Standard MOSIP):</strong></p>
                <div className="code-block" style={{ fontSize: '11px', maxHeight: '150px' }}>
                  <code>{JSON.stringify(result.rawPayload, null, 2)}</code>
                </div>
                <p style={{ marginBottom: '8px', color: '#ccc' }}><strong>JWT (Signature ES256 Inji):</strong></p>
                <div className="code-block" style={{ fontSize: '10px', wordWrap: 'break-word', color: 'var(--cdpi-gold)' }}>
                  <code>{result.credentialToken}</code>
                </div>
              </div>
            </div>
          ) : (
             <div className="glass" style={{ padding: '32px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
               {t('certify', 'fillForm')}
             </div>
          )}
        </div>
      </div>
    </main>
  );
}
