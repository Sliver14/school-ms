'use client';

import { useState } from 'react';

const DEPARTMENTS = [
  'Sciences & Tech',
  'Languages & Lit',
  'Biological Sciences',
  'Chemical Sciences',
  'Commercial Studies',
  'ICT & Robotics',
  'Humanities',
  'Creative Arts',
  'Sports & Athletics',
];

const ROLES = [
  'Lead Instructor (HOD)',
  'Senior Specialist Faculty',
  'Subject Specialist',
  'Junior Secondary Specialist',
  'Assistant Instructor & Lab Faculty',
];

export default function TeacherOnboardingModal({ isOpen, onClose, onTeacherCreated, showToast }) {
  if (!isOpen) return null;

  const [accountRole, setAccountRole] = useState('teacher');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [dept, setDept] = useState('Sciences & Tech');
  const [qualification, setQualification] = useState('B.Sc (Ed), TRCN Certified');
  const [roleTitle, setRoleTitle] = useState('Subject Specialist');
  const [primarySubject, setPrimarySubject] = useState('Mathematics');
  const [formTeacherClass, setFormTeacherClass] = useState('None');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill suggested email based on name
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    const parts = val.trim().split(' ');
    if (parts.length >= 2) {
      const suggested = `${parts[0][0].toLowerCase()}.${parts[parts.length - 1].toLowerCase()}@royalheights.edu.ng`;
      setEmail(suggested);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Name and email are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          accountRole,
          dept: accountRole === 'bursar' ? 'Bursary & Financial Management' : dept,
          qualification,
          roleTitle: accountRole === 'bursar' ? 'Bursar & Finance Officer' : roleTitle,
          primarySubject: accountRole === 'bursar' ? 'Accounting & School Finance' : primarySubject,
          formTeacherClass: formTeacherClass === 'None' || accountRole === 'bursar' ? null : formTeacherClass,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`🎉 ${accountRole === 'bursar' ? 'Bursar' : 'Faculty member'} ${name} onboarded! Credentials generated.`);
        onTeacherCreated(data.teacher, data.credentialSlip);
        onClose();
      } else {
        showToast(data.error || 'Failed to onboard staff');
      }
    } catch (err) {
      showToast('Network error onboarding staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 'min(700px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{accountRole === 'bursar' ? 'Onboard New Bursar / Finance Officer' : 'Onboard New Faculty Member'}</h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              {accountRole === 'bursar'
                ? 'School bursary & accounts desk recruitment, ledger authority, and credentials generation'
                : 'Academic faculty recruitment, credentials generation, and homeroom allocation'}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Account Role Selector */}
          <div style={{ marginBottom: '16px', background: 'var(--surface2)', padding: '10px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
              Staff Account Classification
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className={`btn ${accountRole === 'teacher' ? 'primary' : 'secondary'}`}
                style={{ fontSize: '12.5px', padding: '8px 12px', justifyContent: 'center' }}
                onClick={() => {
                  setAccountRole('teacher');
                  setDept('Sciences & Tech');
                  setRoleTitle('Subject Specialist');
                }}
              >
                👨‍🏫 Academic Faculty / Teacher
              </button>
              <button
                type="button"
                className={`btn ${accountRole === 'bursar' ? 'primary' : 'secondary'}`}
                style={{ fontSize: '12.5px', padding: '8px 12px', justifyContent: 'center' }}
                onClick={() => {
                  setAccountRole('bursar');
                  setDept('Bursary & Financial Management');
                  setRoleTitle('Bursar & Finance Officer');
                  setFormTeacherClass('None');
                }}
              >
                💼 Bursar / Finance Officer
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Full Staff Name (with Title) *</label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder={accountRole === 'bursar' ? 'e.g. Mr. Femi Adekunle (CPA)' : 'e.g. Dr. Aisha Bello'}
              />
            </div>

            <div className="field">
              <label>Official Staff Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={accountRole === 'bursar' ? 'f.adekunle@royalheights.edu.ng' : 'a.bello@royalheights.edu.ng'}
              />
            </div>

            {accountRole === 'teacher' ? (
              <>
                <div className="field">
                  <label>Academic Department *</label>
                  <select value={dept} onChange={(e) => setDept(e.target.value)}>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Faculty Role / Seniority *</label>
                  <select value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)}>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label>Administrative Department *</label>
                  <input type="text" readOnly value="Bursary & Financial Management" />
                </div>

                <div className="field">
                  <label>Finance Authority Designation *</label>
                  <select value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)}>
                    <option value="Chief Bursar & Head of Finance">Chief Bursar & Head of Finance</option>
                    <option value="Senior Accounts Officer">Senior Accounts Officer</option>
                    <option value="Student Billing Specialist">Student Billing Specialist</option>
                    <option value="Cashier & Revenue Officer">Cashier & Revenue Officer</option>
                  </select>
                </div>
              </>
            )}

            {accountRole === 'teacher' ? (
              <>
                <div className="field">
                  <label>Primary Teaching Subject *</label>
                  <input
                    type="text"
                    required
                    value={primarySubject}
                    onChange={(e) => setPrimarySubject(e.target.value)}
                    placeholder="e.g. Chemistry & Practical Science"
                  />
                </div>

                <div className="field">
                  <label>Form Teacher Homeroom Allocation</label>
                  <select value={formTeacherClass} onChange={(e) => setFormTeacherClass(e.target.value)}>
                    <option value="None">None (Subject Specialist Only)</option>
                    <option value="JSS1A">JSS 1 · Arm A</option>
                    <option value="JSS1B">JSS 1 · Arm B</option>
                    <option value="JSS2A">JSS 2 · Arm A</option>
                    <option value="JSS3A">JSS 3 · Arm A</option>
                    <option value="SS1A">SS 1 · Science Arm A</option>
                    <option value="SS2A">SS 2 · Science Arm A</option>
                    <option value="SS2B">SS 2 · Commercial Arm B</option>
                    <option value="SS3A">SS 3 · Science Arm A</option>
                  </select>
                </div>

                <div className="field">
                  <label>Academic Degrees & Certification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. M.Sc Inorganic Chemistry, PGDE, TRCN"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label>Financial Desk Focus Area</label>
                  <input
                    type="text"
                    required
                    value={primarySubject}
                    onChange={(e) => setPrimarySubject(e.target.value)}
                    placeholder="e.g. School Fees & Electronic Settlement Ledger"
                  />
                </div>

                <div className="field">
                  <label>Professional Accounting Credentials</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. B.Sc Accounting, ICAN / ACCA / CPA Fellow"
                  />
                </div>
              </>
            )}

            <div className="field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 000 0000"
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '12px 14px',
              background: 'var(--surface2)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontSize: '12px',
            }}
          >
            <div style={{ color: 'var(--gold-600)', fontWeight: '700', marginBottom: '2px' }}>
              🔒 Automated Bcrypt Credential Provisioning:
            </div>
            <div style={{ color: 'var(--muted)', lineHeight: '1.45' }}>
              Submitting this form immediately provisions a secure workstation account with temporary passcode <code>RoyalHeights@2026</code>. An official welcome slip will be generated for the teacher.
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '20px' }}>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn gold" disabled={isSubmitting}>
              {isSubmitting ? 'Onboarding & Generating...' : '✨ Complete Onboarding & Issue Credentials →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
