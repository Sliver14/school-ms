import fs from 'fs';
import path from 'path';
import {
  studentsData,
  initialFeeSchedules,
  paymentsList,
  initialScores,
  initialClassAllocations,
  allTeachersList,
  parentChildren,
} from '../data/schoolData.js';
import { DEFAULT_PASSWORD_HASH } from './auth.js';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Check if Neon connection is real and configured
function isNeonConfigured() {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes('your_password_here') || url.includes('ep-placeholder')) return false;
  return url.startsWith('postgresql://') || url.startsWith('postgres://');
}

let neonClient = null;
async function getNeonClient() {
  if (!isNeonConfigured()) return null;
  if (!neonClient) {
    try {
      const { neon } = await import('@neondatabase/serverless');
      neonClient = neon(process.env.DATABASE_URL);
      // Run table init in background if neon is active
      await initNeonTables(neonClient);
    } catch (err) {
      console.warn('Neon connection failed, falling back to local database engine:', err.message);
      return null;
    }
  }
  return neonClient;
}

async function initNeonTables(sql) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS rh_admissions (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        entry_class VARCHAR(50) NOT NULL,
        dob VARCHAR(30),
        gender VARCHAR(20),
        parent_name VARCHAR(150),
        parent_phone VARCHAR(50),
        parent_email VARCHAR(150),
        prev_school VARCHAR(200),
        exam_date VARCHAR(50),
        exam_status VARCHAR(50) DEFAULT 'Scheduled',
        score INT DEFAULT 0,
        decision VARCHAR(50) DEFAULT 'Under Review',
        student_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rh_students (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        class VARCHAR(30) NOT NULL,
        arm VARCHAR(10) DEFAULT 'A',
        gender VARCHAR(20),
        guardian VARCHAR(150),
        phone VARCHAR(50),
        status VARCHAR(30) DEFAULT 'Active',
        initials VARCHAR(10),
        average NUMERIC DEFAULT 0,
        attendance NUMERIC DEFAULT 100,
        fee_status VARCHAR(30) DEFAULT 'Pending',
        outstanding_fee NUMERIC DEFAULT 0,
        settled_fee NUMERIC DEFAULT 0,
        total_billed NUMERIC DEFAULT 0,
        house VARCHAR(50) DEFAULT 'Sapphire House'
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rh_fees (
        id VARCHAR(50) PRIMARY KEY,
        class VARCHAR(30) NOT NULL,
        term VARCHAR(30) NOT NULL,
        session VARCHAR(30) DEFAULT '2026/2027',
        title VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount NUMERIC NOT NULL,
        type VARCHAR(50) DEFAULT 'Mandatory',
        due_date VARCHAR(50),
        description TEXT,
        is_custom BOOLEAN DEFAULT FALSE,
        scope VARCHAR(50) DEFAULT 'all',
        discount_waiver INT DEFAULT 0
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rh_payments (
        id VARCHAR(50) PRIMARY KEY,
        student_id VARCHAR(50),
        student_name VARCHAR(150) NOT NULL,
        parent_name VARCHAR(150),
        title VARCHAR(200) NOT NULL,
        class VARCHAR(30),
        term VARCHAR(30),
        amount VARCHAR(50),
        raw_amount NUMERIC NOT NULL,
        method VARCHAR(50) DEFAULT 'Paystack Card',
        reference VARCHAR(100),
        date VARCHAR(50),
        status VARCHAR(30) DEFAULT 'Verified'
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rh_grades (
        id VARCHAR(100) PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(150) NOT NULL,
        class VARCHAR(30) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        ca1 INT DEFAULT 0,
        ca2 INT DEFAULT 0,
        exam INT DEFAULT 0,
        total INT DEFAULT 0,
        grade VARCHAR(10) DEFAULT 'F',
        remark VARCHAR(100),
        status VARCHAR(30) DEFAULT 'Submitted'
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rh_attendance (
        id VARCHAR(100) PRIMARY KEY,
        date VARCHAR(50) NOT NULL,
        student_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(150) NOT NULL,
        class VARCHAR(30) NOT NULL,
        period VARCHAR(50) DEFAULT 'Morning Roll Call',
        status VARCHAR(30) NOT NULL,
        remark VARCHAR(200)
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rh_users (
        id VARCHAR(50) PRIMARY KEY,
        identifier VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(30) NOT NULL,
        name VARCHAR(150) NOT NULL,
        avatar VARCHAR(10),
        phone VARCHAR(50),
        linked_ids JSONB DEFAULT '[]'::jsonb,
        must_change_password BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rh_teachers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150),
        phone VARCHAR(50),
        role VARCHAR(100),
        dept VARCHAR(100),
        qualification VARCHAR(100),
        primary_subject VARCHAR(100),
        form_teacher_class VARCHAR(50)
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rh_class_allocations (
        class_key VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        arm VARCHAR(10),
        room VARCHAR(50),
        capacity INT,
        enrolled INT,
        form_teacher VARCHAR(150),
        subjects JSONB DEFAULT '[]'::jsonb
      );
    `;
  } catch (err) {
    console.error('Neon table schema check failed:', err.message);
  }
}

// -------------------------------------------------------------
// Local JSON Storage Engine (Robust Fallback & Fast Prototyping)
// -------------------------------------------------------------
function getSeedData() {
  const initialAdmissions = [
    {
      id: 'ADM-2026-001',
      name: 'Chidinma Okafor',
      entryClass: 'JS 1',
      dob: '2013-05-14',
      gender: 'Female',
      parentName: 'Engr. Chidi Okafor',
      parentPhone: '+234 803 712 8890',
      parentEmail: 'chidi.okafor@primeeng.com',
      prevSchool: 'Corona Primary School, Victoria Island',
      examDate: 'Saturday, 24 Oct 2026 · 09:00 AM (Hall B)',
      examStatus: 'Scheduled',
      score: 0,
      decision: 'Under Review',
      createdAt: '2026-10-14T08:30:00Z',
    },
    {
      id: 'ADM-2026-002',
      name: 'Zainab Al-Mansoor',
      entryClass: 'SS 1 Science',
      dob: '2011-09-20',
      gender: 'Female',
      parentName: 'Alhaji T. Al-Mansoor',
      parentPhone: '+234 802 334 1122',
      parentEmail: 't.almansoor@horizon.ng',
      prevSchool: 'Crescent High School, Ikeja',
      examDate: 'Completed (CBT Lab 1)',
      examStatus: 'Passed (88%)',
      score: 88,
      decision: 'Accepted',
      createdAt: '2026-10-12T10:15:00Z',
    },
    {
      id: 'ADM-2026-003',
      name: 'Oluwaseun Balogun',
      entryClass: 'SS 1 Commercial',
      dob: '2011-04-18',
      gender: 'Male',
      parentName: 'Mrs. Folake Balogun',
      parentPhone: '+234 805 998 2210',
      parentEmail: 'fbalogun@fidelity.com',
      prevSchool: 'Grace High School, Gbagada',
      examDate: 'Saturday, 24 Oct 2026 · 11:30 AM (Hall A)',
      examStatus: 'Scheduled',
      score: 0,
      decision: 'Interview Scheduled',
      createdAt: '2026-10-15T14:20:00Z',
    },
    {
      id: 'ADM-2026-004',
      name: 'Emeka Chukwuka',
      entryClass: 'JS 1',
      dob: '2013-11-02',
      gender: 'Male',
      parentName: 'Chief Emeka Chukwuka Snr.',
      parentPhone: '+234 803 111 4455',
      parentEmail: 'chukwuka.holdings@gmail.com',
      prevSchool: 'St. Saviour’s School, Ikoyi',
      examDate: 'Completed',
      examStatus: 'Passed (76%)',
      score: 76,
      decision: 'Accepted',
      createdAt: '2026-10-10T09:00:00Z',
    },
  ];

  // Enhanced students with full financial breakdown & parent linkages
  const seededStudents = studentsData.map((s, idx) => {
    const isAdeyemi = s.name === 'Daniel Adeyemi';
    const isOkafor = s.name === 'Amara Okafor';
    const totalBilled = isAdeyemi ? 185000 : isOkafor ? 165000 : 160000;
    const settledFee = isAdeyemi ? 100000 : isOkafor ? 165000 : idx % 2 === 0 ? 160000 : 80000;
    const outstandingFee = Math.max(0, totalBilled - settledFee);
    const feeStatus = outstandingFee === 0 ? 'Paid' : settledFee > 0 ? 'Partial' : 'Pending';

    return {
      ...s,
      house: idx % 3 === 0 ? 'Sapphire House' : idx % 3 === 1 ? 'Emerald House' : 'Ruby House',
      boardingStatus: idx % 4 === 0 ? 'Boarder' : 'Day',
      parent: s.guardian,
      totalBilled,
      settledFee,
      outstandingFee,
      feeStatus,
      clearanceStatus: feeStatus === 'Paid' ? 'Cleared ✓' : 'Exam Hold',
      conductGrade: 'Excellent (A)',
      formTeacherComment: 'A very dedicated and intellectually curious student with exceptional leadership acumen.',
      principalComment: 'Promoted with Honours. Consistently upholds Royal Heights values of Excellence and Integrity.',
    };
  });

  // Comprehensive gradebook data
  const seededGrades = [];
  const subjectsPool = [
    'Mathematics',
    'English Language',
    'Biology',
    'Physics',
    'Chemistry',
    'Economics',
    'Computer Studies',
    'Civic Education',
  ];

  seededStudents.forEach((student) => {
    subjectsPool.forEach((sub, sIdx) => {
      const baseCa1 = 7 + ((sIdx + student.name.length) % 4);
      const baseCa2 = 7 + ((sIdx * 2 + student.name.length) % 4);
      const baseExam = 50 + ((sIdx * 3 + student.name.length * 2) % 20);
      const total = baseCa1 + baseCa2 + baseExam;
      const grade = total >= 80 ? 'A*' : total >= 70 ? 'A' : total >= 60 ? 'B' : total >= 50 ? 'C' : 'F';
      const remark = total >= 80 ? 'Distinction' : total >= 70 ? 'Excellent' : total >= 60 ? 'Very Good' : total >= 50 ? 'Credit' : 'Fail';

      seededGrades.push({
        id: `${student.id}-${sub.replace(/\s+/g, '')}`,
        studentId: student.id,
        studentName: student.name,
        class: student.class,
        term: '1st Term',
        session: '2026/2027',
        subject: sub,
        ca1: Math.min(10, baseCa1),
        ca2: Math.min(10, baseCa2),
        exam: Math.min(80, baseExam),
        total,
        grade,
        remark,
        status: 'Submitted',
      });
    });
  });

  const seededAttendance = [
    { id: 'ATT-001', date: '2026-10-16', studentId: 'RH/2024/018', studentName: 'Daniel Adeyemi', class: 'SS2', arm: 'A', status: 'Present', remark: 'Punctual (Early arrival)' },
    { id: 'ATT-002', date: '2026-10-16', studentId: 'RH/2025/041', studentName: 'Amara Okafor', class: 'SS1', arm: 'B', status: 'Present', remark: 'Punctual' },
    { id: 'ATT-003', date: '2026-10-16', studentId: 'RH/2023/006', studentName: 'Ibrahim Musa', class: 'SS3', arm: 'A', status: 'Late', remark: 'Arrived 08:15 AM' },
    { id: 'ATT-004', date: '2026-10-16', studentId: 'RH/2024/029', studentName: 'Chidi Nwosu', class: 'SS2', arm: 'B', status: 'Present', remark: 'Punctual' },
    { id: 'ATT-005', date: '2026-10-15', studentId: 'RH/2024/018', studentName: 'Daniel Adeyemi', class: 'SS2', arm: 'A', status: 'Present', remark: 'Punctual' },
    { id: 'ATT-006', date: '2026-10-14', studentId: 'RH/2024/018', studentName: 'Daniel Adeyemi', class: 'SS2', arm: 'A', status: 'Excused', remark: 'Clinic appointment' },
  ];

  const seededUsers = [
    {
      id: 'USR-001',
      identifier: 'admin@royalheights.edu.ng',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'admin',
      name: 'School Administrator',
      avatar: 'AD',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'USR-002',
      identifier: 's.okoro@royalheights.edu.ng',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'teacher',
      name: 'Mr. Samuel Okoro',
      avatar: 'SO',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'USR-003',
      identifier: 'RH/2024/018',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'student',
      name: 'Daniel Adeyemi',
      avatar: 'DA',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'USR-004',
      identifier: 'adeyemi.t@gmail.com',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'parent',
      name: 'Mrs. T. Adeyemi',
      avatar: 'PA',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'USR-005',
      identifier: 'bursar@royalheights.edu.ng',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'bursar',
      name: 'Bursary Ledger Desk',
      avatar: 'AC',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    users: seededUsers,
    admissions: initialAdmissions,
    students: seededStudents,
    feeSchedules: initialFeeSchedules,
    payments: paymentsList,
    grades: seededGrades,
    attendance: seededAttendance,
    classAllocations: initialClassAllocations,
    teachers: allTeachersList,
    parentChildren: parentChildren,
  };
}

export function readLocalDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const seed = getSeedData();
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
      const seed = getSeedData();
      parsed.users = seed.users;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading local db:', err);
    return getSeedData();
  }
}

export function writeLocalDb(data) {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local db:', err);
    return false;
  }
}

// -------------------------------------------------------------
// Data Access Methods (Admissions, Students, Fees, Grades, etc.)
// -------------------------------------------------------------

// 1. ADMISSIONS
export async function getAdmissions() {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM rh_admissions ORDER BY created_at DESC;`;
      if (rows && rows.length > 0) return rows;
    } catch (e) {
      console.warn('Neon query fallback to local DB:', e.message);
    }
  }
  const db = readLocalDb();
  return db.admissions || [];
}

export async function createAdmission(app) {
  const db = readLocalDb();
  const newApp = {
    id: `ADM-2026-${String((db.admissions?.length || 0) + 1).padStart(3, '0')}`,
    name: app.fullName || app.name,
    entryClass: app.entryClass,
    dob: app.dob || '2013-05-14',
    gender: app.gender || 'Female',
    parentName: app.parentName,
    parentPhone: app.parentPhone,
    parentEmail: app.parentEmail,
    prevSchool: app.prevSchool || 'N/A',
    examDate: 'Saturday, 24 Oct 2026 · 09:00 AM (Hall B)',
    examStatus: 'Scheduled',
    score: 0,
    decision: 'Under Review',
    createdAt: new Date().toISOString(),
  };

  db.admissions = [newApp, ...(db.admissions || [])];
  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO rh_admissions (id, name, entry_class, dob, gender, parent_name, parent_phone, parent_email, prev_school, exam_date, exam_status, score, decision)
        VALUES (${newApp.id}, ${newApp.name}, ${newApp.entryClass}, ${newApp.dob}, ${newApp.gender}, ${newApp.parentName}, ${newApp.parentPhone}, ${newApp.parentEmail}, ${newApp.prevSchool}, ${newApp.examDate}, ${newApp.examStatus}, ${newApp.score}, ${newApp.decision});
      `;
    } catch (e) {
      console.warn('Neon insert error:', e.message);
    }
  }

  return newApp;
}

export async function updateAdmission(id, updateData) {
  const db = readLocalDb();
  const idx = (db.admissions || []).findIndex((a) => a.id === id);
  if (idx === -1) return null;

  db.admissions[idx] = { ...db.admissions[idx], ...updateData };
  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      if (updateData.score !== undefined && updateData.decision) {
        await sql`
          UPDATE rh_admissions 
          SET score = ${updateData.score}, decision = ${updateData.decision}, exam_status = ${updateData.examStatus || 'Completed'}
          WHERE id = ${id};
        `;
      }
    } catch (e) {
      console.warn('Neon update error:', e.message);
    }
  }

  return db.admissions[idx];
}

// Convert admitted applicant to full enrolled student!
export async function enrolAdmittedApplicant(admissionId, customFields = {}) {
  const db = readLocalDb();
  const applicant = (db.admissions || []).find((a) => a.id === admissionId);
  if (!applicant) throw new Error('Applicant not found');

  const year = '2026';
  const seq = String((db.students?.length || 0) + 1).padStart(3, '0');
  const studentId = `RH/${year}/${seq}`;

  // Map entryClass to standard class name
  let targetClass = applicant.entryClass || 'JSS1';
  if (targetClass.includes('JS 1')) targetClass = 'JSS1';
  else if (targetClass.includes('JS 2')) targetClass = 'JSS2';
  else if (targetClass.includes('JS 3')) targetClass = 'JSS3';
  else if (targetClass.includes('SS 1')) targetClass = 'SS1';
  else if (targetClass.includes('SS 2')) targetClass = 'SS2';
  else if (targetClass.includes('SS 3')) targetClass = 'SS3';

  const nameParts = applicant.name.trim().split(' ');
  const initials = nameParts.length >= 2 
    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
    : applicant.name.slice(0, 2).toUpperCase();

  const newStudent = {
    id: studentId,
    name: applicant.name,
    class: targetClass,
    arm: customFields.arm || 'A',
    gender: applicant.gender || 'Female',
    guardian: applicant.parentName,
    parent: applicant.parentName,
    phone: applicant.parentPhone,
    status: 'Active',
    initials,
    average: applicant.score || 78,
    attendance: 100,
    house: customFields.house || 'Sapphire House',
    boardingStatus: customFields.boardingStatus || 'Day',
    feeStatus: 'Pending',
    totalBilled: 165000,
    settledFee: 0,
    outstandingFee: 165000,
    clearanceStatus: 'Exam Hold (Fees Pending)',
    conductGrade: 'Excellent (A)',
    formTeacherComment: 'Newly enrolled scholar. Showed high analytical prowess in entrance evaluations.',
    principalComment: 'Welcome to Royal Heights. Admitted on Merit.',
  };

  db.students = [newStudent, ...(db.students || [])];
  
  // Update admission status
  const admIdx = db.admissions.findIndex((a) => a.id === admissionId);
  if (admIdx !== -1) {
    db.admissions[admIdx].decision = 'Enrolled ✓';
    db.admissions[admIdx].studentId = studentId;
  }

  writeLocalDb(db);

  // Auto-provision Student User Account
  await createUserAccount({
    identifier: newStudent.id,
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'student',
    name: newStudent.name,
    avatar: initials,
    phone: newStudent.phone || '',
    linkedIds: [newStudent.id],
  });

  // Auto-provision or Link Parent User Account
  const parentEmail = applicant.parentEmail || `${newStudent.name.toLowerCase().replace(/\s+/g, '.')}.guardian@royalheights.parent.ng`;
  await createUserAccount({
    identifier: parentEmail,
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'parent',
    name: newStudent.guardian || `Parent of ${newStudent.name}`,
    avatar: 'PA',
    phone: newStudent.phone || '',
    linkedIds: [newStudent.id],
  });

  await linkStudentToParent(parentEmail, newStudent.id, newStudent.name);

  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO rh_students (id, name, class, arm, gender, guardian, phone, status, initials, average, attendance, fee_status, outstanding_fee, total_billed, house)
        VALUES (${newStudent.id}, ${newStudent.name}, ${newStudent.class}, ${newStudent.arm}, ${newStudent.gender}, ${newStudent.guardian}, ${newStudent.phone}, ${newStudent.status}, ${newStudent.initials}, ${newStudent.average}, ${newStudent.attendance}, ${newStudent.feeStatus}, ${newStudent.outstandingFee}, ${newStudent.totalBilled}, ${newStudent.house});
      `;
      await sql`
        UPDATE rh_admissions SET decision = 'Enrolled ✓', student_id = ${studentId} WHERE id = ${admissionId};
      `;
    } catch (e) {
      console.warn('Neon enrol sync error:', e.message);
    }
  }

  return {
    ...newStudent,
    credentialSlip: {
      studentUsername: newStudent.id,
      studentPasscode: 'RoyalHeights@2026',
      parentEmail,
      parentPasscode: 'RoyalHeights@2026',
    },
  };
}

// 2. STUDENTS
export async function getStudents() {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM rh_students ORDER BY name ASC;`;
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          name: r.name,
          class: r.class,
          arm: r.arm || 'A',
          gender: r.gender || 'Unknown',
          guardian: r.guardian,
          parent: r.parent_name || r.guardian,
          phone: r.phone,
          status: r.status || 'Active',
          initials: r.initials,
          average: Number(r.average) || 0,
          attendance: Number(r.attendance) || 100,
          feeStatus: r.fee_status || 'Pending',
          outstandingFee: Number(r.outstanding_fee) || 0,
          settledFee: Number(r.settled_fee) || 0,
          totalBilled: Number(r.total_billed) || 0,
          house: r.house || 'Sapphire House',
          boardingStatus: r.boarding_status || 'Day',
          clearanceStatus: r.clearance_status || (r.fee_status === 'Paid' ? 'Cleared ✓' : 'Exam Hold'),
          conductGrade: r.conduct_grade || 'Good',
          formTeacherComment: r.form_teacher_comment || '',
          principalComment: r.principal_comment || '',
        }));
      }
    } catch (e) {
      console.warn('Neon getStudents query fallback to local DB:', e.message);
    }
  }
  const db = readLocalDb();
  return db.students || [];
}

export async function createStudent(student) {
  const db = readLocalDb();
  const year = '2026';
  const seq = String((db.students?.length || 0) + 1).padStart(3, '0');
  const studentId = student.id || `RH/${year}/${seq}`;

  const nameParts = student.name.trim().split(' ');
  const initials = nameParts.length >= 2 
    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
    : student.name.slice(0, 2).toUpperCase();

  const newStudent = {
    ...student,
    id: studentId,
    initials,
    status: student.status || 'Active',
    feeStatus: student.feeStatus || 'Paid',
    totalBilled: student.totalBilled || 165000,
    settledFee: student.feeStatus === 'Paid' ? (student.totalBilled || 165000) : 0,
    outstandingFee: student.feeStatus === 'Paid' ? 0 : (student.totalBilled || 165000),
    clearanceStatus: student.feeStatus === 'Paid' ? 'Cleared ✓' : 'Exam Hold',
  };

  db.students = [newStudent, ...(db.students || [])];
  writeLocalDb(db);

  // Auto-provision Student Account
  await createUserAccount({
    identifier: newStudent.id,
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'student',
    name: newStudent.name,
    avatar: initials,
    phone: newStudent.phone || '',
    linkedIds: [newStudent.id],
  });

  // Auto-provision / Link Parent Account
  const parentEmail = student.parentEmail || `${newStudent.name.toLowerCase().replace(/\s+/g, '.')}.guardian@royalheights.parent.ng`;
  await createUserAccount({
    identifier: parentEmail,
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'parent',
    name: newStudent.parent || `Parent of ${newStudent.name}`,
    avatar: 'PA',
    phone: newStudent.phone || '',
    linkedIds: [newStudent.id],
  });

  await linkStudentToParent(parentEmail, newStudent.id, newStudent.name);

  // Sync to Neon if active
  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO rh_students (
          id, name, class, arm, gender, guardian, parent_name, phone, status,
          initials, average, attendance, fee_status, outstanding_fee, settled_fee,
          total_billed, house, boarding_status, clearance_status
        ) VALUES (
          ${newStudent.id}, ${newStudent.name}, ${newStudent.class}, ${newStudent.arm || 'A'},
          ${newStudent.gender || 'Unknown'}, ${newStudent.guardian || newStudent.parent || ''}, ${newStudent.parent || ''},
          ${newStudent.phone || ''}, ${newStudent.status}, ${newStudent.initials},
          ${Number(newStudent.average) || 0}, ${Number(newStudent.attendance) || 100},
          ${newStudent.feeStatus}, ${Number(newStudent.outstandingFee) || 0},
          ${Number(newStudent.settledFee) || 0}, ${Number(newStudent.totalBilled) || 0},
          ${newStudent.house || 'Sapphire House'}, ${newStudent.boardingStatus || 'Day'},
          ${newStudent.clearanceStatus}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          class = EXCLUDED.class,
          status = EXCLUDED.status,
          fee_status = EXCLUDED.fee_status,
          outstanding_fee = EXCLUDED.outstanding_fee;
      `;
    } catch (e) {
      console.warn('Neon student insert error:', e.message);
    }
  }

  return {
    ...newStudent,
    credentialSlip: {
      studentUsername: newStudent.id,
      studentPasscode: 'RoyalHeights@2026',
      parentEmail,
      parentPasscode: 'RoyalHeights@2026',
    },
  };
}

