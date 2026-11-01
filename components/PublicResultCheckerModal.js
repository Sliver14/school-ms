'use client';

import { useState } from 'react';

export default function PublicResultCheckerModal({ isOpen, onClose, showToast }) {
  if (!isOpen) return null;

  const [studentId, setStudentId] = useState('');
  const [session, setSession] = useState('2026/2027');
  const [term, setTerm] = useState('1st Term');
  const [serialNumber, setSerialNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Unlocked Result State
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!studentId.trim()) {
      setErrorMessage('Please enter the Scholar Admission Number (e.g. RH/2024/018).');
      return;
    }
    if (!serialNumber.trim() || !pin.trim()) {
      setErrorMessage('Please enter both the Scratch Card Serial Number and Secret PIN.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/scratch-cards/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentId.trim(),
          session,
          term,
          serialNumber: serialNumber.trim(),
          pin: pin.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVerifiedResult(data.reportCard);
        setCardInfo(data.card);
        if (showToast) showToast('Result verified and decrypted successfully!');
      } else {
        setErrorMessage(data.error || 'Invalid result check credentials.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setStudentId('RH/2024/018');
    setSerialNumber('RHS-2026-773194');
    setPin('8310-9921-4475');
    setSession('2026/2027');
    setTerm('1st Term');
    setErrorMessage('');
  };

  const handleReset = () => {
    setVerifiedResult(null);
    setCardInfo(null);
    setErrorMessage('');
  };

  const handlePrint = () => {
    window.print();
  };

  const rawScores = verifiedResult?.grades || [];
  const student = verifiedResult?.student || {};

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        style={{ width: 'min(860px, 98%)', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head no-print">
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎫</span> Online Result Verification Portal
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              Official Royal Heights Examination & Assessment Checker
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {!verifiedResult ? (
          /* FORM VIEW */
          <div style={{ padding: '10px 0' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(0,0,0,0.2))',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                Enter the student's admission number and scratch card PIN to verify and access official term reports.
                Scratch cards can be purchased at the Bursary or issued via school administration.
              </div>
            </div>

            {errorMessage && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '13px',
                  marginBottom: '18px',
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleVerify} style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Scholar Admission Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RH/2024/018"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13.5px',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Academic Session
                  </label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13.5px',
                    }}
                  >
                    <option value="2026/2027">2026/2027 Academic Session</option>
                    <option value="2025/2026">2025/2026 Academic Session</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Examination Term
                  </label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13.5px',
                    }}
                  >
                    <option value="1st Term">1st Term Examination</option>
                    <option value="2nd Term">2nd Term Examination</option>
                    <option value="3rd Term">3rd Term Promotional</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Scratch Card Serial Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RHS-2026-773194"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13.5px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Secret 12-Digit PIN *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8310-9921-4475"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13.5px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      letterSpacing: '1px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  className="btn gold"
                  disabled={loading}
                  style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 700 }}
                >
                  {loading ? 'Validating Credentials...' : '🔓 Verify & View Official Result'}
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleDemoFill}
                  style={{ borderStyle: 'dashed' }}
                >
                  💡 Fill Demo Test Credentials
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* RESULT DISPLAY VIEW */
          <div>
            {/* Card Badge */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '10px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '12.5px',
              }}
            >
              <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✓</span>
                <strong>Result Verified Online:</strong> Serial {cardInfo?.serialNumber}
              </div>
              <div style={{ color: 'var(--muted)' }}>
                Usage: {cardInfo?.usedCount} of {cardInfo?.maxUses} checks used ({cardInfo?.remainingUses} remaining)
              </div>
            </div>

            {/* Certificate */}
            <div
              className="printable-report-card"
              style={{
                background: 'var(--surface)',
                padding: '24px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--gold-500)', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>🏛️</div>
                <h2 style={{ fontSize: '19px', textTransform: 'uppercase', color: 'var(--gold-600)', margin: '0 0 4px' }}>
                  Royal Heights Secondary School
                </h2>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Plot 12-16 Royal Palm Crescent, Victoria Island, Lagos
                </div>
                <div style={{ marginTop: '8px', display: 'inline-block', padding: '3px 12px', background: 'var(--surface2)', borderRadius: '20px', fontSize: '11.5px', fontWeight: 700 }}>
                  OFFICIAL TERMINAL PERFORMANCE CERTIFICATE
                </div>
              </div>

              {/* Scholar Info */}
              <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)' }}>SCHOLAR NAME</div>
                    <strong>{student.name}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)' }}>ADMISSION NUMBER</div>
                    <strong>{student.id}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)' }}>CLASS</div>
                    <strong>{student.class}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)' }}>TERM AVERAGE</div>
                    <strong style={{ color: 'var(--gold-600)' }}>{verifiedResult.avgScore}%</strong>
                  </div>
                </div>
              </div>

              {/* Scores Table */}
              <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th style={{ textAlign: 'center' }}>CA 1 (20)</th>
                      <th style={{ textAlign: 'center' }}>CA 2 (20)</th>
                      <th style={{ textAlign: 'center' }}>Exam (60)</th>
                      <th style={{ textAlign: 'center' }}>Total</th>
                      <th style={{ textAlign: 'center' }}>Grade</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawScores.map((s, idx) => (
                      <tr key={idx}>
                        <td><strong>{s.subject}</strong></td>
                        <td style={{ textAlign: 'center' }}>{s.ca1}</td>
                        <td style={{ textAlign: 'center' }}>{s.ca2}</td>
                        <td style={{ textAlign: 'center' }}>{s.exam}</td>
                        <td style={{ textAlign: 'center' }}><strong>{s.total}%</strong></td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="badge badge-success">{s.grade}</span>
                        </td>
                        <td><small>{s.remark}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comments */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div style={{ background: 'var(--surface2)', padding: '10px 12px', borderRadius: '6px' }}>
                  <strong style={{ color: 'var(--gold-600)' }}>Form Teacher's Remark:</strong>
                  <p style={{ margin: '4px 0 0' }}>{verifiedResult.formTeacherComment}</p>
                </div>
                <div style={{ background: 'var(--surface2)', padding: '10px 12px', borderRadius: '6px' }}>
                  <strong style={{ color: 'var(--gold-600)' }}>Principal's Commendation:</strong>
                  <p style={{ margin: '4px 0 0' }}>{verifiedResult.principalComment}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions no-print" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn secondary" onClick={handleReset}>
                ← Check Another Result
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn secondary" onClick={onClose}>
                  Close
                </button>
                <button type="button" className="btn gold" onClick={handlePrint}>
                  🖨️ Print Transcript
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

