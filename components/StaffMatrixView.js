'use client';
import { useState } from 'react';

export default function StaffMatrixView({
  classAllocations,
  allTeachersList = [],
  onOpenAllocationModal,
  onOpenOnboardTeacher,
  showToast,
}) {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('ALL');

  const rawList = Array.isArray(classAllocations)
    ? classAllocations
    : Object.entries(classAllocations || {}).map(([key, val]) => ({
        id: key,
        key,
        level: key.startsWith('SS') ? 'Senior Secondary' : 'Junior Secondary',
        ...val,
      }));

  const filteredAllocations = rawList.filter((c) => {
    if (selectedLevelFilter === 'ALL') return true;
    return c.level === selectedLevelFilter;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-head" style={{ marginBottom: '20px' }}>
        <div>
          <h2>Staff Faculty & Subject Allocation Matrix</h2>
          <p>
            Manage homeroom class teachers and individual specialist subject allocations across classes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn secondary"
            onClick={() => showToast('Onboarding documentation downloaded (PDF)')}
          >
            📥 Export Staff Directory
          </button>
          <button
            className="btn primary"
            onClick={onOpenOnboardTeacher}
          >
            + Onboard New Teacher
          </button>
        </div>
      </div>

      {/* Teacher Onboarding & Allocation Architecture Banner */}
      <div className="onboarding-banner">
        <h4>Teacher Onboarding & Class-Subject Allocation System</h4>
        <p>
          At Royal Heights, teacher recruitment and curriculum deployment follows an enterprise 3-tier architecture:
        </p>
        <div className="steps-container">
          <div className="arch-step">
            <div className="step-badge">1</div>
            <div>
              <strong>Profile & Credentials</strong>
              <small>Faculty member is onboarded with degree verification, TRCN accreditation, and department assignment (Sciences, Humanities, Commercial, Arts).</small>
            </div>
          </div>
          <div className="arch-step">
            <div className="step-badge">2</div>
            <div>
              <strong>Homeroom / Form Teacher</strong>
              <small>A teacher is designated as Form Teacher for pastoral care, attendance oversight, and conduct reporting for one specific class arm.</small>
            </div>
          </div>
          <div className="arch-step">
            <div className="step-badge">3</div>
            <div>
              <strong>Multi-Teacher Subject Matrix</strong>
              <small>Multiple specialist teachers are mapped to their respective subjects for that class. One teacher can teach Chemistry to SS2A while another teaches Physics to the same class.</small>
            </div>
          </div>
        </div>
      </div>

      {/* Class Level Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Filter Level:</span>
        {['ALL', 'Junior Secondary', 'Senior Secondary'].map((lvl) => (
          <button
            key={lvl}
            className={`btn small ${selectedLevelFilter === lvl ? 'primary' : 'secondary'}`}
            onClick={() => setSelectedLevelFilter(lvl)}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Subject-Class Allocation Matrix Panel */}
      <div className="panel" style={{ marginBottom: '24px', padding: 0 }}>
        <div className="panel-head" style={{ padding: '20px 20px 0' }}>
          <div className="panel-title">
            <div className="panel-icon">🏛️</div>
            <div>
              <h4>Master Class & Subject Allocation Matrix</h4>
              <p>Live schedule of Form Teachers and Subject Specialists</p>
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW: Allocation Table for tablet/desktop (>= 769px) */}
        <div className="desktop-only table-wrap" style={{ margin: 0, padding: '0 4px 14px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Class Arm</th>
                <th>Academic Level</th>
                <th>Form Teacher (Pastoral)</th>
                <th>Subject Specialists Assigned</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((cls) => {
                const subjectEntries = Array.isArray(cls.subjects)
                  ? cls.subjects.map((s) => [s.subject, s.teacher])
                  : Object.entries(cls.subjects || {});
                return (
                  <tr key={cls.id}>
                    <td>
                      <strong>{cls.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-primary">{cls.level}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'var(--primary-soft)',
                            color: 'var(--primary-text)',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: '700',
                            fontSize: '11px',
                          }}
                        >
                          {cls.formTeacher
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <strong>{cls.formTeacher}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Form Teacher</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="subject-chip-grid">
                        {subjectEntries.map(([subj, teacher]) => (
                          <div className="subject-chip-pill" key={subj}>
                            <span className="subject-title">{subj}</span>
                            <span className="teacher-name">{teacher}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn secondary small"
                        onClick={() => onOpenAllocationModal(cls)}
                      >
                        ⚙️ Edit Allocation
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Responsive Cards for mobile phones (<= 768px, Zero Horizontal Scroll) */}
        <div className="mobile-only mobile-cards-list" style={{ padding: '14px' }}>
          {filteredAllocations.map((cls) => {
            const subjectEntries = Array.isArray(cls.subjects)
              ? cls.subjects.map((s) => [s.subject, s.teacher])
              : Object.entries(cls.subjects || {});

            const formTeacherInitials = (cls.formTeacher || 'FT')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2);

            return (
              <div key={cls.id} className="mobile-card">
                <div className="mobile-card-head">
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', color: 'var(--ink)' }}>{cls.name}</h3>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                      Senior & Junior Arms
                    </div>
                  </div>
                  <span className="badge badge-primary">{cls.level}</span>
                </div>

                {/* Form Teacher Box */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(0, 0, 0, 0.22)',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'var(--primary-soft)',
                      color: 'var(--primary-text)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: '800',
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {formTeacherInitials}
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: '700' }}>
                      Form Teacher (Pastoral Oversight)
                    </div>
                    <strong style={{ fontSize: '13.5px', color: 'var(--ink)' }}>{cls.formTeacher}</strong>
                  </div>
                </div>

                {/* Subject Specialists Section */}
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--muted)',
                      marginBottom: '6px',
                    }}
                  >
                    Subject Specialists Assigned ({subjectEntries.length} Subjects)
                  </div>
                  <div className="mobile-subject-tags">
                    {subjectEntries.map(([subj, teacher]) => (
                      <div className="mobile-subject-pill" key={subj}>
                        <span className="subj-name">{subj}:</span>
                        <span className="subj-teacher">{teacher}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mobile-card-actions">
                  <button
                    className="btn secondary small"
                    style={{ width: '100%' }}
                    onClick={() => onOpenAllocationModal(cls)}
                  >
                    ⚙️ Edit Class Allocations
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Directory Cards */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <div className="panel-icon">👩‍🏫</div>
            <div>
              <h4>Faculty Members & Department Heads</h4>
              <p>Specialist educators delivering Cambridge and National curricula</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
          {allTeachersList.map((teacher) => (
            <div
              key={teacher.id}
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--indigo-900)',
                    color: 'var(--gold-400)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: '700',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {teacher.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h5 style={{ margin: 0, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {teacher.name}
                  </h5>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{teacher.role}</div>
                </div>
              </div>

              <div style={{ fontSize: '12px', display: 'grid', gap: '4px', color: 'var(--ink)' }}>
                <div><strong>Dept:</strong> {teacher.dept}</div>
                <div><strong>Qualification:</strong> {teacher.qualification}</div>
                <div><strong>Primary Subject:</strong> {teacher.primarySubject}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
