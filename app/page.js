'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '../components/LandingPage';
import FastAdmissionModal from '../components/FastAdmissionModal';

export default function HomePage() {
  const router = useRouter();
  const [isFastAdmissionOpen, setIsFastAdmissionOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3800);
  };

  const handleEnterPortal = (targetRole = 'admin') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rh_portal_role', targetRole);
      localStorage.setItem('rh_portal_tab', 'dashboard');
    }
    router.push(`/portal?role=${targetRole}&tab=dashboard`);
  };

  const handleFastAdmissionSubmit = (applicant) => {
    setIsFastAdmissionOpen(false);
    showToast(
      `Application submitted for ${applicant.name} (${applicant.entryClass})! Entrance Exam scheduled.`
    );
  };

  return (
    <div className="app-container">
      {/* PUBLIC SCHOOL LANDING PAGE */}
      <LandingPage
        onEnterPortal={handleEnterPortal}
        onOpenFastAdmission={() => setIsFastAdmissionOpen(true)}
      />

      {/* ADMISSION APPLICATION MODAL */}
      <FastAdmissionModal
        isOpen={isFastAdmissionOpen}
        onClose={() => setIsFastAdmissionOpen(false)}
        onSubmit={handleFastAdmissionSubmit}
      />

      {/* TOAST NOTIFICATION */}
      {toast.visible && (
        <div className="toast" id="systemToast">
          <span>🔔</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