export async function updateStudent(id, fields) {
  const db = readLocalDb();
  const idx = (db.students || []).findIndex((s) => s.id === id);
  if (idx === -1) return null;

  db.students[idx] = { ...db.students[idx], ...fields };
  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        UPDATE rh_students
        SET status = COALESCE(${fields.status || null}, status),
            fee_status = COALESCE(${fields.feeStatus || null}, fee_status),
            outstanding_fee = COALESCE(${fields.outstandingFee !== undefined ? Number(fields.outstandingFee) : null}, outstanding_fee),
            settled_fee = COALESCE(${fields.settledFee !== undefined ? Number(fields.settledFee) : null}, settled_fee),
            average = COALESCE(${fields.average !== undefined ? Number(fields.average) : null}, average),
            attendance = COALESCE(${fields.attendance !== undefined ? Number(fields.attendance) : null}, attendance)
        WHERE id = ${id};
      `;
    } catch (e) {
      console.warn('Neon student update error:', e.message);
    }
  }

  return db.students[idx];
}

// 3. FEES
export async function getFees() {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM rh_fees ORDER BY class, title;`;
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          class: r.class,
          term: r.term,
          session: r.session,
          title: r.title,
          category: r.category,
          amount: Number(r.amount) || 0,
          type: r.type,
          dueDate: r.due_date,
          description: r.description,
          isCustom: r.is_custom,
          scope: r.scope,
          discountWaiver: Number(r.discount_waiver) || 0,
        }));
      }
    } catch (e) {
      console.warn('Neon getFees fallback to local DB:', e.message);
    }
  }
  const db = readLocalDb();
  return db.feeSchedules || [];
}

