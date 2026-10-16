'use client';
import { useState, useMemo } from 'react';
import {
  schoolClasses,
  academicTerms,
  feeCategories,
  classEnrollments,
  paymentsList,
} from '../data/schoolData';

export default function FeesView({
  role = 'admin',
  feeSchedules = [],
  onOpenAddFee,
  onOpenEditFee,
  onDeleteFee,
  onOpenReceipt,
  onOpenPaymentModal,
  showToast,
  parentChildren = [],
  activeChildIndex = 0,
}) {
  const isParent = role === 'parent';
  const isStudent = role === 'student';
  const isAdminOrBursar = role === 'admin' || role === 'bursar';

  // Sub-tab state for Admin & Bursar: 'schedules' | 'ledger'
  const [activeSubTab, setActiveSubTab] = useState('schedules');

  // Filter state for Fee Schedules Matrix
  const [selectedClass, setSelectedClass] = useState('SS2');
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Category badge styling helper
  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'Tuition': return 'cat-badge cat-tuition';
      case 'Development': return 'cat-badge cat-development';
      case 'Laboratory & STEM': return 'cat-badge cat-stem';
      case 'PTA & Welfare': return 'cat-badge cat-pta';
      case 'Examination': return 'cat-badge cat-exam';
      case 'Custom / Special Levy': return 'cat-badge cat-custom';
      default: return 'cat-badge cat-custom';
    }
  };

  // Filtered Fee Items
  const filteredFees = useMemo(() => {
    return feeSchedules.filter((fee) => {
      // Class filter
      if (selectedClass !== 'all') {
        if (fee.class !== selectedClass && fee.class !== 'All Classes') {
          return false;
        }
      }
      // Term filter
      if (selectedTerm !== 'all') {
        if (fee.term !== selectedTerm && fee.term !== 'All Terms') {
          return false;
        }
      }
      // Category filter
      if (selectedCategory !== 'all' && fee.category !== selectedCategory) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all') {
        if (selectedType === 'custom') {
          if (!fee.isCustom && fee.category !== 'Custom / Special Levy') return false;
        } else if (fee.type !== selectedType) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = fee.title?.toLowerCase().includes(q);
        const descMatch = fee.description?.toLowerCase().includes(q);
        const idMatch = fee.id?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !idMatch) {
          return false;
        }
      }
      return true;
    });
  }, [feeSchedules, selectedClass, selectedTerm, selectedCategory, selectedType, searchQuery]);

  // Aggregate Metrics for Selected Class & Term
  const metrics = useMemo(() => {
    const mandatoryFees = filteredFees.filter((f) => f.type === 'Mandatory');
    const optionalFees = filteredFees.filter((f) => f.type === 'Optional');

    const totalMandatory = mandatoryFees.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalOptional = optionalFees.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const enrollment = selectedClass !== 'all' ? (classEnrollments[selectedClass] || 60) : 366;
    const projectedRevenue = totalMandatory * enrollment;

    return {
      mandatoryCount: mandatoryFees.length,
      optionalCount: optionalFees.length,
      totalMandatory,
      totalOptional,
      enrollment,
      projectedRevenue,
    };
  }, [filteredFees, selectedClass]);

  // Active child for Parent/Student views
  const currentChild = activeChildIndex >= 0 && parentChildren[activeChildIndex]
    ? parentChildren[activeChildIndex]
    : parentChildren[0];

  return (
    <div>
      {/* Page Heading */}
      <div className="page-head">
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gold-600)', fontWeight: '700', marginBottom: '2px' }}>
            {isParent ? 'FINANCIAL DESK' : isStudent ? 'STUDENT BILLING DESK' : 'BURSARY & TARIFF GOVERNANCE'}
          </div>
          <h2>
            {isParent
              ? 'Family Fee Statements & Receipts'
              : isStudent
              ? 'My Fee Statement & Clearance'
              : 'School Fees & Tariffs Management'}
          </h2>
          <p>
            {isParent
              ? 'Consolidated tuition, levies, and payment clearance for all enrolled wards.'
              : isStudent
              ? 'Itemized tuition schedule, payment verification, and exam clearance slip.'
              : 'Add, modify, and manage school fees, levies, and ancillary payments per class and term.'}
          </p>
        </div>

        {isAdminOrBursar && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn secondary"
              onClick={() => onOpenAddFee(selectedClass, selectedTerm, false)}
            >
              ＋ Add Class Fee
            </button>
            <button
              className="btn gold"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)', color: '#fff', borderColor: 'transparent', boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)' }}
              onClick={() => onOpenAddFee(selectedClass, selectedTerm, true)}
            >
              ✨ + Create Custom Fee
            </button>
          </div>
        )}

        {isParent && (
          <button
            className="btn primary"
            onClick={() => onOpenPaymentModal && onOpenPaymentModal(currentChild)}
          >
            💳 Settle Outstanding Balance
          </button>
        )}
        {isAdminOrBursar && (
          <button
            className="btn secondary"
            onClick={() => onOpenPaymentModal && onOpenPaymentModal(null)}
          >
            💳 + Process Payment
          </button>
        )}
      </div>

      {/* Admin / Bursar Sub-Tabs Switcher */}
      {isAdminOrBursar && (
        <div className="sub-tabs-container">
          <button
            className={`sub-tab-btn ${activeSubTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('schedules')}
          >
            <span>🏷️ Class & Term Fee Schedules</span>
            <span className="badge badge-primary">{feeSchedules.length}</span>
          </button>
          <button
            className={`sub-tab-btn ${activeSubTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('ledger')}
          >
            <span>🧾 Payment Transactions & Receipts</span>
            <span className="badge badge-gold">{paymentsList.length}</span>
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------
          1. ADMIN / BURSAR: CLASS & TERM FEE SCHEDULES MATRIX
          ------------------------------------------------------------- */}
      {isAdminOrBursar && activeSubTab === 'schedules' && (
        <div>
          {/* Class Selector Filter Chips */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', marginBottom: '8px' }}>
              Select Class Level
            </div>
            <div className="filter-chips-bar">
              <button
                className={`filter-chip ${selectedClass === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedClass('all')}
              >
                All Classes (Whole School)
              </button>
              {schoolClasses.map((cls) => (
                <button
                  key={cls}
                  className={`filter-chip ${selectedClass === cls ? 'active' : ''}`}
                  onClick={() => setSelectedClass(cls)}
                >
                  {cls} Secondary
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius)',
              padding: '16px',
              marginBottom: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              alignItems: 'end',
            }}
          >
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                Academic Term
              </label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <option value="all">All Terms (Full Session)</option>
                {academicTerms.map((t) => (
                  <option key={t} value={t}>{t} (2026/2027)</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                Fee Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {feeCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                Requirement Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Requirements</option>
                <option value="Mandatory">Mandatory Only</option>
                <option value="Optional">Optional Only</option>
                <option value="custom">✨ Custom Fees Only</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                Search Fees
              </label>
              <input
                type="text"
                placeholder="Search by title, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Real-time KPI Stats Cards for the Selected Class & Term */}
          <div className="stats" style={{ marginBottom: '22px' }}>
            <div className="stat-card">
              <div className="stat-head">
                {selectedClass !== 'all' ? `${selectedClass} Mandatory Fees` : 'Mandatory Total'}
              </div>
              <div className="stat-value" style={{ color: 'var(--primary-text)' }}>
                ₦{metrics.totalMandatory.toLocaleString('en-NG')}
              </div>
              <div className="stat-foot">
                {metrics.mandatoryCount} compulsory line items per student ({selectedTerm})
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-head">Optional Ancillary Add-ons</div>
              <div className="stat-value" style={{ color: 'var(--gold-600)' }}>
                ₦{metrics.totalOptional.toLocaleString('en-NG')}
              </div>
              <div className="stat-foot">
                {metrics.optionalCount} elective services (transport, clubs, mocks)
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-head">Projected Class Revenue</div>
              <div className="stat-value" style={{ color: '#10b981' }}>
                ₦{metrics.projectedRevenue.toLocaleString('en-NG')}
              </div>
              <div className="stat-foot">
                Based on {metrics.enrollment} enrolled scholars in {selectedClass}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-head">Class Billing Status</div>
              <div className="stat-value" style={{ fontSize: '22px', paddingTop: '6px' }}>
                Active & Gazette
              </div>
              <div className="stat-foot">Session 2026/2027 · Approved</div>
            </div>
          </div>

          {/* Fees Schedule Table */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">💳</div>
                <div>
                  <h4>
                    {selectedClass !== 'all' ? `${selectedClass} Secondary` : 'Whole School'} Fee Tariff Schedule
                    {selectedTerm !== 'all' ? ` · ${selectedTerm}` : ''}
                  </h4>
                  <p>
                    Showing {filteredFees.length} fee items configured for {selectedClass} in {selectedTerm}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className="btn small secondary"
                  onClick={() => onOpenAddFee(selectedClass, selectedTerm, false)}
                >
                  ＋ Add Class Fee
                </button>
                <button
                  className="btn small gold"
                  style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)', color: '#fff', borderColor: 'transparent' }}
                  onClick={() => onOpenAddFee(selectedClass, selectedTerm, true)}
                >
                  ✨ + Custom Fee
                </button>
              </div>
            </div>

            {filteredFees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📂</div>
                <h4>No fee components found for this selection</h4>
                <p style={{ fontSize: '13px', margin: '6px 0 16px' }}>
                  No fee schedule items match "{selectedClass}" and "{selectedTerm}".
                </p>
                <button
                  className="btn primary small"
                  onClick={() => onOpenAddFee(selectedClass, selectedTerm)}
                >
                  ＋ Add Fee Item for {selectedClass}
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tariff Ref & Category</th>
                      <th>Fee Item Title & Details</th>
                      <th>Target Class</th>
                      <th>Term</th>
                      <th>Requirement</th>
                      <th>Amount (₦)</th>
                      <th>Due Date</th>
                      <th style={{ textAlign: 'right' }}>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFees.map((fee) => (
                      <tr key={fee.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className={getCategoryClass(fee.category)}>
                              {fee.category}
                            </span>
                            <small style={{ color: 'var(--muted)', fontSize: '11px', fontFamily: 'monospace' }}>
                              {fee.id}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <strong>{fee.title}</strong>
                              {fee.isCustom && (
                                <span className="cat-badge cat-custom" style={{ fontSize: '10px' }}>
                                  ✨ Custom Levy
                                </span>
                              )}
                            </div>
                            {fee.targetStudentName && (
                              <div style={{ fontSize: '11.5px', color: 'var(--yellow)', marginTop: '2px' }}>
                                👤 Beneficiary: <strong>{fee.targetStudentName}</strong>
                              </div>
                            )}
                            {fee.description && (
                              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', maxWidth: '340px' }}>
                                {fee.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-primary">
                            {fee.class}
                          </span>
                        </td>
                        <td>
                          <strong>{fee.term}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{fee.session}</div>
                        </td>
                        <td>
                          {fee.type === 'Mandatory' ? (
                            <span className="status green">Mandatory</span>
                          ) : (
                            <span className="status amber">Optional</span>
                          )}
                        </td>
                        <td>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>
                            ₦{Number(fee.amount).toLocaleString('en-NG')}
                          </div>
                        </td>
                        <td>
                          <small style={{ color: 'var(--muted)' }}>{fee.dueDate}</small>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn small"
                              title="Modify Fee Item"
                              onClick={() => onOpenEditFee(fee)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn danger small"
                              title="Remove Fee Item"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove "${fee.title}" for ${fee.class}?`)) {
                                  onDeleteFee(fee.id);
                                }
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          2. ADMIN / BURSAR: PAYMENT TRANSACTIONS & RECEIPTS LEDGER
          ------------------------------------------------------------- */}
      {isAdminOrBursar && activeSubTab === 'ledger' && (
        <div>
          {/* Stats Cards for Financial Overview */}
          <div className="stats" style={{ marginBottom: '22px' }}>
            <div className="stat-card">
              <div className="stat-head">Total Fees Collected</div>
              <div className="stat-value">₦48.6M</div>
              <div className="stat-foot">Term 1 Reconciled Collections</div>
            </div>
            <div className="stat-card">
              <div className="stat-head">Pending / Outstanding Fees</div>
              <div className="stat-value">₦7.4M</div>
              <div className="stat-foot">Automated SMS/Email notices sent</div>
            </div>
            <div className="stat-card">
              <div className="stat-head">Tuition Recovery Rate</div>
              <div className="stat-value" style={{ color: '#10b981' }}>86.8%</div>
              <div className="stat-foot">Reconciliation efficiency</div>
            </div>
            <div className="stat-card">
              <div className="stat-head">Cleared Scholars</div>
              <div className="stat-value">1,114</div>
              <div className="stat-foot">Exams clearance passes issued</div>
            </div>
          </div>

          {/* Transactions Ledger Panel */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <div className="panel-icon">🧾</div>
                <div>
                  <h4>Bursary Payment Receipts & Audit Trail</h4>
                  <p>Click any transaction to inspect or print official Bursary stamp receipt</p>
                </div>
              </div>
              <button
                className="btn small"
                onClick={() => showToast('Exporting official Bursary Ledger CSV...')}
              >
                ⇩ Export Ledger
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Receipt Ref</th>
                    <th>Fee Description</th>
                    <th>Student Beneficiary</th>
                    <th>Class & Term</th>
                    <th>Payer / Sponsor</th>
                    <th>Amount Paid</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsList.map((payment) => (
                    <tr key={payment.id}>
                      <td><strong>{payment.id}</strong></td>
                      <td>{payment.title}</td>
                      <td><strong>{payment.student || payment.name}</strong></td>
                      <td>
                        <span className="badge badge-primary">
                          {payment.class || 'SS2'}
                        </span>
                        <small style={{ color: 'var(--muted)', marginLeft: '4px' }}>
                          {payment.term || '1st Term'}
                        </small>
                      </td>
                      <td>{payment.parent || 'Guardian'}</td>
                      <td>
                        <strong>{payment.amount}</strong>
                      </td>
                      <td><small>{payment.date}</small></td>
                      <td>
                        {payment.status === 'Verified' || payment.status === 'Paid' ? (
                          <span className="badge badge-success">Settled ✓</span>
                        ) : (
                          <span className="badge badge-gold">Pending</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn secondary small"
                          onClick={() => onOpenReceipt(payment)}
                        >
                          View Receipt 🧾
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          3. PARENT / STUDENT PORTAL VIEW: ITEMIZED STATEMENT & RECEIPTS
          ------------------------------------------------------------- */}
      {(isParent || isStudent) && (
        <div>
          {/* Family / Student Stats Cards */}
          <div className="stats" style={{ marginBottom: '22px' }}>
            <div className="stat-card">
              <div className="stat-head">
                {isParent ? 'Family Billed Total' : 'Total Billed for SS2'}
              </div>
              <div className="stat-value">
                ₦{(currentChild?.totalBilled || 185000).toLocaleString('en-NG')}
              </div>
              <div className="stat-foot">
                {isParent ? '2 Enrolled Children (Term 1)' : 'Senior Secondary 2 · 1st Term'}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-head">Total Reconciled</div>
              <div className="stat-value" style={{ color: '#10b981' }}>
                ₦{(currentChild?.settledFee || 100000).toLocaleString('en-NG')}
              </div>
              <div className="stat-foot">
                <span className="positive">Reconciled</span> with Bursary Dept
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-head">Total Outstanding Due</div>
              <div className="stat-value" style={{ color: currentChild?.outstandingFee > 0 ? 'var(--gold-600)' : 'inherit' }}>
                ₦{(currentChild?.outstandingFee || 0).toLocaleString('en-NG')}
              </div>
              <div className="stat-foot">Due 30 October 2026</div>
            </div>

            <div className="stat-card">
              <div className="stat-head">Accounts Clearance</div>
              <div className="stat-value" style={{ fontSize: '22px', paddingTop: '8px', color: 'var(--gold-600)' }}>
                {currentChild?.standing || 'Good Standing'}
              </div>
              <div className="stat-foot">Approved for Examination Hall</div>
            </div>
          </div>

          {/* Child Fee Breakdown & Receipts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {/* Itemized Fee Schedule */}
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">
                  <div className="panel-icon">📋</div>
                  <div>
                    <h4>Official Tariff Breakdown · {currentChild?.class || 'SS2'}</h4>
                    <p>Class fee items approved by School Bursary for 1st Term 2026/2027</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '4px 0' }}>
                {(currentChild?.feeBreakdown || []).map((fee, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 18px',
                      borderBottom: idx < (currentChild?.feeBreakdown?.length - 1) ? '1px solid var(--line)' : 'none',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13.5px' }}>{fee.title}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                        {fee.sub || fee.description || 'Mandatory academic component'}
                      </div>
                    </div>
                    <div style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--ink)' }}>
                      ₦{Number(fee.amount).toLocaleString('en-NG')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Receipts */}
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">
                  <div className="panel-icon">🧾</div>
                  <div>
                    <h4>Official Payment Receipts</h4>
                    <p>Verified bank transfers and Paystack card receipts</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '8px 0' }}>
                {paymentsList
                  .filter((p) => !isParent || p.student?.includes(currentChild?.name?.split(' ')[0]) || p.student === currentChild?.name)
                  .map((payment) => (
                    <div
                      key={payment.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 18px',
                        borderBottom: '1px solid var(--line)',
                      }}
                    >
                      <div>
                        <strong>{payment.id}</strong> · <small>{payment.date}</small>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          {payment.title} ({payment.method})
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '700' }}>{payment.amount}</span>
                        <button
                          className="btn small"
                          onClick={() => onOpenReceipt(payment)}
                        >
                          Receipt
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
