import React from 'react';
import { motion } from 'framer-motion';

const RiskMeter = ({ score, status }) => {
    const getColor = () => {
        if (score < 30) return 'var(--safe)';
        if (score < 70) return 'var(--suspicious)';
        return 'var(--danger)';
    };

    const color = getColor();
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const halfCircumference = circumference / 2;
    const offset = halfCircumference - (score / 100) * halfCircumference;

    return (
        <div className="glass-panel" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Risk Assessment</h3>

            <div style={{ position: 'relative', width: '200px', height: '120px' }}>
                <svg width="200" height="120" viewBox="0 0 200 120">
                    {/* Background Path */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="15"
                        strokeLinecap="round"
                    />
                    {/* Progress Path */}
                    <motion.path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke={color}
                        strokeWidth="15"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: halfCircumference, strokeDashoffset: halfCircumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>

                <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}
                    >
                        {Math.round(score)}%
                    </motion.div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Risk Score
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                style={{
                    marginTop: '1rem',
                    padding: '0.4rem 1.2rem',
                    borderRadius: '2rem',
                    backgroundColor: `${color}20`,
                    color: color,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: `1px solid ${color}40`
                }}
            >
                {status.toUpperCase()}
            </motion.div>
        </div>
    );
};

export default RiskMeter;
