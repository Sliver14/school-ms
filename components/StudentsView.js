'use client';
import { useState } from 'react';

export default function StudentsView({
  students,
  onOpenAddStudent,
  onOpenReportCard,
  onOpenPayment,
  showToast,
  role,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
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

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
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
            flex: '0 1 auto',
            fontSize: '13.5px',
          }}
        >
          <option value="ALL">All Classes (1,280)</option>
          <option value="JS 1B">JS 1B</option>
          <option value="JS 2A">JS 2A</option>
          <option value="SS 2A">SS 2A</option>
          <option value="SS 2B">SS 2B</option>
          <option value="SS 3 Science">SS 3 Science</option>
        </select>
      </div>

      <div className="panel">
        <div style={{ overflowX: 'auto' }}>
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
      </div>
    </div>
  );
}
