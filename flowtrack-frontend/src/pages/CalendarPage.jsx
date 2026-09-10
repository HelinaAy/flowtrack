import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import api from '../services/api';
import './CalendarPage.css';
import './auth.css';
import 'react-calendar/dist/Calendar.css';

const symptomOptions = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne', 'Backache'];
const moodOptions = ['Happy', 'Calm', 'Tired', 'Irritable', 'Anxious', 'Sad'];

export default function CalendarPage() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [flow, setFlow] = useState('none');
  const [mood, setMood] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryRes, logsRes] = await Promise.all([
        api.get('/cycle/summary'),
        api.get('/logs')
      ]);
      setSummary(summaryRes.data);
      setLogs(logsRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const getLogForDate = (dateStr) => logs.find((l) => l.log_date?.split('T')[0] === dateStr);

  const getTileClass = ({ date }) => {
    if (!summary) return '';
    const dateStr = formatDate(date);
    const classes = [];

    // Period days
    if (summary.cycle?.last_period_date) {
      const lastPeriod = new Date(summary.cycle.last_period_date);
      const periodEnd = new Date(lastPeriod);
      periodEnd.setDate(lastPeriod.getDate() + (summary.cycle.period_length || 5) - 1);
      if (date >= lastPeriod && date <= periodEnd) classes.push('day-period');
    }

    // Fertile window
    if (summary.fertileWindowStart && summary.fertileWindowEnd) {
      const fertileStart = new Date(summary.fertileWindowStart);
      const fertileEnd = new Date(summary.fertileWindowEnd);
      if (date >= fertileStart && date <= fertileEnd) classes.push('day-fertile');
    }

    // Predicted next period
    if (summary.nextPeriodDate) {
      const nextPeriod = new Date(summary.nextPeriodDate);
      const nextPeriodEnd = new Date(nextPeriod);
      nextPeriodEnd.setDate(nextPeriod.getDate() + (summary.cycle?.period_length || 5) - 1);
      if (date >= nextPeriod && date <= nextPeriodEnd) classes.push('day-predicted');
    }

    // Has logged entry
    if (getLogForDate(dateStr)) classes.push('day-logged');

    return classes.join(' ');
  };

  const handleDayClick = (date) => {
    const dateStr = formatDate(date);
    const existingLog = getLogForDate(dateStr);

    setSelectedDate(dateStr);
    setFlow(existingLog?.flow || 'none');
    setMood(existingLog?.mood || '');
    setSymptoms(existingLog?.symptoms ? existingLog.symptoms.split(',') : []);
    setNotes(existingLog?.notes || '');
    setShowModal(true);
  };

  const toggleSymptom = (symptom) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/logs', {
        logDate: selectedDate,
        flow,
        mood,
        symptoms: symptoms.join(','),
        notes
      });
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <div className="calendar-title">Calendar</div>
        <div className="calendar-subtext">Tap any day to log or view details</div>
      </div>

      <div className="calendar-container">
        <div className="calendar-card">
          <Calendar
            onClickDay={handleDayClick}
            tileClassName={getTileClass}
            prev2Label={null}
            next2Label={null}
          />
        </div>

        <div className="legend-card">
          <div className="legend-title">Legend</div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#fce7f1' }}></span>
            Period days
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#f3e8ff' }}></span>
            Fertile window
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#fff1f2', border: '1.5px dashed #f43f5e' }}></span>
            Predicted period
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#7c3aed' }}></span>
            Logged entry
          </div>
        </div>
      </div>

      {showModal && (
        <div className="log-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="log-modal" onClick={(e) => e.stopPropagation()}>
            <div className="log-modal-title">Log Entry</div>
            <div className="log-modal-date">{selectedDate}</div>

            <label className="modal-label">Flow</label>
            <div className="flow-options">
              {['none', 'light', 'medium', 'heavy'].map((f) => (
                <button
                  key={f}
                  className={`flow-btn ${flow === f ? 'active' : ''}`}
                  onClick={() => setFlow(f)}
                  type="button"
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <label className="modal-label">Mood</label>
            <div className="flow-options" style={{ flexWrap: 'wrap', gap: '6px' }}>
              {moodOptions.map((m) => (
                <button
                  key={m}
                  className={`flow-btn ${mood === m ? 'active' : ''}`}
                  onClick={() => setMood(mood === m ? '' : m)}
                  type="button"
                  style={{ flex: '0 0 calc(33.33% - 6px)', marginBottom: '4px' }}
                >
                  {m}
                </button>
              ))}
            </div>

            <label className="modal-label">Symptoms</label>
            <div className="flow-options" style={{ flexWrap: 'wrap', gap: '6px' }}>
              {symptomOptions.map((s) => (
                <button
                  key={s}
                  className={`flow-btn ${symptoms.includes(s) ? 'active' : ''}`}
                  onClick={() => toggleSymptom(s)}
                  type="button"
                  style={{ flex: '0 0 calc(33.33% - 6px)', marginBottom: '4px' }}
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="modal-label">Notes</label>
            <textarea
              className="log-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else to note..."
            />

            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="modal-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}