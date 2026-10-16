'use client';

export default function FastAdmissionModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>2026/2027 Fast Admission Application</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
          Begin your ward's journey at Royal Heights. Complete this preliminary form for immediate entrance exam scheduling.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const applicant = {
              name: form.fullName.value,
              entryClass: form.entryClass.value,
              parentEmail: form.parentEmail.value,
            };
            onSubmit(applicant);
          }}
        >
          <div className="form-grid">
            <div className="field">
              <label>Applicant Full Name</label>
              <input type="text" name="fullName" required placeholder="e.g. Farouk Adeleke" defaultValue="Chidinma Okafor" />
            </div>
            <div className="field">
              <label>Intended Class</label>
              <select name="entryClass" defaultValue="JS 1">
                <option value="JS 1">Junior Secondary 1 (JS 1)</option>
                <option value="JS 2">Junior Secondary 2 (JS 2)</option>
                <option value="SS 1 Science">Senior Secondary 1 (SS 1 - Science)</option>
                <option value="SS 1 Arts">Senior Secondary 1 (SS 1 - Arts & Humanities)</option>
                <option value="SS 1 Commercial">Senior Secondary 1 (SS 1 - Commercial)</option>
                <option value="Cambridge A-Levels">Cambridge Advanced Level</option>
              </select>
            </div>
            <div className="field">
              <label>Date of Birth</label>
              <input type="date" name="dob" defaultValue="2013-05-14" />
            </div>
            <div className="field">
              <label>Gender</label>
              <select name="gender" defaultValue="Female">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="field">
              <label>Parent / Guardian Name</label>
              <input type="text" name="parentName" required placeholder="Dr. / Mr. / Mrs." defaultValue="Engr. Chidi Okafor" />
            </div>
            <div className="field">
              <label>Parent Phone Number</label>
              <input type="tel" name="parentPhone" required placeholder="+234 803 000 0000" defaultValue="+234 803 712 8890" />
            </div>
            <div className="field full">
              <label>Parent Email Address</label>
              <input type="email" name="parentEmail" required placeholder="parent@domain.com" defaultValue="chidi.okafor@primeeng.com" />
            </div>
            <div className="field full">
              <label>Previous School Attended</label>
              <input type="text" name="prevSchool" placeholder="School name and city" defaultValue="Corona Primary School, Victoria Island" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn gold">Submit Application & Book Exam →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
