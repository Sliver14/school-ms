'use client';

import { useState } from 'react';

export default function UserCredentialSlipModal({ isOpen, onClose, data, showToast }) {
  if (!isOpen || !data) return null;

  const [copied, setCopied] = useState(false);

  const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login';

  const handleCopy = () => {
    const text = `Royal Heights Secondary School - Workstation Access Credentials
-----------------------------------------------------------
Name: ${data.name || 'Stakeholder'}
Role: ${data.role || 'User'}
Portal URL: ${portalUrl}
Username / ID: ${data.identifier || data.studentUsername || data.parentEmail}
Temporary Password: ${data.temporaryPassword || data.studentPasscode || 'RoyalHeights@2026'}
-----------------------------------------------------------
Note: Passwords are encrypted with Bcrypt. Set a private password on first sign-in.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      if (showToast) showToast('Credentials copied to clipboard');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        style={{ width: 'min(620px, 100%)', background: 'var(--surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head no-print">
          <div>
            <h3>Official Workstation Credential Slip</h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              Royal Heights Information Systems • Stakeholder Provisioning Desk
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Printable Credential Card */}
        <div
          className="printable-credential-card"
          style={{
            border: '2px dashed var(--gold-500)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            background: 'var(--surface2)',
            position: 'relative',
            marginTop: '8px',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>🏛️</div>
            <h3 style={{ margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold-600)', fontSize: '17px' }}>
              Royal Heights Secondary School
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.5px' }}>
              Official Stakeholder Portal Account Slip
            </div>
          </div>

          {/* User Bio */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Stakeholder Name</div>
              <strong style={{ fontSize: '14.5px' }}>{data.name || 'New Account'}</strong>
            </div>
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Account Role</div>
              <span className="badge badge-primary">{data.role || 'Member'}</span>
            </div>
            {data.department && (
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Department</div>
                <div style={{ fontSize: '13px' }}>{data.department}</div>
              </div>
            )}
            {data.formTeacherClass && (
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Class Allocation</div>
                <div style={{ fontSize: '13px' }}>{data.formTeacherClass}</div>
              </div>
            )}
          </div>

          {/* Credentials Display Box */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                Login Portal Address
              </div>
              <div style={{ fontSize: '13px', color: 'var(--gold-600)', fontWeight: '600' }}>
                {portalUrl}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Username / Identity
                </div>
                <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>
                  {data.identifier || data.studentUsername || data.parentEmail}
                </strong>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Temporary Passcode
                </div>
                <strong style={{ fontSize: '15px', color: '#10b981', letterSpacing: '0.5px' }}>
                  {data.temporaryPassword || data.studentPasscode || 'RoyalHeights@2026'}
                </strong>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div style={{ fontSize: '11.5px', color: 'var(--muted)', lineHeight: '1.45', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
            🔒 <strong>Bcrypt Security Protocol:</strong> This temporary passcode is protected with 10 salt rounds. For security compliance, please change your password upon your first sign-in in the <em>Settings & Security</em> workspace.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions no-print" style={{ marginTop: '20px' }}>
          <button type="button" className="btn secondary" onClick={onClose}>
            Done
          </button>
          <button type="button" className="btn secondary" onClick={handleCopy}>
            {copied ? '✓ Copied' : '📋 Copy Slip Text'}
          </button>
          <button type="button" className="btn gold" onClick={handlePrint}>
            🖨️ Print Slip Slip
          </button>
        </div>
      </div>
    </div>
  );
}
