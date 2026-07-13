import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { mockPatients, mockDoctors, mockBeds, mockAppointments } from '../src/lib/mock-data';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding Database...");
  
  // Mappings to replace old string IDs with proper UUIDs
  const doctorIdMap = new Map<string, string>();
  const patientIdMap = new Map<string, string>();
  const bedIdMap = new Map<string, string>();
  
  // 1. Skip Doctors (requires auth.users)
  console.log("Skipping Doctors (Requires Auth Users)");

  // 2. Insert Patients
  for (const pat of mockPatients) {
    const newId = crypto.randomUUID();
    patientIdMap.set(pat.id, newId);
    
    // Find assigned doctor ID
    let docId = null;
    if (pat.doctorAssigned) {
      docId = doctorIdMap.get(pat.doctorAssigned) || null;
    }
    
    const { error } = await supabase.from('patients').insert({
      id: newId,
      name: pat.name,
      age: pat.age,
      gender: pat.gender,
      blood_group: pat.bloodGroup,
      phone: pat.phone,
      email: pat.email || null,
      address: pat.address,
      emergency_contact: pat.emergencyContact,
      registration_date: pat.registrationDate,
      patient_type: pat.patientType,
      priority: pat.priority,
      department: pat.department,
      doctor_assigned: null, // bypassing FK for now
      status: pat.status
    });
    
    if (error) console.error("Error inserting patient", error);
  }
  console.log("Seeded Patients");

  // 3. Insert Beds
  for (const bed of mockBeds) {
    const newId = crypto.randomUUID();
    bedIdMap.set(bed.id, newId);
    
    let patId = null;
    if (bed.patientId) {
      patId = patientIdMap.get(bed.patientId) || null;
    }
    
    const { error } = await supabase.from('beds').insert({
      id: newId,
      number: bed.number,
      ward: bed.ward,
      floor: bed.floor,
      type: bed.type,
      status: bed.status,
      patient_id: patId,
      admission_date: bed.admissionDate ? new Date(bed.admissionDate).toISOString() : null
    });
    if (error) console.error("Error inserting bed", error);
  }
  console.log("Seeded Beds");
  
  // 4. Update Patients with Bed Assigned
  // We need to map `mockPatients.bedAssigned` (which is string bed id like "W1-05") to new UUID.
  for (const pat of mockPatients) {
    if (pat.bedAssigned) {
       const bId = bedIdMap.get(pat.bedAssigned);
       if (bId) {
         await supabase.from('patients').update({ bed_assigned: bId }).eq('id', patientIdMap.get(pat.id));
       }
    }
  }
  console.log("Linked Beds to Patients");

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
