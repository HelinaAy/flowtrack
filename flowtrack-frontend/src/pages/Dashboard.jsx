import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Droplet,
  Calendar as CalendarIcon,
  Heart,
  Activity,
  Smile,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const phaseDescriptions = {
  menstrual: 'Rest, recharge, and honor your natural pace today.',
  follicular: 'Rising energy levels and heightened mental clarity.',
  ovulation: 'Peak confidence, stamina, and ovulatory energy.',
  luteal: 'Winding down, nurturing comfort, and steady pacing.',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  // Hydration tracker (0-8+ cups)
  const [waterGlasses, setWaterGlasses] = useState(3);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryRes, historyRes] = await Promise.all([
        api.get('/cycle/summary'),
        api.get('/cycle/history'),
      ]);

      setSummary(summaryRes.data);
      setHistory(historyRes.data || []);
      setNeedsSetup(false);
    } catch (err) {
      console.error('Dashboard loading error:', err);
      if (err.response?.status === 404) {
        setNeedsSetup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSetup = async () => {
    try {
      await api.post('/cycle', {
        lastPeriodDate: new Date().toISOString().split('T')[0],
        cycleLength: 28,
        periodLength: 5,
      });

      setNeedsSetup(false);
      setLoading(true);
      await loadDashboard();
    } catch (err) {
      console.error('Cycle setup error:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p style={{ color: '#8b8494', fontSize: '14px' }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="dashboard-wrapper">
        <div className="setup-prompt">
          <h3>Set Up Your Cycle</h3>
          <p style={{ color: '#8b8494', fontSize: '13.5px', marginBottom: '20px', lineHeight: '1.5' }}>
            To see your personalized cycle insights, tell us when your last period started. You can fine-tune this anytime in Profile.
          </p>
          <button className="log-btn" onClick={handleQuickSetup}>
            Quick Setup (Start Today)
          </button>
        </div>
      </div>
    );
  }

  const chartData = history
    .slice(0, 6)
    .reverse()
    .map((c, i) => ({
      name: `Cycle ${i + 1}`,
      length: c.cycle_length,
    }));

  return (
    <div className="dashboard-wrapper">
      {/* ==================== HEADER ==================== */}
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          Hello, {user?.name?.split(' ')[0] || 'there'}
        </div>
        <div className="dashboard-subtext">
          Here's your cycle overview and daily wellness status
        </div>
      </div>

      {/* ==================== MAIN GRID ==================== */}
      <div className="dashboard-grid">
        {/* ==================== 1. PHASE CARD ==================== */}
        <div className="phase-card">
          <div className="phase-ring">
            <div className="day-num">{summary?.currentCycleDay || 1}</div>
            <div className="day-label">CYCLE DAY</div>
          </div>
          <div className="phase-name">{summary?.phase || 'Follicular'} Phase</div>
          <div className="phase-desc">
            {phaseDescriptions[summary?.phase] || phaseDescriptions.follicular}
          </div>
        </div>

        {/* ==================== 2. NEXT PERIOD ==================== */}
        <div className="stat-card">
          <div>
            <div className="stat-icon" style={{ background: '#fce7f1' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                  stroke="#d95f91"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="stat-label">Next Period In</div>
            <div className="stat-value">{summary?.daysUntilNextPeriod ?? '--'} days</div>
          </div>
          <div className="stat-sub">Expected {summary?.nextPeriodDate || '--'}</div>
        </div>

        {/* ==================== 3. FERTILE WINDOW ==================== */}
        <div className="stat-card">
          <div>
            <div className="stat-icon" style={{ background: '#f5f3ff' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#7c3aed" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="#7c3aed" />
              </svg>
            </div>
            <div className="stat-label">Fertile Window</div>
            <div className="stat-value" style={{ fontSize: '15px' }}>
              {summary?.fertileWindowStart || '--'} – {summary?.fertileWindowEnd || '--'}
            </div>
          </div>
          <div className="stat-sub" style={{ color: '#7c3aed' }}>
            High Conception Probability
          </div>
        </div>

        {/* ==================== 4. TREND CHART ==================== */}
        <div className="chart-card">
          <div className="card-title">Cycle Length Trend</div>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={190}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5eef4" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#8b8494' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#8b8494' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #eee',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="length"
                  stroke="#d95f91"
                  strokeWidth={2.5}
                  dot={{ fill: '#7c3aed', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#8b8494', fontSize: '13px', margin: '14px 0' }}>
              Log a few more cycles to see your trend here.
            </p>
          )}
        </div>

        {/* ==================== 5. TRACK TODAY CTA ==================== */}
        <div className="log-cta-card">
          <div>
            <div className="card-title" style={{ marginBottom: '6px' }}>
              Track Today's Symptoms
            </div>
            <p style={{ color: '#8b8494', fontSize: '13px', margin: '0 0 16px' }}>
              Log your flow intensity, mood, energy, and cravings for today
            </p>
          </div>
          <button className="log-btn" onClick={() => navigate('/log')}>
            + Add Daily Log
          </button>
        </div>

        {/* ==================== 6. HYDRATION TRACKER (Pure CSS) ==================== */}
        <div className="hydration-card">
          <div className="hydration-header">
            <div className="hydration-title-group">
              <div className="hydration-icon-wrapper">
                <Droplet size={16} />
              </div>
              <div>
                <h4 className="hydration-title">Hydration Tracker</h4>
                <p className="hydration-subtitle">{waterGlasses} of 8 glasses logged today</p>
              </div>
            </div>

            <div className="hydration-controls-btn-group">
              <button
                type="button"
                onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                className="hydration-btn"
                title="Decrease 1 glass"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setWaterGlasses((prev) => Math.min(12, prev + 1))}
                className="hydration-btn hydration-btn-primary"
                title="Add 1 glass"
              >
                +
              </button>
            </div>
          </div>

          <div className="hydration-cups-grid">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                onClick={() => setWaterGlasses(i + 1)}
                className={`hydration-cup-item ${i < waterGlasses ? 'filled' : ''}`}
                title={`Log ${i + 1} glasses`}
              >
                <Droplet size={13} fill={i < waterGlasses ? 'currentColor' : 'none'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== 7. QUICK NAVIGATION (Pure CSS) ==================== */}
      <div className="quick-nav-grid">
        <Link to="/calendar" className="quick-nav-card">
          <div className="quick-nav-icon icon-calendar">
            <CalendarIcon size={18} />
          </div>
          <h3 className="quick-nav-title">Interactive Calendar</h3>
          <p className="quick-nav-desc">View past periods and next 6-month predictions.</p>
        </Link>

        <Link to="/log" className="quick-nav-card">
          <div className="quick-nav-icon icon-log">
            <Heart size={18} />
          </div>
          <h3 className="quick-nav-title">Symptom & Mood Log</h3>
          <p className="quick-nav-desc">Track cramps, flow, energy, cravings, and intimacy.</p>
        </Link>

        <Link to="/insights" className="quick-nav-card">
          <div className="quick-nav-icon icon-insights">
            <Activity size={18} />
          </div>
          <h3 className="quick-nav-title">Cycle Insights</h3>
          <p className="quick-nav-desc">Average cycle variations, duration graphs & patterns.</p>
        </Link>

        <Link to="/wellness" className="quick-nav-card">
          <div className="quick-nav-icon icon-wellness">
            <Smile size={18} />
          </div>
          <h3 className="quick-nav-title">Holistic Wellness</h3>
          <p className="quick-nav-desc">Cycle-synced workouts, nutrition plans & self-care.</p>
        </Link>
      </div>
    </div>
  );
}