export async function createFee(fee) {
  const db = readLocalDb();
  const newFee = {
    ...fee,
    id: fee.id || `FEE-${fee.class}-${Date.now().toString().slice(-4)}`,
  };
  db.feeSchedules = [newFee, ...(db.feeSchedules || [])];
  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO rh_fees (id, class, term, session, title, category, amount, type, due_date, description, is_custom, scope, discount_waiver)
        VALUES (
          ${newFee.id}, ${newFee.class}, ${newFee.term || '1st Term'}, ${newFee.session || '2026/2027'},
          ${newFee.title}, ${newFee.category || 'Tuition'}, ${Number(newFee.amount) || 0},
          ${newFee.type || 'Mandatory'}, ${newFee.dueDate || null}, ${newFee.description || null},
          ${!!newFee.isCustom}, ${newFee.scope || 'all'}, ${Number(newFee.discountWaiver) || 0}
        )
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, amount = EXCLUDED.amount;
      `;
    } catch (e) {
      console.warn('Neon fee insert error:', e.message);
    }
  }

  return newFee;
}

export async function deleteFee(id) {
  const db = readLocalDb();
  db.feeSchedules = (db.feeSchedules || []).filter((f) => f.id !== id);
  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`DELETE FROM rh_fees WHERE id = ${id};`;
    } catch (e) {
      console.warn('Neon fee delete error:', e.message);
    }
  }

  return true;
}

// 4. PAYMENTS & CLEARANCE
export async function getPayments() {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM rh_payments ORDER BY id DESC;`;
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          studentId: r.student_id,
          student: r.student_name,
          name: r.student_name,
          parent: r.parent_name,
          title: r.title,
          class: r.class,
          term: r.term,
          amount: r.amount,
          rawAmount: Number(r.raw_amount) || 0,
          method: r.method,
          reference: r.reference,
          date: r.date,
          status: r.status,
        }));
      }
    } catch (e) {
      console.warn('Neon getPayments fallback to local DB:', e.message);
    }
  }
  const db = readLocalDb();
  return db.payments || [];
}

