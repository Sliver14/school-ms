export const studentsData = [
  {id:'RH/2024/018', name:'Daniel Adeyemi', class:'SS2', arm:'A', gender:'Male', guardian:'Mrs. T. Adeyemi', phone:'0803 ••• ••41', status:'Active', initials:'DA', average:78.4, attendance:94},
  {id:'RH/2025/041', name:'Amara Okafor', class:'SS1', arm:'B', gender:'Female', guardian:'Mr. C. Okafor', phone:'0806 ••• ••82', status:'Active', initials:'AO', average:86.2, attendance:97},
  {id:'RH/2023/006', name:'Ibrahim Musa', class:'SS3', arm:'A', gender:'Male', guardian:'Mrs. H. Musa', phone:'0812 ••• ••17', status:'Active', initials:'IM', average:72.8, attendance:91},
  {id:'RH/2026/077', name:'Zara Bello', class:'JSS1', arm:'A', gender:'Female', guardian:'Mr. A. Bello', phone:'0809 ••• ••53', status:'Pending', initials:'ZB', average:0, attendance:100},
  {id:'RH/2024/029', name:'Chidi Nwosu', class:'SS2', arm:'B', gender:'Male', guardian:'Mrs. N. Nwosu', phone:'0703 ••• ••64', status:'Active', initials:'CN', average:81.6, attendance:96},
  {id:'RH/2025/052', name:'Mariam Yusuf', class:'SS1', arm:'A', gender:'Female', guardian:'Mr. S. Yusuf', phone:'0814 ••• ••38', status:'Active', initials:'MY', average:74.1, attendance:89},
  {id:'RH/2023/014', name:'Favour Eze', class:'SS3', arm:'B', gender:'Female', guardian:'Mrs. C. Eze', phone:'0802 ••• ••29', status:'Active', initials:'FE', average:91.3, attendance:98},
  {id:'RH/2026/083', name:'Samuel James', class:'JSS1', arm:'B', gender:'Male', guardian:'Mr. P. James', phone:'0706 ••• ••92', status:'Active', initials:'SJ', average:69.8, attendance:92},
  {id:'RH/2025/033', name:'Tomi Adebayo', class:'JSS3', arm:'A', gender:'Female', guardian:'Mrs. K. Adebayo', phone:'0805 ••• ••71', status:'Active', initials:'TA', average:82.7, attendance:95},
  {id:'RH/2024/063', name:'Peter Obioma', class:'JSS2', arm:'A', gender:'Male', guardian:'Mr. E. Obioma', phone:'0810 ••• ••25', status:'Active', initials:'PO', average:66.4, attendance:87}
];

export const subjectsList = [
  'Mathematics',
  'English Language',
  'Basic Science',
  'Civic Education',
  'Biology',
  'Economics',
  'Computer Studies',
  'Literature in English'
];

export const initialScores = studentsData.slice(0, 6).map((s, i) => ({
  id: s.id,
  name: s.name,
  class: s.class,
  subject: 'Mathematics',
  ca1: [8, 9, 7, 6, 10, 7][i],
  ca2: [9, 8, 8, 7, 9, 6][i],
  exam: [62, 71, 58, 49, 73, 54][i],
  status: i < 3 ? 'Submitted' : 'Draft'
}));

