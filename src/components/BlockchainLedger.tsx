import { useNexusStore } from '../store/nexusStore';

export default function BlockchainLedger() {
  const { assets } = useNexusStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Blockchain Ledger Explorer</h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Record Count: <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{assets.length}</span>
        </span>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>Asset Identifier</th>
              <th style={{ padding: '1rem' }}>Valuation</th>
              <th style={{ padding: '1rem' }}>FICO Score</th>
              <th style={{ padding: '1rem' }}>Country</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Tx Deploy Hash</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Ledger state empty. Register assets in Sandbox and authorize pipeline evaluations to write blocks.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr 
                  key={asset.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {asset.name ?? 'Unregistered Asset'}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                    ${(asset.value ?? 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {asset.ficoScore ?? 'N/A'}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {asset.countryCode ?? 'N/A'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`asset-status-pill status-${(asset.status ?? 'DRAFT').toLowerCase()}`}>
                      {asset.status ?? 'DRAFT'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {asset.txHash ? (
                      <span style={{ color: 'var(--secondary)' }}>{asset.txHash}</span>
                    ) : asset.status === 'REJECTED' ? (
                      <span style={{ color: 'var(--accent)' }}>ABORTED: {asset.failureReason ?? 'Check failed'}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Pending Deployment</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
