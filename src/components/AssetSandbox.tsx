import React, { useState } from 'react';
import { useNexusStore } from '../store/nexusStore';

export default function AssetSandbox() {
  const {
    assets,
    isEvaluating,
    createUserAsset,
    executeLivePipeline,
    addLog,
  } = useNexusStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [value, setValue] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [countryCode, setCountryCode] = useState('US');
  const [ficoScore, setFicoScore] = useState(740);
  const [riskScore, setRiskScore] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    createUserAsset({
      name,
      value: Number(value),
      downPayment: Number(downPayment),
      countryCode,
      ficoScore: Number(ficoScore),
      riskScore: Number(riskScore),
    });

    // Reset and close drawer
    setName('');
    setIsDrawerOpen(false);
    addLog(`Asset Sandbox: Registered asset draft "${name}" successfully.`);
  };

  const handleLaunchEvaluation = async (assetId: string, assetName: string) => {
    // Smooth scroll to the terminal/logs section
    const logsElement = document.querySelector('.terminal-panel');
    if (logsElement) {
      logsElement.scrollIntoView({ behavior: 'smooth' });
      // Add a transient glow effect to draw focus
      logsElement.classList.add('terminal-glow');
      setTimeout(() => {
        logsElement.classList.remove('terminal-glow');
      }, 2000);
    }
    
    addLog(`Asset Sandbox: Swarm Evaluation triggered for "${assetName}". Focusing terminal.`);
    await executeLivePipeline(assetId);
  };

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'AU', name: 'Australia' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SG', name: 'Singapore' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Asset Sandbox Portfolio</h3>
        <button className="btn btn-primary" onClick={() => setIsDrawerOpen(true)}>
          + Open Setup Drawer
        </button>
      </div>

      {/* Grid of registered assets */}
      {assets.length === 0 ? (
        <div className="empty-state glass-panel" style={{ padding: '3rem' }}>
          <span className="empty-icon">📂</span>
          <span>Sandbox Portfolio is empty.</span>
          <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
            Click "Open Setup Drawer" to configure and register property assets.
          </span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {assets.map((asset) => (
            <div key={asset.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', wordBreak: 'break-word' }}>{asset.name}</span>
                <span className={`asset-status-pill status-${asset.status.toLowerCase()}`}>
                  {asset.status}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Appraised Value:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>${asset.value.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Down Payment:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>${asset.downPayment.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Origin Country:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{asset.countryCode}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Borrower FICO:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{asset.ficoScore}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Risk Metrics:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{asset.riskScore}%</span>
                </div>
              </div>

              {asset.status === 'DRAFT' && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleLaunchEvaluation(asset.id, asset.name)}
                  disabled={isEvaluating}
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    padding: '0.5rem 1rem',
                    animation: 'pulse 2s infinite',
                  }}
                >
                  🚀 Launch Swarm Evaluation
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sliding Glassmorphic Setup Drawer Overlay */}
      {isDrawerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '100%',
              borderRadius: 0,
              borderLeft: '1px solid var(--border-color)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              background: 'rgba(18, 19, 28, 0.95)',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 600 }}>Asset Config Drawer</h3>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsDrawerOpen(false)}
                style={{ padding: '0.25rem 0.5rem', minWidth: '40px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div className="form-group">
                <label className="form-label">Asset Reference Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CAS-REALEST-092-DE"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Appraised Valuation ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Down Payment Sizing ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Origin Country Code</label>
                <select
                  className="form-input"
                  style={{ background: 'var(--bg-darker)' }}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  required
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code} style={{ color: 'var(--text-primary)' }}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Borrower Credit Score (300-850)</label>
                <input
                  type="number"
                  className="form-input"
                  value={ficoScore}
                  onChange={(e) => setFicoScore(Number(e.target.value))}
                  min="300"
                  max="850"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assessed Risk Score (0-100%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={riskScore}
                  onChange={(e) => setRiskScore(Number(e.target.value))}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'auto', padding: '0.8rem' }}
              >
                Register Asset as DRAFT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
