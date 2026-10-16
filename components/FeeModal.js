'use client';
import { useState, useEffect } from 'react';
import { schoolClasses, academicTerms, feeCategories, studentsData } from '../data/schoolData';

const CUSTOM_FEE_PRESETS = [
  {
    title: 'Cambridge Robotics & AI Innovation Bootcamp',
    category: 'Laboratory & STEM',
    amount: 45000,
    scope: 'SS2',
    type: 'Optional',
    description: 'Hardware micro-controller kits, Python robotics software license, and regional STEM competition registration.',
  },
  {
    title: 'Annual Overseas Academic Leadership Tour',
    category: 'Custom / Special Levy',
    amount: 650000,
    scope: 'All Classes',
    type: 'Optional',
    description: 'Immersion program in UK/Ghana partner institutions, visa processing, return flight logistics, and travel insurance.',
  },
  {
    title: 'SS3 Valedictory Dinner, Gown & Yearbook',
    category: 'Custom / Special Levy',
    amount: 85000,
    scope: 'SS3',
    type: 'Mandatory',
    description: 'Custom tailored graduation regalia, hardback full-color commemorative yearbook, and valedictory banquet dinner.',
  },
  {
    title: 'Inter-House Sports Customized House Jersey & Kit',
    category: 'PTA & Welfare',
    amount: 18000,
    scope: 'All Classes',
    type: 'Mandatory',
    description: 'House athletics uniform (Windsor, Tudor, Stuart, Hanover), tracksuit and commemorative badge.',
  },
  {
    title: 'Science Laboratory Safety & Consumables Surcharge',
    category: 'Laboratory & STEM',
    amount: 25000,
    scope: 'SS1',
    type: 'Mandatory',
    description: 'Specialized reagents, volumetric glassware, and personal protective equipment for term practical assessments.',
  },
  {
    title: 'Hostel Boarding Weekend Enrichment & Catering',
    category: 'Custom / Special Levy',
    amount: 35000,
    scope: 'Boarders Only',
    type: 'Optional',
    description: 'Special weekend outings, cinema evening, specialized nutrition catering, and laundry maintenance.',
  },
];

