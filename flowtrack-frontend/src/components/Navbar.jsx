import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Insights', path: '/insights' },
    { label: 'Wellness', path: '/wellness' },
    { label: 'Profile', path: '/profile' }
  ];

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="modern-navbar">
      <div className="navbar-container">
        
        {/* Brand */}
        <Link to={user ? '/dashboard' : '/login'} className="nav-brand">
          <div className="brand-icon-wrapper">🌸</div>
          <span>FlowTrack</span>
        </Link>

        {/* Centered Desktop Segmented Nav Pills */}
        {user && (
          <nav className="nav-center-menu">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-pill-item ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Action Items */}
        {user ? (
          <div className="nav-right-actions">
            
            {/* Quick Log Action Pill */}
            <Link to="/log" className="nav-quick-log-btn">
              <span>+</span>
              <span>Log Today</span>
            </Link>

            {/* User Profile Dropdown */}
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className="user-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="nav-avatar">{initials}</div>
                <span className="nav-user-name">{user?.name?.split(' ')[0] || 'Account'}</span>
                <span className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`}>▼</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="nav-dropdown-menu">
                  <div className="dropdown-user-header">
                    <div className="dropdown-name">{user?.name || 'User'}</div>
                    <div className="dropdown-email">{user?.email}</div>
                  </div>

                  <Link to="/profile" className="dropdown-link">
                    ⚙️ Settings & Cycle
                  </Link>
                  <Link to="/log" className="dropdown-link">
                    📝 Daily Log
                  </Link>

                  <div className="dropdown-divider" />

                  <button type="button" className="dropdown-logout-btn" onClick={handleLogout}>
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        ) : (
          <div className="nav-right-actions">
            <Link to="/login" className="nav-pill-item">Sign In</Link>
            <Link to="/register" className="nav-quick-log-btn">Get Started</Link>
          </div>
        )}

      </div>

      {/* Mobile Drawer Menu */}
      {user && mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                {isActive && <span>•</span>}
              </Link>
            );
          })}

          <Link
            to="/log"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Daily Log</span>
          </Link>

          <button type="button" className="mobile-logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}