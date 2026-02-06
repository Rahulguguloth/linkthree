import React from 'react';
import { ExternalLink, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

const History = ({ items, onSelect }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item, index) => (
                <div
                    key={item._id || index}
                    onClick={() => onSelect(item)}
                    className="glass-panel"
                    style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--glass)')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: item.status === 'Safe' ? 'var(--safe)' : item.status === 'Suspicious' ? 'var(--suspicious)' : 'var(--danger)'
                        }}></div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.1rem' }}>{item.url}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: item.status === 'Safe' ? 'var(--safe)' : item.status === 'Suspicious' ? 'var(--suspicious)' : 'var(--danger)' }}>
                                {item.riskScore}%
                            </span>
                            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Risk</p>
                        </div>
                        <ExternalLink size={18} color="var(--text-muted)" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default History;
