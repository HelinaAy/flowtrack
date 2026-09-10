import { useState, useEffect } from 'react';
import api from '../services/api';
import './LogEntry.css';

const symptomOptions = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne', 'Backache'];
const moodOptions = ['Happy', 'Calm', 'Tired', 'Irritable', 'Anxious', 'Sad'];
const flowOptions = ['none', 'light', 'medium', 'heavy'];

export default function LogEntry() {
  const today = new Date().toISOString().split('T')[0];

  const [flow, setFlow] = useState('none');
  const [mood, setMood] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadTodayLog();
    loadHistory();
  }, []);

  const loadTodayLog = async () => {
    try {
      const res = await api.get(`/logs/${today}`);
      if (res.data) {
        setFlow(res.data.flow || 'none');
        setMood(res.data.mood || '');
        setSymptoms(res.data.symptoms ? res.data.symptoms.split(',') : []);
        setNotes(res.data.notes || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get('/logs');
      setHistory(res.data.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleSymptom = (symptom) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage(false);
    try {
      await api.post('/logs', {
        logDate: today,
        flow,
        mood,
        symptoms: symptoms.join(','),
        notes
      });
      setSavedMessage(true);
      loadHistory();
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const formatDisplayDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="log-wrapper">
      
      {/* Header */}
      <div className="log-header">
        <div className="log-title">Daily Wellness Log</div>
        <div className="log-subtext">Track your physical signs, energy, and emotions</div>
      </div>

      <div className="log-container">
        
        {/* Form Card */}
        <div className="log-form-card">
          {savedMessage && (
            <div className="log-saved-banner">
              ✓ Daily entry saved successfully! Predictions updated.
            </div>
          )}

          <div className="log-date-pill">
            <span>📅</span>
            <span>{formatDisplayDate(today)} (Today)</span>
          </div>

          {/* Flow Section */}
          <div className="log-section-label">Menstrual Flow</div>
          <div className="chip-row">
            {flowOptions.map((f) => (
              <button
                key={f}
                type="button"
                className={`chip ${flow === f ? 'active' : ''}`}
                onClick={() => setFlow(f)}
              >
                {f === 'none' ? '— None' : f === 'light' ? '💧 Light' : f === 'medium' ? '🩸 Medium' : '🩸🩸 Heavy'}
              </button>
            ))}
          </div>

          {/* Mood Section */}
          <div className="log-section-label">Mood & Energy</div>
          <div className="chip-row">
            {moodOptions.map((m) => (
              <button
                key={m}
                type="button"
                className={`chip ${mood === m ? 'active' : ''}`}
                onClick={() => setMood(mood === m ? '' : m)}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Symptoms Section */}
          <div className="log-section-label">Physical Symptoms</div>
          <div className="chip-row">
            {symptomOptions.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${symptoms.includes(s) ? 'active' : ''}`}
                onClick={() => toggleSymptom(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Notes Section */}
          <div className="log-section-label">Personal Reflections / Notes</div>
          <textarea
            className="log-textarea"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else you would like to note for today..."
          />

          <button className="log-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving Today\'s Log...' : 'Save Entry →'}
          </button>
        </div>

        {/* History Card */}
        <div className="history-card">
          <div className="history-title">
            <span>📋</span>
            <span>Recent Activity</span>
          </div>

          {loadingHistory ? (
            <p className="empty-history">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="empty-history">🌸 No entries yet. Save your first log above.</p>
          ) : (
            history.map((log) => (
              <div className="history-item" key={log.id}>
                <div>
                  <div className="history-date">{formatDisplayDate(log.log_date)}</div>
                  <div className="history-tags">
                    {[log.mood, log.symptoms?.split(',').join(', ')].filter(Boolean).join(' · ') || 'No symptoms noted'}
                  </div>
                </div>
                <span className={`history-flow-badge badge-${log.flow}`}>
                  {log.flow === 'none' ? 'No Flow' : `${log.flow} Flow`}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}