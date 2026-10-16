'use client';
import { initialScores } from '../data/schoolData';

export default function AcademicsView({
  role,
  parentChildren,
  activeChildIndex,
  onOpenReportCard,
  onOpenScoreEntry,
  gradesList = [],
  showToast,
}) {
  const isParent = role === 'parent';
  const activeChild =
    isParent && activeChildIndex >= 0
      ? parentChildren[activeChildIndex]
      : parentChildren[0];

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
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {(role === 'teacher' || role === 'admin') && (
            <button
              className="btn primary"
              onClick={onOpenScoreEntry}
            >
              ✍️ + Enter CA & Exam Marks
            </button>
          )}
          <button
            className="btn gold"
            onClick={() => onOpenReportCard(activeChild)}
          >
            📜 View Official Report Card
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

        <div style={{ overflowX: 'auto' }}>
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
      </div>
    </div>
  );
}