export const paymentsList = [
  {id:'PAY-20391', name:'Daniel Adeyemi', student:'Daniel Adeyemi', parent:'Mrs. T. Adeyemi', title:'Senior Secondary 2 Tuition & Science Levy', class:'SS2', term:'1st Term', amount:'₦185,000', rawAmount:185000, method:'Bank Transfer', date:'14 Oct 2026', status:'Verified'},
  {id:'PAY-20390', name:'Amara Okafor', student:'Amara Okafor', parent:'Mr. C. Okafor', title:'Senior Secondary 1 Tuition & STEM Pack', class:'SS1', term:'1st Term', amount:'₦165,000', rawAmount:165000, method:'Paystack Card', date:'14 Oct 2026', status:'Verified'},
  {id:'PAY-20389', name:'Ibrahim Musa', student:'Ibrahim Musa', parent:'Mrs. H. Musa', title:'SS3 WAEC/NECO Registration & Tuition Installment', class:'SS3', term:'1st Term', amount:'₦220,000', rawAmount:220000, method:'POS Terminal', date:'13 Oct 2026', status:'Pending'},
  {id:'PAY-20388', name:'Chidi Nwosu', student:'Chidi Nwosu', parent:'Mrs. N. Nwosu', title:'Senior Secondary 2 Tuition & Development Levy', class:'SS2', term:'1st Term', amount:'₦185,000', rawAmount:185000, method:'Bank Transfer', date:'13 Oct 2026', status:'Verified'},
  {id:'PAY-20355', name:'Kemi Adeyemi', student:'Kemi Adeyemi', parent:'Mrs. T. Adeyemi', title:'Junior Secondary 1 Foundation Tuition & Arts Kit', class:'JSS1', term:'1st Term', amount:'₦160,000', rawAmount:160000, method:'Paystack Card', date:'11 Oct 2026', status:'Verified'}
];

export const schoolClasses = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

export const academicTerms = ['1st Term', '2nd Term', '3rd Term'];

export const feeCategories = [
  'Tuition',
  'Development',
  'Laboratory & STEM',
  'PTA & Welfare',
  'Examination',
  'Optional / Ancillary',
  'Custom / Special Levy'
];

export const classEnrollments = {
  JSS1: 60,
  JSS2: 58,
  JSS3: 62,
  SS1: 64,
  SS2: 62,
  SS3: 60
};

