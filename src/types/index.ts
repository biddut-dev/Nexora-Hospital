// types/index.ts

export type UserRole =
  | "admin"
  | "manager"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "pharmacist"
  | "pathologist"
  | "radiology_technician"
  | "equipment_operator"
  | "medical_assistant"
  | "ward_boy"
  | "cleaner"
  | "report_delivery"
  | "patient";

export type PatientPriority = "critical" | "urgent" | "stable";

export type BedStatus = "available" | "occupied" | "reserved" | "cleaning" | "maintenance";

export type BedType =
  | "general"
  | "cabin"
  | "vip_cabin"
  | "icu"
  | "nicu"
  | "picu"
  | "emergency"
  | "isolation";

export type AppointmentStatus = "scheduled" | "confirmed" | "waiting" | "in_progress" | "completed" | "cancelled";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  bloodGroup: BloodGroup;
  phone: string;
  email?: string;
  address: string;
  emergencyContact: string;
  registrationDate: string;
  patientType: "opd" | "ipd" | "emergency";
  priority?: PatientPriority;
  department?: string;
  doctorAssigned?: string;
  bedAssigned?: string;
  status: "active" | "admitted" | "discharged" | "transferred";
  avatar?: string;
  insuranceId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  status: "available" | "busy" | "off_duty" | "on_leave";
  patientsToday: number;
  experience: number;
  avatar?: string;
  qualification: string;
  schedule: string[];
  rating: number;
}

export interface Bed {
  id: string;
  number: string;
  ward: string;
  floor: number;
  type: BedType;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  tokenNumber?: string;
  notes?: string;
  priority?: PatientPriority;
}

export interface VitalSign {
  timestamp: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodSugar: number;
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate: number;
  weight: number;
  bmi: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
  diagnosis: string;
  notes?: string;
  followUpDate?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  requestedBy: string;
  requestDate: string;
  status: "pending" | "sample_collected" | "processing" | "completed" | "approved";
  result?: string;
  normalRange?: string;
  isAbnormal?: boolean;
  reportDate?: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  status: "available" | "dispatched" | "returning" | "maintenance";
  location?: string;
  assignedTo?: string;
  lastUpdated: string;
}

export interface BloodUnit {
  bloodGroup: BloodGroup;
  units: number;
  lastUpdated: string;
  expiryDate: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  phone: string;
  email: string;
  joiningDate: string;
  status: "active" | "on_leave" | "inactive";
  shift: "morning" | "evening" | "night";
  avatar?: string;
}

export interface MedicalEquipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "operational" | "maintenance" | "faulty" | "reserved";
  lastMaintenance: string;
  nextMaintenance: string;
  serialNumber: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical" | "success";
  timestamp: string;
  read: boolean;
}

export interface KPICard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: "green" | "blue" | "amber" | "red" | "purple";
  description?: string;
}
