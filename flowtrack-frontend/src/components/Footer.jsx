import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-container">
        
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link to={user ? '/dashboard' : '/login'} className="footer-brand">
              <span className="footer-brand-icon">🌸</span>
              <span>FlowTrack</span>
            </Link>
            <p className="footer-desc">
              Empowering your daily wellbeing through gentle cycle tracking, smart phase insights, and personalized wellness guidance.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">🔒 Private & Encrypted</span>
              <span className="footer-badge">✨ Science-Backed</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <div className="footer-heading">Application</div>
            <ul className="footer-links-list">
              <li>
                <Link to="/dashboard" className="footer-link">Dashboard</Link>
              </li>
              <li>
                <Link to="/calendar" className="footer-link">Cycle Calendar</Link>
              </li>
              <li>
                <Link to="/log" className="footer-link">Daily Symptom Log</Link>
              </li>
              <li>
                <Link to="/insights" className="footer-link">Cycle Insights</Link>
              </li>
              <li>
                <Link to="/wellness" className="footer-link">Wellness Tips</Link>
              </li>
            </ul>
          </div>

          {/* Account & Privacy */}
          <div>
            <div className="footer-heading">Account & Security</div>
            <ul className="footer-links-list">
              <li>
                <Link to="/profile" className="footer-link">Cycle Settings & Profile</Link>
              </li>
              <li className="footer-text-item">Database Protected</li>
              <li className="footer-text-item">Non-diagnostic Wellness</li>
              <li className="footer-text-item">Private Health Storage</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>© {currentYear} FlowTrack. All rights reserved.</div>
          <div>Crafted with 🌸 for cycle mindfulness</div>
        </div>

      </div>
    </footer>
  );
}