export const initialFeeSchedules = [
  // --- JSS 1 (1st Term) ---
  {
    id: 'FEE-JSS1-T1-01',
    class: 'JSS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'Junior Tuition Fee',
    category: 'Tuition',
    amount: 105000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Core junior secondary academic instruction and foundational learning resources'
  },
  {
    id: 'FEE-JSS1-T1-02',
    class: 'JSS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'Development Levy',
    category: 'Development',
    amount: 25000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Campus expansion, sports center and junior e-library maintenance'
  },
  {
    id: 'FEE-JSS1-T1-03',
    class: 'JSS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'Basic Technology & Arts Kit',
    category: 'Laboratory & STEM',
    amount: 15000,
    type: 'Mandatory',
    dueDate: '15 Nov 2026',
    description: 'Studio materials, technical drawing instruments & computer lab license'
  },
  {
    id: 'FEE-JSS1-T1-04',
    class: 'JSS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'PTA Dues & Medical Retainer',
    category: 'PTA & Welfare',
    amount: 15000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'PTA community projects and 24/7 on-campus wellness clinic coverage'
  },
  {
    id: 'FEE-JSS1-T1-05',
    class: 'JSS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'School Bus Transit Shuttle',
    category: 'Optional / Ancillary',
    amount: 45000,
    type: 'Optional',
    dueDate: '30 Oct 2026',
    description: 'Daily morning and afternoon air-conditioned shuttle service'
  },

  // --- JSS 2 (1st Term) ---
  {
    id: 'FEE-JSS2-T1-01',
    class: 'JSS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'Junior Tuition Fee',
    category: 'Tuition',
    amount: 110000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Intermediate junior secondary academic instruction and laboratory work'
  },
  {
    id: 'FEE-JSS2-T1-02',
    class: 'JSS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'Development Levy',
    category: 'Development',
    amount: 25000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'School infrastructure and science block maintenance'
  },
  {
    id: 'FEE-JSS2-T1-03',
    class: 'JSS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'Science Practical & ICT Levy',
    category: 'Laboratory & STEM',
    amount: 18000,
    type: 'Mandatory',
    dueDate: '15 Nov 2026',
    description: 'Integrated science laboratory consumables and coding workstation access'
  },
  {
    id: 'FEE-JSS2-T1-04',
    class: 'JSS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'PTA Dues & Medical Retainer',
    category: 'PTA & Welfare',
    amount: 15000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'PTA community dues and student clinic healthcare subscription'
  },

  // --- JSS 3 (1st Term) ---
  {
    id: 'FEE-JSS3-T1-01',
    class: 'JSS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'Junior Tuition Fee',
    category: 'Tuition',
    amount: 115000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Final year junior curriculum and pre-BECE academic coaching'
  },
  {
    id: 'FEE-JSS3-T1-02',
    class: 'JSS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'Development Levy',
    category: 'Development',
    amount: 25000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'School infrastructure and digital test center development'
  },
  {
    id: 'FEE-JSS3-T1-03',
    class: 'JSS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'Junior Mock & Pre-BECE Assessment Fee',
    category: 'Examination',
    amount: 25000,
    type: 'Mandatory',
    dueDate: '10 Nov 2026',
    description: 'State and National BECE mock examination papers, registration & CBT center pass'
  },
  {
    id: 'FEE-JSS3-T1-04',
    class: 'JSS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'PTA Dues & Medical Retainer',
    category: 'PTA & Welfare',
    amount: 15000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'PTA activities and health clinic retainer'
  },

  // --- SS 1 (1st Term) ---
  {
    id: 'FEE-SS1-T1-01',
    class: 'SS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'Senior Tuition Fee',
    category: 'Tuition',
    amount: 120000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Senior secondary core and elective subjects instruction'
  },
  {
    id: 'FEE-SS1-T1-02',
    class: 'SS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'Development Levy',
    category: 'Development',
    amount: 25000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Campus facilities, sports pavilion and campus technology'
  },
  {
    id: 'FEE-SS1-T1-03',
    class: 'SS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'Science Lab & Robotics Practical',
    category: 'Laboratory & STEM',
    amount: 20000,
    type: 'Mandatory',
    dueDate: '15 Nov 2026',
    description: 'Physics, Chemistry, Biology laboratory equipment and robotics license'
  },
  {
    id: 'FEE-SS1-T1-04',
    class: 'SS1',
    term: '1st Term',
    session: '2026/2027',
    title: 'PTA Dues & Medical Retainer',
    category: 'PTA & Welfare',
    amount: 20000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'PTA contribution and dedicated campus clinic coverage'
  },

  // --- SS 2 (1st Term) ---
  {
    id: 'FEE-SS2-T1-01',
    class: 'SS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'Tuition Fee',
    category: 'Tuition',
    amount: 120000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Instructional materials, subject specialist instruction, science lab access'
  },
  {
    id: 'FEE-SS2-T1-02',
    class: 'SS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'Development Levy',
    category: 'Development',
    amount: 25000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Campus facilities & sports pavilion maintenance'
  },
  {
    id: 'FEE-SS2-T1-03',
    class: 'SS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'Science & ICT Laboratory Charge',
    category: 'Laboratory & STEM',
    amount: 20000,
    type: 'Mandatory',
    dueDate: '15 Nov 2026',
    description: 'Robotics lab, physics/chemistry consumables and computing infrastructure'
  },
  {
    id: 'FEE-SS2-T1-04',
    class: 'SS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'PTA Dues & Medical Retainer',
    category: 'PTA & Welfare',
    amount: 20000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'On-campus wellness clinic and parents association executive projects'
  },
  {
    id: 'FEE-SS2-T1-05',
    class: 'SS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'Pre-WAEC Cambridge Checkpoint Mock',
    category: 'Examination',
    amount: 30000,
    type: 'Optional',
    dueDate: '15 Nov 2026',
    description: 'Optional international benchmarking assessment and diagnostic test'
  },
  {
    id: 'FEE-SS2-T1-06',
    class: 'SS2',
    term: '1st Term',
    session: '2026/2027',
    title: 'School Bus Shuttle Service',
    category: 'Optional / Ancillary',
    amount: 50000,
    type: 'Optional',
    dueDate: '30 Oct 2026',
    description: 'Executive campus transit service for mainland/island zones'
  },

  // --- SS 3 (1st Term) ---
  {
    id: 'FEE-SS3-T1-01',
    class: 'SS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'Senior Tuition Fee',
    category: 'Tuition',
    amount: 135000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Graduating class comprehensive academic coaching and syllabus completion'
  },
  {
    id: 'FEE-SS3-T1-02',
    class: 'SS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'WAEC / NECO / UTME Exam Registration Levy',
    category: 'Examination',
    amount: 85000,
    type: 'Mandatory',
    dueDate: '20 Nov 2026',
    description: 'National and West African council registrations, biometrics and CBT centers'
  },
  {
    id: 'FEE-SS3-T1-03',
    class: 'SS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'Advanced Science Lab & Practical Prep',
    category: 'Laboratory & STEM',
    amount: 30000,
    type: 'Mandatory',
    dueDate: '15 Nov 2026',
    description: 'Alternative to practical specimens, chemicals and apparatus sets'
  },
  {
    id: 'FEE-SS3-T1-04',
    class: 'SS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'Valedictory & Graduation Levy',
    category: 'Development',
    amount: 35000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'Graduation yearbook, gown rental, award plaques and diploma certification'
  },
  {
    id: 'FEE-SS3-T1-05',
    class: 'SS3',
    term: '1st Term',
    session: '2026/2027',
    title: 'PTA Dues & Medical Retainer',
    category: 'PTA & Welfare',
    amount: 20000,
    type: 'Mandatory',
    dueDate: '30 Oct 2026',
    description: 'PTA graduation committee fund and medical coverage'
  },

  // --- 2nd Term (Lent) Sample Data ---
  {
    id: 'FEE-SS2-T2-01',
    class: 'SS2',
    term: '2nd Term',
    session: '2026/2027',
    title: 'Tuition Fee (2nd Term)',
    category: 'Tuition',
    amount: 120000,
    type: 'Mandatory',
    dueDate: '15 Jan 2027',
    description: 'Lent Term academic tuition and laboratory sessions'
  },
  {
    id: 'FEE-SS2-T2-02',
    class: 'SS2',
    term: '2nd Term',
    session: '2026/2027',
    title: 'Inter-House Sports & Athletic Levy',
    category: 'Development',
    amount: 20000,
    type: 'Mandatory',
    dueDate: '25 Jan 2027',
    description: 'Biennial inter-house sports festival, track uniforms and medals'
  },
  {
    id: 'FEE-JSS1-T2-01',
    class: 'JSS1',
    term: '2nd Term',
    session: '2026/2027',
    title: 'Junior Tuition Fee (2nd Term)',
    category: 'Tuition',
    amount: 105000,
    type: 'Mandatory',
    dueDate: '15 Jan 2027',
    description: 'Lent Term academic instruction and mid-term assessments'
  },

  // --- 3rd Term (Trinity) Sample Data ---
  {
    id: 'FEE-SS2-T3-01',
    class: 'SS2',
    term: '3rd Term',
    session: '2026/2027',
    title: 'Tuition Fee (3rd Term)',
    category: 'Tuition',
    amount: 120000,
    type: 'Mandatory',
    dueDate: '02 May 2027',
    description: 'Trinity Term promotion term tuition and mock promotion examinations'
  },
  {
    id: 'FEE-JSS1-T3-01',
    class: 'JSS1',
    term: '3rd Term',
    session: '2026/2027',
    title: 'Junior Tuition Fee (3rd Term)',
    category: 'Tuition',
    amount: 105000,
    type: 'Mandatory',
    dueDate: '02 May 2027',
    description: 'Trinity Term promotional term tuition and academic reports'
  }
];

