'use client';

import { useState, useEffect } from 'react';

export default function ScratchCardsView({ showToast }) {
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inUse: 0,
    exhausted: 0,
    revoked: 0,
    totalValue: 0,
    totalUsedChecks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [revealedPins, setRevealedPins] = useState({});

  // Batch Generation Modal State
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [genCount, setGenCount] = useState(10);
  const [genSession, setGenSession] = useState('2026/2027');
  const [genTerm, setGenTerm] = useState('1st Term');
  const [genPrice, setGenPrice] = useState(2000);
  const [genMaxUses, setGenMaxUses] = useState(5);
  const [genBatchCode, setGenBatchCode] = useState('');
  const [isSubmittingGen, setIsSubmittingGen] = useState(false);

  // Print Slips Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printFilter, setPrintFilter] = useState('active');

  const fetchCards = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/scratch-cards?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCards(data.cards || []);
        if (data.stats) setStats(data.stats);
      } else {
        showToast(data.error || 'Failed to load scratch cards');
      }
    } catch (err) {
      showToast('Network error loading scratch cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCards();
  };

  const togglePinReveal = (cardId) => {
    setRevealedPins((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleToggleStatus = async (card) => {
    const newStatus = card.status === 'Revoked' ? 'Active' : 'Revoked';
    try {
      const res = await fetch('/api/scratch-cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Card ${card.serialNumber} is now ${newStatus}`);
        fetchCards();
      } else {
        showToast(data.error || 'Failed to update card status');
      }
    } catch (err) {
      showToast('Network error updating card status');
    }
  };

  const handleGenerateBatch = async (e) => {
    e.preventDefault();
    setIsSubmittingGen(true);
    try {
      const res = await fetch('/api/scratch-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: genCount,
          session: genSession,
          term: genTerm,
          price: genPrice,
          maxUses: genMaxUses,
          batchCode: genBatchCode || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully generated ${data.count} scratch cards!`);
        setIsGenerateOpen(false);
        fetchCards();
      } else {
        showToast(data.error || 'Generation failed');
      }
    } catch (err) {
      showToast('Network error generating scratch cards');
    } finally {
      setIsSubmittingGen(false);
    }
  };

  const handleExportCSV = () => {
    if (!cards || cards.length === 0) {
      showToast('No scratch cards available to export');
      return;
    }
    const headers = ['Serial Number', 'PIN', 'Session', 'Term', 'Price (NGN)', 'Max Uses', 'Used Count', 'Student ID', 'Student Name', 'Status', 'Batch Code', 'Created At'];
    const rows = cards.map((c) => [
      `"${c.serialNumber}"`,
      `"${c.pin}"`,
      `"${c.session}"`,
      `"${c.term}"`,
      c.price,
      c.maxUses,
      c.usedCount,
      `"${c.studentId || ''}"`,
      `"${c.studentName || ''}"`,
      `"${c.status}"`,
      `"${c.batchCode || ''}"`,
      `"${c.createdAt || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Royal_Heights_Scratch_Cards_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Scratch cards exported to CSV successfully');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`);
  };

  const printFilteredCards = cards.filter((c) => {
    if (printFilter === 'active') return c.status === 'Active';
    if (printFilter === 'all') return true;
    return c.status === printFilter;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h2>Official Result Scratch Card System 🎫</h2>
          <p>
            Generate, distribute, and audit secure PIN scratch cards required by students and guardians to check term results
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn secondary" onClick={() => setIsPrintModalOpen(true)}>
            🖨️ Print Card Slips
          </button>
          <button className="btn secondary" onClick={handleExportCSV}>
            📥 Export CSV
          </button>
          <button className="btn gold" onClick={() => setIsGenerateOpen(true)}>
            ✨ + Generate Scratch Cards
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-head">Total Generated</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-foot">Cumulative batch total</div>
        </div>

        <div className="stat-card">
          <div className="stat-head">Active / Unused</div>
          <div className="stat-value" style={{ color: 'var(--mint)' }}>{stats.active}</div>
          <div className="stat-foot">Available for sale / issuance</div>
        </div>

        <div className="stat-card">
          <div className="stat-head">Bound / In Use</div>
          <div className="stat-value" style={{ color: 'var(--sky, #38bdf8)' }}>{stats.inUse}</div>
          <div className="stat-foot">Linked to scholar profiles</div>
        </div>

        <div className="stat-card">
          <div className="stat-head">Exhausted</div>
          <div className="stat-value" style={{ color: 'var(--muted)' }}>{stats.exhausted}</div>
          <div className="stat-foot">{stats.totalUsedChecks} total result views recorded</div>
        </div>

        <div className="stat-card">
          <div className="stat-head">Inventory Face Value</div>
          <div className="stat-value" style={{ color: 'var(--yellow)', fontSize: '24px' }}>
            ₦{Number(stats.totalValue || 0).toLocaleString()}
          </div>
          <div className="stat-foot">₦2,000 standard rate per unit</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All (${stats.total})` },
              { id: 'Active', label: `Active (${stats.active})` },
              { id: 'In Use', label: `In Use (${stats.inUse})` },
              { id: 'Exhausted', label: `Exhausted (${stats.exhausted})` },
              { id: 'Revoked', label: `Revoked (${stats.revoked})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn small ${statusFilter === tab.id ? 'primary' : 'secondary'}`}
                style={{ padding: '6px 14px', borderRadius: '20px' }}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search Serial, PIN, or Student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--surface2)',
                color: 'var(--text)',
                fontSize: '13px',
              }}
            />
            <button type="submit" className="btn secondary small">Search</button>
            {searchQuery && (
              <button
                type="button"
                className="btn secondary small"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTimeout(fetchCards, 50);
                }}
              >
                ✕
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Cards Table */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <div className="panel-icon">💳</div>
            <div>
              <h4>Scratch Card Inventory & Activation Log</h4>
              <p>Each card allows up to 5 checks and binds to the scholar's admission number on first check</p>
            </div>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Showing {cards.length} card{cards.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
            Loading scratch cards ledger...
          </div>
        ) : cards.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎫</div>
            <h4>No scratch cards match your query</h4>
            <p style={{ maxWidth: '420px', margin: '8px auto 16px' }}>
              No cards were found matching "{searchQuery || statusFilter}". Generate a new batch to replenish stock.
            </p>
            <button className="btn gold" onClick={() => setIsGenerateOpen(true)}>
              ✨ Generate Batch Cards
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Secret PIN</th>
                  <th>Session & Term</th>
                  <th>Bound Scholar</th>
                  <th>Checks Used</th>
                  <th>Status</th>
                  <th>Batch</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((c) => {
                  const isPinVisible = !!revealedPins[c.id];
                  const maskedPin = c.pin ? c.pin.slice(0, 4) + '-••••-••••' : '••••-••••-••••';

                  return (
                    <tr key={c.id}>
                      {/* Serial Number */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong style={{ fontFamily: 'monospace', fontSize: '13.5px', color: 'var(--text)' }}>
                            {c.serialNumber}
                          </strong>
                          <button
                            type="button"
                            title="Copy Serial Number"
                            onClick={() => copyToClipboard(c.serialNumber, 'Serial')}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--muted)',
                              padding: '2px',
                              display: 'inline-flex',
                            }}
                          >
                            📋
                          </button>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          ₦{Number(c.price || 2000).toLocaleString()}
                        </span>
                      </td>

                      {/* PIN */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '13px',
                              letterSpacing: '1px',
                              background: 'var(--surface2)',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--line)',
                            }}
                          >
                            {isPinVisible ? c.pin : maskedPin}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePinReveal(c.id)}
                            title={isPinVisible ? 'Hide PIN' : 'Reveal PIN'}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--muted)',
                              fontSize: '14px',
                            }}
                          >
                            {isPinVisible ? '🙈' : '👁️'}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(c.pin, 'PIN')}
                            title="Copy Full PIN"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--muted)',
                              fontSize: '13px',
                            }}
                          >
                            📋
                          </button>
                        </div>
                      </td>

                      {/* Session / Term */}
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.term}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{c.session}</div>
                      </td>

                      {/* Bound Scholar */}
                      <td>
                        {c.studentId ? (
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{c.studentName}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{c.studentId}</div>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--mint)',
                              background: 'rgba(16, 185, 129, 0.1)',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                            }}
                          >
                            ● Unclaimed (Open)
                          </span>
                        )}
                      </td>

                      {/* Usage */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '48px', height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${Math.min(100, ((c.usedCount || 0) / (c.maxUses || 5)) * 100)}%`,
                                height: '100%',
                                background: c.usedCount >= c.maxUses ? '#ef4444' : 'var(--yellow)',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
                            {c.usedCount} / {c.maxUses}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          {c.maxUses - (c.usedCount || 0)} left
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            c.status === 'Active'
                              ? 'badge-green'
                              : c.status === 'In Use'
                              ? 'badge-gold'
                              : c.status === 'Exhausted'
                              ? 'badge-gray'
                              : 'badge-red'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Batch Code */}
                      <td>
                        <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                          {c.batchCode || 'BATCH-01'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn secondary small"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            onClick={() => handleToggleStatus(c)}
                            title={c.status === 'Revoked' ? 'Reactivate Card' : 'Revoke Card'}
                          >
                            {c.status === 'Revoked' ? '🔓 Unblock' : '🚫 Revoke'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BATCH GENERATOR MODAL */}
      {isGenerateOpen && (
        <div className="modal-backdrop" onClick={() => setIsSubmittingGen(false) || setIsGenerateOpen(false)}>
          <div className="modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>✨ Batch Generate Scratch Cards</h3>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                  Create encrypted 12-digit PIN cards with unique serial numbers
                </div>
              </div>
              <button className="icon-btn" onClick={() => setIsGenerateOpen(false)} aria-label="Close">✕</button>
            </div>

            <form onSubmit={handleGenerateBatch} style={{ display: 'grid', gap: '16px', marginTop: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  Quantity of Cards to Generate
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  {[5, 10, 25, 50, 100].map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`btn small ${genCount === q ? 'primary' : 'secondary'}`}
                      onClick={() => setGenCount(q)}
                      style={{ flex: 1, padding: '6px 0' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={genCount}
                  onChange={(e) => setGenCount(parseInt(e.target.value, 10) || 1)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface2)',
                    color: 'var(--text)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Academic Session
                  </label>
                  <select
                    value={genSession}
                    onChange={(e) => setGenSession(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="2026/2027">2026/2027</option>
                    <option value="2025/2026">2025/2026</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Academic Term
                  </label>
                  <select
                    value={genTerm}
                    onChange={(e) => setGenTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                    <option value="Annual / All Terms">Annual / All Terms</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Unit Price (₦)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={genPrice}
                    onChange={(e) => setGenPrice(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Max Checks Allowed
                  </label>
                  <select
                    value={genMaxUses}
                    onChange={(e) => setGenMaxUses(parseInt(e.target.value, 10) || 5)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                    }}
                  >
                    <option value={3}>3 Checks</option>
                    <option value={5}>5 Checks (Standard)</option>
                    <option value={10}>10 Checks</option>
                    <option value={20}>20 Checks</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  Custom Batch Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BATCH-2026-T1-PRINT"
                  value={genBatchCode}
                  onChange={(e) => setGenBatchCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface2)',
                    color: 'var(--text)',
                    fontSize: '13px',
                  }}
                />
              </div>

              {/* Total Estimated Inventory Summary */}
              <div
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Total Batch Face Value</div>
                  <strong style={{ fontSize: '17px', color: 'var(--yellow)' }}>
                    ₦{(genCount * genPrice).toLocaleString()}
                  </strong>
                </div>
                <div style={{ fontSize: '12px', textAlign: 'right', color: 'var(--muted)' }}>
                  {genCount} Cards × {genMaxUses} Checks Each<br />
                  Valid for 1 Calendar Year
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="btn secondary" onClick={() => setIsGenerateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn gold" disabled={isSubmittingGen}>
                  {isSubmittingGen ? 'Generating Cards...' : `Generate ${genCount} Scratch Cards`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE SCRATCH CARD SLIPS MODAL */}
      {isPrintModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPrintModalOpen(false)}>
          <div
            className="modal"
            style={{ width: 'min(980px, 98%)', maxHeight: '92vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head no-print">
              <div>
                <h3>🖨️ Printable Scratch Card Slips Sheet</h3>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                  Ready-to-print cards formatted with school crest, security holographic borders, serial numbers, and foil PINs
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={printFilter}
                  onChange={(e) => setPrintFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface2)',
                    color: 'var(--text)',
                    fontSize: '12px',
                  }}
                >
                  <option value="active">Active Unused Only ({stats.active})</option>
                  <option value="all">All Cards ({stats.total})</option>
                </select>
                <button className="btn gold small" onClick={() => window.print()}>
                  🖨️ Print Slips
                </button>
                <button className="icon-btn" onClick={() => setIsPrintModalOpen(false)} aria-label="Close">✕</button>
              </div>
            </div>

            {/* Grid of Scratch Cards for Printing / Slips */}
            <div
              className="scratch-cards-print-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
                marginTop: '16px',
              }}
            >
              {printFilteredCards.slice(0, 18).map((card) => (
                <div
                  key={card.id}
                  className="scratch-card-slip"
                  style={{
                    border: '2px dashed #ca8a04',
                    borderRadius: '12px',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #1e1b2e 0%, #110e1a 100%)',
                    color: '#f8fafc',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Holographic Watermark / Seal */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '-10px',
                      bottom: '-10px',
                      opacity: 0.08,
                      fontSize: '90px',
                      fontWeight: 900,
                      pointerEvents: 'none',
                    }}
                  >
                    RH
                  </div>

                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        fontSize: '14px',
                        color: '#000',
                      }}
                    >
                      RH
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.8px', color: '#fef08a' }}>
                        ROYAL HEIGHTS SECONDARY SCHOOL
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                        Official Examination Result Checker Card
                      </div>
                    </div>
                  </div>

                  {/* Serial Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', margin: '8px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                    <span>
                      <strong style={{ color: '#94a3b8' }}>SERIAL:</strong>{' '}
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#fef08a' }}>
                        {card.serialNumber}
                      </span>
                    </span>
                    <span style={{ color: '#94a3b8' }}>
                      {card.session} • {card.term}
                    </span>
                  </div>

                  {/* Scratch Panel Simulation */}
                  <div style={{ margin: '10px 0' }}>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Scratch Here For Secret PIN
                    </div>
                    <div
                      style={{
                        background: 'linear-gradient(90deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)',
                        color: '#0f172a',
                        padding: '10px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '15px',
                        letterSpacing: '2px',
                        border: '1px solid #e2e8f0',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    >
                      {card.pin}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div style={{ fontSize: '9px', color: '#94a3b8', lineHeight: 1.35, marginTop: '8px' }}>
                    1. Visit: <strong>royalheights.edu.ng/result-checker</strong><br />
                    2. Enter Scholar Admission Number, Serial & PIN.<br />
                    3. Card is strictly non-transferable & allows up to <strong>{card.maxUses} checks</strong>.
                  </div>

                  {/* Barcode Placeholder */}
                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '9px',
                      color: '#64748b',
                    }}
                  >
                    <span style={{ letterSpacing: '3px', fontFamily: 'monospace' }}>||| | ||||| || |||</span>
                    <span>₦{Number(card.price || 2000).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {printFilteredCards.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
                No cards match the selected filter.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

