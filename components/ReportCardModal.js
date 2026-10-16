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
  showToast,
}) {
  if (!isOpen || !activeChild) return null;

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
  const [isSavingComments, setIsSavingComments] = useState(false);

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

  const handleSaveEndorsement = async () => {
    setIsSavingComments(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: activeChild.id,
          formTeacherComment,
          principalComment,
          conductGrade,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Official report card endorsements saved successfully');
      } else {
        showToast(data.error || 'Failed to update endorsements');
      }
    } catch (err) {
      showToast('Network error saving endorsements');
    } finally {
      setIsSavingComments(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal report-card-modal-container"
        style={{ width: 'min(860px, 100%)', maxHeight: '92vh', overflowY: 'auto' }}
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
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Sibling toggle for parents */}
        {isParent && parentChildren && parentChildren.length > 1 && (
          <div className="report-card-child-toggle no-print" style={{ marginBottom: '16px' }}>
            {parentChildren.map((child, idx) => (
              <button
                key={child.id}
                className={`btn small ${activeChildIndex === idx ? 'gold' : 'secondary'}`}
                onClick={() => onSwitchChild(idx)}
              >
                View {child.name} ({child.class})
              </button>
            ))}
          </div>
        )}

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
                <strong>{activeChild.id || activeChild.admissionNo}</strong>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
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

          {/* Official Signatures Stamp */}
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
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>Academic Registrar</div>
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
    </div>
  );
}