export const ROLE_PERMISSIONS = {
  admin: {
    name: 'School Administrator',
    sub: 'Full Governance & Settings',
    avatar: 'AD',
    tabs: ['dashboard', 'students', 'academics', 'timetable', 'attendance', 'admissions', 'fees', 'parents', 'scratch-cards', 'communications', 'staff', 'reports', 'settings'],
    tabLabels: {
      academics: 'Academics & Results',
      timetable: 'Timetable',
      attendance: 'Attendance',
      fees: 'Fees & Payments',
      'scratch-cards': 'Scratch Cards'
    }
  },
  teacher: {
    name: 'Mr. Samuel Okoro',
    sub: 'Class & Subject Faculty',
    avatar: 'SO',
    tabs: ['dashboard', 'students', 'academics', 'timetable', 'attendance', 'staff', 'communications'],
    tabLabels: {
      academics: 'Score Entry & Marks',
      timetable: 'Teaching Schedule',
      attendance: 'Daily Register',
      fees: 'Fees & Payments'
    }
  },
  student: {
    name: 'Daniel Adeyemi',
    sub: 'SS2A · Admission RH/2024/018',
    avatar: 'DA',
    tabs: ['dashboard', 'academics', 'timetable', 'attendance', 'communications'],
    tabLabels: {
      academics: 'My Results & Reports',
      timetable: 'My Class Timetable',
      attendance: 'My Attendance Log',
      fees: 'Fee Statement'
    }
  },
  parent: {
    name: 'Mrs. T. Adeyemi',
    sub: 'Parent / Guardian (Daniel & Kemi)',
    avatar: 'PA',
    tabs: ['dashboard', 'academics', 'timetable', 'attendance', 'fees', 'communications'],
    tabLabels: {
      academics: 'Child Report Card',
      timetable: 'Class Schedule',
      attendance: 'Attendance Record',
      fees: 'Fees & Receipts'
    }
  },
  bursar: {
    name: 'Accounts Office',
    sub: 'Tuition & Invoicing Desk',
    avatar: 'AC',
    tabs: ['dashboard', 'students', 'fees', 'scratch-cards', 'admissions', 'communications', 'reports'],
    tabLabels: {
      academics: 'Academics',
      timetable: 'Timetable',
      attendance: 'Attendance',
      fees: 'Fees & Collections',
      'scratch-cards': 'Scratch Cards'
    }
  }
};

