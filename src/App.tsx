import React, { useState } from 'react';
import { useNexusStore } from './store/nexusStore';
import ControlCenter from './components/ControlCenter';
import AssetSandbox from './components/AssetSandbox';
import MissionControlTerminal from './components/MissionControlTerminal';
import BlockchainLedger from './components/BlockchainLedger';

export default function App() {
  const {
    walletAddress,
    rpcStatus,
    rpcUrl,
    contractHash,
    connectWallet,
    disconnectWallet,
    setRpcSettings,
    activeTab,
    setActiveTab,
  } = useNexusStore();

  // Check connection on mount
  React.useEffect(() => {
    useNexusStore.getState().fetchOnChainConstraints().catch(() => {});
  }, []);

  // Local Form states
  const [inputRpcUrl, setInputRpcUrl] = useState(rpcUrl);
  const [inputContractHash, setInputContractHash] = useState(contractHash);

  // Sync RPC settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setRpcSettings(inputRpcUrl, inputContractHash);
  };

  const navItems = [
    { id: 'control-center', label: '🛠️ Control Center' },
    { id: 'sandbox', label: '🧪 Asset Sandbox' },
    { id: 'mission-control', label: '📡 Mission Control' },
    { id: 'ledger', label: '⛓️ Blockchain Ledger' },
    { id: 'wallet-profile', label: '🔑 Wallet Profile' },
    { id: 'network-analytics', label: '📊 Network Analytics' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">N</div>
          <div className="logo-text">NexusVault</div>
        </div>

        <div className="header-actions">
          <div className="rpc-status-tag">
            <span className={`rpc-dot ${rpcStatus === 'ONLINE' ? 'online' : 'offline'}`}></span>
            <span>RPC: {rpcStatus}</span>
          </div>

          {walletAddress ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 6)}
              </span>
              <button className="btn btn-danger" onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Casper Signer
            </button>
          )}
        </div>
      </header>

      {/* Main Tabbed Grid Layout */}
      <main className="app-container" style={{ gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        
        {/* Navigation Sidebar */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', paddingLeft: '0.5rem', marginBottom: '0.5rem' }}>
              Navigation
            </span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="btn"
                style={{
                  justifyContent: 'flex-start',
                  background: activeTab === item.id ? 'var(--primary-glow)' : 'transparent',
                  border: activeTab === item.id ? '1px solid var(--primary)' : '1px solid transparent',
                  color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.6rem 1rem',
                  fontSize: '0.9rem',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick config settings inside sidebar */}
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div className="panel-header" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>RPC Config</div>
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Endpoint</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                  value={inputRpcUrl}
                  onChange={(e) => setInputRpcUrl(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Contract Hash</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                  value={inputContractHash}
                  onChange={(e) => setInputContractHash(e.target.value)}
                  placeholder="hash-..."
                />
              </div>

              <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}>
                Save Settings
              </button>
            </form>
          </div>
        </section>

        {/* Dynamic Panel Content Area */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeTab === 'control-center' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <ControlCenter />
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <AssetSandbox />
            </div>
          )}

          {activeTab === 'mission-control' && (
            <div className="glass-panel" style={{ padding: '2rem', height: '100%', minHeight: '550px' }}>
              <MissionControlTerminal />
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <BlockchainLedger />
            </div>
          )}

          {activeTab === 'wallet-profile' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>🔑 Wallet Profile & Credentials</h3>
              {walletAddress ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)' }}>
                    <div className="hud-title" style={{ fontSize: '0.8rem' }}>Connected Public Key (Hex)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--secondary)', wordBreak: 'break-all', marginTop: '0.25rem' }}>
                      {walletAddress}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '1rem', flex: 1 }}>
                      <div className="hud-title" style={{ fontSize: '0.75rem' }}>Signature Algorithm</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                        ED25519 / SECP256K1
                      </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1rem', flex: 1 }}>
                      <div className="hud-title" style={{ fontSize: '0.75rem' }}>Connection State</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--success)', marginTop: '0.25rem' }}>
                        Authorized
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">🔒</span>
                  <span>No wallet connected.</span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    Connect your Casper Signer or Casper Wallet in the top right to authorize interactions.
                  </span>
                  <button className="btn btn-primary" onClick={connectWallet} style={{ marginTop: '1rem' }}>
                    Connect Wallet Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'network-analytics' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>📊 Casper Network Analytics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div className="hud-title" style={{ fontSize: '0.75rem' }}>Network Provider</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rpcUrl}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div className="hud-title" style={{ fontSize: '0.75rem' }}>Target Contract</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {contractHash || 'No contract queried'}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div className="hud-title" style={{ fontSize: '0.75rem' }}>Ledger Health Status</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: rpcStatus === 'ONLINE' ? 'var(--success)' : 'var(--accent)', marginTop: '0.25rem' }}>
                    {rpcStatus === 'ONLINE' ? 'Synced with Peer Network' : 'Disconnected'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
