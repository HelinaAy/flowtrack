import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { darkMode, toggleTheme } = useTheme();
  

  useEffect(() => {
    loadCycle();
  }, []);

  const loadCycle = async () => {
    try {
      const res = await api.get('/cycle');
      if (res.data) {
        setLastPeriodDate(res.data.last_period_date?.split('T')[0] || '');
        setCycleLength(res.data.cycle_length || 28);
        setPeriodLength(res.data.period_length || 5);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // No cycle data yet — leave fields at defaults, this is expected for new users
      } else {
        console.error('Load cycle error:', err.response?.data || err.message);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');

    // Frontend validation before hitting the backend
    if (!lastPeriodDate) {
      setError('Please select your last period start date.');
      setSaving(false);
      return;
    }

    if (!cycleLength || Number(cycleLength) < 20 || Number(cycleLength) > 45) {
      setError('Cycle length must be between 20 and 45 days.');
      setSaving(false);
      return;
    }

    if (!periodLength || Number(periodLength) < 1 || Number(periodLength) > 10) {
      setError('Period length must be between 1 and 10 days.');
      setSaving(false);
      return;
    }

    try {
      const res = await api.post('/cycle', {
        lastPeriodDate,
        cycleLength: Number(cycleLength),
        periodLength: Number(periodLength)
      });
      console.log('Save response:', res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to save. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <div className="profile-title">Profile & Settings</div>
        <div className="profile-subtext">Manage your account and cycle preferences</div>
      </div>

      <div className="profile-container">
        {/* User Card */}
        <div className="profile-card">
          <div className="profile-avatar-row">
            <div className="profile-avatar">{initials}</div>
            <div>
              <div className="profile-name">{user?.name || 'FlowTrack Member'}</div>
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Cycle Information Settings */}
        <div className="profile-card">
          <div className="profile-section-title">Cycle Information</div>

          {error && <div className="profile-error">{error}</div>}
          {saved && <div className="profile-saved-msg">Cycle information updated</div>}

          <div className="profile-form-group">
            <label className="profile-label">Last Period Start Date</label>
            <input
              type="date"
              className="profile-input"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
            />
          </div>

          <div className="profile-form-group">
            <label className="profile-label">Average Cycle Length (days)</label>
            <input
              type="number"
              className="profile-input"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              min={20}
              max={45}
            />
          </div>

          <div className="profile-form-group">
            <label className="profile-label">Average Period Length (days)</label>
            <input
              type="number"
              className="profile-input"
              value={periodLength}
              onChange={(e) => setPeriodLength(e.target.value)}
              min={1}
              max={10}
            />
          </div>

          <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Appearance Settings */}
        <div className="profile-card">
          <div className="profile-section-title">Appearance</div>
          <div className="theme-toggle-row">
            <span className="theme-toggle-label">Dark Mode</span>
            <button
  type="button"
  className={`theme-switch ${darkMode ? 'active' : ''}`}
  onClick={toggleTheme}
  aria-label="Toggle dark mode"
>
  <span className="theme-switch-knob"></span>
</button>
          </div>
        </div>

        {/* Logout Action */}
        <div className="profile-card">
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}