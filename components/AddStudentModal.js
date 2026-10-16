'use client';

import { useState } from 'react';

export default function AddStudentModal({ isOpen, onClose, onAddStudent, existingStudents = [] }) {
  if (!isOpen) return null;

  const [parentName, setParentName] = useState('Mrs. T. Adeyemi');
  const [parentEmail, setParentEmail] = useState('adeyemi.t@gmail.com');
  const [createStudentAccount, setCreateStudentAccount] = useState(true);
  const [createParentAccount, setCreateParentAccount] = useState(true);

  // Real-time sibling match detection
  const matchedSibling = (existingStudents || []).find(
    (s) =>
      s.parent?.toLowerCase().includes(parentName.toLowerCase().trim()) ||
      (s.guardian && s.guardian.toLowerCase().includes(parentName.toLowerCase().trim()))
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 'min(680px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Enrol New Scholar & Provision Accounts</h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              Student ID generation, parent sibling linkage & Bcrypt credential setup
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const newStudent = {
              name: form.name.value,
              class: form.studentClass.value,
              parent: parentName,
              guardian: parentName,
              parentEmail: parentEmail,
              phone: form.phone.value,
              status: 'Active',
              feeStatus: 'Paid',
              house: form.house.value,
              boardingStatus: form.boardingStatus.value,
            };
            onAddStudent(newStudent);
          }}
        >
          <div className="form-grid">
            <div className="field">
              <label>Scholar Full Name *</label>
              <input type="text" name="name" required placeholder="First and Last name" defaultValue="Tayo Adeyemi" />
            </div>

            <div className="field">
              <label>Class Assignment *</label>
              <select name="studentClass" defaultValue="JSS1">
                <option value="JSS1">JSS 1 (Junior 1)</option>
                <option value="JSS2">JSS 2 (Junior 2)</option>
                <option value="JSS3">JSS 3 (Junior 3)</option>
                <option value="SS1">SS 1 (Senior 1)</option>
                <option value="SS2">SS 2 (Senior 2)</option>
                <option value="SS3">SS 3 (Senior 3)</option>
              </select>
            </div>

            <div className="field">
              <label>School House</label>
              <select name="house" defaultValue="Sapphire House">
                <option value="Sapphire House">Sapphire House</option>
                <option value="Emerald House">Emerald House</option>
                <option value="Ruby House">Ruby House</option>
                <option value="Topaz House">Topaz House</option>
              </select>
            </div>

            <div className="field">
              <label>Boarding / Day Status</label>
              <select name="boardingStatus" defaultValue="Day">
                <option value="Day">Day Scholar</option>
                <option value="Boarder">Full Boarder</option>
              </select>
            </div>

            <div className="field">
              <label>Parent / Guardian Name *</label>
              <input
                type="text"
                name="parent"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Parent Name"
              />
            </div>

            <div className="field">
              <label>Parent Email Address *</label>
              <input
                type="email"
                name="parentEmail"
                required
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@domain.com"
              />
            </div>

            <div className="field full">
              <label>Parent Emergency Phone *</label>
              <input type="tel" name="phone" required placeholder="Phone number" defaultValue="+234 803 712 8890" />
            </div>
          </div>

          {/* Sibling Linkage Badge */}
          {matchedSibling && (
            <div
              style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#93c5fd',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🔗</span>
              <span>
                <strong>Sibling Match Detected:</strong> This scholar will be linked to existing Parent Account ({matchedSibling.parent} · sibling of {matchedSibling.name}).
              </span>
            </div>
          )}

          {/* Account Provisioning Options */}
          <div style={{ marginTop: '16px', background: 'var(--surface2)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold-600)', fontWeight: '700', marginBottom: '8px' }}>
              Automated Workstation Account Provisioning
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', marginBottom: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={createStudentAccount}
                onChange={(e) => setCreateStudentAccount(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <span>Generate Student Portal Login using Admission Number (<code>RH/2026/xxx</code>)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={createParentAccount}
                onChange={(e) => setCreateParentAccount(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <span>Provision or link Parent Portal Account with Bcrypt-hashed password</span>
            </label>
          </div>

          <div className="modal-actions" style={{ marginTop: '18px' }}>
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">Enrol Scholar & Issue Credentials →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
