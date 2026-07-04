import React, { useEffect, useRef } from 'react';
import { useNexusStore } from '../store/nexusStore';

export default function MissionControlTerminal() {
  const { activeAsset, logsBus, clearLogs } = useNexusStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (panelRef.current) {
      panelRef.current.classList.add('terminal-glow');
      const timer = setTimeout(() => {
        panelRef.current?.classList.remove('terminal-glow');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [logsBus.length]);

  const stages = [
    { num: 1, label: 'Initiation' },
    { num: 2, label: 'Policy Retrieval' },
    { num: 3, label: 'Risk Assessment' },
    { num: 4, label: 'Tx Packaging' },
    { num: 5, label: 'Consensus Proof' },
  ];

  // Helper to determine milestone styling based on activeAsset status
  const getMilestoneClass = (stepNum: number) => {
    if (!activeAsset) return 'standby';

    const currentStage = activeAsset.stage || 0;
    const status = activeAsset.status;

    if (status === 'REJECTED' && currentStage === stepNum) {
      return 'aborted'; // Deep crimson
    }

    if (status === 'CONFIRMED' || currentStage > stepNum) {
      return 'verified'; // Green
    }

    if (currentStage === stepNum) {
      return 'active'; // Pulsing blue
    }

    return 'standby'; // Neutral gray
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Mission Control Terminal</h3>
        {activeAsset && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target:</span>
            <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{activeAsset.name}</span>
          </div>
        )}
      </div>

      {/* Milestone Row */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '18px',
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255,255,255,0.06)',
            zIndex: 1
          }} />

          {stages.map((s) => {
            const milestoneClass = getMilestoneClass(s.num);
            let bubbleStyle: React.CSSProperties = {
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#0b0c10',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              transition: 'all 0.3s ease',
              zIndex: 2
            };

            let labelColor = 'var(--text-secondary)';

            if (milestoneClass === 'active') {
              bubbleStyle.borderColor = 'var(--secondary)';
              bubbleStyle.color = 'var(--secondary)';
              bubbleStyle.boxShadow = '0 0 12px var(--secondary-glow)';
              bubbleStyle.animation = 'pulse 1.5s infinite';
              labelColor = 'var(--text-primary)';
            } else if (milestoneClass === 'verified') {
              bubbleStyle.borderColor = 'var(--success)';
              bubbleStyle.color = 'var(--success)';
              bubbleStyle.background = 'rgba(16, 185, 129, 0.05)';
              labelColor = 'var(--success)';
            } else if (milestoneClass === 'aborted') {
              bubbleStyle.borderColor = 'var(--accent)';
              bubbleStyle.color = 'var(--accent)';
              bubbleStyle.background = 'rgba(244, 63, 94, 0.05)';
              labelColor = 'var(--accent)';
            }

            return (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={bubbleStyle}>{s.num}</div>
                <span style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 500, color: labelColor, maxWidth: '90px' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div ref={panelRef} className="terminal-panel glass-panel" style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
        <div className="terminal-header">
          <span style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>Live Logs Bus Terminal</span>
          <button className="btn btn-secondary" onClick={clearLogs} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>
            Clear Logs
          </button>
        </div>
        <div className="terminal-body" style={{ flex: 1, overflowY: 'auto' }}>
          {logsBus.map((log, index) => (
            <div key={index} className="log-line">
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
