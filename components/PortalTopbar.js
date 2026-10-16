'use client';
import { pageNames, ROLE_PERMISSIONS } from '../data/schoolData';

export default function PortalTopbar({
  role,
  activePage,
  onSwitchRole,
  onSwitchView,
  onToggleMobileMenu,
  onLogout,
  currentUser,
}) {
  const title = pageNames[activePage] || activePage;
  const roleConfig = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin;
  const userInitials = currentUser?.avatar || roleConfig?.avatar || (role ? role.slice(0, 2).toUpperCase() : 'RH');
  const userName = currentUser?.name || roleConfig?.name || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User');

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          className="icon-btn mobile-menu"
          id="menuToggle"
          aria-label="Toggle navigation menu"
          onClick={onToggleMobileMenu}
        >
          <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page Title & Breadcrumb */}
        <div className="topbar-headings">
          <div className="crumb">
            <span className="crumb-root">Portal</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{title}</span>
          </div>
          <div className="topbar-title-row">
            <h1 id="pageTitle" className="portal-page-title">{title}</h1>
            <span className={`topbar-role-badge role-${role}`}>
              <span className="role-status-dot" />
              {role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="top-actions">
        {/* Return to School Website Button */}
        <button
          className="btn small ghost btn-school-website"
          onClick={() => onSwitchView('landing')}
          title="Return to School Website"
          aria-label="Return to School Website"
        >
          <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="website-btn-text">School Website</span>
        </button>

        {/* Academic Session / Term Selector */}
        <div className="term-selector-pill">
          <svg className="topbar-icon term-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <select
            className="session-select"
            id="termSelect"
            aria-label="Academic Term Session"
            defaultValue="2026/2027 · First Term"
          >
            <option>2026/2027 · First Term</option>
            <option>2025/2026 · Third Term</option>
            <option>2025/2026 · Second Term</option>
          </select>
        </div>

        {/* Notifications & Announcements Bell */}
        <button
          className="icon-btn topbar-notif-btn"
          id="notificationsBtn"
          title="Notifications & Campus Notices"
          aria-label="Notifications"
        >
          <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notif-dot" />
        </button>

        {/* Interactive Role Switcher Dropdown */}
        <div className="role-picker-container">
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
        </div>

        {/* User Mini Profile Avatar Pill */}
        <div className="topbar-user-badge" title={`${userName} (${roleConfig?.title || role})`}>
          <div className="topbar-avatar">{userInitials}</div>
          <span className="topbar-user-name">{userName}</span>
        </div>

        {/* Fast Secure Sign Out / Workstation Lock */}
        {onLogout && (
          <button
            className="icon-btn topbar-logout-btn"
            onClick={onLogout}
            title="Secure Sign Out / Lock Portal"
            aria-label="Sign Out"
          >
            <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
