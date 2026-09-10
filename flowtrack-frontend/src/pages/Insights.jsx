import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import api from '../services/api';
import './Insights.css';

export default function Insights() {
  const [history, setHistory] = useState([]);
  const [symptomStats, setSymptomStats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const [historyRes, statsRes, logsRes] = await Promise.all([
        api.get('/cycle/history'),
        api.get('/logs/stats/symptoms'),
        api.get('/logs')
      ]);
      setHistory(historyRes.data);
      setSymptomStats(statsRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="insights-wrapper"><p className="text-center">Loading insights...</p></div>;
  }

  const cycleChartData = history
    .slice(0, 8)
    .reverse()
    .map((c, i) => ({ name: `Cycle ${i + 1}`, length: c.cycle_length }));

  const avgCycleLength = history.length
    ? Math.round(history.reduce((sum, c) => sum + c.cycle_length, 0) / history.length)
    : '—';

  const topSymptom = symptomStats.length ? symptomStats[0].symptom : '—';

  return (
    <div className="insights-wrapper">
      <div className="insights-header">
        <div className="insights-title">Insights</div>
        <div className="insights-subtext">Patterns from your logged cycles and symptoms</div>
      </div>

      <div className="insights-container">
        <div className="summary-row">
          <div className="summary-card">
            <div className="summary-label">Average Cycle Length</div>
            <div className="summary-value accent">{avgCycleLength} {avgCycleLength !== '—' && 'days'}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Logs Recorded</div>
            <div className="summary-value">{logs.length}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Most Common Symptom</div>
            <div className="summary-value accent" style={{ fontSize: '20px' }}>{topSymptom}</div>
          </div>
        </div>

        <div className="chart-panel">
          <div className="chart-panel-title">Cycle Length Trend</div>
          <div className="chart-panel-subtext">How your cycle length has changed over time</div>

          {cycleChartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={cycleChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a99fb0' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#a99fb0' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="length" stroke="#e88ba0" strokeWidth={3} dot={{ fill: '#c299e8', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart-state">
              Log at least two cycles to see your trend here.
            </div>
          )}
        </div>

        <div className="chart-panel">
          <div className="chart-panel-title">Symptom Frequency</div>
          <div className="chart-panel-subtext">Which symptoms you've logged most often</div>

          {symptomStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={symptomStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="symptom" tick={{ fontSize: 12, fill: '#a99fb0' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#a99fb0' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#c299e8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart-state">
              No symptoms logged yet. Add some in your daily log.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}