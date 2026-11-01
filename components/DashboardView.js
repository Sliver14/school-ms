'use client';

export default function DashboardView({
  role,
  parentChildren,
  activeChildIndex,
  onSelectChild,
  onOpenReportCard,
  onOpenFastAdmission,
  onNavigate,
  unlockedCards = {},
  showToast,
}) {
  const activeChild =
    activeChildIndex >= 0 ? parentChildren[activeChildIndex] : parentChildren[0];
  const childId = activeChild?.id || activeChild?.admissionNo;
  const isChildUnlocked = role === 'admin' || role === 'teacher' || role === 'bursar' || !!unlockedCards[childId];

  const getChildFormTeacher = (c) => c?.formTeacher || c?.classTeacher || 'Mr. Samuel Okoro';
  const getChildGPA = (c) => c?.gpa || (c?.average ? (c.average / 25).toFixed(2) : '3.88');
  const getChildAvg = (c) => c?.avgScore || c?.average || '82.5';
  const getChildRank = (c) => c?.rank || '4th of 32';
  const getChildAttendance = (c) => {
    if (!c?.attendance) return '96.4%';
    return c.attendance.toString().includes('%') ? c.attendance : `${c.attendance}%`;
  };
  const getChildFeeStatus = (c) => c?.feeStatus || (c?.outstandingFee === 0 ? 'Cleared' : 'Cleared');

  const rawActiveScores = activeChild?.scores || activeChild?.subjects || [];
  const normalizedActiveScores = rawActiveScores.map((sc) => {
    const total = sc.total !== undefined ? sc.total : (sc.ca1 || 0) + (sc.ca2 || 0) + (sc.exam || 0);
    const grade = sc.grade || (total >= 85 ? 'A*' : total >= 75 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : 'F');
    return {
      ...sc,
      total,
      grade,
    };
  });

  // PARENT DASHBOARD: ALL WARDS OVERVIEW
  if (role === 'parent' && activeChildIndex === -1) {
    return (
      <div>
        <div className="parent-banner">
          <h3>Adeleke Family Academic Overview</h3>
          <p>
            Summary metrics across all your 2 enrolled children at Royal Heights Secondary School.
          </p>
        </div>

        <div className="family-summary-grid">
          {parentChildren.map((child, idx) => (
            <div className="child-card-summary" key={child.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{child.name}</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    {child.class} • Form Teacher: <strong>{getChildFormTeacher(child)}</strong>
                  </div>
                </div>
                <span className="badge badge-primary">{child.id}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '10px', background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Term GPA</div>
                  <strong style={{ fontSize: '15px', color: 'var(--gold-600)' }}>{getChildGPA(child)} / 4.0</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Attendance</div>
                  <strong style={{ fontSize: '15px' }}>{getChildAttendance(child)}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Class Rank</div>
                  <strong style={{ fontSize: '15px' }}>{getChildRank(child)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--muted)' }}>Fee Status:</span>
                <span className={`badge ${getChildFeeStatus(child) === 'Cleared' ? 'badge-success' : 'badge-gold'}`}>
                  {getChildFeeStatus(child) === 'Cleared' ? '✓ Cleared' : 'Pending Verification'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn primary small"
                  style={{ flex: 1 }}
                  onClick={() => onSelectChild(idx)}
                >
                  Open {child.name.split(' ')[0]}'s Portal
                </button>
                <button
                  className="btn secondary small"
                  onClick={() => {
                    onSelectChild(idx);
                    onOpenReportCard(child);
                  }}
                >
                  📜 Report Card
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Family Financial and Communication status */}
        <div className="section-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">💳</div>
                <div>
                  <h4>Combined Tuition & Levies Summary</h4>
                  <p>2025/2026 Academic Session</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                <span>Daniel Adeleke (SS 2A Tuition & Boarding)</span>
                <strong style={{ color: '#10b981' }}>₦2,450,000 (Paid ✓)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                <span>Kemi Adeleke (JS 1B Tuition & Day Pass)</span>
                <strong style={{ color: '#10b981' }}>₦1,850,000 (Paid ✓)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px' }}>
                <strong>Total Outstanding Balance</strong>
                <strong style={{ color: '#10b981' }}>₦0.00 (All Clear)</strong>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">📢</div>
                <div>
                  <h4>Parent Notices & PTA Broadcasts</h4>
                  <p>Important updates from the school management</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '12px', fontSize: '13px' }}>
              <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <strong>📅 Annual Inter-House Athletics Championship:</strong> Holding this Friday at the main sports pavilion. All parents are warmly invited.
              </div>
              <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <strong>🧪 Cambridge Mock Exams (SS 2):</strong> Mock timetable published. Daniel has 4 papers scheduled next week.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PARENT DASHBOARD: SINGLE CHILD FOCUSED VIEW
  if (role === 'parent') {
    return (
      <div>
        {/* Child Hero Banner */}
        <div className="parent-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0 }}>{activeChild.name}</h3>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  background: isChildUnlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: isChildUnlocked ? '#10b981' : 'var(--yellow)',
                  border: isChildUnlocked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                  fontWeight: 600,
                }}
              >
                {isChildUnlocked ? '✓ Scratch Card Verified' : '🔒 Card Required'}
              </span>
            </div>
            <p style={{ marginTop: '4px' }}>
              Class: <strong>{activeChild.class}</strong> • Form Teacher: <strong>{getChildFormTeacher(activeChild)}</strong> • Admission ID: <strong>{activeChild.id}</strong>
            </p>
          </div>
          <button className={`btn ${isChildUnlocked ? 'gold' : 'secondary'}`} onClick={() => onOpenReportCard(activeChild)}>
            {isChildUnlocked ? '📜 Download Term Report Card' : '🔓 Unlock Report Card (Card PIN)'}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-head">Term Cumulative GPA</div>
            <div className="stat-value">{getChildGPA(activeChild)} / 4.00</div>
            <div className="stat-foot">Top percentile ranking</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Subject Average Score</div>
            <div className="stat-value">{getChildAvg(activeChild)}%</div>
            <div className="stat-foot">Continuous assessment & exam</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Class Position Rank</div>
            <div className="stat-value">{getChildRank(activeChild)}</div>
            <div className="stat-foot">Homeroom standing</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Term Attendance Rate</div>
            <div className="stat-value">{getChildAttendance(activeChild)}</div>
            <div className="stat-foot">Consistent punctuality</div>
          </div>
        </div>

        {/* Detailed Panels */}
        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">📚</div>
                <div>
                  <h4>Academic Progress in Current Subjects</h4>
                  <p>Continuous Assessment (CA) and mid-term exam performance</p>
                </div>
              </div>
            </div>
            {/* DESKTOP VIEW: Academic Progress Table (>= 769px) */}
            <div className="desktop-only table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>CA 1 (20)</th>
                    <th>CA 2 (20)</th>
                    <th>Exam (60)</th>
                    <th>Total</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {normalizedActiveScores.map((sc, i) => (
                    <tr key={i}>
                      <td><strong>{sc.subject}</strong></td>
                      <td>{sc.ca1}</td>
                      <td>{sc.ca2}</td>
                      <td>{sc.exam}</td>
                      <td><strong>{sc.total}%</strong></td>
                      <td>
                        <span className={`badge ${sc.grade.startsWith('A') ? 'badge-success' : 'badge-primary'}`}>
                          {sc.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW: Academic Progress Cards (<= 768px, Zero Horizontal Scroll) */}
            <div className="mobile-only mobile-cards-list" style={{ padding: '4px 0 10px' }}>
              {normalizedActiveScores.map((sc, i) => (
                <div key={i} className="mobile-card" style={{ padding: '12px 14px' }}>
                  <div className="mobile-card-head">
                    <h4 className="mobile-card-title">{sc.subject}</h4>
                    <span className={`badge ${sc.grade.startsWith('A') ? 'badge-success' : 'badge-primary'}`}>
                      Grade {sc.grade}
                    </span>
                  </div>
                  <div className="mobile-score-chips">
                    <div>
                      <div className="mobile-score-chip-label">CA 1</div>
                      <div className="mobile-score-chip-val">{sc.ca1}</div>
                    </div>
                    <div>
                      <div className="mobile-score-chip-label">CA 2</div>
                      <div className="mobile-score-chip-val">{sc.ca2}</div>
                    </div>
                    <div>
                      <div className="mobile-score-chip-label">Exam</div>
                      <div className="mobile-score-chip-val">{sc.exam}</div>
                    </div>
                    <div style={{ background: 'rgba(255, 194, 26, 0.12)', borderRadius: '6px' }}>
                      <div className="mobile-score-chip-label" style={{ color: 'var(--yellow)' }}>Total</div>
                      <div className="mobile-score-chip-val" style={{ color: 'var(--yellow)' }}>{sc.total}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">📝</div>
                <div>
                  <h4>Form Teacher's Pastoral Notes</h4>
                  <p>By {getChildFormTeacher(activeChild)}</p>
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 'var(--radius)', fontSize: '13px', lineHeight: '1.7', border: '1px solid var(--line)' }}>
              <p style={{ margin: 0 }}>
                "{activeChild.name} continues to demonstrate high academic discipline and active participation in class discussions. In practical laboratory work, {activeChild.name.split(' ')[0]} displays commendable attention to safety protocols and analytical deduction."
              </p>
              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-gold">Conduct: Excellent</span>
                <button
                  className="btn secondary small"
                  onClick={() => showToast(`Message sent to ${getChildFormTeacher(activeChild)}`)}
                >
                  Reply to Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STUDENT DASHBOARD
  if (role === 'student') {
    return (
      <div>
        <div className="page-head">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0 }}>Welcome back, Daniel! 🎒</h2>
              <span
                style={{
                  fontSize: '11.5px',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: isChildUnlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: isChildUnlocked ? '#10b981' : 'var(--yellow)',
                  border: isChildUnlocked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                  fontWeight: 600,
                }}
              >
                {isChildUnlocked ? '✓ Scratch Card Verified' : '🔒 Card Required'}
              </span>
            </div>
            <p style={{ marginTop: '4px' }}>Senior Secondary 2A (Science) • House: Windsor • Term 1</p>
          </div>
          <button className={`btn ${isChildUnlocked ? 'gold' : 'secondary'}`} onClick={() => onOpenReportCard(activeChild)}>
            {isChildUnlocked ? '📜 View My Term Report' : '🔓 Unlock Term Report Card'}
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-head">Term GPA</div>
            <div className="stat-value">3.92</div>
            <div className="stat-foot">Top 5% of class stream</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Class Rank</div>
            <div className="stat-value">3rd</div>
            <div className="stat-foot">Out of 34 scholars in SS2A</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Attendance Standing</div>
            <div className="stat-value">98.4%</div>
            <div className="stat-foot">47 of 50 school days</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Accounts Clearance</div>
            <div className="stat-value" style={{ fontSize: '22px', paddingTop: '8px' }}>Cleared</div>
            <div className="stat-foot">Eligible for examinations</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">📅</div>
                <div>
                  <h4>Today's Academic Schedule</h4>
                  <p>Thursday, 15 October 2026</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                { time: '08:00 - 09:20', subject: 'Further Mathematics', venue: 'Lab 204', teacher: 'Mr. David Okonkwo' },
                { time: '09:30 - 10:50', subject: 'Chemistry Practicals', venue: 'Chem Lab A', teacher: 'Dr. Robert Cole' },
                { time: '11:10 - 12:30', subject: 'English Language', venue: 'Room 12B', teacher: 'Mrs. Sarah Adebayo' },
                { time: '13:30 - 14:50', subject: 'Robotics & AI', venue: 'STEM Innovation Hub', teacher: 'Mr. Femi Alabi' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'var(--surface2)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '4px solid var(--primary)',
                  }}
                >
                  <div>
                    <strong>{s.subject}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {s.teacher} • {s.venue}
                    </div>
                  </div>
                  <span className="badge badge-primary">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">📝</div>
                <div>
                  <h4>Upcoming Submissions</h4>
                  <p>Assignments and laboratory write-ups due</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <strong>Physics: Wave Optics Problem Set</strong>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Due Tomorrow at 14:00 • Submit in Portal</div>
              </div>
              <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <strong>Biology: Genetics & Punnett Square Analysis</strong>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Due Monday, 19 October • Lab Notebook</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TEACHER DASHBOARD
  if (role === 'teacher') {
    return (
      <div>
        <div className="page-head">
          <div>
            <h2>Faculty Portal • Dr. Robert Cole 👩‍🏫</h2>
            <p>Head of Science Department • Form Teacher: Senior Secondary 2A</p>
          </div>
          <button className="btn primary" onClick={() => onNavigate('staff')}>
            🏛️ View Subject Allocation Matrix
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-head">Students in Homeroom</div>
            <div className="stat-value">32</div>
            <div className="stat-foot">Senior Secondary 2A</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Classes Taught</div>
            <div className="stat-value">4</div>
            <div className="stat-foot">Chemistry & Biology Streams</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Class Attendance</div>
            <div className="stat-value">97.8%</div>
            <div className="stat-foot">Weekly class average</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Gradebook Status</div>
            <div className="stat-value" style={{ color: '#10b981' }}>100%</div>
            <div className="stat-foot">Term 1 CA grades submitted</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">🧪</div>
                <div>
                  <h4>My Assigned Teaching Schedule</h4>
                  <p>Specialist classes allocated to Dr. Robert Cole</p>
                </div>
              </div>
            </div>
            {/* DESKTOP VIEW: Schedule Table (>= 769px) */}
            <div className="desktop-only table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Role in Class</th>
                    <th>Students</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>SS 2A</strong></td>
                    <td>Chemistry</td>
                    <td><span className="badge badge-gold">Form Teacher + Specialist</span></td>
                    <td>32</td>
                    <td><button className="btn small secondary" onClick={() => onNavigate('academics')}>Enter CA</button></td>
                  </tr>
                  <tr>
                    <td><strong>SS 2B</strong></td>
                    <td>Chemistry</td>
                    <td><span className="badge badge-primary">Subject Specialist</span></td>
                    <td>30</td>
                    <td><button className="btn small secondary" onClick={() => onNavigate('academics')}>Enter CA</button></td>
                  </tr>
                  <tr>
                    <td><strong>SS 3 Science</strong></td>
                    <td>Advanced Chemistry</td>
                    <td><span className="badge badge-primary">Subject Specialist</span></td>
                    <td>28</td>
                    <td><button className="btn small secondary" onClick={() => onNavigate('academics')}>Enter CA</button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW: Schedule Cards (<= 768px, Zero Horizontal Scroll) */}
            <div className="mobile-only mobile-cards-list" style={{ padding: '4px 0 10px' }}>
              <div className="mobile-card">
                <div className="mobile-card-head">
                  <div>
                    <h4 className="mobile-card-title">SS 2A · Chemistry</h4>
                    <div className="mobile-card-sub">32 Enrolled Scholars</div>
                  </div>
                  <span className="badge badge-gold">Form Teacher + Specialist</span>
                </div>
                <div className="mobile-card-actions">
                  <button className="btn small secondary" style={{ width: '100%' }} onClick={() => onNavigate('academics')}>
                    Enter CA & Exam Scores →
                  </button>
                </div>
              </div>

              <div className="mobile-card">
                <div className="mobile-card-head">
                  <div>
                    <h4 className="mobile-card-title">SS 2B · Chemistry</h4>
                    <div className="mobile-card-sub">30 Enrolled Scholars</div>
                  </div>
                  <span className="badge badge-primary">Subject Specialist</span>
                </div>
                <div className="mobile-card-actions">
                  <button className="btn small secondary" style={{ width: '100%' }} onClick={() => onNavigate('academics')}>
                    Enter CA & Exam Scores →
                  </button>
                </div>
              </div>

              <div className="mobile-card">
                <div className="mobile-card-head">
                  <div>
                    <h4 className="mobile-card-title">SS 3 Science · Adv. Chemistry</h4>
                    <div className="mobile-card-sub">28 Enrolled Scholars</div>
                  </div>
                  <span className="badge badge-primary">Subject Specialist</span>
                </div>
                <div className="mobile-card-actions">
                  <button className="btn small secondary" style={{ width: '100%' }} onClick={() => onNavigate('academics')}>
                    Enter CA & Exam Scores →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">📢</div>
                <div>
                  <h4>Academic Council Notices</h4>
                  <p>Faculty updates</p>
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--surface2)', padding: '14px', borderRadius: 'var(--radius)', fontSize: '13px' }}>
              <strong>Mid-Term Grade Moderation:</strong> All science practical assessments must be validated by Friday. Moderation committee convenes in Conference Room B.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // BURSAR DASHBOARD
  if (role === 'bursar') {
    return (
      <div>
        <div className="page-head">
          <div>
            <h2>Bursary & Accounts Operations 💳</h2>
            <p>Financial ledger, tuition reconciliation, and revenue auditing</p>
          </div>
          <button className="btn primary" onClick={() => showToast('Dispatched automated payment reminder to 14 guardians')}>
            📧 Send Outstanding Reminders
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-head">Total Fees Collected</div>
            <div className="stat-value">₦48.6M</div>
            <div className="stat-foot">2026/2027 Term 1 Inflow</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Pending / Outstanding Fees</div>
            <div className="stat-value">₦7.4M</div>
            <div className="stat-foot">Due 30 October 2026</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Tuition Recovery Rate</div>
            <div className="stat-value" style={{ color: '#10b981' }}>86.8%</div>
            <div className="stat-foot">Reconciled via bank & Paystack</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Accounts Clearance</div>
            <div className="stat-value">1,114</div>
            <div className="stat-foot">Scholars fully cleared for exams</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">🧾</div>
                <div>
                  <h4>Recent Financial Transactions</h4>
                  <p>Live bank and portal payments</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <strong>₦2,450,000</strong> — Daniel Adeleke (SS 2A)
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Dr. & Mrs. Adeleke • Ref: #REC-9941</div>
                </div>
                <span className="badge badge-success">Verified ✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <strong>₦1,850,000</strong> — Kemi Adeleke (JS 1B)
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Dr. & Mrs. Adeleke • Ref: #REC-9872</div>
                </div>
                <span className="badge badge-success">Verified ✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <strong>₦2,450,000</strong> — Tobi Balogun (SS 2A)
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Chief O. Balogun • Ref: #REC-9810</div>
                </div>
                <span className="badge badge-success">Verified ✓</span>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">📊</div>
                <div>
                  <h4>Collection Revenue Breakdown</h4>
                  <p>Term 1 fee components</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Tuition & Laboratory Levies</span>
                  <strong>₦34,200,000 (70%)</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--surface3)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '70%', height: '100%', background: 'var(--primary)' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Boarding & Accommodation</span>
                  <strong>₦11,400,000 (23%)</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--surface3)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '23%', height: '100%', background: 'var(--gold-500)' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Extracurricular & Technology Levies</span>
                  <strong>₦3,000,000 (7%)</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--surface3)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '7%', height: '100%', background: '#10b981' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD (DEFAULT)
  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Executive Administration & Governance 🏛️</h2>
          <p>Real-time campus metrics, faculty allocations, and institutional oversight</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn secondary" onClick={() => onNavigate('staff')}>
            🏛️ Staff & Subject Matrix
          </button>
          <button className="btn gold" onClick={onOpenFastAdmission}>
            + Fast Admission
          </button>
        </div>
      </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-head">Total Enrolled Scholars</div>
            <div className="stat-value">1,280</div>
            <div className="stat-foot">Junior & Senior Secondary Arms</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Certified Teaching Faculty</div>
            <div className="stat-value">86</div>
            <div className="stat-foot">Post-graduate specialists</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Academic Pass Distinction</div>
            <div className="stat-value" style={{ color: '#10b981' }}>99.4%</div>
            <div className="stat-foot">WAEC & Cambridge IGCSE 2025</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Campus Attendance Today</div>
            <div className="stat-value">97.2%</div>
            <div className="stat-foot">Morning biometric register</div>
          </div>
        </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <div className="panel-icon">📝</div>
              <div>
                <h4>2026/2027 Admissions Pipeline</h4>
                <p>Real-time candidate registrations</p>
              </div>
            </div>
            <button className="btn secondary small" onClick={() => onNavigate('admissions')}>
              View All Pipeline →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary-text)' }}>148</div>
              <small style={{ color: 'var(--muted)' }}>Applications</small>
            </div>
            <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--gold-600)' }}>94</div>
              <small style={{ color: 'var(--muted)' }}>Exam Booked</small>
            </div>
            <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>52</div>
              <small style={{ color: 'var(--muted)' }}>Accepted</small>
            </div>
            <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)' }}>28</div>
              <small style={{ color: 'var(--muted)' }}>Enrolled</small>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <div className="panel-icon">👩‍🏫</div>
              <div>
                <h4>Faculty Subject Allocations</h4>
                <p>Class Arm subject coverage status</p>
              </div>
            </div>
            <button className="btn secondary small" onClick={() => onNavigate('staff')}>
              Manage Matrix →
            </button>
          </div>
          <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
              <span>Senior Secondary 2A</span>
              <span className="badge badge-success">7 / 7 Specialists Assigned</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
              <span>Senior Secondary 2B</span>
              <span className="badge badge-success">7 / 7 Specialists Assigned</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
              <span>Junior Secondary 1B</span>
              <span className="badge badge-success">7 / 7 Specialists Assigned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