export default function FeeModal({
  isOpen,
  onClose,
  onSaveFee,
  feeItem = null,
  defaultClass = 'SS2',
  defaultTerm = '1st Term',
  defaultIsCustom = false,
  students = studentsData,
}) {
  const isEditing = Boolean(feeItem);

  const [isCustomMode, setIsCustomMode] = useState(defaultIsCustom || Boolean(feeItem?.isCustom));
  const [targetScope, setTargetScope] = useState(feeItem?.targetScope || 'class');
  const [selectedStudent, setSelectedStudent] = useState(feeItem?.targetStudentId || '');
  const [customCategoryType, setCustomCategoryType] = useState(
    feeItem?.customCategoryName ? 'custom' : 'preset'
  );
  const [customCategoryName, setCustomCategoryName] = useState(feeItem?.customCategoryName || '');
  const [discountPercent, setDiscountPercent] = useState(feeItem?.discountPercent || 0);

  const [formData, setFormData] = useState({
    title: '',
    class: defaultClass === 'all' ? 'SS2' : defaultClass,
    term: defaultTerm === 'all' ? '1st Term' : defaultTerm,
    session: '2026/2027',
    category: 'Tuition',
    amount: '',
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: '',
    billingFrequency: 'term',
  });

  useEffect(() => {
    if (feeItem) {
      setIsCustomMode(Boolean(feeItem.isCustom));
      setTargetScope(feeItem.targetScope || (feeItem.class === 'All Classes' ? 'all' : 'class'));
      setSelectedStudent(feeItem.targetStudentId || '');
      setCustomCategoryName(feeItem.customCategoryName || '');
      setCustomCategoryType(feeItem.customCategoryName ? 'custom' : 'preset');
      setDiscountPercent(feeItem.discountPercent || 0);

      setFormData({
        title: feeItem.title || '',
        class: feeItem.class || 'SS2',
        term: feeItem.term || '1st Term',
        session: feeItem.session || '2026/2027',
        category: feeItem.category || 'Tuition',
        amount: feeItem.amount || '',
        type: feeItem.type || 'Mandatory',
        dueDate: feeItem.dueDate || '30 Oct 2026',
        description: feeItem.description || '',
        billingFrequency: feeItem.billingFrequency || 'term',
      });
    } else {
      setIsCustomMode(defaultIsCustom);
      setTargetScope('class');
      setSelectedStudent('');
      setCustomCategoryName('');
      setCustomCategoryType('preset');
      setDiscountPercent(0);

      setFormData({
        title: '',
        class: defaultClass === 'all' ? 'SS2' : defaultClass,
        term: defaultTerm === 'all' ? '1st Term' : defaultTerm,
        session: '2026/2027',
        category: defaultIsCustom ? 'Custom / Special Levy' : 'Tuition',
        amount: '',
        type: 'Mandatory',
        dueDate: '30 Oct 2026',
        description: '',
        billingFrequency: 'term',
      });
    }
  }, [feeItem, defaultClass, defaultTerm, defaultIsCustom, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      title: preset.title,
      category: preset.category,
      amount: preset.amount,
      type: preset.type,
      description: preset.description,
    }));
    if (preset.scope === 'All Classes') {
      setTargetScope('all');
    } else if (preset.scope === 'Boarders Only') {
      setTargetScope('boarders');
    } else {
      setTargetScope('class');
      setFormData((prev) => ({ ...prev, class: preset.scope }));
    }
    setIsCustomMode(true);
  };

  const rawAmount = parseFloat(formData.amount) || 0;
  const netAmount = discountPercent > 0 ? Math.round(rawAmount * (1 - discountPercent / 100)) : rawAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (rawAmount <= 0) return;

    let resolvedClass = formData.class;
    let resolvedStudentName = '';

    if (targetScope === 'all') {
      resolvedClass = 'All Classes';
    } else if (targetScope === 'boarders') {
      resolvedClass = 'Boarders Only';
    } else if (targetScope === 'day') {
      resolvedClass = 'Day Students Only';
    } else if (targetScope === 'graduating') {
      resolvedClass = 'SS3';
    } else if (targetScope === 'individual') {
      const match = students.find((s) => s.id === selectedStudent);
      resolvedClass = match ? `${match.class} (${match.name.split(' ')[0]})` : 'Individual Scholar';
      resolvedStudentName = match ? match.name : '';
    }

    const finalCategory =
      customCategoryType === 'custom' && customCategoryName.trim()
        ? customCategoryName.trim()
        : formData.category;

    const prefix = isCustomMode ? 'CUST' : 'FEE';
    const tagCode = Math.floor(100 + Math.random() * 900);
    const generatedId =
      feeItem?.id ||
      `${prefix}-${resolvedClass.replace(/[^a-zA-Z0-9]/g, '')}-${formData.term.slice(0, 2).toUpperCase()}-${tagCode}`;

    const payload = {
      ...formData,
      id: generatedId,
      amount: netAmount,
      rawAmount: rawAmount,
      discountPercent: discountPercent,
      category: finalCategory,
      class: resolvedClass,
      isCustom: isCustomMode,
      targetScope: targetScope,
      targetStudentId: selectedStudent || null,
      targetStudentName: resolvedStudentName || null,
      customCategoryName: customCategoryType === 'custom' ? customCategoryName : null,
    };

    onSaveFee(payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        style={{ width: 'min(720px, 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-head">
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gold-600)', fontWeight: '700', marginBottom: '3px' }}>
              ADMINISTRATIVE TARIFF SYSTEM
            </div>
            <h3>{isEditing ? 'Modify Fee Component' : isCustomMode ? 'Create Custom Fee / Special Assessment' : 'Add New Curriculum Fee Item'}</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
              {isCustomMode
                ? 'Configure ad-hoc tariffs, specialized excursions, valedictory levies, or individualized scholar assessments.'
                : 'Configure standard class arm tuition, development levies, and session schedules.'}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {/* Mode Switcher Pills */}
        <div className="fee-mode-tabs">
          <button
            type="button"
            className={`fee-mode-tab ${!isCustomMode ? 'active' : ''}`}
            onClick={() => {
              setIsCustomMode(false);
              setFormData((prev) => ({ ...prev, category: 'Tuition' }));
            }}
          >
            <span>📚 Standard Curriculum Fee</span>
          </button>
          <button
            type="button"
            className={`fee-mode-tab ${isCustomMode ? 'custom-active' : ''}`}
            onClick={() => {
              setIsCustomMode(true);
              setFormData((prev) => ({ ...prev, category: 'Custom / Special Levy' }));
            }}
          >
            <span>✨ Custom Fee / Special Levy</span>
          </button>
        </div>

        {/* Quick Presets Carousel/List for Custom Mode */}
        {isCustomMode && !isEditing && (
          <div style={{ background: 'var(--surface2)', padding: '14px', borderRadius: 'var(--radius)', marginBottom: '18px', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--yellow)', letterSpacing: '0.5px' }}>
                ⚡ Quick Custom Tariff Presets (Click to Auto-fill)
              </span>
              <small style={{ color: 'var(--muted)', fontSize: '11px' }}>One-click template</small>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
              {CUSTOM_FEE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    color: 'var(--text)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--yellow)';
                    e.currentTarget.style.color = 'var(--yellow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--line)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                >
                  {p.title.split(' ')[0]} {p.title.split(' ')[1]} (₦{p.amount.toLocaleString('en-NG')})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {/* Target Scope Selection (Custom Fee Superpower) */}
          {isCustomMode && (
            <div style={{ background: 'rgba(255, 194, 26, 0.05)', border: '1px solid rgba(255, 194, 26, 0.25)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                Target Recipient Scope *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {[
                  { key: 'all', label: 'All Classes', desc: 'Whole School' },
                  { key: 'class', label: 'Specific Class', desc: 'Single Arm' },
                  { key: 'boarders', label: 'Boarders Only', desc: 'Hostel Students' },
                  { key: 'day', label: 'Day Students', desc: 'Commuters' },
                  { key: 'graduating', label: 'SS 3 Only', desc: 'Graduating Arm' },
                  { key: 'individual', label: 'Individual Scholar', desc: 'Specific Ward' },
                ].map((sc) => (
                  <button
                    key={sc.key}
                    type="button"
                    onClick={() => setTargetScope(sc.key)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '12px',
                      background: targetScope === sc.key ? 'var(--yellow)' : 'var(--card)',
                      color: targetScope === sc.key ? '#201600' : 'var(--text)',
                      border: '1px solid',
                      borderColor: targetScope === sc.key ? 'var(--yellow)' : 'var(--line)',
                      fontWeight: '700',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>{sc.label}</div>
                    <small style={{ fontSize: '10.5px', opacity: 0.8, fontWeight: '500' }}>{sc.desc}</small>
                  </button>
                ))}
              </div>

              {/* If Individual Scholar is chosen, show live Scholar Search / Select */}
              {targetScope === 'individual' && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 194, 26, 0.2)' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                    Select Specific Scholar Beneficiary *
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    style={{ background: 'var(--card)', borderColor: 'var(--yellow)' }}
                  >
                    <option value="">-- Choose Scholar from Enrolment Register --</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.class} • Guardian: {st.guardian || st.parent || 'Parent'}) • {st.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Fee Title */}
          <div className="field">
            <label>Fee Item Title / Description *</label>
            <input
              type="text"
              placeholder={isCustomMode ? 'e.g. Cambridge AI Bootcamp, Overseas Tour, Valedictory Dinner' : 'e.g. Science Laboratory Levy, Tuition Fee'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Target Class (If scope is specific class) & Term Grid */}
          <div className="field-grid-3">
            {(!isCustomMode || targetScope === 'class') ? (
              <div className="field">
                <label>Target Class *</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  required
                >
                  {schoolClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls} (Secondary)
                    </option>
                  ))}
                  <option value="All Classes">All Classes (General Levy)</option>
                </select>
              </div>
            ) : (
              <div className="field">
                <label>Assigned Scope</label>
                <input
                  type="text"
                  disabled
                  value={
                    targetScope === 'all'
                      ? 'All Classes (School-wide)'
                      : targetScope === 'boarders'
                      ? 'Boarders Only'
                      : targetScope === 'day'
                      ? 'Day Students Only'
                      : targetScope === 'graduating'
                      ? 'SS3 Graduating Arm'
                      : 'Individual Scholar'
                  }
                  style={{ opacity: 0.8, background: 'var(--surface2)', fontWeight: '700' }}
                />
              </div>
            )}

            <div className="field">
              <label>Academic Term *</label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                required
              >
                {academicTerms.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="All Terms">All Terms</option>
              </select>
            </div>

            <div className="field">
              <label>Academic Session</label>
              <input
                type="text"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                placeholder="2026/2027"
              />
            </div>
          </div>

          {/* Category, Requirement & Amount Grid */}
          <div className="field-grid-3">
            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <label>Billing Category *</label>
                {isCustomMode && (
                  <button
                    type="button"
                    onClick={() => setCustomCategoryType((prev) => (prev === 'custom' ? 'preset' : 'custom'))}
                    style={{ fontSize: '11px', color: 'var(--sky)', textDecoration: 'underline' }}
                  >
                    {customCategoryType === 'custom' ? 'Choose preset' : '+ Custom Category'}
                  </button>
                )}
              </div>
              {customCategoryType === 'custom' ? (
                <input
                  type="text"
                  placeholder="e.g. Tour & Visa, Valedictory, Repair"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  required
                />
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {feeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="field">
              <label>Requirement *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="Mandatory">Mandatory (Compulsory)</option>
                <option value="Optional">Optional (Elective Service)</option>
              </select>
            </div>

            <div className="field">
              <label>Standard Amount (₦) *</label>
              <input
                type="number"
                min="500"
                step="500"
                placeholder="e.g. 120000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Custom Discount / Waiver Option & Billing Frequency */}
          {isCustomMode && (
            <div className="field-grid-2" style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Scholarship / Staff Subsidy Waiver</label>
                <select
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                >
                  <option value="0">Standard Full Tariff (0% Discount)</option>
                  <option value="15">Staff Child Concession (15% Off)</option>
                  <option value="25">Sibling Loyalty Waiver (25% Off)</option>
                  <option value="50">Merit Scholar Subsidy (50% Off)</option>
                  <option value="100">Full Indigent Bursary (100% Free)</option>
                </select>
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label>Net Invoice Payable</label>
                <div style={{ fontSize: '18px', fontWeight: '800', color: discountPercent > 0 ? '#10b981' : 'var(--text)', paddingTop: '6px' }}>
                  ₦{netAmount.toLocaleString('en-NG')}
                  {discountPercent > 0 && (
                    <span style={{ fontSize: '11.5px', color: '#10b981', marginLeft: '6px', fontWeight: '600' }}>
                      ({discountPercent}% Concession Applied)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Due Date & Reference */}
          <div className="field-grid-2">
            <div className="field">
              <label>Payment Due Date *</label>
              <input
                type="text"
                placeholder="e.g. 30 Oct 2026 or 15 Nov 2026"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Generated Ref Code</label>
              <input
                type="text"
                disabled
                value={
                  feeItem?.id ||
                  `${isCustomMode ? 'CUST' : 'FEE'}-${(targetScope === 'all' ? 'ALL' : formData.class).replace(/[^a-zA-Z0-9]/g, '')}-${formData.term.slice(0, 2).toUpperCase()}-AUTO`
                }
                style={{ opacity: 0.7, background: 'var(--surface2)', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          <div className="field">
            <label>Item Scope & Detailed Breakdown</label>
            <textarea
              placeholder="Detail what this fee covers (e.g. Consumables, specialized tutors, lab safety kits, exam CBT licenses, excursion bus tokens)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {isEditing ? 'Save Changes ✓' : isCustomMode ? 'Create & Dispatch Custom Fee ✨' : 'Add Fee to Schedule ＋'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