export const parentChildren = [
  {
    id: 'RH/2024/018',
    name: 'Daniel Adeyemi',
    class: 'SS2A',
    stream: 'Senior Secondary · Science Stream',
    house: 'Sapphire House',
    classTeacher: 'Mr. Samuel Okoro',
    average: 78.4,
    rank: '4th of 32',
    attendance: 94,
    daysPresent: 47,
    daysTotal: 50,
    excused: 2,
    late: 1,
    totalBilled: 185000,
    settledFee: 100000,
    outstandingFee: 85000,
    standing: 'Good Standing',
    initials: 'DA',
    subjects: [
      {subject: 'Mathematics', ca1: 9, ca2: 8, exam: 62},
      {subject: 'English Language', ca1: 8, ca2: 8, exam: 61},
      {subject: 'Biology', ca1: 9, ca2: 9, exam: 58},
      {subject: 'Economics', ca1: 7, ca2: 8, exam: 56},
      {subject: 'Computer Studies', ca1: 10, ca2: 9, exam: 67},
      {subject: 'Civic Education', ca1: 8, ca2: 9, exam: 60},
      {subject: 'Physics', ca1: 7, ca2: 7, exam: 54}
    ],
    todaySchedule: [
      {time: '08:00 AM', subject: 'Mathematics (Algebra)', room: 'Room 12', teacher: 'Mr. Samuel Okoro'},
      {time: '09:00 AM', subject: 'English Language (Essay)', room: 'Room 08', teacher: 'Mrs. Grace James'},
      {time: '11:00 AM', subject: 'Biology Practical', room: 'Laboratory 2', teacher: 'Mrs. Hauwa Musa'}
    ],
    timetable: [
      ['Mathematics','English','Biology','Civic Ed.','Economics'],
      ['English','Mathematics','Chemistry','Literature','Physics'],
      ['Biology','Economics','Mathematics','English','Computer'],
      ['Physics','Civic Ed.','English','Mathematics','Biology'],
      ['Computer','Literature','Economics','Physics','Mathematics'],
      ['Economics','Biology','Civic Ed.','Computer','English']
    ],
    attendanceLog: [
      {date: '15 Oct 2026', period: 'Morning Roll Call', status: 'Present', remark: 'Punctual'},
      {date: '14 Oct 2026', period: 'Morning Roll Call', status: 'Present', remark: 'Punctual'},
      {date: '13 Oct 2026', period: 'Morning Roll Call', status: 'Present', remark: 'Punctual'},
      {date: '12 Oct 2026', period: 'Morning Roll Call', status: 'Present', remark: 'Punctual'},
      {date: '09 Oct 2026', period: 'Morning Roll Call', status: 'Excused', remark: 'Medical clinic permit'}
    ],
    feeBreakdown: [
      {title: 'Tuition Fee', sub: 'Instructional materials & academics', amount: 120000},
      {title: 'Development Levy', sub: 'Campus facilities & sports pavilion', amount: 25000},
      {title: 'Science & ICT Laboratory Charge', sub: 'Robotics lab & consumable chemicals', amount: 20000},
      {title: 'PTA Dues & Medical Retainer', sub: 'On-campus wellness clinic', amount: 20000}
    ],
    recentReceipt: {id: 'PAY-20391', date: '14 Oct 2026', amount: 100000, method: 'Bank Transfer', status: 'Verified'},
    teacherNote: 'Daniel demonstrates commendable dedication and critical reasoning in scientific inquiries. Continue practicing time management in problem solving.'
  },
  {
    id: 'RH/2026/042',
    name: 'Kemi Adeyemi',
    class: 'JSS1B',
    stream: 'Junior Secondary · Foundation & Languages',
    house: 'Emerald House',
    classTeacher: 'Mrs. Grace James',
    average: 84.6,
    rank: '2nd of 30',
    attendance: 98,
    daysPresent: 49,
    daysTotal: 50,
    excused: 1,
    late: 0,
    totalBilled: 160000,
    settledFee: 120000,
    outstandingFee: 40000,
    standing: 'Distinction Standing',
    initials: 'KA',
    subjects: [
      {subject: 'Mathematics', ca1: 10, ca2: 9, exam: 68},
      {subject: 'English Language', ca1: 9, ca2: 9, exam: 66},
      {subject: 'Basic Science', ca1: 9, ca2: 8, exam: 67},
      {subject: 'Social Studies', ca1: 8, ca2: 9, exam: 64},
      {subject: 'Computer Studies', ca1: 10, ca2: 10, exam: 72},
      {subject: 'French Language', ca1: 8, ca2: 8, exam: 63},
      {subject: 'Visual Arts', ca1: 9, ca2: 9, exam: 65}
    ],
    todaySchedule: [
      {time: '08:00 AM', subject: 'Basic Science (Ecosystems)', room: 'Room 04', teacher: 'Mr. Nnamdi'},
      {time: '09:00 AM', subject: 'French Language', room: 'Room 06', teacher: 'Mme. Dupont'},
      {time: '11:00 AM', subject: 'Mathematics (Fractions)', room: 'Room 04', teacher: 'Mr. Adekunle'}
    ],
    timetable: [
      ['English','Basic Science','Mathematics','French','Social Studies'],
      ['Mathematics','English','Computer','Visual Arts','Basic Science'],
      ['Social Studies','French','Mathematics','English','Physical Ed.'],
      ['Basic Science','Social Studies','English','Computer','Mathematics'],
      ['French','Visual Arts','Basic Science','Mathematics','English'],
      ['Computer','Physical Ed.','French','Basic Science','Music']
    ],
    attendanceLog: [
      {date: '15 Oct 2026', period: 'Morning Roll Call', status: 'Present', remark: 'Punctual (Early arrival)'},
      {date: '14 Oct 2026', period: 'Morning Roll Call', status: 'Present', remark: 'Punctual'},
      {date: '13 Oct 2026', period: 'Morning Roll Call', status: 'Present', remark: 'Punctual'},
      {date: '12 Oct 2026', period: 'Morning Roll Call', status: 'Present', remark: 'Punctual'},
      {date: '08 Oct 2026', period: 'Morning Roll Call', status: 'Excused', remark: 'Dental appointment'}
    ],
    feeBreakdown: [
      {title: 'Junior Tuition Fee', sub: 'Core academic instruction', amount: 105000},
      {title: 'Development Levy', sub: 'School expansion & sports center', amount: 25000},
      {title: 'Basic Technology & Arts Kit', sub: 'Studio materials & computing license', amount: 15000},
      {title: 'PTA Dues & Medical Retainer', sub: 'On-campus wellness clinic', amount: 15000}
    ],
    recentReceipt: {id: 'PAY-20355', date: '11 Oct 2026', amount: 120000, method: 'Paystack Card', status: 'Verified'},
    teacherNote: 'Kemi is an exceptionally bright and diligent student. Her grasp of mathematics, spoken French and language arts is outstanding.'
  }
];

