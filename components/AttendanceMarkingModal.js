'use client';

import { useState } from 'react';

export default function AttendanceMarkingModal({
  isOpen,
  onClose,
  students,
  onAttendanceSaved,
  showToast,
}) {
  if (!isOpen) return null;

  const [selectedClass, setSelectedClass] = useState('SS2');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [period, setPeriod] = useState('Morning Roll Call');
  const [isSaving, setIsSaving] = useState(false);

  // Filter students for the selected class
  const classStudents = students.filter(
    (s) => s.class === selectedClass || s.class.startsWith(selectedClass)
  );

  // Local attendance state mapping: studentId -> { status, remark }
  const [records, setRecords] = useState(() => {
    const init = {};
    classStudents.forEach((s) => {
      init[s.id] = { status: 'Present', remark: 'On Time' };
    });
    return init;
  });

  const handleStatusChange = (studentId, status) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        remark: status === 'Present' ? 'On Time' : status === 'Late' ? 'Late Arrival' : status,
      },
    }));
  };

  const handleRemarkChange = (studentId, remark) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remark,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    classStudents.forEach((s) => {
      updated[s.id] = { status: 'Present', remark: 'On Time' };
    });
    setRecords(updated);
    showToast(`Marked all ${classStudents.length} scholars in ${selectedClass} as Present`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      class: selectedClass,
      date: selectedDate,
      period,
      status: records[s.id]?.status || 'Present',
      remark: records[s.id]?.remark || 'On Time',
    }));

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✅ Roll call logged for ${payload.length} students in ${selectedClass}!`);
        onAttendanceSaved(data.records);
        onClose();
      } else {
        showToast(data.error || 'Failed to save attendance');
      }
    } catch (err) {
      showToast('Network error saving attendance');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 'min(780px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Daily Attendance Register & Roll Call</h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              Biometric check-in and homeroom attendance log
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Controls Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px', background: 'var(--surface2)', padding: '14px', borderRadius: 'var(--radius)' }}>
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Class Arm</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '7px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                <option value="JSS1">Junior Secondary 1 (JSS1)</option>
                <option value="JSS2">Junior Secondary 2 (JSS2)</option>
                <option value="JSS3">Junior Secondary 3 (JSS3)</option>
                <option value="SS1">Senior Secondary 1 (SS1)</option>
                <option value="SS2">Senior Secondary 2 (SS2)</option>
                <option value="SS3">Senior Secondary 3 (SS3)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '7px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Session / Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '7px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                <option value="Morning Roll Call">Morning Roll Call (08:00 AM)</option>
                <option value="Afternoon Session">Afternoon Session (01:30 PM)</option>
                <option value="Laboratory Roll Call">Laboratory Practical Session</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              Scholars Roster ({classStudents.length} registered)
            </span>
            <button
              type="button"
              className="btn secondary small"
              onClick={handleMarkAllPresent}
            >
              ⚡ Mark All Present
            </button>
          </div>

          {/* Students Roll Call Table */}
          <div style={{ maxHeight: '340px', overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
            <table className="data-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((s) => {
                  const currentStatus = records[s.id]?.status || 'Present';
                  const currentRemark = records[s.id]?.remark || 'On Time';
                  return (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td><small>{s.id}</small></td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {['Present', 'Late', 'Absent', 'Excused'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(s.id, st)}
                              style={{
                                padding: '3px 8px',
                                fontSize: '11px',
                                borderRadius: '6px',
                                border: '1px solid var(--line)',
                                background:
                                  currentStatus === st
                                    ? st === 'Present'
                                      ? '#10b981'
                                      : st === 'Late'
                                      ? '#f59e0b'
                                      : st === 'Absent'
                                      ? '#ef4444'
                                      : '#6366f1'
                                    : 'transparent',
                                color: currentStatus === st ? '#ffffff' : 'var(--muted)',
                                cursor: 'pointer',
                                fontWeight: currentStatus === st ? '700' : '400',
                              }}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={currentRemark}
                          onChange={(e) => handleRemarkChange(s.id, e.target.value)}
                          placeholder="Note..."
                          style={{
                            fontSize: '11.5px',
                            padding: '4px 8px',
                            borderRadius: '5px',
                            border: '1px solid var(--line)',
                            background: 'var(--surface)',
                            color: 'var(--ink)',
                            width: '100%',
                          }}
                        />
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
              {isSaving ? 'Logging Roll Call...' : '💾 Save Attendance Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
