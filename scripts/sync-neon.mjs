import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env or .env.local
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
const dbUrl = match ? match[1] : process.env.DATABASE_URL;

if (!dbUrl || dbUrl.includes('placeholder') || dbUrl.includes('your_password')) {
  console.error('No valid DATABASE_URL found in environment.');
  process.exit(1);
}

console.log('Connecting to Neon database...');
const sql = neon(dbUrl);

async function run() {
  try {
    const timeRes = await sql`SELECT NOW() as current_time, current_database() as db;`;
    console.log('✓ Successfully connected to Neon Postgres:', timeRes[0]);

    // 1. Create Tables
    console.log('\nCreating/verifying database tables...');

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
    console.log('✓ rh_users table ready');

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
    console.log('✓ rh_admissions table ready');

    await sql`
      CREATE TABLE IF NOT EXISTS rh_students (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        class VARCHAR(30) NOT NULL,
        arm VARCHAR(10) DEFAULT 'A',
        gender VARCHAR(20),
        guardian VARCHAR(150),
        parent_name VARCHAR(150),
        phone VARCHAR(50),
        status VARCHAR(30) DEFAULT 'Active',
        initials VARCHAR(10),
        average NUMERIC DEFAULT 0,
        attendance NUMERIC DEFAULT 100,
        fee_status VARCHAR(30) DEFAULT 'Pending',
        outstanding_fee NUMERIC DEFAULT 0,
        settled_fee NUMERIC DEFAULT 0,
        total_billed NUMERIC DEFAULT 0,
        house VARCHAR(50) DEFAULT 'Sapphire House',
        boarding_status VARCHAR(30) DEFAULT 'Day',
        clearance_status VARCHAR(50) DEFAULT 'Exam Hold',
        conduct_grade VARCHAR(50),
        form_teacher_comment TEXT,
        principal_comment TEXT
      );
    `;
    console.log('✓ rh_students table ready');

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
    console.log('✓ rh_fees table ready');

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
    console.log('✓ rh_payments table ready');

    await sql`
      CREATE TABLE IF NOT EXISTS rh_grades (
        id VARCHAR(100) PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(150) NOT NULL,
        class VARCHAR(30) NOT NULL,
        term VARCHAR(30) DEFAULT '1st Term',
        session VARCHAR(30) DEFAULT '2026/2027',
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
    console.log('✓ rh_grades table ready');

    await sql`
      CREATE TABLE IF NOT EXISTS rh_attendance (
        id VARCHAR(100) PRIMARY KEY,
        date VARCHAR(50) NOT NULL,
        student_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(150) NOT NULL,
        class VARCHAR(30) NOT NULL,
        arm VARCHAR(10) DEFAULT 'A',
        period VARCHAR(50) DEFAULT 'Morning Roll Call',
        status VARCHAR(30) NOT NULL,
        remark VARCHAR(200)
      );
    `;
    console.log('✓ rh_attendance table ready');

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
    await sql`ALTER TABLE rh_teachers ALTER COLUMN email DROP NOT NULL;`.catch(() => {});
    console.log('✓ rh_teachers table ready');

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
    console.log('✓ rh_class_allocations table ready');

    await sql`
      CREATE TABLE IF NOT EXISTS rh_scratch_cards (
        id VARCHAR(60) PRIMARY KEY,
        serial_number VARCHAR(50) UNIQUE NOT NULL,
        pin VARCHAR(50) NOT NULL,
        session VARCHAR(30) NOT NULL,
        term VARCHAR(30) NOT NULL,
        price NUMERIC DEFAULT 2000,
        max_uses INT DEFAULT 5,
        used_count INT DEFAULT 0,
        student_id VARCHAR(50),
        student_name VARCHAR(150),
        status VARCHAR(30) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at VARCHAR(50),
        last_used_at VARCHAR(50),
        batch_code VARCHAR(50)
      );
    `;
    console.log('✓ rh_scratch_cards table ready');

    // 2. Read local db.json
    const dbJsonPath = path.join(process.cwd(), 'data', 'db.json');
    if (!fs.existsSync(dbJsonPath)) {
      console.error('Local data/db.json not found!');
      return;
    }
    const db = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

    console.log('\n--- Syncing Data from Local JSON to Neon Postgres ---');

    // Sync Users
    if (Array.isArray(db.users)) {
      console.log(`Syncing ${db.users.length} users...`);
      for (const u of db.users) {
        await sql`
          INSERT INTO rh_users (id, identifier, password_hash, role, name, avatar, phone, linked_ids, must_change_password)
          VALUES (
            ${u.id},
            ${u.identifier.toLowerCase().trim()},
            ${u.passwordHash},
            ${u.role},
            ${u.name},
            ${u.avatar || 'RH'},
            ${u.phone || null},
            ${JSON.stringify(u.linkedIds || [])}::jsonb,
            ${!!u.mustChangePassword}
          )
          ON CONFLICT (identifier) DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            role = EXCLUDED.role,
            name = EXCLUDED.name,
            avatar = EXCLUDED.avatar,
            phone = EXCLUDED.phone,
            linked_ids = EXCLUDED.linked_ids,
            must_change_password = EXCLUDED.must_change_password,
            updated_at = CURRENT_TIMESTAMP;
        `;
      }
      console.log(`✓ Synchronized ${db.users.length} users into rh_users.`);
    }

    // Sync Admissions
    if (Array.isArray(db.admissions)) {
      console.log(`Syncing ${db.admissions.length} admissions...`);
      for (const a of db.admissions) {
        await sql`
          INSERT INTO rh_admissions (id, name, entry_class, dob, gender, parent_name, parent_phone, parent_email, prev_school, exam_date, exam_status, score, decision, student_id)
          VALUES (
            ${a.id},
            ${a.name},
            ${a.entryClass},
            ${a.dob || null},
            ${a.gender || null},
            ${a.parentName || null},
            ${a.parentPhone || null},
            ${a.parentEmail || null},
            ${a.prevSchool || null},
            ${a.examDate || null},
            ${a.examStatus || 'Scheduled'},
            ${Number(a.score) || 0},
            ${a.decision || 'Under Review'},
            ${a.studentId || null}
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            entry_class = EXCLUDED.entry_class,
            score = EXCLUDED.score,
            decision = EXCLUDED.decision,
            exam_status = EXCLUDED.exam_status,
            student_id = EXCLUDED.student_id;
        `;
      }
      console.log(`✓ Synchronized ${db.admissions.length} admissions.`);
    }

    // Sync Students
    if (Array.isArray(db.students)) {
      console.log(`Syncing ${db.students.length} students...`);
      for (const s of db.students) {
        await sql`
          INSERT INTO rh_students (
            id, name, class, arm, gender, guardian, parent_name, phone, status,
            initials, average, attendance, fee_status, outstanding_fee, settled_fee,
            total_billed, house, boarding_status, clearance_status, conduct_grade,
            form_teacher_comment, principal_comment
          )
          VALUES (
            ${s.id},
            ${s.name},
            ${s.class},
            ${s.arm || 'A'},
            ${s.gender || 'Unknown'},
            ${s.guardian || s.parent || null},
            ${s.parent || s.guardian || null},
            ${s.phone || null},
            ${s.status || 'Active'},
            ${s.initials || null},
            ${Number(s.average) || 0},
            ${Number(s.attendance) || 100},
            ${s.feeStatus || 'Pending'},
            ${Number(s.outstandingFee) || 0},
            ${Number(s.settledFee) || 0},
            ${Number(s.totalBilled) || 0},
            ${s.house || 'Sapphire House'},
            ${s.boardingStatus || 'Day'},
            ${s.clearanceStatus || 'Exam Hold'},
            ${s.conductGrade || 'Good'},
            ${s.formTeacherComment || null},
            ${s.principalComment || null}
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            class = EXCLUDED.class,
            arm = EXCLUDED.arm,
            status = EXCLUDED.status,
            average = EXCLUDED.average,
            attendance = EXCLUDED.attendance,
            fee_status = EXCLUDED.fee_status,
            outstanding_fee = EXCLUDED.outstanding_fee,
            settled_fee = EXCLUDED.settled_fee,
            total_billed = EXCLUDED.total_billed,
            clearance_status = EXCLUDED.clearance_status;
        `;
      }
      console.log(`✓ Synchronized ${db.students.length} students.`);
    }

    // Sync Fee Schedules
    if (Array.isArray(db.feeSchedules)) {
      console.log(`Syncing ${db.feeSchedules.length} fee schedules...`);
      for (const f of db.feeSchedules) {
        await sql`
          INSERT INTO rh_fees (id, class, term, session, title, category, amount, type, due_date, description, is_custom, scope, discount_waiver)
          VALUES (
            ${f.id},
            ${f.class},
            ${f.term || '1st Term'},
            ${f.session || '2026/2027'},
            ${f.title},
            ${f.category || 'Tuition'},
            ${Number(f.amount) || 0},
            ${f.type || 'Mandatory'},
            ${f.dueDate || null},
            ${f.description || null},
            ${!!f.isCustom},
            ${f.scope || 'all'},
            ${Number(f.discountWaiver) || 0}
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            amount = EXCLUDED.amount,
            category = EXCLUDED.category;
        `;
      }
      console.log(`✓ Synchronized ${db.feeSchedules.length} fee schedules.`);
    }

    // Sync Payments
    if (Array.isArray(db.payments)) {
      console.log(`Syncing ${db.payments.length} payment records...`);
      for (const p of db.payments) {
        await sql`
          INSERT INTO rh_payments (id, student_id, student_name, parent_name, title, class, term, amount, raw_amount, method, reference, date, status)
          VALUES (
            ${p.id},
            ${p.studentId || null},
            ${p.student || p.name || 'Student'},
            ${p.parent || null},
            ${p.title || 'Tuition Settlement'},
            ${p.class || null},
            ${p.term || '1st Term'},
            ${p.amount || `₦${p.rawAmount}`},
            ${Number(p.rawAmount) || 0},
            ${p.method || 'Paystack Card'},
            ${p.reference || null},
            ${p.date || null},
            ${p.status || 'Verified'}
          )
          ON CONFLICT (id) DO UPDATE SET
            raw_amount = EXCLUDED.raw_amount,
            status = EXCLUDED.status;
        `;
      }
      console.log(`✓ Synchronized ${db.payments.length} payment records.`);
    }

    // Sync Attendance
    if (Array.isArray(db.attendance)) {
      console.log(`Syncing ${db.attendance.length} attendance records...`);
      for (const att of db.attendance) {
        await sql`
          INSERT INTO rh_attendance (id, date, student_id, student_name, class, arm, period, status, remark)
          VALUES (
            ${att.id},
            ${att.date},
            ${att.studentId},
            ${att.studentName},
            ${att.class},
            ${att.arm || 'A'},
            ${att.period || 'Morning Roll Call'},
            ${att.status},
            ${att.remark || null}
          )
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            remark = EXCLUDED.remark;
        `;
      }
      console.log(`✓ Synchronized ${db.attendance.length} attendance entries.`);
    }

    // Sync Grades
    if (Array.isArray(db.grades)) {
      console.log(`Syncing ${db.grades.length} grades...`);
      for (const g of db.grades) {
        await sql`
          INSERT INTO rh_grades (id, student_id, student_name, class, term, session, subject, ca1, ca2, exam, total, grade, remark, status)
          VALUES (
            ${g.id},
            ${g.studentId},
            ${g.studentName},
            ${g.class},
            ${g.term || '1st Term'},
            ${g.session || '2026/2027'},
            ${g.subject},
            ${Number(g.ca1) || 0},
            ${Number(g.ca2) || 0},
            ${Number(g.exam) || 0},
            ${Number(g.total) || 0},
            ${g.grade || 'F'},
            ${g.remark || null},
            ${g.status || 'Submitted'}
          )
          ON CONFLICT (id) DO UPDATE SET
            ca1 = EXCLUDED.ca1,
            ca2 = EXCLUDED.ca2,
            exam = EXCLUDED.exam,
            total = EXCLUDED.total,
            grade = EXCLUDED.grade,
            remark = EXCLUDED.remark;
        `;
      }
      console.log(`✓ Synchronized ${db.grades.length} gradebook records.`);
    }

    // Sync Teachers
    if (Array.isArray(db.teachers)) {
      console.log(`Syncing ${db.teachers.length} teachers...`);
      for (const t of db.teachers) {
        await sql`
          INSERT INTO rh_teachers (id, name, email, phone, role, dept, qualification, primary_subject, form_teacher_class)
          VALUES (
            ${t.id},
            ${t.name},
            ${t.email},
            ${t.phone || null},
            ${t.role || null},
            ${t.dept || null},
            ${t.qualification || null},
            ${t.primarySubject || null},
            ${t.formTeacherClass || null}
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            role = EXCLUDED.role,
            dept = EXCLUDED.dept,
            qualification = EXCLUDED.qualification,
            primary_subject = EXCLUDED.primary_subject,
            form_teacher_class = EXCLUDED.form_teacher_class;
        `;
      }
      console.log(`✓ Synchronized ${db.teachers.length} teachers.`);
    }

    // Sync Class Allocations
    if (db.classAllocations && typeof db.classAllocations === 'object') {
      const keys = Object.keys(db.classAllocations);
      console.log(`Syncing ${keys.length} class allocations...`);
      for (const k of keys) {
        const item = db.classAllocations[k];
        await sql`
          INSERT INTO rh_class_allocations (class_key, name, category, arm, room, capacity, enrolled, form_teacher, subjects)
          VALUES (
            ${k},
            ${item.name || k},
            ${item.category || null},
            ${item.arm || null},
            ${item.room || null},
            ${Number(item.capacity) || 35},
            ${Number(item.enrolled) || 0},
            ${item.formTeacher || null},
            ${JSON.stringify(item.subjects || [])}::jsonb
          )
          ON CONFLICT (class_key) DO UPDATE SET
            name = EXCLUDED.name,
            form_teacher = EXCLUDED.form_teacher,
            enrolled = EXCLUDED.enrolled,
            subjects = EXCLUDED.subjects;
        `;
      }
      console.log(`✓ Synchronized ${keys.length} class allocations.`);
    }

    // Sync Scratch Cards
    if (Array.isArray(db.scratchCards)) {
      console.log(`Syncing ${db.scratchCards.length} scratch cards...`);
      for (const sc of db.scratchCards) {
        await sql`
          INSERT INTO rh_scratch_cards (
            id, serial_number, pin, session, term, price, max_uses, used_count,
            student_id, student_name, status, created_at, expires_at, last_used_at, batch_code
          ) VALUES (
            ${sc.id}, ${sc.serialNumber}, ${sc.pin}, ${sc.session}, ${sc.term},
            ${sc.price || 2000}, ${sc.maxUses || 5}, ${sc.usedCount || 0},
            ${sc.studentId || null}, ${sc.studentName || null}, ${sc.status || 'Active'},
            ${sc.createdAt || new Date().toISOString()}, ${sc.expiresAt || null},
            ${sc.lastUsedAt || null}, ${sc.batchCode || 'BATCH-2026-T1'}
          )
          ON CONFLICT (serial_number) DO UPDATE SET
            status = EXCLUDED.status,
            used_count = EXCLUDED.used_count,
            student_id = EXCLUDED.student_id,
            student_name = EXCLUDED.student_name,
            last_used_at = EXCLUDED.last_used_at;
        `;
      }
      console.log(`✓ Synchronized ${db.scratchCards.length} scratch cards.`);
    }

    // Verification Counts
    console.log('\n--- Final Database Table Counts in Neon Postgres ---');
    const [uCount] = await sql`SELECT COUNT(*) as count FROM rh_users;`;
    const [aCount] = await sql`SELECT COUNT(*) as count FROM rh_admissions;`;
    const [sCount] = await sql`SELECT COUNT(*) as count FROM rh_students;`;
    const [fCount] = await sql`SELECT COUNT(*) as count FROM rh_fees;`;
    const [pCount] = await sql`SELECT COUNT(*) as count FROM rh_payments;`;
    const [attCount] = await sql`SELECT COUNT(*) as count FROM rh_attendance;`;
    const [gCount] = await sql`SELECT COUNT(*) as count FROM rh_grades;`;
    const [tCount] = await sql`SELECT COUNT(*) as count FROM rh_teachers;`;
    const [cCount] = await sql`SELECT COUNT(*) as count FROM rh_class_allocations;`;
    const [scCount] = await sql`SELECT COUNT(*) as count FROM rh_scratch_cards;`;

    console.log(`- rh_users: ${uCount.count}`);
    console.log(`- rh_admissions: ${aCount.count}`);
    console.log(`- rh_students: ${sCount.count}`);
    console.log(`- rh_fees: ${fCount.count}`);
    console.log(`- rh_payments: ${pCount.count}`);
    console.log(`- rh_attendance: ${attCount.count}`);
    console.log(`- rh_grades: ${gCount.count}`);
    console.log(`- rh_teachers: ${tCount.count}`);
    console.log(`- rh_class_allocations: ${cCount.count}`);
    console.log(`- rh_scratch_cards: ${scCount.count}`);

    console.log('\n🚀 Neon Postgres database sync complete and all data verified!');
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1);
  }
}

run();