export const initialClassAllocations = {
  'SS2A': {
    name: 'Senior Secondary 2 · Arm A (Science Stream)',
    formTeacher: 'Mr. Samuel Okoro',
    room: 'Room 12 · Block B',
    studentCount: 32,
    subjects: [
      {subject: 'Mathematics', teacher: 'Mr. Samuel Okoro', dept: 'Sciences & Tech', periods: 5, role: 'Lead Instructor (HOD)'},
      {subject: 'English Language', teacher: 'Mrs. Grace James', dept: 'Languages & Lit', periods: 5, role: 'Subject Specialist'},
      {subject: 'Biology', teacher: 'Mrs. Hauwa Musa', dept: 'Biological Sciences', periods: 4, role: 'Subject Specialist'},
      {subject: 'Physics', teacher: 'Mr. Samuel Okoro', dept: 'Sciences & Tech', periods: 4, role: 'Lead Instructor'},
      {subject: 'Chemistry', teacher: 'Dr. Kelechi Nwosu', dept: 'Chemical Sciences', periods: 4, role: 'Senior Specialist'},
      {subject: 'Economics', teacher: 'Mr. Chinedu Bello', dept: 'Commercial Studies', periods: 4, role: 'Subject Specialist'},
      {subject: 'Computer Studies', teacher: 'Ms. Esther Eze', dept: 'ICT & Robotics', periods: 3, role: 'Lab Specialist'},
      {subject: 'Civic Education', teacher: 'Mr. Chinedu Bello', dept: 'Humanities', periods: 2, role: 'Subject Specialist'}
    ]
  },
  'SS2B': {
    name: 'Senior Secondary 2 · Arm B (Commercial & Arts Stream)',
    formTeacher: 'Mr. Chinedu Bello',
    room: 'Room 11 · Block B',
    studentCount: 30,
    subjects: [
      {subject: 'Mathematics', teacher: 'Mr. Samuel Okoro', dept: 'Sciences & Tech', periods: 5, role: 'Lead Instructor'},
      {subject: 'English Language', teacher: 'Mrs. Grace James', dept: 'Languages & Lit', periods: 5, role: 'Subject Specialist'},
      {subject: 'Economics', teacher: 'Mr. Chinedu Bello', dept: 'Commercial Studies', periods: 5, role: 'Lead Instructor'},
      {subject: 'Literature in English', teacher: 'Mrs. Grace James', dept: 'Languages & Lit', periods: 4, role: 'Subject Specialist'},
      {subject: 'Commerce', teacher: 'Mr. Chinedu Bello', dept: 'Commercial Studies', periods: 4, role: 'Subject Specialist'},
      {subject: 'Government', teacher: 'Mrs. Folake Balogun', dept: 'Humanities', periods: 4, role: 'Subject Specialist'},
      {subject: 'Computer Studies', teacher: 'Ms. Esther Eze', dept: 'ICT & Robotics', periods: 3, role: 'Lab Specialist'}
    ]
  },
  'JSS1B': {
    name: 'Junior Secondary 1 · Arm B (Foundation Stream)',
    formTeacher: 'Mrs. Grace James',
    room: 'Room 04 · Junior Wing',
    studentCount: 30,
    subjects: [
      {subject: 'Mathematics', teacher: 'Mr. Emeka Adekunle', dept: 'Sciences & Tech', periods: 5, role: 'Junior Specialist'},
      {subject: 'English Language', teacher: 'Mrs. Grace James', dept: 'Languages & Lit', periods: 5, role: 'Lead Instructor'},
      {subject: 'Basic Science', teacher: 'Mr. Nnamdi Opara', dept: 'Biological Sciences', periods: 4, role: 'Subject Specialist'},
      {subject: 'French Language', teacher: 'Mme. Claire Dupont', dept: 'Modern Languages', periods: 3, role: 'Bilingual Faculty'},
      {subject: 'Social Studies', teacher: 'Mrs. Folake Balogun', dept: 'Humanities', periods: 3, role: 'Subject Specialist'},
      {subject: 'Computer Studies', teacher: 'Ms. Esther Eze', dept: 'ICT & Robotics', periods: 3, role: 'Lab Specialist'},
      {subject: 'Visual Arts', teacher: 'Mr. Babatunde Lawal', dept: 'Creative Arts', periods: 2, role: 'Studio Specialist'},
      {subject: 'Physical & Health Ed', teacher: 'Coach Segun Adeleke', dept: 'Sports', periods: 2, role: 'Head Coach'}
    ]
  }
};

