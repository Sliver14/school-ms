'use client';
import { useState } from 'react';

export function TimetableModule({ role }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { time: '08:00 - 09:20', mon: 'Mathematics', tue: 'Physics', wed: 'Chemistry', thu: 'Further Maths', fri: 'Biology' },
    { time: '09:30 - 10:50', mon: 'English Lang', tue: 'Chemistry', wed: 'Biology', thu: 'Chemistry Practical', fri: 'English Literature' },
    { time: '11:10 - 12:30', mon: 'Physics Lab', tue: 'ICT / Coding', wed: 'Civic Edu', thu: 'English Lang', fri: 'Economics' },
    { time: '13:30 - 14:50', mon: 'Further Maths', tue: 'Robotics', wed: 'Technical Draw', thu: 'Robotics AI', fri: 'Sports & Clubs' },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Master Timetable & Period Schedule</h2>
          <p>Senior Secondary 2A (Science Arm) • 2025/2026 Academic Session</p>
        </div>
      </div>

      <div className="panel">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Period Time</th>
                {days.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p, idx) => (
                <tr key={idx}>
                  <td><strong>{p.time}</strong></td>
                  <td><span className="badge badge-primary">{p.mon}</span></td>
                  <td><span className="badge badge-primary">{p.tue}</span></td>
                  <td><span className="badge badge-primary">{p.wed}</span></td>
                  <td><span className="badge badge-primary">{p.thu}</span></td>
                  <td><span className="badge badge-gold">{p.fri}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AttendanceModule({ role, attendanceList = [], onOpenAttendanceModal }) {
  const displayList = attendanceList.length > 0 ? attendanceList : [
    { date: 'Friday, 16 Oct 2026', period: 'Morning Roll Call', status: 'Present', studentName: 'Daniel Adeyemi', hostTeacher: 'Mr. Samuel Okoro', remark: 'Punctual' },
    { date: 'Thursday, 15 Oct 2026', period: 'Morning Roll Call', status: 'Present', studentName: 'Daniel Adeyemi', hostTeacher: 'Mr. Samuel Okoro', remark: 'In Homeroom' },
    { date: 'Wednesday, 14 Oct 2026', period: 'Morning Roll Call', status: 'Present', studentName: 'Daniel Adeyemi', hostTeacher: 'Mr. Samuel Okoro', remark: 'On Time' },
    { date: 'Tuesday, 13 Oct 2026', period: 'Morning Roll Call', status: 'Excused', studentName: 'Daniel Adeyemi', hostTeacher: 'Mr. Samuel Okoro', remark: 'Medical Clinic Permit' },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Attendance Register & Analytics</h2>
          <p>Term 1 Class & Campus Attendance Tracking (98.4% Average)</p>
        </div>
        {(role === 'admin' || role === 'teacher') && (
          <button className="btn gold" onClick={onOpenAttendanceModal}>
            📋 + Take Today's Roll Call
          </button>
        )}
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-num">56 / 58</div>
          <div className="stat-label">Days Present This Term</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">2</div>
          <div className="stat-label">Excused Medical Absences</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">0</div>
          <div className="stat-label">Unexcused Absences</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">96.5%</div>
          <div className="stat-label">Punctuality Score</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <div className="panel-icon">✅</div>
            <div>
              <h4>Daily Morning Register Log</h4>
              <p>Biometric and roll call records</p>
            </div>
          </div>
          {(role === 'admin' || role === 'teacher') && (
            <button className="btn secondary small" onClick={onOpenAttendanceModal}>
              Record Class Register
            </button>
          )}
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Roll Call Period</th>
                <th>Scholar</th>
                <th>Status</th>
                <th>Host Teacher</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.date}</strong></td>
                  <td>{row.period || 'Morning Roll Call'}</td>
                  <td>{row.studentName || 'Daniel Adeyemi'}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.status === 'Present'
                          ? 'badge-success'
                          : row.status === 'Late'
                          ? 'badge-gold'
                          : row.status === 'Excused'
                          ? 'badge-primary'
                          : 'badge-danger'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.hostTeacher || 'Mr. Samuel Okoro'}</td>
                  <td><small>{row.remark || 'Punctual'}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdmissionsModule({ admissions = [], onOpenFastAdmission, onReviewApplicant }) {
  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Admissions Management Hub</h2>
          <p>Entrance examinations, applicant screening, and prospective scholar pipeline</p>
        </div>
        <button className="btn gold" onClick={onOpenFastAdmission}>
          + Fast New Application
        </button>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <div className="panel-icon">📝</div>
            <div>
              <h4>2026/2027 Entrance Applicants ({admissions.length} Registered)</h4>
              <p>Applications awaiting CBT exam, interview or enrolment</p>
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Target Class</th>
                <th>Parent / Sponsor</th>
                <th>Exam Status</th>
                <th>Score</th>
                <th>Decision</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((applicant) => (
                <tr key={applicant.id}>
                  <td>
                    <strong>{applicant.name}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Ref: {applicant.id}</div>
                  </td>
                  <td><span className="badge badge-primary">{applicant.entryClass}</span></td>
                  <td>
                    <div>{applicant.parentName}</div>
                    <small style={{ color: 'var(--muted)' }}>{applicant.parentPhone}</small>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        applicant.examStatus?.includes('Passed')
                          ? 'badge-success'
                          : 'badge-gold'
                      }`}
                    >
                      {applicant.examStatus || 'Scheduled'}
                    </span>
                  </td>
                  <td>
                    <strong>{applicant.score ? `${applicant.score}%` : '—'}</strong>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        applicant.decision?.includes('Enrolled') || applicant.decision === 'Accepted'
                          ? 'badge-success'
                          : applicant.decision === 'Under Review'
                          ? 'badge-primary'
                          : 'badge-gold'
                      }`}
                    >
                      {applicant.decision}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn secondary small"
                      onClick={() => onReviewApplicant(applicant)}
                    >
                      {applicant.decision?.includes('Enrolled') ? 'View Record' : 'Review & Enrol →'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ParentsModule() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Parents & Guardians Directory</h2>
          <p>Family records, enrolled wards linkage, and contact registers</p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Parent / Guardian</th>
                <th>Enrolled Wards</th>
                <th>Contact Phone</th>
                <th>Email</th>
                <th>PTA Representative</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dr. & Mrs. Adeleke</strong></td>
                <td>
                  <span className="badge badge-primary">Daniel (SS 2A)</span>{' '}
                  <span className="badge badge-primary">Kemi (JS 1B)</span>
                </td>
                <td>+234 803 111 2233</td>
                <td>adeleke.family@domain.com</td>
                <td><span className="badge badge-gold">SS 2 Arm Rep</span></td>
              </tr>
              <tr>
                <td><strong>Chief & Mrs. O. Balogun</strong></td>
                <td><span className="badge badge-primary">Tobi (SS 2A)</span></td>
                <td>+234 802 333 4455</td>
                <td>balogun.holdings@domain.com</td>
                <td>Member</td>
              </tr>
              <tr>
                <td><strong>Engr. & Dr. C. Okafor</strong></td>
                <td><span className="badge badge-primary">Somto (JS 2A)</span></td>
                <td>+234 809 555 6677</td>
                <td>chidi.okafor@primeeng.com</td>
                <td>Member</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CommunicationsModule({ showToast }) {
  return (
    <div>
      <div className="page-head">
        <div>
          <h2>School Communications & Broadcasts</h2>
          <p>Instant SMS, email broadcasts, and direct faculty-parent messaging</p>
        </div>
        <button
          className="btn primary"
          onClick={() => showToast('Broadcast modal ready to dispatch')}
        >
          + New Broadcast Message
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <div className="panel-icon">📢</div>
              <div>
                <h4>Recent Announcements</h4>
                <p>Broadcasts sent to community</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong>Inter-House Athletics Sports Day</strong>
                <small style={{ color: 'var(--muted)' }}>Today, 09:00</small>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                Parents are reminded that all houses will compete in the track events at 10:00 AM on Friday.
              </p>
            </div>
            <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong>Cambridge Checkpoint & IGCSE Workshops</strong>
                <small style={{ color: 'var(--muted)' }}>Yesterday</small>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                After-school clinics commence on Monday for all registered candidates.
              </p>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <div className="panel-icon">💬</div>
              <div>
                <h4>Direct Faculty Inquiries</h4>
                <p>Private messages</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ padding: '10px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
              <strong>From: Mrs. Sarah Adebayo (English Dept)</strong>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>
                "Daniel has been selected for the National Schools Debate Invitational!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReportsModule() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Institutional Analytics & Audits</h2>
          <p>Academic pass distributions, student retention rates, and bursary reconciliations</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-num">99.4%</div>
          <div className="stat-label">WAEC & Cambridge Overall Pass</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">88.6%</div>
          <div className="stat-label">Distinction (A* & A) Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">0%</div>
          <div className="stat-label">Student Dropout Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">100%</div>
          <div className="stat-label">Regulatory Audit Compliance</div>
        </div>
      </div>
    </div>
  );
}

export function SettingsModule({ showToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: '', message: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', message: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordFeedback({ type: '', message: '' });

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('rh_auth_token') : '';
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setPasswordFeedback({ type: 'success', message: '✓ Password successfully updated and re-hashed with Bcrypt.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Password securely updated');
      } else {
        setPasswordFeedback({ type: 'error', message: data.error || 'Failed to update password.' });
      }
    } catch (err) {
      setPasswordFeedback({ type: 'error', message: 'Network error updating password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>System Configuration & Portal Settings</h2>
          <p>Academic calendar session dates, grading scale parameters, and security</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* General Settings */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <div className="panel-icon">⚙️</div>
              <div>
                <h4>Academic Governance</h4>
                <p>Term parameters & grading weight</p>
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="field full">
              <label>Current Active Academic Session</label>
              <input type="text" defaultValue="2026/2027 Academic Session" />
            </div>
            <div className="field">
              <label>Current Term</label>
              <select defaultValue="Term 1">
                <option value="Term 1">Term 1 (First Term)</option>
                <option value="Term 2">Term 2 (Second Term)</option>
                <option value="Term 3">Term 3 (Third Term)</option>
              </select>
            </div>
            <div className="field">
              <label>Grading Policy</label>
              <select defaultValue="Cambridge & WAEC Weighted">
                <option value="Cambridge & WAEC Weighted">Weighted (CA 40%, Exam 60%)</option>
                <option value="Standard 30/70">Standard (CA 30%, Exam 70%)</option>
              </select>
            </div>
            <div className="field full">
              <label>School Contact Email</label>
              <input type="email" defaultValue="admin@royalheights.edu.ng" />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button className="btn primary" onClick={() => showToast('Settings successfully updated!')}>
              Save Academic Settings
            </button>
          </div>
        </div>

        {/* Security & Password Hash Card */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <div className="panel-icon">🛡️</div>
              <div>
                <h4>Account Security & Password Hashing</h4>
                <p>Bcrypt (10 Salt Rounds) · 256-Bit Cryptographic Hashing</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '16px', fontSize: '12.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-600)', fontWeight: '700', marginBottom: '2px' }}>
              <span>🔒</span> Cryptographic Protection Active
            </div>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '11.5px', lineHeight: '1.45' }}>
              Passwords are automatically salted and hashed using the industry-standard <strong>Bcrypt algorithm</strong> before storage in Neon PostgreSQL. Plain-text passwords are never saved or logged.
            </p>
          </div>

          {passwordFeedback.message && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                marginBottom: '14px',
                background: passwordFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${passwordFeedback.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: passwordFeedback.type === 'success' ? '#10b981' : '#ef4444',
              }}
            >
              {passwordFeedback.message}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="field" style={{ marginBottom: '12px' }}>
              <label>Current Password *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password..."
              />
            </div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label>New Password (Min 8 Characters) *</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create strong new password..."
              />
              {newPassword && (
                <div style={{ fontSize: '11px', marginTop: '4px', color: newPassword.length >= 10 ? '#10b981' : '#f59e0b' }}>
                  {newPassword.length >= 10 ? '✓ Strong password' : '⚠️ Moderate strength (add more characters)'}
                </div>
              )}
            </div>

            <div className="field" style={{ marginBottom: '16px' }}>
              <label>Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password..."
              />
            </div>

            <button
              type="submit"
              className="btn gold"
              disabled={isUpdatingPassword}
              style={{ width: '100%' }}
            >
              {isUpdatingPassword ? 'Hashing & Updating...' : '🔐 Hash & Save New Password →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
