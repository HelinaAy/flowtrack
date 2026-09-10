import { useState, useEffect } from 'react';
import api from '../services/api';
import './Wellness.css';

const categoryMeta = {
  nutrition: { label: 'Nutrition', color: '#fce7f1', iconColor: '#d95f91', icon: '🥗' },
  exercise: { label: 'Exercise & Movement', color: '#f3e8ff', iconColor: '#7c3aed', icon: '🧘‍♀️' },
  hydration: { label: 'Hydration', color: '#e0f2fe', iconColor: '#0284c7', icon: '💧' },
  selfCare: { label: 'Self-Care & Rest', color: '#fdf2f8', iconColor: '#db2777', icon: '✨' },
  stressManagement: { label: 'Stress Management', color: '#f0fdf4', iconColor: '#16a34a', icon: '🌿' }
};

export default function Wellness() {
  const [phase, setPhase] = useState('');
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      const res = await api.get('/wellness');
      setPhase(res.data.phase);
      setTips(res.data.tips);
    } catch (err) {
      if (err.response?.status === 404) {
        setNeedsSetup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="wellness-wrapper">
        <p className="text-center" style={{ color: '#8b8494', fontSize: '14px', paddingTop: '40px' }}>
          Loading your wellness tips...
        </p>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="wellness-wrapper">
        <div className="no-cycle-state">
          <h3>No Cycle Data Yet</h3>
          <p>
            Set up your cycle information from the Dashboard first to see personalized wellness guidance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wellness-wrapper">
      <div className="wellness-header">
        <div className="wellness-title">Wellness Tips</div>
        <div className="wellness-subtext">Personalized daily guidance for your current hormonal phase</div>
      </div>

      <div className="wellness-phase-banner">
        <div>
          <div className="wellness-banner-label">Current Cycle Phase</div>
          <div className="wellness-banner-phase">{phase} Phase</div>
        </div>
        <span className="wellness-banner-badge">
          Personalized Routine
        </span>
      </div>

      <div className="wellness-grid">
        {tips && Object.entries(tips).map(([key, text]) => {
          const meta = categoryMeta[key] || { 
            label: key.charAt(0).toUpperCase() + key.slice(1), 
            color: '#fdf2f7', 
            iconColor: '#d95f91',
            icon: '🌸' 
          };

          return (
            <div className="wellness-card" key={key}>
              <div className="wellness-card-header">
                <div className="wellness-card-icon" style={{ background: meta.color }}>
                  <span style={{ fontSize: '17px' }}>{meta.icon}</span>
                </div>
                <div className="wellness-card-title">{meta.label}</div>
              </div>
              <p className="wellness-card-text">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}