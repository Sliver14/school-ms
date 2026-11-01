'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PortalSidebar from '../../components/PortalSidebar';
import PortalTopbar from '../../components/PortalTopbar';
import ParentChildSelector from '../../components/ParentChildSelector';
import DashboardView from '../../components/DashboardView';
import AcademicsView from '../../components/AcademicsView';
import StaffMatrixView from '../../components/StaffMatrixView';
import StudentsView from '../../components/StudentsView';
import FeesView from '../../components/FeesView';
import {
  TimetableModule,
  AttendanceModule,
  AdmissionsModule,
  ParentsModule,
  CommunicationsModule,
  ReportsModule,
  SettingsModule,
} from '../../components/OtherViews';
import FastAdmissionModal from '../../components/FastAdmissionModal';
import ReportCardModal from '../../components/ReportCardModal';
import ScratchCardsView from '../../components/ScratchCardsView';
import SubjectAllocationModal from '../../components/SubjectAllocationModal';
import ReceiptModal from '../../components/ReceiptModal';
import AddStudentModal from '../../components/AddStudentModal';
import FeeModal from '../../components/FeeModal';
import AdmissionReviewModal from '../../components/AdmissionReviewModal';
import PaymentSimulationModal from '../../components/PaymentSimulationModal';
import AttendanceMarkingModal from '../../components/AttendanceMarkingModal';
import ScoreEntryModal from '../../components/ScoreEntryModal';
import TeacherOnboardingModal from '../../components/TeacherOnboardingModal';
import UserCredentialSlipModal from '../../components/UserCredentialSlipModal';