export async function processPayment(paymentData) {
  const db = readLocalDb();
  const paymentId = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;
  const refCode = `REF-RH-${Date.now().toString().slice(-6)}`;
  const dateFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const rawAmount = Number(paymentData.amount) || 0;
  const newPayment = {
    id: paymentId,
    name: paymentData.studentName,
    student: paymentData.studentName,
    parent: paymentData.parentName || 'Parent / Sponsor',
    title: paymentData.title || 'Tuition & Development Fee Settlement',
    class: paymentData.class || 'SS2',
    term: paymentData.term || '1st Term',
    amount: `₦${rawAmount.toLocaleString()}`,
    rawAmount,
    method: paymentData.method || 'Paystack Card',
    reference: refCode,
    date: dateFormatted,
    status: 'Verified',
  };

  db.payments = [newPayment, ...(db.payments || [])];

  // If student is specified, update student fee balance & clearance status!
  if (paymentData.studentId) {
    const sIdx = (db.students || []).findIndex((s) => s.id === paymentData.studentId);
    if (sIdx !== -1) {
      const student = db.students[sIdx];
      const newSettled = (Number(student.settledFee) || 0) + rawAmount;
      const newOutstanding = Math.max(0, (Number(student.totalBilled) || 0) - newSettled);
      const feeStatus = newOutstanding === 0 ? 'Paid' : 'Partial';
      const clearanceStatus = newOutstanding === 0 ? 'Cleared ✓' : 'Partial Clearance';

      db.students[sIdx] = {
        ...student,
        settledFee: newSettled,
        outstandingFee: newOutstanding,
        feeStatus,
        clearanceStatus,
      };
    }
  }

  // Also update parentChildren in db if applicable
  if (db.parentChildren && Array.isArray(db.parentChildren)) {
    db.parentChildren = db.parentChildren.map((child) => {
      if (child.name === paymentData.studentName || child.id === paymentData.studentId) {
        const newSettled = (Number(child.settledFee) || 0) + rawAmount;
        const newOutstanding = Math.max(0, (Number(child.totalBilled) || 0) - newSettled);
        return {
          ...child,
          settledFee: newSettled,
          outstandingFee: newOutstanding,
          recentReceipt: {
            id: paymentId,
            date: dateFormatted,
            amount: rawAmount,
            method: paymentData.method || 'Paystack Card',
            status: 'Verified',
          },
        };
      }
      return child;
    });
  }

  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO rh_payments (id, student_id, student_name, parent_name, title, class, term, amount, raw_amount, method, reference, date, status)
        VALUES (
          ${newPayment.id}, ${paymentData.studentId || null}, ${newPayment.student}, ${newPayment.parent},
          ${newPayment.title}, ${newPayment.class}, ${newPayment.term}, ${newPayment.amount},
          ${newPayment.rawAmount}, ${newPayment.method}, ${newPayment.reference}, ${newPayment.date},
          ${newPayment.status}
        );
      `;
      if (paymentData.studentId) {
        await sql`
          UPDATE rh_students
          SET settled_fee = settled_fee + ${rawAmount},
              outstanding_fee = GREATEST(0, total_billed - (settled_fee + ${rawAmount})),
              fee_status = CASE WHEN total_billed <= (settled_fee + ${rawAmount}) THEN 'Paid' ELSE 'Partial' END,
              clearance_status = CASE WHEN total_billed <= (settled_fee + ${rawAmount}) THEN 'Cleared ✓' ELSE 'Partial Clearance' END
          WHERE id = ${paymentData.studentId};
        `;
      }
    } catch (e) {
      console.warn('Neon payment process error:', e.message);
    }
  }

  return newPayment;
}

// 5. ATTENDANCE
export async function getAttendance(query = {}) {
  const sql = await getNeonClient();
  if (sql) {
    try {
      let rows;
      if (query.studentId) {
        rows = await sql`SELECT * FROM rh_attendance WHERE student_id = ${query.studentId} ORDER BY date DESC;`;
      } else if (query.class && query.date) {
        rows = await sql`SELECT * FROM rh_attendance WHERE class = ${query.class} AND date = ${query.date} ORDER BY student_name ASC;`;
      } else if (query.class) {
        rows = await sql`SELECT * FROM rh_attendance WHERE class = ${query.class} ORDER BY date DESC;`;
      } else {
        rows = await sql`SELECT * FROM rh_attendance ORDER BY date DESC LIMIT 200;`;
      }
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          date: r.date,
          studentId: r.student_id,
          studentName: r.student_name,
          class: r.class,
          arm: r.arm || 'A',
          period: r.period || 'Morning Roll Call',
          status: r.status,
          remark: r.remark,
        }));
      }
    } catch (e) {
      console.warn('Neon getAttendance fallback:', e.message);
    }
  }
  const db = readLocalDb();
  let list = db.attendance || [];
  if (query.class) list = list.filter((a) => a.class === query.class);
  if (query.date) list = list.filter((a) => a.date === query.date);
  if (query.studentId) list = list.filter((a) => a.studentId === query.studentId);
  return list;
}

export async function markAttendance(records) {
  const db = readLocalDb();
  const existing = db.attendance || [];
  
  // records is an array of { studentId, studentName, class, status, remark, date }
  const newRecords = records.map((r, i) => ({
    id: `ATT-${Date.now()}-${i}`,
    date: r.date || new Date().toISOString().split('T')[0],
    studentId: r.studentId,
    studentName: r.studentName,
    class: r.class,
    arm: r.arm || 'A',
    period: r.period || 'Morning Roll Call',
    status: r.status || 'Present',
    remark: r.remark || (r.status === 'Present' ? 'On Time' : r.status),
  }));

  db.attendance = [...newRecords, ...existing];
  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      for (const r of newRecords) {
        await sql`
          INSERT INTO rh_attendance (id, date, student_id, student_name, class, arm, period, status, remark)
          VALUES (${r.id}, ${r.date}, ${r.studentId}, ${r.studentName}, ${r.class}, ${r.arm || 'A'}, ${r.period}, ${r.status}, ${r.remark})
          ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, remark = EXCLUDED.remark;
        `;
      }
    } catch (e) {
      console.warn('Neon attendance sync error:', e.message);
    }
  }

  return newRecords;
}

// 6. GRADES & CONTINUOUS ASSESSMENT
export async function getGrades(query = {}) {
  const sql = await getNeonClient();
  if (sql) {
    try {
      let rows;
      if (query.studentId) {
        rows = await sql`SELECT * FROM rh_grades WHERE student_id = ${query.studentId} ORDER BY subject ASC;`;
      } else if (query.class) {
        rows = await sql`SELECT * FROM rh_grades WHERE class = ${query.class} ORDER BY student_name, subject;`;
      } else {
        rows = await sql`SELECT * FROM rh_grades ORDER BY class, student_name LIMIT 300;`;
      }
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          studentId: r.student_id,
          studentName: r.student_name,
          class: r.class,
          term: r.term || '1st Term',
          session: r.session || '2026/2027',
          subject: r.subject,
          ca1: Number(r.ca1) || 0,
          ca2: Number(r.ca2) || 0,
          exam: Number(r.exam) || 0,
          total: Number(r.total) || 0,
          grade: r.grade,
          remark: r.remark,
          status: r.status,
        }));
      }
    } catch (e) {
      console.warn('Neon getGrades fallback:', e.message);
    }
  }
  const db = readLocalDb();
  let list = db.grades || [];
  if (query.studentId) list = list.filter((g) => g.studentId === query.studentId);
  if (query.class) list = list.filter((g) => g.class === query.class);
  if (query.subject) list = list.filter((g) => g.subject.toLowerCase() === query.subject.toLowerCase());
  return list;
}

export async function saveGrades(entries) {
  const db = readLocalDb();
  const existingGrades = db.grades || [];

  entries.forEach((entry) => {
    const total = (Number(entry.ca1) || 0) + (Number(entry.ca2) || 0) + (Number(entry.exam) || 0);
    const grade = total >= 80 ? 'A*' : total >= 70 ? 'A' : total >= 60 ? 'B' : total >= 50 ? 'C' : 'F';
    const remark = total >= 80 ? 'Distinction' : total >= 70 ? 'Excellent' : total >= 60 ? 'Very Good' : total >= 50 ? 'Credit' : 'Fail';

    const gradeId = `${entry.studentId}-${entry.subject.replace(/\s+/g, '')}`;
    const idx = existingGrades.findIndex((g) => g.id === gradeId || (g.studentId === entry.studentId && g.subject === entry.subject));

    const record = {
      id: gradeId,
      studentId: entry.studentId,
      studentName: entry.studentName,
      class: entry.class,
      subject: entry.subject,
      term: entry.term || '1st Term',
      session: entry.session || '2026/2027',
      ca1: Number(entry.ca1) || 0,
      ca2: Number(entry.ca2) || 0,
      exam: Number(entry.exam) || 0,
      total,
      grade,
      remark,
      status: 'Submitted',
    };

    if (idx !== -1) {
      existingGrades[idx] = { ...existingGrades[idx], ...record };
    } else {
      existingGrades.push(record);
    }
  });

  db.grades = existingGrades;
  writeLocalDb(db);
  return db.grades;
}

// 7. COMPILED OFFICIAL REPORT CARD
export async function getReportCard(studentId) {
  const db = readLocalDb();
  const student = (db.students || []).find((s) => s.id === studentId) || db.students?.[0];
  if (!student) return null;

  const grades = (db.grades || []).filter((g) => g.studentId === student.id);
  const totalMarks = grades.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const avgMarks = grades.length > 0 ? (totalMarks / grades.length).toFixed(1) : student.average || 80.0;
  const gpa = (avgMarks / 25).toFixed(2);

  return {
    student,
    grades,
    avgScore: avgMarks,
    gpa,
    rank: student.rank || '3rd of 32',
    term: '1st Term',
    session: '2026/2027',
    attendance: student.attendance || 96,
    conductGrade: student.conductGrade || 'A (Exemplary)',
    formTeacherComment: student.formTeacherComment || 'Maintains high academic standards and demonstrates leadership in group practicals.',
    principalComment: student.principalComment || 'Promoted with Honours. A pillar of character and academic excellence.',
  };
}

// 8. ALLOCATIONS & TEACHERS
export async function getAllocations() {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const teachersRows = await sql`SELECT * FROM rh_teachers ORDER BY id ASC;`;
      const allocRows = await sql`SELECT * FROM rh_class_allocations;`;
      const classAllocations = {};
      allocRows.forEach((r) => {
        classAllocations[r.class_key] = {
          name: r.name,
          category: r.category,
          arm: r.arm,
          room: r.room,
          capacity: Number(r.capacity) || 35,
          enrolled: Number(r.enrolled) || 0,
          formTeacher: r.form_teacher,
          subjects: typeof r.subjects === 'string' ? JSON.parse(r.subjects) : (r.subjects || []),
        };
      });

      const teachers = teachersRows.map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        role: t.role,
        dept: t.dept,
        qualification: t.qualification,
        primarySubject: t.primary_subject,
        formTeacherClass: t.form_teacher_class,
      }));

      return {
        classAllocations: Object.keys(classAllocations).length > 0 ? classAllocations : (readLocalDb().classAllocations || initialClassAllocations),
        teachers: teachers.length > 0 ? teachers : (readLocalDb().teachers || allTeachersList),
      };
    } catch (e) {
      console.warn('Neon getAllocations fallback:', e.message);
    }
  }
  const db = readLocalDb();
  return {
    classAllocations: db.classAllocations || initialClassAllocations,
    teachers: db.teachers || allTeachersList,
  };
}

export async function saveAllocation(classKey, allocationData) {
  const db = readLocalDb();
  if (!db.classAllocations) db.classAllocations = { ...initialClassAllocations };
  db.classAllocations[classKey] = {
    ...db.classAllocations[classKey],
    ...allocationData,
  };
  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      const item = db.classAllocations[classKey];
      await sql`
        INSERT INTO rh_class_allocations (class_key, name, category, arm, room, capacity, enrolled, form_teacher, subjects)
        VALUES (
          ${classKey}, ${item.name || classKey}, ${item.category || null}, ${item.arm || null},
          ${item.room || null}, ${Number(item.capacity) || 35}, ${Number(item.enrolled) || 0},
          ${item.formTeacher || null}, ${JSON.stringify(item.subjects || [])}::jsonb
        )
        ON CONFLICT (class_key) DO UPDATE SET
          name = EXCLUDED.name,
          form_teacher = EXCLUDED.form_teacher,
          enrolled = EXCLUDED.enrolled,
          subjects = EXCLUDED.subjects;
      `;
    } catch (e) {
      console.warn('Neon saveAllocation error:', e.message);
    }
  }

  return db.classAllocations[classKey];
}

// 9. USER AUTHENTICATION & SECURITY
export async function getUserByIdentifier(identifier) {
  if (!identifier) return null;
  const q = identifier.trim().toLowerCase();

  const sql = await getNeonClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM rh_users WHERE LOWER(identifier) = ${q} LIMIT 1;`;
      if (rows && rows.length > 0) {
        const u = rows[0];
        return {
          id: u.id,
          identifier: u.identifier,
          passwordHash: u.password_hash,
          role: u.role,
          name: u.name,
          avatar: u.avatar,
        };
      }
    } catch (e) {
      console.warn('Neon query error for user, fallback to local DB:', e.message);
    }
  }

  const db = readLocalDb();
  const users = db.users || [];
  return users.find((u) => u.identifier.trim().toLowerCase() === q) || null;
}

