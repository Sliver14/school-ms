'use client';

import { useState } from 'react';

export default function ReportCardModal({
  isOpen,
  onClose,
  activeChild,
  parentChildren,
  activeChildIndex,
  onSwitchChild,
  isParent,
  role = 'admin',
  unlockedCards = {},
  onUnlockCard,
  showToast,
}) {
  if (!isOpen || !activeChild) return null;

  const studentId = activeChild.id || activeChild.admissionNo;
  const isStaff = role === 'admin' || role === 'teacher' || role === 'bursar';

  // State for Staff toggle to test the student lock gate
  const [forceLockPreview, setForceLockPreview] = useState(false);

  // Scratch Card Verification Gatekeeper State
  const [serialInput, setSerialInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [gateError, setGateError] = useState('');

  // Form comments state
  const [formTeacherComment, setFormTeacherComment] = useState(
    activeChild.formTeacherComment ||
      activeChild.teacherNote ||
      'Daniel demonstrates commendable intellectual rigour, leadership, and exemplary conduct across all academic disciplines.'
  );
  const [principalComment, setPrincipalComment] = useState(
    activeChild.principalComment ||
      'Promoted with Honours. A stellar scholar upholding the Royal Heights virtues of Excellence and Character.'
  );
  const [conductGrade, setConductGrade] = useState(activeChild.conductGrade || 'A (Exemplary)');

  const rawModalScores = activeChild.scores || activeChild.subjects || [];
  const modalScores = rawModalScores.map((sc) => {
    const total = sc.total !== undefined ? sc.total : (sc.ca1 || 0) + (sc.ca2 || 0) + (sc.exam || 0);
    const grade = sc.grade || (total >= 80 ? 'A*' : total >= 70 ? 'A' : total >= 60 ? 'B' : total >= 50 ? 'C' : 'F');
    const remark = sc.remark || (total >= 80 ? 'Distinction' : total >= 70 ? 'Excellent' : total >= 60 ? 'Very Good' : 'Pass');
    return {
      ...sc,
      total,
      grade,
      remark,
    };
  });

  const avg = activeChild.avgScore || activeChild.average || '78.4';
  const gpa = activeChild.gpa || (avg ? (Number(avg) / 25).toFixed(2) : '3.88');
  const rank = activeChild.rank || '4th of 32';
  const attendance = activeChild.attendance || 96;

  // Active verified scratch card details for this scholar
  const currentCard = unlockedCards[studentId];
  const isUnlocked = isStaff ? !forceLockPreview : !!currentCard;

  const handleVerifyCard = async (e) => {
    if (e) e.preventDefault();
    if (!serialInput.trim() || !pinInput.trim()) {
      setGateError('Please enter both the Serial Number and Secret PIN.');
      return;
    }

    setIsVerifying(true);
    setGateError('');

    try {
      const res = await fetch('/api/scratch-cards/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: serialInput.trim(),
          pin: pinInput.trim(),
          studentId: studentId,
          studentName: activeChild.name,
          term: '1st Term',
          session: '2026/2027',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Scratch card verified successfully!');
        if (onUnlockCard) {
          onUnlockCard(studentId, data.card);
        }
        if (forceLockPreview) {
          setForceLockPreview(false);
        }
      } else {
        setGateError(data.error || 'Invalid scratch card credentials.');
      }
    } catch (err) {
      setGateError('Network error verifying scratch card. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickDemoCard = () => {
    setSerialInput('RHS-2026-773194');
    setPinInput('8310-9921-4475');
    setGateError('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal report-card-modal-container"
        style={{ width: 'min(890px, 100%)', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head no-print">
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📜</span> Official Term Performance Certificate
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              Royal Heights Secondary School • Academic Evaluation Transcript
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isStaff && (
              <button
                type="button"
                className={`btn small ${forceLockPreview ? 'gold' : 'secondary'}`}
                onClick={() => setForceLockPreview(!forceLockPreview)}
                title="Toggle Student Lock Gate Preview"
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
              >
                {forceLockPreview ? 'Exit Student Lock Mode' : '👁️ Preview Student Lock'}
              </button>
            )}
            <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* Sibling toggle for parents */}
        {isParent && parentChildren && parentChildren.length > 1 && (
          <div className="report-card-child-toggle no-print" style={{ marginBottom: '16px' }}>
            {parentChildren.map((child, idx) => (
              <button
                key={child.id}
                className={`btn small ${activeChildIndex === idx ? 'gold' : 'secondary'}`}
                onClick={() => {
                  setGateError('');
                  onSwitchChild(idx);
                }}
              >
                View {child.name} ({child.class})
                {unlockedCards[child.id] && ' ✓'}
              </button>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/* CASE 1: LOCKED STATE (SCRATCH CARD VERIFICATION GATEKEEPER)  */}
        {/* ============================================================ */}
        {!isUnlocked ? (
          <div
            className="scratch-card-gatekeeper"
            style={{
              background: 'linear-gradient(135deg, #1f1b2e 0%, #13101d 100%)',
              border: '1.5px solid var(--line-strong, #3a334a)',
              borderRadius: '16px',
              padding: '32px 24px',
              color: 'var(--text)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background Watermark */}
            <div
              style={{
                position: 'absolute',
                right: '-20px',
                top: '-20px',
                opacity: 0.05,
                fontSize: '180px',
                pointerEvents: 'none',
              }}
            >
              🔒
            </div>

            <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.05))',
                  border: '1.5px solid #eab308',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '28px',
                  margin: '0 auto 16px',
                }}
              >
                🔒
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
                Academic Transcript Protected
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                To view and download the official terminal report card for{' '}
                <strong style={{ color: 'var(--gold, #eab308)' }}>{activeChild.name}</strong> ({studentId}),
                please enter your Royal Heights Result Scratch Card credentials.
              </p>

              {/* Scholar Details Pill */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  background: 'var(--surface2)',
                  padding: '10px 16px',
                  borderRadius: '24px',
                  fontSize: '12px',
                  marginBottom: '24px',
                  border: '1px solid var(--line)',
                }}
              >
                <span><strong>Scholar:</strong> {activeChild.name}</span>
                <span>•</span>
                <span><strong>Admission:</strong> {studentId}</span>
                <span>•</span>
                <span><strong>Term:</strong> 1st Term 2026/2027</span>
              </div>

              {/* Error Notice */}
              {gateError && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    marginBottom: '18px',
                    textAlign: 'left',
                  }}
                >
                  ⚠️ {gateError}
                </div>
              )}

              {/* Card Verification Form */}
              <form onSubmit={handleVerifyCard} style={{ display: 'grid', gap: '14px', textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--muted)' }}>
                    Scratch Card Serial Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RHS-2026-773194"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      letterSpacing: '1px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--muted)' }}>
                    Secret 12-Digit PIN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8310-9921-4475"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      letterSpacing: '2px',
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                    PIN can be entered with or without hyphens
                  </small>
                </div>

                <div style={{ marginTop: '8px', display: 'grid', gap: '10px' }}>
                  <button
                    type="submit"
                    className="btn gold"
                    disabled={isVerifying}
                    style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700 }}
                  >
                    {isVerifying ? 'Verifying Card with Bursary Ledger...' : '🔓 Verify & Unlock Report Card'}
                  </button>

                  <button
                    type="button"
                    className="btn secondary small"
                    onClick={handleQuickDemoCard}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '12px',
                      color: 'var(--yellow)',
                      borderStyle: 'dashed',
                    }}
                  >
                    💡 Auto-fill Valid Demo Scratch Card (RHS-2026-773194)
                  </button>
                </div>
              </form>

              {/* Instructions Footnote */}
              <div
                style={{
                  marginTop: '22px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--line)',
                  fontSize: '11.5px',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                }}
              >
                ℹ️ Official result scratch cards are obtainable at the School Bursary & Accounts Office.
                Each card allows up to 5 checks and binds permanently to the student's admission number on first activation.
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* CASE 2: UNLOCKED OFFICIAL CERTIFICATE & PERFORMANCE REPORT   */
          /* ============================================================ */
          <div>
            {/* Official Security Verification Banner */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                background: isStaff && forceLockPreview === false && !currentCard
                  ? 'rgba(56, 189, 248, 0.12)'
                  : 'rgba(16, 185, 129, 0.12)',
                border: isStaff && forceLockPreview === false && !currentCard
                  ? '1px solid rgba(56, 189, 248, 0.3)'
                  : '1px solid rgba(16, 185, 129, 0.3)',
                padding: '10px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '12.5px',
              }}
            >
              {currentCard ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                    <span style={{ fontSize: '16px' }}>✓</span>
                    <strong>Verified Official Transcript</strong>
                    <span style={{ color: 'var(--text)' }}>
                      • Card Serial: <strong style={{ fontFamily: 'monospace' }}>{currentCard.serialNumber}</strong>
                    </span>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '12px' }}>
                    Check <strong style={{ color: '#10b981' }}>{currentCard.usedCount}</strong> of {currentCard.maxUses} used ({currentCard.remainingUses} remaining)
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sky, #38bdf8)' }}>
                  <span>🛡️</span>
                  <strong>Staff Preview Clearance:</strong> Full evaluation access granted without scratch card deduction.
                </div>
              )}
            </div>

            {/* Printable Certificate Document Box */}
            <div className="printable-report-card" style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--line)', position: 'relative' }}>
              
              {/* Official Crest Header */}
              <div style={{ borderBottom: '2px solid var(--gold-500)', paddingBottom: '16px', marginBottom: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>🏛️</div>
                <h2 style={{ fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold-600)', margin: '0 0 4px' }}>
                  Royal Heights Secondary School
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.5px' }}>
                  Excellence • Character • Leadership
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                  Plot 12-16 Royal Palm Crescent, Victoria Island, Lagos • Tel: +234 1 800-ROYAL
                </div>
                <div style={{ marginTop: '10px', display: 'inline-block', padding: '3px 12px', background: 'var(--surface2)', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid var(--line)' }}>
                  OFFICIAL CONTINUOUS ASSESSMENT & TERMINAL EXAMINATION REPORT
                </div>
              </div>

              {/* Student Profile Grid */}
              <div style={{ background: 'var(--surface2)', padding: '14px 18px', borderRadius: '8px', marginBottom: '18px', border: '1px solid var(--line)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Scholar Name</div>
                    <strong style={{ fontSize: '15px' }}>{activeChild.name}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Admission ID</div>
                    <strong>{studentId}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Class & Arm</div>
                    <span className="badge badge-primary">{activeChild.class} (Arm A)</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>School House</div>
                    <strong>{activeChild.house || 'Sapphire House'}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Term Cumulative Average</div>
                    <strong style={{ color: 'var(--gold-600)', fontSize: '15px' }}>{avg}%</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Cumulative GPA</div>
                    <strong style={{ color: 'var(--gold-600)', fontSize: '15px' }}>{gpa} / 4.00</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Class Rank</div>
                    <span className="badge badge-gold">{rank}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Attendance Rate</div>
                    <span className="badge badge-success">{attendance}% Present</span>
                  </div>
                </div>
              </div>

              {/* Academic Scores Table */}
              <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
                <table className="data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Subject Title</th>
                      <th style={{ textAlign: 'center' }}>CA 1 (20)</th>
                      <th style={{ textAlign: 'center' }}>CA 2 (20)</th>
                      <th style={{ textAlign: 'center' }}>Exam (60)</th>
                      <th style={{ textAlign: 'center' }}>Total (100)</th>
                      <th style={{ textAlign: 'center' }}>Grade</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalScores.map((sc, idx) => (
                      <tr key={idx}>
                        <td><strong>{sc.subject}</strong></td>
                        <td style={{ textAlign: 'center' }}>{sc.ca1}</td>
                        <td style={{ textAlign: 'center' }}>{sc.ca2}</td>
                        <td style={{ textAlign: 'center' }}>{sc.exam}</td>
                        <td style={{ textAlign: 'center' }}>
                          <strong>{sc.total}%</strong>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${sc.grade.startsWith('A') ? 'badge-success' : 'badge-primary'}`}>
                            {sc.grade}
                          </span>
                        </td>
                        <td><small>{sc.remark}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grading Key Footer */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--muted)', padding: '8px 12px', background: 'var(--surface3)', borderRadius: '6px', marginBottom: '18px' }}>
                <span><strong>Grading Key:</strong></span>
                <span>A* (80-100% Distinction)</span>
                <span>A (70-79% Excellent)</span>
                <span>B (60-69% Very Good)</span>
                <span>C (50-59% Credit)</span>
                <span>F (0-49% Fail)</span>
              </div>

              {/* Pastoral & Endorsement Blocks */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gold-600)', marginBottom: '6px' }}>
                    Form Teacher's Pastoral Remark
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
                    {formTeacherComment}
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gold-600)', marginBottom: '6px' }}>
                    Principal's Honours Commendation
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
                    {principalComment}
                  </div>
                </div>
              </div>

              {/* Official Signatures Stamp & Scratch Card Watermark */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingTop: '16px', borderTop: '1px dashed var(--line)', textAlign: 'center' }}>
                <div>
                  <div style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '14px', color: 'var(--gold-600)' }}>Samuel Okoro</div>
                  <div style={{ height: '1px', background: 'var(--line)', margin: '4px 20px 6px' }} />
                  <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Form Teacher Signature</div>
                </div>

                <div>
                  <div style={{ display: 'inline-block', padding: '2px 8px', border: '1.5px solid #10b981', color: '#10b981', borderRadius: '4px', fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    ✓ DIGITALLY SEALED
                  </div>
                  <div style={{ height: '1px', background: 'var(--line)', margin: '4px 20px 6px' }} />
                  <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {currentCard ? `CARD: ${currentCard.serialNumber}` : 'Academic Registrar'}
                  </div>
                </div>

                <div>
                  <div style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '14px', color: 'var(--gold-600)' }}>Dr. Victoria Adeleke</div>
                  <div style={{ height: '1px', background: 'var(--line)', margin: '4px 20px 6px' }} />
                  <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>School Principal</div>
                </div>
              </div>
            </div>

            {/* Modal Action Controls (Hidden when printing) */}
            <div className="modal-actions no-print" style={{ marginTop: '20px' }}>
              <button type="button" className="btn secondary" onClick={onClose}>
                Close Transcript
              </button>
              <button type="button" className="btn gold" onClick={handlePrint}>
                🖨️ Print / Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
