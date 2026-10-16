'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const DEMO_PROFILES = {
  admin: {
    role: 'admin',
    title: 'School Administrator',
    identifierLabel: 'Administrator Email / Staff ID',
    defaultIdentifier: 'admin@royalheights.edu.ng',
    name: 'School Administrator',
    sub: 'Full Governance & Financial Ledger',
    avatar: 'AD',
    badge: 'Executive',
  },
  teacher: {
    role: 'teacher',
    title: 'Teaching Faculty',
    identifierLabel: 'Staff Work Email',
    defaultIdentifier: 's.okoro@royalheights.edu.ng',
    name: 'Mr. Samuel Okoro',
    sub: 'Head of Sciences · SS2 Mathematics & Physics Specialist',
    avatar: 'SO',
    badge: 'Faculty',
  },
  student: {
    role: 'student',
    title: 'Enrolled Scholar',
    identifierLabel: 'School Admission Number (e.g. RH/2024/018)',
    defaultIdentifier: 'RH/2024/018',
    name: 'Daniel Adeyemi',
    sub: 'Senior Secondary 2 · Science Stream',
    avatar: 'DA',
    badge: 'Scholar',
  },
  parent: {
    role: 'parent',
    title: 'Parent / Legal Guardian',
    identifierLabel: 'Registered Parent Email Address',
    defaultIdentifier: 'adeyemi.t@gmail.com',
    name: 'Mrs. T. Adeyemi',
    sub: 'Guardian of Daniel Adeyemi (SS2) & Kemi Adeyemi (JSS1)',
    avatar: 'PA',
    badge: 'Guardian',
  },
  bursar: {
    role: 'bursar',
    title: 'Bursary & Accounts Office',
    identifierLabel: 'Accounts Officer Email',
    defaultIdentifier: 'bursar@royalheights.edu.ng',
    name: 'Bursary Ledger Desk',
    sub: 'Tuition Invoicing & Bank Reconciliation',
    avatar: 'AC',
    badge: 'Finance',
  },
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramRole = searchParams.get('role');
  const initialRole = paramRole && DEMO_PROFILES[paramRole] ? paramRole : 'admin';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [identifier, setIdentifier] = useState(DEMO_PROFILES[initialRole].defaultIdentifier);
  const [password, setPassword] = useState('RoyalHeights@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);

  // Update identifier when switching role tab
  const handleSelectRole = (newRole) => {
    setSelectedRole(newRole);
    setIdentifier(DEMO_PROFILES[newRole].defaultIdentifier);
    setPassword('RoyalHeights@2026');
    setErrorMessage('');
  };

  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setToastMessage(`Signing in as ${DEMO_PROFILES[selectedRole].title}...`);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('rh_auth_token', data.token);
          localStorage.setItem('rh_user', JSON.stringify(data.user));
          localStorage.setItem('rh_portal_role', data.user.role || selectedRole);
          localStorage.setItem('rh_portal_tab', 'dashboard');
          if ((data.user.role || selectedRole) === 'parent') {
            localStorage.setItem('rh_portal_child', '0');
          }
        }
        setToastMessage(`Verified! Redirecting to ${DEMO_PROFILES[data.user.role || selectedRole].title}...`);
        setTimeout(() => {
          router.push(`/portal?role=${data.user.role || selectedRole}&tab=dashboard`);
        }, 400);
      } else {
        setIsLoading(false);
        setErrorMessage(data.error || 'Invalid credentials. Please verify your password.');
        setToastMessage('Authentication failed');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Network connection error. Please try again.');
      setToastMessage('Connection error');
    }
  };

  const profile = DEMO_PROFILES[selectedRole];

  return (
    <div className="auth-simple-page">
      {/* Top Header Navigation */}
      <header className="auth-simple-topbar">
        <Link href="/" className="auth-brand-logo">
          <div className="brand-badge">RH</div>
          <div>
            <strong>Royal Heights</strong>
            <small>Secondary School</small>
          </div>
        </Link>
        <Link href="/" className="btn small ghost auth-return-btn">
          ← Website
        </Link>
      </header>

      {/* Main Centered Simplified Card */}
      <main className="auth-simple-container">
        <div className="auth-simple-card">
          <div className="auth-card-head">
            <span className="auth-chip-badge">🛡️ Secure Campus Portal</span>
            <h1 className="auth-card-title">Sign In</h1>
            <p className="auth-card-desc">Select your portal role or sign in with your credentials</p>
          </div>

          {/* Clean Segmented Role Pills */}
          <div className="auth-segmented-tabs" role="tablist" aria-label="Select role">
            {Object.keys(DEMO_PROFILES).map((roleKey) => (
              <button
                key={roleKey}
                type="button"
                role="tab"
                aria-selected={selectedRole === roleKey}
                className={`auth-segment-pill ${selectedRole === roleKey ? 'active' : ''}`}
                onClick={() => handleSelectRole(roleKey)}
              >
                {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
              </button>
            ))}
          </div>

          {/* Active Persona Banner */}
          <div className="auth-persona-row">
            <div className="auth-persona-avatar">{profile.avatar}</div>
            <div className="auth-persona-meta">
              <div className="auth-persona-name">
                <strong>{profile.name}</strong>
                <span className="badge badge-primary">{profile.badge}</span>
              </div>
              <small className="auth-persona-sub">{profile.sub}</small>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="auth-error-banner">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Clean Form */}
          <form onSubmit={handleSignIn} className="auth-clean-form">
            <div className="field">
              <label htmlFor="auth-id-input">{profile.identifierLabel}</label>
              <input
                id="auth-id-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter identity or ID..."
                required
                autoComplete="username"
              />
            </div>

            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="auth-pwd-input">Password</label>
                <button
                  type="button"
                  className="auth-pwd-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide 👁️' : 'Show 👁️‍🗨️'}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-pwd-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="auth-form-meta-row">
              <label className="auth-remember-check">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <span className="auth-pwd-hint">
                Default: <strong>RoyalHeights@2026</strong>
              </span>
            </div>

            <button
              type="submit"
              className="btn primary large auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : `Sign In as ${profile.title} →`}
            </button>
          </form>

          {/* Collapsible Quick Demo Drawer Toggle */}
          <div className="auth-demo-toggle-area">
            <button
              type="button"
              className="auth-demo-toggle-btn"
              onClick={() => setShowDemoDrawer((prev) => !prev)}
            >
              <span>⚡ Quick Demo Credentials</span>
              <span style={{ fontSize: '11px' }}>{showDemoDrawer ? '▲ Hide' : '▼ View All'}</span>
            </button>

            {showDemoDrawer && (
              <div className="auth-demo-chips-grid">
                {Object.values(DEMO_PROFILES).map((p) => {
                  const isSelected = selectedRole === p.role;
                  return (
                    <div
                      key={p.role}
                      className={`auth-mini-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectRole(p.role)}
                    >
                      <div className="auth-mini-avatar">{p.avatar}</div>
                      <div className="auth-mini-info">
                        <strong>{p.title}</strong>
                        <small>{p.defaultIdentifier}</small>
                      </div>
                      <span className="auth-mini-badge">{p.badge}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="auth-simple-footer">
          <span>© 2026 Royal Heights Secondary School · Secure Campus Portal</span>
        </footer>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast" id="systemToast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: 'var(--canvas)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="brand-badge" style={{ margin: '0 auto 16px' }}>RH</div>
            <h3 style={{ font: '600 20px var(--serif)', color: 'var(--ink)' }}>Loading Royal Heights Portal...</h3>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
