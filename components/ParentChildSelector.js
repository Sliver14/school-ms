'use client';

export default function ParentChildSelector({
  parentChildren,
  activeChildIndex,
  onSelectChild,
}) {
  return (
    <div className="child-selector-container">
      <div className="child-selector-header">
        <div className="child-selector-title">
          <span>👨‍👩‍👧‍👦</span>
          <span>Your Enrolled Wards ({parentChildren.length} Children):</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
          Click to switch dashboard context or view combined summary
        </div>
      </div>
      <div className="child-pill-list">
        {parentChildren.map((child, idx) => {
          const isActive = activeChildIndex === idx;
          const initials = child.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2);

          return (
            <button
              key={child.id}
              className={`child-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectChild(idx)}
            >
              <div className="child-pill-avatar">{initials}</div>
              <div>
                <strong>{child.name}</strong>
                <span className="child-pill-tag" style={{ marginLeft: '6px' }}>
                  {child.class}
                </span>
              </div>
            </button>
          );
        })}

        <button
          className={`child-pill child-pill-all ${
            activeChildIndex === -1 ? 'active' : ''
          }`}
          onClick={() => onSelectChild(-1)}
        >
          <div className="child-pill-avatar">📊</div>
          <div>
            <strong>All Wards Overview</strong>
            <span className="child-pill-tag" style={{ marginLeft: '6px' }}>
              Combined
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
