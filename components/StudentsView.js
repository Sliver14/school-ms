'use client';
import { useState } from 'react';

export default function StudentsView({
  students = [],
  onOpenAddStudent,
  onOpenReportCard,
  onOpenPayment,
  showToast,
  role,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');

  const filtered = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.parent && s.parent.toLowerCase().includes(term)) ||
      (s.guardian && s.guardian.toLowerCase().includes(term)) ||
      (s.id && s.id.toLowerCase().includes(term));
    const matchesClass = classFilter === 'ALL' || s.class === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Student Enrolment Directory</h2>
          <p>Complete roster of registered scholars across all arms</p>
        </div>
        {(role === 'admin' || role === 'bursar') && (
          <button className="btn primary" onClick={onOpenAddStudent}>
            + Enrol New Student
          </button>
        )}
      </div>

      {/* Search & Class Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', flex: '1 1 300px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Filter by scholar name, ID or parent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '9px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--ink)',
              flex: '1 1 200px',
              minWidth: 0,
              fontSize: '13.5px',
            }}
          />

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '9px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--ink)',
              flex: '0 1 180px',
              minWidth: 0,
              fontSize: '13.5px',
            }}
          >
            <option value="ALL">All Classes (Whole School)</option>
            <option value="JS 1B">JS 1B</option>
            <option value="JS 2A">JS 2A</option>
            <option value="SS 2A">SS 2A</option>
            <option value="SS 2B">SS 2B</option>
            <option value="SS 3 Science">SS 3 Science</option>
          </select>
        </div>

        <div style={{ fontSize: '12.5px', color: 'var(--muted)', fontWeight: '600' }}>
          Showing <span style={{ color: 'var(--ink)' }}>{filtered.length}</span> of {students.length} scholars
        </div>
      </div>

      <div className="panel" style={{ padding: '0' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
            <h4>No scholars found</h4>
            <p style={{ fontSize: '13px', margin: '4px 0 14px' }}>
              No enrolled students matched "{searchTerm}" in {classFilter}.
            </p>
            <button
              className="btn secondary small"
              onClick={() => {
                setSearchTerm('');
                setClassFilter('ALL');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW: Visible only on tablet/desktop (>= 769px) */}
            <div className="desktop-only table-wrap" style={{ margin: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Full Name</th>
                    <th>Class</th>
                    <th>Parent / Guardian</th>
                    <th>Contact Phone</th>
                    <th>Fee Status</th>
                    <th>Academic Standing</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr key={student.id}>
                      <td><strong>{student.id}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'var(--surface3)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            {student.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-primary">{student.class}</span></td>
                      <td>{student.parent || student.guardian}</td>
                      <td><small>{student.phone}</small></td>
                      <td>
                        <span
                          className={`badge ${
                            student.feeStatus === 'Paid'
                              ? 'badge-success'
                              : 'badge-gold'
                          }`}
                        >
                          {student.feeStatus || 'Pending'}
                        </span>
                      </td>
                      <td><span className="badge badge-success">Good Standing</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn small secondary"
                            title="View Official Report Card"
                            onClick={() => onOpenReportCard && onOpenReportCard(student)}
                          >
                            📜 Report
                          </button>
                          {(role === 'admin' || role === 'bursar') && (
                            <button
                              className="btn small gold"
                              title="Settle Fees & Clear Exam"
                              onClick={() => onOpenPayment && onOpenPayment(student)}
                            >
                              💳 Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE RESPONSIVE CARDS VIEW: Visible on screens <= 768px (Zero Horizontal Scroll) */}
            <div className="mobile-only mobile-cards-list" style={{ padding: '12px' }}>
              {filtered.map((student) => {
                const initials = student.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2);

                return (
                  <div key={student.id} className="mobile-card">
                    <div className="mobile-card-head">
                      <div className="mobile-card-title-group">
                        <div className="mobile-card-avatar">{initials}</div>
                        <div style={{ minWidth: 0 }}>
                          <h4 className="mobile-card-title">{student.name}</h4>
                          <div className="mobile-card-sub">{student.id}</div>
                        </div>
                      </div>
                      <div className="mobile-card-badge-row">
                        <span className="badge badge-primary">{student.class}</span>
                        <span
                          className={`badge ${
                            student.feeStatus === 'Paid'
                              ? 'badge-success'
                              : 'badge-gold'
                          }`}
                        >
                          {student.feeStatus || 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="mobile-card-grid">
                      <div className="mobile-card-field">
                        <span className="mobile-card-label">Parent / Guardian</span>
                        <span className="mobile-card-value" title={student.parent || student.guardian}>
                          {student.parent || student.guardian || '—'}
                        </span>
                      </div>
                      <div className="mobile-card-field">
                        <span className="mobile-card-label">Contact Phone</span>
                        <a
                          href={`tel:${student.phone}`}
                          className="mobile-card-value"
                          style={{ color: 'var(--sky)', textDecoration: 'none' }}
                        >
                          {student.phone || '—'}
                        </a>
                      </div>
                      <div className="mobile-card-field full">
                        <span className="mobile-card-label">Academic Standing</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span className="badge badge-success" style={{ fontSize: '11px' }}>
                            ✓ Good Academic Standing
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <button
                        className="btn small secondary"
                        onClick={() => onOpenReportCard && onOpenReportCard(student)}
                      >
                        📜 Report Card
                      </button>
                      {(role === 'admin' || role === 'bursar') && (
                        <button
                          className="btn small gold"
                          onClick={() => onOpenPayment && onOpenPayment(student)}
                        >
                          💳 Settle Fees
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
