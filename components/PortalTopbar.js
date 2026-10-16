'use client';
import { pageNames } from '../data/schoolData';

export default function PortalTopbar({
  role,
  activePage,
  onSwitchRole,
  onSwitchView,
  onToggleMobileMenu,
  onLogout,
}) {
  const title = pageNames[activePage] || activePage;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-btn mobile-menu"
          id="menuToggle"
          aria-label="Open menu"
          onClick={onToggleMobileMenu}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <div>
          <div className="crumb">Portal / <span id="crumbText">Overview</span></div>
          <h1 id="pageTitle" className="portal-page-title">{title}</h1>
        </div>
      </div>

      <div className="top-actions">
        {/* Return to Website Button */}
        <button
          className="btn small ghost btn-school-website"
          onClick={() => onSwitchView('landing')}
          title="Return to School Website"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span className="website-btn-text">School Website</span>
        </button>

        {/* Academic Term Selector */}
        <select className="session-select" id="termSelect" aria-label="Academic term" defaultValue="2026/2027 · First Term">
          <option>2026/2027 · First Term</option>
          <option>2025/2026 · Third Term</option>
          <option>2025/2026 · Second Term</option>
        </select>

        {/* Notification Bell */}
        <button className="icon-btn" id="notificationsBtn" title="Notifications" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 16V11a6 6 0 1112 0v5l2 2H4z"/><path d="M10 21h4"/></svg>
          <span className="notif-dot"></span>
        </button>

        {/* Interactive Role Switcher Dropdown */}
        <select
          className="role-picker"
          id="rolePicker"
          aria-label="Switch User Role"
          value={role}
          onChange={(e) => onSwitchRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="bursar">Bursar</option>
        </select>

        {/* Secure Sign Out Button */}
        {onLogout && (
          <button
            className="icon-btn"
            onClick={onLogout}
            title="Secure Sign Out / Lock Portal"
            aria-label="Sign Out"
            style={{ color: '#ef4444' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
