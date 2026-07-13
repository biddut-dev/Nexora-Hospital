import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:@NXHospital%511@db.gcvlflzjvxmrscrfzdot.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  console.log("Connected to PostgreSQL");
  
  await client.query('ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;');
  console.log("Dropped profiles -> auth.users fkey");
  
  await client.query('ALTER TABLE patients DROP CONSTRAINT IF EXISTS fk_doctor_assigned;');
  await client.query('ALTER TABLE patients DROP CONSTRAINT IF EXISTS patients_doctor_assigned_fkey;');
  console.log("Dropped patients -> doctors fkey");
  
  await client.query('ALTER TABLE beds DROP CONSTRAINT IF EXISTS beds_patient_id_fkey;');
  console.log("Dropped beds -> patients fkey");
  
  await client.end();
}

run().catch(console.error);
