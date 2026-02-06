import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, History as HistoryIcon, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import URLInput from './components/URLInput';
import RiskMeter from './components/RiskMeter';
import RiskDetails from './components/RiskDetails';
import History from './components/History';

function App() {
  const [currentScan, setCurrentScan] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/history');
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (url) => {
    setLoading(true);
    setError(null);
    setCurrentScan(null);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { url });
      setCurrentScan(response.data);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="animate-fade" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LinkGuard AI
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>
          Instant URL safety analysis powered by advanced heuristics and global reputation APIs.
        </p>
      </header>

      <main>
        {/* Input Section */}
        <section className="glass-panel animate-fade" style={{ marginBottom: '3rem' }}>
          <URLInput onAnalyze={handleAnalyze} loading={loading} />
          {error && (
            <div style={{ marginTop: '1rem', color: 'var(--danger)', textAlign: 'center', fontWeight: 500 }}>
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {loading && (
          <div className="glass-panel animate-fade" style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Analyzing URL security patterns...</p>
          </div>
        )}

        {currentScan && (
          <div className="animate-fade">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', marginBottom: '3rem' }}>
              <RiskMeter score={currentScan.riskScore} status={currentScan.status} />
              <div className="glass-panel">
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={20} color="var(--primary)" /> Analysis Summary
                </h3>
                <p style={{ lineHeight: 1.6, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                  {currentScan.summary}
                </p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Final Status</span>
                    <span style={{ fontWeight: 600, color: currentScan.status === 'Safe' ? 'var(--safe)' : currentScan.status === 'Suspicious' ? 'var(--suspicious)' : 'var(--danger)' }}>
                      {currentScan.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <RiskDetails findings={currentScan.findings} />
          </div>
        )}

        {/* History Section */}
        {!currentScan && !loading && history.length > 0 && (
          <section className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HistoryIcon size={24} color="var(--primary)" /> Recent Scans
            </h2>
            <History items={history} onSelect={setCurrentScan} />
          </section>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