import {
  studentsData,
  ROLE_PERMISSIONS,
  parentChildren,
  initialClassAllocations,
  allTeachersList,
  initialFeeSchedules,
} from '../../data/schoolData';

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial role and tab resolution from URL or localStorage
  const urlRole = searchParams.get('role');
  const urlTab = searchParams.get('tab');
  const urlChild = searchParams.get('child');

  // Role State
  const [role, setRole] = useState(urlRole || 'admin');
  const [activePage, setActivePage] = useState(urlTab || 'dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Parent Multi-Child State
  const [activeParentChildIndex, setActiveParentChildIndex] = useState(
    urlChild !== null && !isNaN(parseInt(urlChild)) ? parseInt(urlChild) : 0
  );
  const [parentChildrenState, setParentChildrenState] = useState(parentChildren);

  // Dynamic School Data State (Synced with Backend API)
  const [students, setStudents] = useState(studentsData);
  const [classAllocations, setClassAllocations] = useState(initialClassAllocations);
  const [feeSchedules, setFeeSchedules] = useState(initialFeeSchedules);
  const [admissions, setAdmissions] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [gradesList, setGradesList] = useState([]);

  // Modals State
  const [isFastAdmissionOpen, setIsFastAdmissionOpen] = useState(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [reportCardChild, setReportCardChild] = useState(parentChildren[0]);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [allocationClass, setAllocationClass] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [defaultFeeClass, setDefaultFeeClass] = useState('SS2');
  const [defaultFeeTerm, setDefaultFeeTerm] = useState('1st Term');
  const [defaultIsCustom, setDefaultIsCustom] = useState(false);

  // Phase 2 & 3 Modals
  const [isReviewApplicantOpen, setIsReviewApplicantOpen] = useState(false);
  const [reviewingApplicant, setReviewingApplicant] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetStudent, setPaymentTargetStudent] = useState(null);
  const [paymentFeeItem, setPaymentFeeItem] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isScoreEntryOpen, setIsScoreEntryOpen] = useState(false);
  const [isTeacherOnboardOpen, setIsTeacherOnboardOpen] = useState(false);
  const [isCredentialSlipOpen, setIsCredentialSlipOpen] = useState(false);
  const [credentialSlipData, setCredentialSlipData] = useState(null);
  const [teachersList, setTeachersList] = useState(allTeachersList);

  // Scratch Card Unlocked Sessions State
  const [unlockedCards, setUnlockedCards] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('rh_unlocked_cards');
        return stored ? JSON.parse(stored) : {};
      } catch (_) {
        return {};
      }
    }
    return {};
  });

  const handleUnlockCard = (studentId, cardData) => {
    setUnlockedCards((prev) => {
      const updated = { ...prev, [studentId]: cardData };
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('rh_unlocked_cards', JSON.stringify(updated));
        } catch (_) {}
      }
      return updated;
    });
  };

  // Toast State
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3800);
  };

  // Handle Logout & Portal Locking (Instantaneous & Non-Blocking)
  const handleLogout = () => {
    // 1. Immediately wipe client credentials & storage for instant security
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rh_auth_token');
      localStorage.removeItem('rh_user');
      localStorage.removeItem('rh_portal_role');
      localStorage.removeItem('rh_portal_tab');
      localStorage.removeItem('rh_portal_child');
    }

    // 2. Clear server-side session cookie in background without blocking navigation
    fetch('/api/auth/logout', { method: 'POST', keepalive: true }).catch(() => {});

    // 3. Immediately transition to login page
    router.replace('/login');
  };

  // Restore session and verify authentication token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('rh_portal_role');
      const savedTab = localStorage.getItem('rh_portal_tab');
      const savedChild = localStorage.getItem('rh_portal_child');
      const token = localStorage.getItem('rh_auth_token');
      const savedUserStr = localStorage.getItem('rh_user');

      if (savedUserStr) {
        try {
          setCurrentUser(JSON.parse(savedUserStr));
        } catch (_) {}
      }

      // Verify session via /api/auth/me
      fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            if (!urlRole && data.user.role) setRole(data.user.role);
          }
        })
        .catch(() => {});

      if (!urlRole && savedRole && ROLE_PERMISSIONS[savedRole]) {
        setRole(savedRole);
      }
      if (!urlTab && savedTab) {
        setActivePage(savedTab);
      }
      if (urlChild === null && savedChild !== null) {
        const parsed = parseInt(savedChild);
        if (!isNaN(parsed)) setActiveParentChildIndex(parsed);
      }
    }
  }, [urlRole, urlTab, urlChild]);

  // Load live data from Backend API
  useEffect(() => {
    async function loadApiData() {
      try {
        const [admRes, stuRes, feeRes, attRes, grdRes] = await Promise.allSettled([
          fetch('/api/admissions').then((r) => r.json()),
          fetch('/api/students').then((r) => r.json()),
          fetch('/api/fees').then((r) => r.json()),
          fetch('/api/attendance').then((r) => r.json()),
          fetch('/api/grades').then((r) => r.json()),
        ]);

        if (admRes.status === 'fulfilled' && admRes.value.success) {
          setAdmissions(admRes.value.admissions);
        }
        if (stuRes.status === 'fulfilled' && stuRes.value.success) {
          setStudents(stuRes.value.students);
        }
        if (feeRes.status === 'fulfilled' && feeRes.value.success) {
          setFeeSchedules(feeRes.value.fees);
        }
        if (attRes.status === 'fulfilled' && attRes.value.success) {
          setAttendanceList(attRes.value.attendance);
        }
        if (grdRes.status === 'fulfilled' && grdRes.value.success) {
          setGradesList(grdRes.value.grades);
        }
      } catch (e) {
        console.warn('API sync warning:', e);
      }
    }
    loadApiData();
  }, []);

  // Synchronize state changes to URL and localStorage
  const updatePortalSession = (newRole, newTab, newChild) => {
    if (typeof window !== 'undefined') {
      const targetRole = newRole !== undefined ? newRole : role;
      const targetTab = newTab !== undefined ? newTab : activePage;
      const targetChild = newChild !== undefined ? newChild : activeParentChildIndex;

      localStorage.setItem('rh_portal_role', targetRole);
      localStorage.setItem('rh_portal_tab', targetTab);
      localStorage.setItem('rh_portal_child', targetChild.toString());

      const params = new URLSearchParams();
      params.set('role', targetRole);
      params.set('tab', targetTab);
      if (targetRole === 'parent') {
        params.set('child', targetChild.toString());
      }

      window.history.replaceState(null, '', `/portal?${params.toString()}`);
    }
  };

  // Switch role handler with permission enforcement
  const handleSwitchRole = (newRole) => {
    setRole(newRole);
    const allowed = ROLE_PERMISSIONS[newRole]?.tabs || ROLE_PERMISSIONS.admin.tabs || [];
    let nextTab = activePage;
    if (!allowed.includes(activePage)) {
      nextTab = 'dashboard';
      setActivePage('dashboard');
    }
    updatePortalSession(newRole, nextTab, activeParentChildIndex);
    showToast(`Switched to ${newRole.toUpperCase()} Portal environment`);
  };

  // Navigate tab handler
  const handleNavigate = (page) => {
    setActivePage(page);
    updatePortalSession(role, page, activeParentChildIndex);
  };

  // Switch child handler for parents
  const handleSelectChild = (idx) => {
    setActiveParentChildIndex(idx);
    updatePortalSession(role, activePage, idx);
    if (idx >= 0 && parentChildrenState[idx]) {
      showToast(`Viewing dashboard for ${parentChildrenState[idx].name}`);
    } else {
      showToast('Viewing All Wards Combined Overview');
    }
  };

  // Return to School Website handler
  const handleReturnToWebsite = () => {
    router.push('/');
  };

  // Fast admission submit (API connected)
  const handleFastAdmissionSubmit = async (applicant) => {
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicant),
      });
      const data = await res.json();
      if (data.success) {
        setAdmissions((prev) => [data.applicant, ...prev]);
        setIsFastAdmissionOpen(false);
        showToast(
          `Application registered for ${applicant.name} (${applicant.entryClass})! CBT entrance exam booked.`
        );
      }
    } catch (e) {
      setIsFastAdmissionOpen(false);
      showToast(`Application recorded for ${applicant.name}`);
    }
  };

  // Review & Enrol Applicant
  const handleReviewApplicant = (applicant) => {
    setReviewingApplicant(applicant);
    setIsReviewApplicantOpen(true);
  };

  const handleUpdateApplicant = (updated) => {
    setAdmissions((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleEnrolApplicant = (newStudent, applicantId) => {
    setStudents((prev) => [newStudent, ...prev]);
    setAdmissions((prev) =>
      prev.map((a) =>
        a.id === applicantId ? { ...a, decision: 'Enrolled ✓', studentId: newStudent.id } : a
      )
    );
    if (newStudent.credentialSlip) {
      setCredentialSlipData(newStudent.credentialSlip);
      setIsCredentialSlipOpen(true);
    }
  };

  // Onboard New Teacher Handler
  const handleTeacherCreated = (newTeacher, credentialSlip) => {
    setTeachersList((prev) => [newTeacher, ...prev]);
    if (credentialSlip) {
      setCredentialSlipData(credentialSlip);
      setIsCredentialSlipOpen(true);
    }
  };

  // Save Subject-Class Allocation
  const handleSaveAllocation = async (classId, newAllocationData) => {
    try {
      await fetch('/api/allocations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classKey: classId, ...newAllocationData }),
      });
    } catch (e) {}

    setClassAllocations((prev) => {
      if (Array.isArray(prev)) {
        return prev.map((c) => {
          if (c.id === classId || c.key === classId) {
            return {
              ...c,
              formTeacher: newAllocationData.formTeacher,
              subjects: newAllocationData.subjects,
            };
          }
          return c;
        });
      } else {
        const nextObj = { ...prev };
        if (nextObj[classId]) {
          nextObj[classId] = {
            ...nextObj[classId],
            formTeacher: newAllocationData.formTeacher,
            subjects: Object.entries(newAllocationData.subjects).map(([subject, teacher]) => ({
              subject,
              teacher,
              dept: 'Academic Dept',
              periods: 4,
              role: 'Subject Specialist',
            })),
          };
        }
        return nextObj;
      }
    });
    setIsAllocationModalOpen(false);
    showToast(
      `Class-Subject Allocation Matrix successfully updated for ${allocationClass?.name || 'class'}!`
    );
  };

  // Add new student
  const handleAddStudent = async (newStudent) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();
      if (data.success) {
        setStudents((prev) => [data.student, ...prev]);
        setIsAddStudentOpen(false);
        showToast(`Enrolled ${data.student.name} successfully into ${data.student.class}!`);
        if (data.student.credentialSlip) {
          setCredentialSlipData(data.student.credentialSlip);
          setIsCredentialSlipOpen(true);
        }
        return;
      }
    } catch (e) {}

    const studentWithId = {
      id: `RH/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      ...newStudent,
    };
    setStudents((prev) => [studentWithId, ...prev]);
    setIsAddStudentOpen(false);
    showToast(`Enrolled ${studentWithId.name} successfully into ${studentWithId.class}!`);
  };

  // Payment Settlement Handlers
  const handleOpenPaymentModal = (student, feeItem = null) => {
    setPaymentTargetStudent(student || parentChildrenState[activeParentChildIndex] || students[0]);
    setPaymentFeeItem(feeItem);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (receipt, amount, studentId) => {
    // Update students list
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId || s.name === receipt.name) {
          const newSettled = (Number(s.settledFee) || 0) + amount;
          const newOutstanding = Math.max(0, (Number(s.totalBilled) || 0) - newSettled);
          return {
            ...s,
            settledFee: newSettled,
            outstandingFee: newOutstanding,
            feeStatus: newOutstanding === 0 ? 'Paid' : 'Partial',
            clearanceStatus: newOutstanding === 0 ? 'Cleared ✓' : 'Partial Clearance',
          };
        }
        return s;
      })
    );

    // Update parent children state
    setParentChildrenState((prev) =>
      prev.map((c) => {
        if (c.id === studentId || c.name === receipt.name) {
          const newSettled = (Number(c.settledFee) || 0) + amount;
          const newOutstanding = Math.max(0, (Number(c.totalBilled) || 0) - newSettled);
          return {
            ...c,
            settledFee: newSettled,
            outstandingFee: newOutstanding,
            standing: newOutstanding === 0 ? 'Cleared for Exams ✓' : 'Good Standing',
            recentReceipt: receipt,
          };
        }
        return c;
      })
    );

    // Open receipt modal
    setReceiptData(receipt);
    setIsReceiptOpen(true);
  };

  // Score Entry Handlers
  const handleOpenScoreEntry = () => {
    setIsScoreEntryOpen(true);
  };

  const handleScoresSaved = (newGrades) => {
    setGradesList(newGrades);
    showToast('Continuous assessment marks recorded and GPA updated');
  };

  // Attendance Handlers
  const handleOpenAttendanceModal = () => {
    setIsAttendanceModalOpen(true);
  };

  const handleAttendanceSaved = (records) => {
    setAttendanceList((prev) => [...records, ...prev]);
  };

  // Fee Management Handlers (Admin & Bursar)
  const handleOpenAddFee = (targetClass = 'SS2', targetTerm = '1st Term', isCustom = false) => {
    setEditingFee(null);
    setDefaultFeeClass(targetClass === 'all' ? 'SS2' : targetClass);
    setDefaultFeeTerm(targetTerm === 'all' ? '1st Term' : targetTerm);
    setDefaultIsCustom(Boolean(isCustom));
    setIsFeeModalOpen(true);
  };

  const handleOpenEditFee = (feeItem) => {
    setEditingFee(feeItem);
    setDefaultFeeClass(feeItem.class || 'SS2');
    setDefaultFeeTerm(feeItem.term || '1st Term');
    setDefaultIsCustom(Boolean(feeItem.isCustom || feeItem.category === 'Custom / Special Levy'));
    setIsFeeModalOpen(true);
  };

  const handleSaveFee = async (feeData) => {
    try {
      await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feeData),
      });
    } catch (e) {}

    if (editingFee) {
      setFeeSchedules((prev) =>
        prev.map((f) => (f.id === editingFee.id ? { ...feeData, id: editingFee.id } : f))
      );
      showToast(`Fee item '${feeData.title}' updated successfully.`);
    } else {
      const newFee = {
        ...feeData,
        id: `FEE-${feeData.class}-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setFeeSchedules((prev) => [newFee, ...prev]);
      showToast(
        feeData.isCustom
          ? `✨ Custom fee '${feeData.title}' created & applied!`
          : `Fee component '${feeData.title}' scheduled for ${feeData.class}!`
      );
    }
    setIsFeeModalOpen(false);
  };

  const handleDeleteFee = async (feeId) => {
    try {
      await fetch(`/api/fees?id=${feeId}`, { method: 'DELETE' });
    } catch (e) {}

    setFeeSchedules((prev) => prev.filter((f) => f.id !== feeId));
    showToast('Fee component successfully removed from schedule.');
  };

  // Open official report card for any student
  const handleOpenReportCard = (childOrStudent) => {
    setReportCardChild(childOrStudent || parentChildrenState[0]);
    setIsReportCardOpen(true);
  };

  return (
    <div className="portal-view" id="portalView">
      {/* Sidebar Navigation */}
      <PortalSidebar
        role={role}
        activePage={activePage}
        onNavigate={handleNavigate}
        onSwitchView={handleReturnToWebsite}
        onSwitchRole={handleSwitchRole}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Mobile Drawer Backdrop */}
      <div
        className={`portal-backdrop ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Main Area */}
      <main className="main">
        {/* Topbar */}
        <PortalTopbar
          role={role}
          activePage={activePage}
          onSwitchRole={handleSwitchRole}
          onSwitchView={handleReturnToWebsite}
          onToggleMobileMenu={() => setIsMobileOpen((prev) => !prev)}
          onLogout={handleLogout}
          currentUser={currentUser}
        />

        {/* Portal Content Body */}
        <div className="content">
          {/* If Parent role, show the Multi-Child Selector pills on top */}
          {role === 'parent' && (
            <ParentChildSelector
              parentChildren={parentChildrenState}
              activeChildIndex={activeParentChildIndex}
              onSelectChild={handleSelectChild}
            />
          )}

          {/* Page Content Routing based on activePage */}
          {activePage === 'dashboard' && (
            <DashboardView
              role={role}
              parentChildren={parentChildrenState}
              activeChildIndex={activeParentChildIndex}
              onSelectChild={handleSelectChild}
              onOpenReportCard={handleOpenReportCard}
              onOpenFastAdmission={() => setIsFastAdmissionOpen(true)}
              onNavigate={handleNavigate}
              unlockedCards={unlockedCards}
              showToast={showToast}
            />
          )}

          {activePage === 'academics' && (
            <AcademicsView
              role={role}
              parentChildren={parentChildrenState}
              activeChildIndex={activeParentChildIndex}
              onOpenReportCard={handleOpenReportCard}
              onOpenScoreEntry={handleOpenScoreEntry}
              gradesList={gradesList}
              unlockedCards={unlockedCards}
              showToast={showToast}
            />
          )}

          {activePage === 'staff' && (
            <StaffMatrixView
              classAllocations={classAllocations}
              allTeachersList={teachersList}
              onOpenAllocationModal={(classItem) => {
                setAllocationClass(classItem);
                setIsAllocationModalOpen(true);
              }}
              onOpenOnboardTeacher={() => setIsTeacherOnboardOpen(true)}
              showToast={showToast}
            />
          )}

          {activePage === 'students' && (
            <StudentsView
              students={students}
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onOpenReportCard={handleOpenReportCard}
              onOpenPayment={handleOpenPaymentModal}
              showToast={showToast}
              role={role}
            />
          )}

          {activePage === 'fees' && (
            <FeesView
              role={role}
              feeSchedules={feeSchedules}
              onOpenAddFee={handleOpenAddFee}
              onOpenEditFee={handleOpenEditFee}
              onDeleteFee={handleDeleteFee}
              onOpenReceipt={(payment) => {
                setReceiptData(payment);
                setIsReceiptOpen(true);
              }}
              onOpenPaymentModal={handleOpenPaymentModal}
              showToast={showToast}
              parentChildren={parentChildrenState}
              activeChildIndex={activeParentChildIndex}
            />
          )}

          {activePage === 'timetable' && <TimetableModule role={role} />}

          {activePage === 'attendance' && (
            <AttendanceModule
              role={role}
              attendanceList={attendanceList}
              onOpenAttendanceModal={handleOpenAttendanceModal}
            />
          )}

          {activePage === 'admissions' && (
            <AdmissionsModule
              admissions={admissions}
              onOpenFastAdmission={() => setIsFastAdmissionOpen(true)}
              onReviewApplicant={handleReviewApplicant}
            />
          )}

          {activePage === 'parents' && <ParentsModule />}

          {activePage === 'scratch-cards' && (
            <ScratchCardsView showToast={showToast} />
          )}

          {activePage === 'communications' && (
            <CommunicationsModule showToast={showToast} />
          )}

          {activePage === 'reports' && <ReportsModule />}

          {activePage === 'settings' && <SettingsModule showToast={showToast} />}
        </div>
      </main>

      {/* MODALS */}
      <FastAdmissionModal
        isOpen={isFastAdmissionOpen}
        onClose={() => setIsFastAdmissionOpen(false)}
        onSubmit={handleFastAdmissionSubmit}
      />

      <AdmissionReviewModal
        isOpen={isReviewApplicantOpen}
        onClose={() => setIsReviewApplicantOpen(false)}
        applicant={reviewingApplicant}
        onUpdateApplicant={handleUpdateApplicant}
        onEnrolApplicant={handleEnrolApplicant}
        showToast={showToast}
      />

      <PaymentSimulationModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        student={paymentTargetStudent}
        feeItem={paymentFeeItem}
        onPaymentSuccess={handlePaymentSuccess}
        showToast={showToast}
      />

      <AttendanceMarkingModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        students={students}
        onAttendanceSaved={handleAttendanceSaved}
        showToast={showToast}
      />

      <ScoreEntryModal
        isOpen={isScoreEntryOpen}
        onClose={() => setIsScoreEntryOpen(false)}
        students={students}
        onScoresSaved={handleScoresSaved}
        showToast={showToast}
      />

      <ReportCardModal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        activeChild={reportCardChild}
        parentChildren={parentChildrenState}
        activeChildIndex={activeParentChildIndex}
        onSwitchChild={(idx) => {
          setActiveParentChildIndex(idx);
          setReportCardChild(parentChildrenState[idx]);
        }}
        isParent={role === 'parent'}
        role={role}
        unlockedCards={unlockedCards}
        onUnlockCard={handleUnlockCard}
        showToast={showToast}
      />

      <SubjectAllocationModal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        classItem={allocationClass}
        allTeachersList={allTeachersList}
        onSaveAllocation={handleSaveAllocation}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={receiptData}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
      />

      <FeeModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        onSaveFee={handleSaveFee}
        feeItem={editingFee}
        defaultClass={defaultFeeClass}
        defaultTerm={defaultFeeTerm}
        defaultIsCustom={defaultIsCustom}
        students={students}
      />

      <TeacherOnboardingModal
        isOpen={isTeacherOnboardOpen}
        onClose={() => setIsTeacherOnboardOpen(false)}
        onTeacherCreated={handleTeacherCreated}
        showToast={showToast}
      />

      <UserCredentialSlipModal
        isOpen={isCredentialSlipOpen}
        onClose={() => setIsCredentialSlipOpen(false)}
        data={credentialSlipData}
        showToast={showToast}
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

export default function PortalPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: 'var(--canvas)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="brand-badge" style={{ margin: '0 auto 16px' }}>RH</div>
            <h3 style={{ font: '600 20px var(--serif)', color: 'var(--ink)' }}>Loading Royal Heights Portal...</h3>
          </div>
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