export async function updateUserPassword(identifier, newHashedPassword) {
  if (!identifier || !newHashedPassword) return false;
  const q = identifier.trim().toLowerCase();

  const db = readLocalDb();
  const idx = (db.users || []).findIndex((u) => u.identifier.trim().toLowerCase() === q);
  if (idx !== -1) {
    db.users[idx].passwordHash = newHashedPassword;
    db.users[idx].updatedAt = new Date().toISOString();
    writeLocalDb(db);
  }

  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        UPDATE rh_users
        SET password_hash = ${newHashedPassword}, updated_at = CURRENT_TIMESTAMP
        WHERE LOWER(identifier) = ${q};
      `;
    } catch (e) {
      console.warn('Neon password update error:', e.message);
    }
  }

  return true;
}

export async function getAllUsers() {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const rows = await sql`SELECT id, identifier, role, name, avatar, phone, linked_ids FROM rh_users ORDER BY name ASC;`;
      if (rows && rows.length > 0) {
        return rows.map((u) => ({
          id: u.id,
          identifier: u.identifier,
          role: u.role,
          name: u.name,
          avatar: u.avatar,
          phone: u.phone,
          linkedIds: typeof u.linked_ids === 'string' ? JSON.parse(u.linked_ids) : (u.linked_ids || []),
        }));
      }
    } catch (e) {
      console.warn('Neon getAllUsers fallback:', e.message);
    }
  }
  const db = readLocalDb();
  return (db.users || []).map((u) => ({
    id: u.id,
    identifier: u.identifier,
    role: u.role,
    name: u.name,
    avatar: u.avatar,
    phone: u.phone,
    linkedIds: u.linkedIds,
  }));
}

// 10. STAKEHOLDER PROVISIONING (Students, Parents, Teachers, Bursars)
export async function createUserAccount({
  identifier,
  passwordHash,
  role,
  name,
  avatar = 'RH',
  phone = '',
  linkedIds = [],
}) {
  const db = readLocalDb();
  const q = identifier.trim().toLowerCase();
  const existing = (db.users || []).find((u) => u.identifier.trim().toLowerCase() === q);
  if (existing) {
    return { existing: true, user: existing };
  }

  const userId = `USR-${role.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;
  const newUser = {
    id: userId,
    identifier: identifier.trim(),
    passwordHash: passwordHash || DEFAULT_PASSWORD_HASH,
    role,
    name,
    avatar: avatar || name.slice(0, 2).toUpperCase(),
    phone,
    linkedIds,
    createdAt: new Date().toISOString(),
    mustChangePassword: true,
  };

  db.users = [newUser, ...(db.users || [])];
  writeLocalDb(db);

  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO rh_users (id, identifier, password_hash, role, name, avatar)
        VALUES (${newUser.id}, ${newUser.identifier}, ${newUser.passwordHash}, ${newUser.role}, ${newUser.name}, ${newUser.avatar});
      `;
    } catch (e) {
      console.warn('Neon user insert error:', e.message);
    }
  }

  return { existing: false, user: newUser };
}

export async function linkStudentToParent(parentEmail, studentId, studentName) {
  if (!parentEmail || !studentId) return;
  const db = readLocalDb();
  const q = parentEmail.trim().toLowerCase();

  const pIdx = (db.users || []).findIndex((u) => u.role === 'parent' && u.identifier.trim().toLowerCase() === q);
  if (pIdx !== -1) {
    const currentLinked = db.users[pIdx].linkedIds || [];
    if (!currentLinked.includes(studentId)) {
      db.users[pIdx].linkedIds = [...currentLinked, studentId];
      writeLocalDb(db);
    }
  }

  // Also update parentChildren in local db if not present
  if (db.parentChildren && Array.isArray(db.parentChildren)) {
    const exists = db.parentChildren.find((c) => c.id === studentId);
    if (!exists) {
      const student = (db.students || []).find((s) => s.id === studentId);
      if (student) {
        db.parentChildren.push({
          id: student.id,
          name: student.name,
          class: student.class,
          stream: `${student.class} · Academic Arm`,
          house: student.house || 'Sapphire House',
          classTeacher: 'Mr. Samuel Okoro',
          average: student.average || 80,
          rank: '5th of 32',
          attendance: student.attendance || 98,
          totalBilled: student.totalBilled || 165000,
          settledFee: student.settledFee || 0,
          outstandingFee: student.outstandingFee || 165000,
          standing: 'Good Standing',
          initials: student.initials || 'ST',
        });
        writeLocalDb(db);
      }
    }
  }
}

export async function onboardTeacher(teacherData) {
  const db = readLocalDb();
  const year = '2026';
  const seq = String((db.teachers?.length || 0) + 1).padStart(2, '0');
  const teacherId = `T${seq}`;

  const newTeacher = {
    id: teacherId,
    name: teacherData.name,
    email: teacherData.email,
    phone: teacherData.phone || '+234 800 000 0000',
    role: teacherData.roleTitle || 'Subject Specialist',
    dept: teacherData.dept || 'Academic Dept',
    qualification: teacherData.qualification || 'B.Sc (Ed), PGDE',
    primarySubject: teacherData.primarySubject || 'General Studies',
    formTeacherClass: teacherData.formTeacherClass || null,
  };

  if (!db.teachers) db.teachers = [...allTeachersList];
  db.teachers = [newTeacher, ...db.teachers];

  // If assigned as Form Teacher, update class allocations
  if (teacherData.formTeacherClass && db.classAllocations?.[teacherData.formTeacherClass]) {
    db.classAllocations[teacherData.formTeacherClass].formTeacher = newTeacher.name;
  }

  writeLocalDb(db);

  // Provision user account with Bcrypt hash
  const targetRole = teacherData.accountRole === 'bursar' ? 'bursar' : 'teacher';
  const account = await createUserAccount({
    identifier: newTeacher.email,
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: targetRole,
    name: newTeacher.name,
    avatar: newTeacher.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    phone: newTeacher.phone,
    linkedIds: [teacherId],
  });

  return {
    teacher: newTeacher,
    user: account.user,
    temporaryPassword: 'RoyalHeights@2026',
  };
}
