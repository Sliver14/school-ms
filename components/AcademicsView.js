'use client';
import { initialScores } from '../data/schoolData';

export default function AcademicsView({
  role,
  parentChildren,
  activeChildIndex,
  onOpenReportCard,
  onOpenScoreEntry,
  gradesList = [],
  unlockedCards = {},
  showToast,
}) {
  const isParent = role === 'parent';
  const isStudent = role === 'student';
  const isProtectedRole = isParent || isStudent;
  const activeChild =
    isParent && activeChildIndex >= 0
      ? parentChildren[activeChildIndex]
      : parentChildren[0];

  const studentId = activeChild.id || activeChild.admissionNo;
  const isUnlocked = !isProtectedRole || !!unlockedCards[studentId];

  const rawScores = (gradesList && gradesList.length > 0)
    ? gradesList
    : (isParent ? (activeChild.scores || activeChild.subjects) : initialScores) || [];

  const scores = rawScores.map((s) => {
    const total = s.total !== undefined ? s.total : (s.ca1 || 0) + (s.ca2 || 0) + (s.exam || 0);
    const grade = s.grade || (total >= 80 ? 'A*' : total >= 70 ? 'A' : total >= 60 ? 'B' : total >= 50 ? 'C' : 'F');
    return {
      ...s,
      total,
      grade,
    };
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>
            {isParent
              ? `Academic Performance • ${activeChild.name}`
              : 'Academics & Examination Gradebook'}
          </h2>
          <p>
            {isParent
              ? `Term 1 continuous assessment and examination results for ${activeChild.class}`
              : 'Continuous Assessment (CA), practicals, and term examination recording'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {(role === 'teacher' || role === 'admin') && (
            <button
              className="btn primary"
              onClick={onOpenScoreEntry}
            >
              ✍️ + Enter CA & Exam Marks
            </button>
          )}
          {isProtectedRole && (
            <span
              style={{
                fontSize: '12px',
                padding: '5px 12px',
                borderRadius: '20px',
                background: isUnlocked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                border: isUnlocked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                color: isUnlocked ? '#10b981' : 'var(--yellow)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isUnlocked ? '✓ Scratch Card Verified' : '🔒 Card PIN Required'}
            </span>
          )}
          <button
            className={`btn ${isUnlocked ? 'gold' : 'secondary'}`}
            onClick={() => onOpenReportCard(activeChild)}
          >
            {isUnlocked ? '📜 View Official Report Card' : '🔓 Unlock Report Card'}
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <div className="panel-icon">📊</div>
            <div>
              <h4>2026/2027 Academic Session • First Term Gradebook</h4>
              <p>Passing Threshold: 50% • Distinction Threshold: 75%</p>
            </div>
          </div>
          {(role === 'teacher' || role === 'admin') && (
            <button
              className="btn secondary small"
              onClick={() => showToast('Gradebook spreadsheet exported successfully')}
            >
              📥 Export CSV
            </button>
          )}
        </div>

        {/* DESKTOP VIEW: Gradebook Table (>= 769px) */}
        <div className="desktop-only table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject Title</th>
                <th>Continuous Assessment 1 (20)</th>
                <th>Continuous Assessment 2 (20)</th>
                <th>Term Exam (60)</th>
                <th>Overall (100)</th>
                <th>Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((sc, idx) => (
                <tr key={idx}>
                  <td><strong>{sc.subject}</strong></td>
                  <td>{sc.ca1}</td>
                  <td>{sc.ca2}</td>
                  <td>{sc.exam}</td>
                  <td><strong>{sc.total}%</strong></td>
                  <td>
                    <span
                      className={`badge ${
                        sc.grade.startsWith('A')
                          ? 'badge-success'
                          : 'badge-primary'
                      }`}
                    >
                      {sc.grade}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {sc.remark || (sc.total >= 85 ? 'Distinction' : 'Very Good')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Responsive Grade Cards (<= 768px, Zero Horizontal Scroll) */}
        <div className="mobile-only mobile-cards-list" style={{ padding: '12px' }}>
          {scores.map((sc, idx) => (
            <div key={idx} className="mobile-card">
              <div className="mobile-card-head">
                <h4 className="mobile-card-title">{sc.subject}</h4>
                <div className="mobile-card-badge-row">
                  <span
                    className={`badge ${
                      sc.grade.startsWith('A')
                        ? 'badge-success'
                        : 'badge-primary'
                    }`}
                  >
                    Grade {sc.grade}
                  </span>
                </div>
              </div>

              <div className="mobile-score-chips">
                <div>
                  <div className="mobile-score-chip-label">CA 1 (20)</div>
                  <div className="mobile-score-chip-val">{sc.ca1}</div>
                </div>
                <div>
                  <div className="mobile-score-chip-label">CA 2 (20)</div>
                  <div className="mobile-score-chip-val">{sc.ca2}</div>
                </div>
                <div>
                  <div className="mobile-score-chip-label">Exam (60)</div>
                  <div className="mobile-score-chip-val">{sc.exam}</div>
                </div>
                <div style={{ background: 'rgba(255, 194, 26, 0.12)', borderRadius: '6px' }}>
                  <div className="mobile-score-chip-label" style={{ color: 'var(--yellow)' }}>Total</div>
                  <div className="mobile-score-chip-val" style={{ color: 'var(--yellow)' }}>{sc.total}%</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                <span>Faculty Remark:</span>
                <span style={{ color: 'var(--ink)', fontWeight: '600' }}>
                  {sc.remark || (sc.total >= 85 ? 'Distinction' : 'Very Good')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
