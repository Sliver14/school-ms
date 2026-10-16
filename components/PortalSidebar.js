'use client';
import { ROLE_PERMISSIONS, pageNames } from '../data/schoolData';

const NAV_ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
  ),
  academics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></svg>
  ),
  timetable: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
  ),
  attendance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></svg>
  ),
  admissions: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="8" r="4"/><path d="M3 21c0-4 3-6 7-6M18 14v6M15 17h6"/></svg>
  ),
  fees: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/></svg>
  ),
  parents: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 14.5c3 0 6 1.5 6 4.5"/></svg>
  ),
  communications: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 7l9 7 9-7"/></svg>
  ),
  staff: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/></svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>
  ),
};

export default function PortalSidebar({
  role,
  activePage,
  onNavigate,
  onSwitchView,
  isMobileOpen,
  onCloseMobile,
  onLogout,
  currentUser,
}) {
  const roleConfig = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin;
  const allowedPages = roleConfig?.tabs || [];
  const userName = currentUser?.name || roleConfig?.name;
  const userAvatar = currentUser?.avatar || roleConfig?.avatar || 'RH';
  const roleSub = roleConfig?.sub || (role ? role.toUpperCase() : 'PORTAL USER');

  return (
    <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`} id="sidebar">
      {/* Brand */}
      <div className="brand">
        <div className="brand-badge">RH</div>
        <div className="brand-text">
          <strong>Royal Heights</strong>
          <small>Secondary School</small>
        </div>
        {onCloseMobile && (
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onCloseMobile}
            aria-label="Close sidebar menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick Return to Website */}
      <a
        href="#"
        className="sidebar-site-link"
        onClick={(e) => {
          e.preventDefault();
          if (onCloseMobile) onCloseMobile();
          onSwitchView('landing');
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Return to School Website
      </a>

      {/* Dynamic Navigation */}
      <nav className="nav" id="mainNav">
        <div className="nav-section">
          <div className="nav-label">
            {role.toUpperCase()} WORKSPACE ({allowedPages.length} TABS)
          </div>
          {allowedPages.map((pageKey) => {
            const isActive = activePage === pageKey;
            const customLabel = roleConfig.tabLabels?.[pageKey] || pageNames[pageKey] || pageKey;

            return (
              <button
                key={pageKey}
                className={isActive ? 'active' : ''}
                onClick={() => {
                  onNavigate(pageKey);
                  if (onCloseMobile) onCloseMobile();
                }}
                data-page={pageKey}
              >
                {NAV_ICONS[pageKey] || (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/></svg>
                )}
                <span className="nav-btn-text">{customLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer with Current User Profile */}
      <div className="sidebar-user-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="sidebar-avatar" id="sidebarAvatar">
            {userAvatar}
          </div>
          <div className="sidebar-user-info">
            <strong id="sidebarUserName">{userName}</strong>
            <small id="sidebarRoleDesc">{roleSub}</small>
          </div>
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Log Out & Lock Workstation"
            aria-label="Log Out"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