export const allTeachersList = [
  { id: 'T01', name: 'Mr. Samuel Okoro', role: 'Head of Sciences', dept: 'Sciences & Tech', qualification: 'B.Sc (Ed) Physics, M.Sc Unilag', primarySubject: 'Mathematics & Physics' },
  { id: 'T02', name: 'Mrs. Grace James', role: 'Head of Languages', dept: 'Languages & Lit', qualification: 'B.A English (Ibadan), PGDE', primarySubject: 'English Language & Lit' },
  { id: 'T03', name: 'Mrs. Hauwa Musa', role: 'Senior Biology Specialist', dept: 'Biological Sciences', qualification: 'B.Sc Biology (ABU Zaria)', primarySubject: 'Biology' },
  { id: 'T04', name: 'Mr. Chinedu Bello', role: 'Head of Commercials', dept: 'Commercial Studies', qualification: 'B.Sc Economics (UNN), ACA', primarySubject: 'Economics & Commerce' },
  { id: 'T05', name: 'Ms. Esther Eze', role: 'Lead STEM & Robotics', dept: 'ICT & Robotics', qualification: 'B.Eng Computer Eng (FUTO)', primarySubject: 'Computer Studies & AI' },
  { id: 'T06', name: 'Dr. Kelechi Nwosu', role: 'Senior Chemistry Faculty', dept: 'Chemical Sciences', qualification: 'Ph.D Chemistry (Manchester)', primarySubject: 'Chemistry' },
  { id: 'T07', name: 'Mr. Emeka Adekunle', role: 'Junior Maths Specialist', dept: 'Sciences & Tech', qualification: 'B.Sc Mathematics (OAU)', primarySubject: 'Junior Mathematics' },
  { id: 'T08', name: 'Mr. Nnamdi Opara', role: 'Junior Science Instructor', dept: 'Biological Sciences', qualification: 'B.Sc Biochemistry (UNIPORT)', primarySubject: 'Basic Science' },
  { id: 'T09', name: 'Mme. Claire Dupont', role: 'Bilingual Coordinator', dept: 'Modern Languages', qualification: 'M.A French (Sorbonne/Lagos)', primarySubject: 'French Language' },
  { id: 'T10', name: 'Mrs. Folake Balogun', role: 'Humanities Lead', dept: 'Humanities', qualification: 'B.Sc Political Science (UI)', primarySubject: 'Civic Edu & Government' },
  { id: 'T11', name: 'Mr. Babatunde Lawal', role: 'Creative Arts Curator', dept: 'Creative Arts', qualification: 'MFA Fine Arts (Yabatech)', primarySubject: 'Visual Arts' },
  { id: 'T12', name: 'Coach Segun Adeleke', role: 'Director of Athletics', dept: 'Sports & PE', qualification: 'B.Sc Physical Education (NIS)', primarySubject: 'Physical & Health Ed' }
];

export const pageNames = {
  dashboard: 'Dashboard',
  students: 'Students Directory',
  academics: 'Academics & Results',
  timetable: 'Timetable & Schedule',
  attendance: 'Attendance Register',
  admissions: 'Admissions & Enrolment',
  fees: 'Fees & Payments',
  parents: 'Parents & Guardians',
  communications: 'School Communications',
  staff: 'Staff & Subjects',
  reports: 'Reports & Analytics',
  'scratch-cards': 'Scratch Card Management',
  settings: 'Settings & Security'
};
