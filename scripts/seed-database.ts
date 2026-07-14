import pg from 'pg';
import crypto from 'crypto';
import { mockPatients, mockDoctors, mockBeds, mockAppointments, mockStaff } from '../src/lib/mock-data';

const { Client } = pg;

const client = new Client({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.gcvlflzjvxmrscrfzdot',
  database: 'postgres',
  password: '@NXHospital%511'
});

async function run() {
  console.log("Connecting to PostgreSQL database...");
  await client.connect();
  console.log("Connected successfully!");

  console.log("Clearing existing data from tables...");
  await client.query('TRUNCATE TABLE appointments, beds, patients, doctors, profiles CASCADE;');
  console.log("Tables cleared.");

  // 1. Seed Profiles & Doctors
  const doctorUuidMap = new Map<string, string>(); // Maps DOC-001 -> UUID
  const doctorNameUuidMap = new Map<string, string>(); // Maps "Dr. Priya Sharma" -> UUID
  const staffUuidMap = new Map<string, string>(); // Maps STF-001 -> UUID

  console.log("Seeding Profiles and Doctors...");
  
  // Seed an Admin profile
  const adminUuid = crypto.randomUUID();
  await client.query(`
    INSERT INTO profiles (id, name, email, role, department, phone)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [adminUuid, 'Admin User', 'admin@nexora.com', 'admin', 'Administration', '01711-000000']);
  console.log("Seeded Admin Profile");

  // Seed Doctors
  for (const doc of mockDoctors) {
    const docUuid = crypto.randomUUID();
    doctorUuidMap.set(doc.id, docUuid);
    doctorNameUuidMap.set(doc.name, docUuid);

    // Insert into profiles
    await client.query(`
      INSERT INTO profiles (id, name, email, role, department, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [docUuid, doc.name, doc.email, 'doctor', doc.department, doc.phone]);

    // Insert into doctors
    await client.query(`
      INSERT INTO doctors (id, specialization, department, status, experience, qualification, rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [docUuid, doc.specialization, doc.department, doc.status, doc.experience, doc.qualification, doc.rating]);
  }
  console.log(`Seeded ${mockDoctors.length} Doctors and Profiles.`);

  // Seed other staff members
  for (const stf of mockStaff) {
    const stfUuid = crypto.randomUUID();
    staffUuidMap.set(stf.id, stfUuid);

    await client.query(`
      INSERT INTO profiles (id, name, email, role, department, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [stfUuid, stf.name, stf.email, stf.role, stf.department, stf.phone]);
  }
  console.log(`Seeded ${mockStaff.length} other Staff Profiles.`);

  // 2. Seed Patients
  console.log("Seeding Patients...");
  const patientUuidMap = new Map<string, string>(); // Maps NXR-2026-10001 -> UUID

  for (const pat of mockPatients) {
    const patUuid = crypto.randomUUID();
    patientUuidMap.set(pat.id, patUuid);

    // Find assigned doctor UUID
    let docAssignedUuid: string | null = null;
    if (pat.doctorAssigned) {
      docAssignedUuid = doctorNameUuidMap.get(pat.doctorAssigned) || null;
    }

    await client.query(`
      INSERT INTO patients (
        id, name, age, gender, blood_group, phone, email, address, 
        emergency_contact, registration_date, patient_type, priority, 
        department, doctor_assigned, bed_assigned, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `, [
      patUuid,
      pat.name,
      pat.age,
      pat.gender,
      pat.bloodGroup,
      pat.phone,
      pat.email || null,
      pat.address,
      pat.emergencyContact,
      pat.registrationDate,
      pat.patientType,
      pat.priority || 'stable',
      pat.department,
      docAssignedUuid,
      null, // bed_assigned will be linked later
      pat.status || 'active'
    ]);
  }
  console.log(`Seeded ${mockPatients.length} Patients.`);

  // 3. Seed Beds
  console.log("Seeding Beds...");
  const bedUuidMap = new Map<string, string>(); // Maps W1-01 -> UUID

  for (const bed of mockBeds) {
    const bedUuid = crypto.randomUUID();
    bedUuidMap.set(bed.id, bedUuid);

    let patUuid: string | null = null;
    if (bed.patientId) {
      patUuid = patientUuidMap.get(bed.patientId) || null;
    }

    await client.query(`
      INSERT INTO beds (id, number, ward, floor, type, status, patient_id, admission_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      bedUuid,
      bed.number,
      bed.ward,
      bed.floor,
      bed.type,
      bed.status,
      patUuid,
      bed.admissionDate ? new Date(bed.admissionDate) : null
    ]);
  }
  console.log(`Seeded ${mockBeds.length} Beds.`);

  // 4. Update Patients with Bed Assigned
  console.log("Linking Bed Assignments to Patients...");
  for (const pat of mockPatients) {
    if (pat.bedAssigned) {
      const patUuid = patientUuidMap.get(pat.id);
      const bedUuid = bedUuidMap.get(pat.bedAssigned);

      if (patUuid && bedUuid) {
        await client.query(`
          UPDATE patients 
          SET bed_assigned = $1 
          WHERE id = $2
        `, [bedUuid, patUuid]);
      }
    }
  }
  console.log("Linked Beds to Patients.");

  // 5. Seed Appointments
  console.log("Seeding Appointments...");
  for (const appt of mockAppointments) {
    const apptUuid = crypto.randomUUID();
    const patUuid = patientUuidMap.get(appt.patientId) || null;
    const docUuid = doctorUuidMap.get(appt.doctorId) || null;

    if (patUuid && docUuid) {
      // Map appointment status or fallback
      let apptStatus: string = appt.status;
      if (apptStatus === 'in_progress') apptStatus = 'active'; // map to simple text status
      
      await client.query(`
        INSERT INTO appointments (id, patient_id, doctor_id, department, date, time, status, token_number, priority)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        apptUuid,
        patUuid,
        docUuid,
        appt.department,
        appt.date,
        appt.time,
        apptStatus,
        appt.tokenNumber,
        appt.priority || 'stable'
      ]);
    }
  }
  console.log(`Seeded ${mockAppointments.length} Appointments.`);

  console.log("Database seeded successfully!");
  await client.end();
}

run().catch(async (err) => {
  console.error("Error seeding database:", err);
  try {
    await client.end();
  } catch (e) {}
});
