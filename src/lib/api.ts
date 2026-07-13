import { createClient } from './supabase/client';

const getSupabase = () => {
  // We use this function so that it uses the environment variables securely
  return createClient();
};

export async function getPatients() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      bed_assigned ( number, ward )
    `);
  
  if (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
  return data;
}

export async function getDoctors() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('doctors').select('*');
  
  if (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
  return data;
}

export async function getBeds() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('beds').select('*');
  
  if (error) {
    console.error('Error fetching beds:', error);
    return [];
  }
  return data;
}

export async function getCommandCenterStats() {
  const supabase = getSupabase();
  
  try {
    const [
      { count: patientsCount },
      { count: doctorsCount },
      { count: availableBeds },
    ] = await Promise.all([
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('beds').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    ]);

    return {
      patients: patientsCount || 0,
      doctors: doctorsCount || 0,
      availableBeds: availableBeds || 0,
    };
  } catch (error) {
    console.error("Error fetching stats from Supabase:", error);
    return { patients: 0, doctors: 0, availableBeds: 0 };
  }
}
