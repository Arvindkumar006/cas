import { useNexusStore } from '../store/nexusStore';

export default function ControlCenter() {
  const { rpcStatus, assets, onChainConstraints } = useNexusStore();

  // Dynamic calculations from live assets array
  const totalEvaluations = assets.length;
  const successfulDeploys = assets.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'DEPLOYING' || a.status === 'APPROVED'
  ).length;
  const totalRejections = assets.filter((a) => a.status === 'REJECTED').length;
  
  const rejectionRatio = totalEvaluations > 0 
    ? Math.round((totalRejections / totalEvaluations) * 100) 
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>System Control Center</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Node Link:</span>
          <span 
            className={`rpc-status-tag`} 
            style={{ 
              borderColor: rpcStatus === 'ONLINE' ? 'var(--success)' : 'var(--accent)',
              color: rpcStatus === 'ONLINE' ? '#6ee7b7' : '#fda4af',
              background: rpcStatus === 'ONLINE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              padding: '0.25rem 0.75rem'
            }}
          >
            <span className={`rpc-dot ${rpcStatus === 'ONLINE' ? 'online' : 'offline'}`} />
            {rpcStatus}
          </span>
        </div>
      </div>

      {/* Dynamic Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--secondary)' }}>
          <div className="hud-title">Total Evaluations</div>
          <div className="hud-value" style={{ color: 'var(--text-primary)' }}>{totalEvaluations}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Real-time properties registered
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
          <div className="hud-title">Successful Deploys</div>
          <div className="hud-value" style={{ color: 'var(--success)' }}>{successfulDeploys}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Ledger-confirmed integrations
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent)' }}>
          <div className="hud-title">Rejection Ratio</div>
          <div className="hud-value" style={{ color: 'var(--accent)' }}>{rejectionRatio}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Based on policy compliance aborts
          </div>
        </div>
      </div>

      {/* Policy Monitor */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="panel-header" style={{ marginBottom: '1rem' }}>On-Chain Policy Configuration</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MAX RISK BARRIER</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.25rem' }}>
              {onChainConstraints.maxRiskBarrier > 0 ? `${onChainConstraints.maxRiskBarrier}%` : 'Uninitialized'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Max risk allowed for ledger endorsement
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MINIMUM FICO SCORE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.25rem' }}>
              {onChainConstraints.minimumFico > 0 ? onChainConstraints.minimumFico : 'Uninitialized'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Minimum borrower rating criteria
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
