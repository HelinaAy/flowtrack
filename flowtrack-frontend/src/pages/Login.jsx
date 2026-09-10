import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        
        {/* Brand Logo & Tag */}
        <div className="text-center">
          <div className="auth-logo-icon">🌸</div>
          <div className="auth-brand-badge">FLOWTRACK</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue tracking your wellness</p>
        </div>

        {/* Success Banner */}
        {location.state?.justRegistered && (
          <div className="auth-success-badge">
            ✓ Account created successfully. Please sign in.
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="auth-label mb-0">Password</label>
            </div>
            <div className="auth-input-wrapper">
              <input
                className="auth-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>

        <div className="auth-privacy-note">
          🔒 Private & confidential cycle tracking
        </div>

      </div>
    </div>
  );
}