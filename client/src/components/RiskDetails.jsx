import React from 'react';
import { ShieldAlert, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const RiskDetails = ({ findings }) => {
    if (!findings || findings.length === 0) return null;

    return (
        <div className="animate-fade">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldAlert size={24} color="var(--danger)" /> Detected Vulnerabilities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {findings.map((item, index) => (
                    <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: item.category === 'DANGER' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
                            {item.category === 'DANGER' ? (
                                <ShieldAlert size={20} color="var(--danger)" />
                            ) : item.category === 'Safe' ? (
                                <ShieldCheck size={20} color="var(--safe)" />
                            ) : (
                                <AlertTriangle size={20} color="var(--suspicious)" />
                            )}
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.category}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RiskDetails;
