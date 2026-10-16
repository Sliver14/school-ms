'use client';
import { useState, useEffect } from 'react';

export default function SubjectAllocationModal({
  isOpen,
  onClose,
  classItem,
  allTeachersList,
  onSaveAllocation,
}) {
  const [formData, setFormData] = useState({
    formTeacher: '',
    subjects: {},
  });

  useEffect(() => {
    if (classItem) {
      let subjectsMap = {};
      if (Array.isArray(classItem.subjects)) {
        classItem.subjects.forEach((s) => {
          subjectsMap[s.subject] = s.teacher;
        });
      } else if (classItem.subjects && typeof classItem.subjects === 'object') {
        subjectsMap = { ...classItem.subjects };
      }

      setFormData({
        formTeacher: classItem.formTeacher || '',
        subjects: subjectsMap,
      });
    }
  }, [classItem]);

  if (!isOpen || !classItem) return null;

  const teacherProfiles = allTeachersList.map((t) =>
    typeof t === 'object' ? t : { id: t, name: t, dept: 'Faculty' }
  );

  const handleSubjectChange = (subject, teacherName) => {
    setFormData((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: teacherName,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveAllocation(classItem.id || classItem.key, formData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 'min(680px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Configure Subject Specialist Matrix</h3>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Class: <strong>{classItem.name}</strong> • Level: {classItem.level}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 'var(--radius)', marginBottom: '16px', border: '1px solid var(--line)' }}>
            <div className="field">
              <label>Designated Form / Homeroom Teacher (Pastoral Oversight)</label>
              <select
                value={formData.formTeacher}
                onChange={(e) => setFormData({ ...formData, formTeacher: e.target.value })}
                required
              >
                {teacherProfiles.map((t) => (
                  <option key={t.id || t.name} value={t.name}>
                    {t.name} ({t.dept || 'Faculty'})
                  </option>
                ))}
              </select>
              <small style={{ color: 'var(--muted)', fontSize: '11.5px', marginTop: '3px' }}>
                Responsible for class attendance, conduct grading, and parent communications.
              </small>
            </div>
          </div>

          <h4 style={{ margin: '14px 0 10px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)' }}>
            Specialist Subject Teachers Allocation
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '14px' }}>
            Assign different subject matter experts for each discipline in this class.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {Object.entries(formData.subjects).map(([subject, currentTeacher]) => (
              <div className="field" key={subject}>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{subject}</span>
                </label>
                <select
                  value={currentTeacher}
                  onChange={(e) => handleSubjectChange(subject, e.target.value)}
                >
                  {teacherProfiles.map((t) => (
                    <option key={t.id || t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="modal-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save Matrix Allocation →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
