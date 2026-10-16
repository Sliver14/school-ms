'use client';

import { useState } from 'react';

export default function AdmissionReviewModal({
  isOpen,
  onClose,
  applicant,
  onUpdateApplicant,
  onEnrolApplicant,
  showToast,
}) {
  if (!isOpen || !applicant) return null;

  const [score, setScore] = useState(applicant.score || 0);
  const [decision, setDecision] = useState(applicant.decision || 'Under Review');
  const [examStatus, setExamStatus] = useState(applicant.examStatus || 'Scheduled');
  const [examDate, setExamDate] = useState(applicant.examDate || 'Saturday, 24 Oct 2026 · 09:00 AM (Hall B)');
  const [arm, setArm] = useState('A');
  const [house, setHouse] = useState('Sapphire House');
  const [boardingStatus, setBoardingStatus] = useState('Day');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlreadyEnrolled = applicant.decision === 'Enrolled ✓' || applicant.studentId;

  const handleSaveReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: applicant.id,
          score: Number(score),
          decision,
          examStatus,
          examDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Evaluation updated for ${applicant.name}`);
        onUpdateApplicant(data.applicant);
        onClose();
      } else {
        showToast(data.error || 'Failed to update applicant');
      }
    } catch (err) {
      showToast('Network error updating applicant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrol = async () => {
    if (isAlreadyEnrolled) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enrol',
          id: applicant.id,
          customFields: {
            arm,
            house,
            boardingStatus,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🎉 ${applicant.name} enrolled as Scholar (${data.student.id})!`);
        onEnrolApplicant(data.student, applicant.id);
        onClose();
      } else {
        showToast(data.error || 'Failed to enrol applicant');
      }
    } catch (err) {
      showToast('Network error enrolling applicant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 'min(720px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Candidate Review & Enrolment Desk</h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              Application Ref: <strong>{applicant.id}</strong> • Target: {applicant.entryClass}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Candidate Bio Overview */}
        <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--line)', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Candidate Name</div>
              <strong style={{ fontSize: '15px' }}>{applicant.name}</strong>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Target Entry Class</div>
              <span className="badge badge-primary">{applicant.entryClass}</span>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Parent / Sponsor</div>
              <strong>{applicant.parentName}</strong>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Contact Phone</div>
              <small>{applicant.parentPhone}</small>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Previous School</div>
              <div style={{ fontSize: '13px' }}>{applicant.prevSchool || 'Corona Primary School, Lagos'}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveReview}>
          <div className="form-grid">
            <div className="field">
              <label>Entrance CBT Schedule / Hall</label>
              <input
                type="text"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                placeholder="e.g. Saturday, 24 Oct 2026 · 09:00 AM"
              />
            </div>

            <div className="field">
              <label>CBT Exam Status</label>
              <select value={examStatus} onChange={(e) => setExamStatus(e.target.value)}>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress (CBT Lab)</option>
                <option value="Completed">Completed</option>
                <option value="Passed">Passed</option>
                <option value="Absent / Rescheduled">Absent / Rescheduled</option>
              </select>
            </div>

            <div className="field">
              <label>Entrance Exam Score (%)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {score >= 80 ? '🌟 Distinction' : score >= 65 ? '✅ Merit Pass' : score > 0 ? '⚠️ Borderline' : 'Awaiting Test'}
                </span>
              </div>
            </div>

            <div className="field">
              <label>Admissions Board Decision</label>
              <select value={decision} onChange={(e) => setDecision(e.target.value)}>
                <option value="Under Review">Under Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Accepted">Accepted (Merit)</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>

          {/* Section: Convert to Enrolled Student */}
          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px dashed var(--gold-500)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-600)', marginBottom: '8px' }}>
              <span>🎓</span> Scholar Enrolment Assignment
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '14px' }}>
              When admitted, assign class arm, school house, and boarding residency. A unique Student ID will be generated.
            </p>

            <div className="form-grid">
              <div className="field">
                <label>Class Arm</label>
                <select value={arm} onChange={(e) => setArm(e.target.value)}>
                  <option value="A">Arm A</option>
                  <option value="B">Arm B</option>
                  <option value="C">Arm C</option>
                </select>
              </div>

              <div className="field">
                <label>School House</label>
                <select value={house} onChange={(e) => setHouse(e.target.value)}>
                  <option value="Sapphire House">Sapphire House (Blue)</option>
                  <option value="Emerald House">Emerald House (Green)</option>
                  <option value="Ruby House">Ruby House (Red)</option>
                  <option value="Topaz House">Topaz House (Gold)</option>
                </select>
              </div>

              <div className="field full">
                <label>Boarding / Day Status</label>
                <select value={boardingStatus} onChange={(e) => setBoardingStatus(e.target.value)}>
                  <option value="Day">Day Student</option>
                  <option value="Boarder">Full Boarder (Hall of Residence)</option>
                </select>
              </div>
            </div>

            {isAlreadyEnrolled ? (
              <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}>
                ✓ Candidate is already fully enrolled as Scholar ({applicant.studentId})
              </div>
            ) : (
              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn gold"
                  onClick={handleEnrol}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing Enrolment...' : '✨ Admit & Enrol as Royal Heights Scholar →'}
                </button>
              </div>
            )}
          </div>

          <div className="modal-actions" style={{ marginTop: '18px' }}>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              Save Evaluation Notes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
