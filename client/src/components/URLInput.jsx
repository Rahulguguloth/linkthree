import React, { useState } from 'react';
import { Search } from 'lucide-react';

const URLInput = ({ onAnalyze, loading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            // Ensure protocol is present
            let finalUrl = url.trim();
            if (!/^https?:\/\//i.test(finalUrl)) {
                finalUrl = 'http://' + finalUrl;
            }
            onAnalyze(finalUrl);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL to analyze (e.g., example.com)"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1.25rem 1.25rem 1.25rem 3.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border)',
                        borderRadius: '1rem',
                        color: 'var(--text-main)',
                        fontSize: '1.1rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
            </div>
            <button
                type="submit"
                disabled={loading || !url.trim()}
                style={{
                    padding: '1.25rem 2.5rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: loading || !url.trim() ? 0.6 : 1,
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-hover)')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary)')}
            >
                {loading ? 'Analyzing...' : 'Analyze Now'}
            </button>
        </form>
    );
};

export default URLInput;
