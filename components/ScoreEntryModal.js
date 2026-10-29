'use client';

import { useState } from 'react';

export default function ScoreEntryModal({
  isOpen,
  onClose,
  students,
  onScoresSaved,
  showToast,
}) {
  if (!isOpen) return null;

  const [selectedClass, setSelectedClass] = useState('SS2');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [term, setTerm] = useState('1st Term');
  const [session, setSession] = useState('2026/2027');
  const [isSaving, setIsSaving] = useState(false);

  const classStudents = students.filter(
    (s) => s.class === selectedClass || s.class.startsWith(selectedClass)
  );

  // Score mapping: studentId -> { ca1, ca2, exam }
  const [scores, setScores] = useState(() => {
    const init = {};
    classStudents.forEach((s, idx) => {
      init[s.id] = {
        ca1: 8 + (idx % 3),
        ca2: 8 + ((idx * 2) % 3),
        exam: 52 + ((idx * 5) % 20),
      };
    });
    return init;
  });

  const handleScoreChange = (studentId, field, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    const limit = field === 'exam' ? 60 : 20;
    const capped = Math.min(limit, num);

    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: capped,
      },
    }));
  };

  const calculateTotal = (studentId) => {
    const sc = scores[studentId] || { ca1: 0, ca2: 0, exam: 0 };
    return (sc.ca1 || 0) + (sc.ca2 || 0) + (sc.exam || 0);
  };

  const getGrade = (tot) => {
    if (tot >= 80) return { grade: 'A*', remark: 'Distinction', color: '#10b981' };
    if (tot >= 70) return { grade: 'A', remark: 'Excellent', color: '#10b981' };
    if (tot >= 60) return { grade: 'B', remark: 'Very Good', color: '#3b82f6' };
    if (tot >= 50) return { grade: 'C', remark: 'Credit Pass', color: '#f59e0b' };
    return { grade: 'F', remark: 'Fail', color: '#ef4444' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = classStudents.map((s) => {
      const sc = scores[s.id] || { ca1: 0, ca2: 0, exam: 0 };
      return {
        studentId: s.id,
        studentName: s.name,
        class: selectedClass,
        subject: selectedSubject,
        term,
        session,
        ca1: sc.ca1,
        ca2: sc.ca2,
        exam: sc.exam,
      };
    });

    try {
      const res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          `✅ Marks recorded for ${payload.length} students in ${selectedClass} · ${selectedSubject}!`
        );
        onScoresSaved(data.grades);
        onClose();
      } else {
        showToast(data.error || 'Failed to save grades');
      }
    } catch (err) {
      showToast('Network error recording grades');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 'min(820px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Continuous Assessment & Exam Score Entry</h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              CA1 (20) + CA2 (20) + Terminal Exam (60) = Total (100)
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Filter Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '16px', background: 'var(--surface2)', padding: '12px 14px', borderRadius: 'var(--radius)' }}>
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                <option value="JSS1">JSS 1</option>
                <option value="JSS2">JSS 2</option>
                <option value="JSS3">JSS 3</option>
                <option value="SS1">SS 1</option>
                <option value="SS2">SS 2</option>
                <option value="SS3">SS 3</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="English Language">English Language</option>
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Economics">Economics</option>
                <option value="Computer Studies">Computer Studies</option>
                <option value="Civic Education">Civic Education</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
            </div>
          </div>

          {/* Scores Table */}
          <div style={{ maxHeight: '340px', overflow: 'auto', maxWidth: '100%', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
            <table className="data-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th style={{ width: '85px' }}>CA 1 (20)</th>
                  <th style={{ width: '85px' }}>CA 2 (20)</th>
                  <th style={{ width: '85px' }}>Exam (60)</th>
                  <th style={{ width: '75px' }}>Total</th>
                  <th style={{ width: '60px' }}>Grade</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((s) => {
                  const sc = scores[s.id] || { ca1: 0, ca2: 0, exam: 0 };
                  const total = calculateTotal(s.id);
                  const { grade, remark, color } = getGrade(total);

                  return (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.name}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.id}</div>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={sc.ca1}
                          onChange={(e) => handleScoreChange(s.id, 'ca1', e.target.value)}
                          style={{ width: '65px', padding: '4px 6px', textAlign: 'center', fontWeight: '600' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={sc.ca2}
                          onChange={(e) => handleScoreChange(s.id, 'ca2', e.target.value)}
                          style={{ width: '65px', padding: '4px 6px', textAlign: 'center', fontWeight: '600' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={sc.exam}
                          onChange={(e) => handleScoreChange(s.id, 'exam', e.target.value)}
                          style={{ width: '65px', padding: '4px 6px', textAlign: 'center', fontWeight: '600' }}
                        />
                      </td>
                      <td>
                        <strong style={{ fontSize: '14px' }}>{total}%</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700', color }}>{grade}</span>
                      </td>
                      <td>
                        <small style={{ color: 'var(--muted)' }}>{remark}</small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="modal-actions" style={{ marginTop: '16px' }}>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={isSaving}>
              {isSaving ? 'Submitting & Computing...' : '✨ Submit & Compute Class Terminal Results'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
