'use client';

import { useState } from 'react';

export default function PaymentSimulationModal({
  isOpen,
  onClose,
  student,
  feeItem,
  onPaymentSuccess,
  showToast,
}) {
  if (!isOpen) return null;

  const defaultAmount = feeItem?.amount || student?.outstandingFee || 185000;
  const [amount, setAmount] = useState(defaultAmount);
  const [gateway, setGateway] = useState('paystack');
  const [cardNumber, setCardNumber] = useState('4084 0021 9934 1102');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('input'); // 'input', 'processing', 'success'

  const targetStudentName = student?.name || 'Daniel Adeyemi';
  const targetStudentId = student?.id || 'RH/2024/018';
  const targetParent = student?.guardian || student?.parent || 'Mrs. T. Adeyemi';
  const targetClass = student?.class || 'SS2';
  const title = feeItem ? feeItem.title : `${targetClass} Academic Session Tuition & Levies Settlement`;

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep('processing');

    try {
      // Realistic gateway processing animation delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: targetStudentId,
          studentName: targetStudentName,
          parentName: targetParent,
          title,
          class: targetClass,
          term: feeItem?.term || '1st Term',
          amount: Number(amount),
          method:
            gateway === 'paystack'
              ? 'Paystack Card'
              : gateway === 'transfer'
              ? 'Bank Transfer'
              : 'POS Terminal',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep('success');
        showToast(`✅ Payment of ₦${Number(amount).toLocaleString()} cleared successfully!`);
        setTimeout(() => {
          onPaymentSuccess(data.receipt, Number(amount), targetStudentId);
          onClose();
        }, 800);
      } else {
        setIsProcessing(false);
        setStep('input');
        showToast(data.error || 'Payment gateway failed');
      }
    } catch (err) {
      setIsProcessing(false);
      setStep('input');
      showToast('Network error processing transaction');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 'min(580px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Secure School Fee Settlement</h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              Scholar: <strong>{targetStudentName}</strong> ({targetStudentId})
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {step === 'processing' ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 16px', width: '40px', height: '40px', border: '3px solid var(--line)', borderTopColor: 'var(--gold-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <h4>Contacting Payment Gateway...</h4>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
              Simulating instant settlement via {gateway.toUpperCase()} switch.
            </p>
          </div>
        ) : step === 'success' ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ color: '#10b981' }}>Payment Authorized!</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
              Receipt generated. Student examination status is now <strong>Cleared ✓</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSimulatePayment}>
            {/* Bill Summary */}
            <div style={{ background: 'var(--surface2)', padding: '14px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--line)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Bill Description:</span>
                <strong style={{ fontSize: '13.5px' }}>{title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Student Outstanding:</span>
                <span style={{ fontWeight: '700', color: student?.outstandingFee > 0 ? '#ef4444' : '#10b981' }}>
                  ₦{(student?.outstandingFee || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Gateway Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                Select Payment Channel
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button
                  type="button"
                  className={`btn small ${gateway === 'paystack' ? 'gold' : 'secondary'}`}
                  onClick={() => setGateway('paystack')}
                  style={{ display: 'flex', flexDirection: 'column', padding: '10px 8px', height: 'auto', gap: '4px' }}
                >
                  <span style={{ fontSize: '18px' }}>💳</span>
                  <span>Paystack Card</span>
                </button>
                <button
                  type="button"
                  className={`btn small ${gateway === 'transfer' ? 'gold' : 'secondary'}`}
                  onClick={() => setGateway('transfer')}
                  style={{ display: 'flex', flexDirection: 'column', padding: '10px 8px', height: 'auto', gap: '4px' }}
                >
                  <span style={{ fontSize: '18px' }}>🏛️</span>
                  <span>Bank Transfer</span>
                </button>
                <button
                  type="button"
                  className={`btn small ${gateway === 'pos' ? 'gold' : 'secondary'}`}
                  onClick={() => setGateway('pos')}
                  style={{ display: 'flex', flexDirection: 'column', padding: '10px 8px', height: 'auto', gap: '4px' }}
                >
                  <span style={{ fontSize: '18px' }}>📟</span>
                  <span>Campus POS</span>
                </button>
              </div>
            </div>

            <div className="form-grid">
              <div className="field full">
                <label>Amount to Pay (₦)</label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ fontSize: '16px', fontWeight: '700' }}
                />
              </div>

              {gateway === 'paystack' && (
                <>
                  <div className="field full">
                    <label>Card Number (Simulation)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4084 0000 0000 0000"
                    />
                  </div>
                  <div className="field">
                    <label>Expiry Date</label>
                    <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
                  </div>
                  <div className="field">
                    <label>CVV / CVC</label>
                    <input type="password" maxLength="3" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                  </div>
                </>
              )}

              {gateway === 'transfer' && (
                <div className="field full" style={{ background: 'var(--surface3)', padding: '12px', borderRadius: '8px', fontSize: '12.5px' }}>
                  <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>Royal Heights Dedicated Virtual Account:</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>0123456789 • Providus Bank</div>
                  <div style={{ marginTop: '4px', color: 'var(--gold-600)' }}>Account Name: Royal Heights Sec. Sch / {targetStudentName}</div>
                </div>
              )}

              {gateway === 'pos' && (
                <div className="field full" style={{ background: 'var(--surface3)', padding: '12px', borderRadius: '8px', fontSize: '12.5px' }}>
                  <div>Bursary Terminal ID: <strong>POS-RH-BURSAR-02</strong></div>
                  <div style={{ color: 'var(--muted)', marginTop: '4px' }}>Ready for contactless chip card insert / tap at cashier desk.</div>
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button type="button" className="btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn gold" disabled={isProcessing}>
                ✨ Authorize Payment of ₦{Number(amount).toLocaleString()} →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
