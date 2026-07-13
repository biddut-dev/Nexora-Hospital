// lib/mock-data/index.ts
import {
  Patient,
  Doctor,
  Bed,
  Appointment,
  VitalSign,
  Prescription,
  LabTest,
  Ambulance,
  BloodUnit,
  StaffMember,
  MedicalEquipment,
  Notification,
} from "@/types";

export const mockPatients: Patient[] = [
  { id: "NXR-2026-10001", name: "Rahman Ali", age: 45, gender: "male", bloodGroup: "B+", phone: "01711-234567", email: "rahman@email.com", address: "Dhaka, Bangladesh", emergencyContact: "01711-234568", registrationDate: "2026-07-01", patientType: "opd", priority: "stable", department: "Cardiology", doctorAssigned: "Dr. Priya Sharma", status: "active" },
  { id: "NXR-2026-10002", name: "Fatima Begum", age: 32, gender: "female", bloodGroup: "A+", phone: "01812-345678", address: "Chittagong, Bangladesh", emergencyContact: "01812-345679", registrationDate: "2026-07-05", patientType: "ipd", priority: "urgent", department: "Gynecology", doctorAssigned: "Dr. Nadia Islam", bedAssigned: "W3-12", status: "active" },
  { id: "NXR-2026-10003", name: "Karim Hossain", age: 67, gender: "male", bloodGroup: "O+", phone: "01611-456789", address: "Sylhet, Bangladesh", emergencyContact: "01611-456790", registrationDate: "2026-07-10", patientType: "emergency", priority: "critical", department: "Neurology", doctorAssigned: "Dr. Ahmed Reza", bedAssigned: "ICU-4", status: "active" },
  { id: "NXR-2026-10004", name: "Nasrin Akter", age: 28, gender: "female", bloodGroup: "AB+", phone: "01711-567890", address: "Rajshahi, Bangladesh", emergencyContact: "01711-567891", registrationDate: "2026-07-11", patientType: "opd", priority: "stable", department: "Dermatology", doctorAssigned: "Dr. Sumaiya Khan", status: "active" },
  { id: "NXR-2026-10005", name: "Mosaddek Ahmed", age: 52, gender: "male", bloodGroup: "A-", phone: "01912-678901", address: "Khulna, Bangladesh", emergencyContact: "01912-678902", registrationDate: "2026-07-12", patientType: "ipd", priority: "urgent", department: "Orthopedics", doctorAssigned: "Dr. Rafiq Uddin", bedAssigned: "W1-05", status: "active" },
  { id: "NXR-2026-10006", name: "Shirin Sultana", age: 41, gender: "female", bloodGroup: "O-", phone: "01511-789012", address: "Barisal, Bangladesh", emergencyContact: "01511-789013", registrationDate: "2026-07-13", patientType: "emergency", priority: "critical", department: "Emergency", doctorAssigned: "Dr. Saidul Islam", bedAssigned: "EM-02", status: "active" },
  { id: "NXR-2026-10007", name: "Hanif Miah", age: 38, gender: "male", bloodGroup: "B-", phone: "01411-890123", address: "Comilla, Bangladesh", emergencyContact: "01411-890124", registrationDate: "2026-07-13", patientType: "opd", priority: "stable", department: "ENT", doctorAssigned: "Dr. Joynal Abedin", status: "active" },
  { id: "NXR-2026-10008", name: "Rima Chowdhury", age: 23, gender: "female", bloodGroup: "AB-", phone: "01311-901234", address: "Mymensingh, Bangladesh", emergencyContact: "01311-901235", registrationDate: "2026-07-13", patientType: "opd", priority: "stable", department: "Ophthalmology", doctorAssigned: "Dr. Rashida Khatun", status: "active" },
  { id: "NXR-2026-10009", name: "Delwar Hossain", age: 71, gender: "male", bloodGroup: "A+", phone: "01611-012345", address: "Rangpur, Bangladesh", emergencyContact: "01611-012346", registrationDate: "2026-07-08", patientType: "ipd", priority: "urgent", department: "Cardiology", doctorAssigned: "Dr. Priya Sharma", bedAssigned: "CCU-2", status: "active" },
  { id: "NXR-2026-10010", name: "Ayesha Siddika", age: 19, gender: "female", bloodGroup: "B+", phone: "01711-123456", address: "Dhaka, Bangladesh", emergencyContact: "01711-123457", registrationDate: "2026-07-13", patientType: "opd", priority: "stable", department: "General Medicine", doctorAssigned: "Dr. Tanvir Hassan", status: "active" },
];

export const mockDoctors: Doctor[] = [
  { id: "DOC-001", name: "Dr. Priya Sharma", specialization: "Cardiology", department: "Cardiology", phone: "01711-DOC001", email: "priya@nexora.com", status: "busy", patientsToday: 18, experience: 12, qualification: "MBBS, MD (Cardiology)", schedule: ["Mon", "Tue", "Wed", "Thu", "Fri"], rating: 4.9 },
  { id: "DOC-002", name: "Dr. Nadia Islam", specialization: "Gynecology & Obstetrics", department: "Gynecology", phone: "01711-DOC002", email: "nadia@nexora.com", status: "available", patientsToday: 14, experience: 8, qualification: "MBBS, FCPS (OBG)", schedule: ["Mon", "Tue", "Thu", "Fri"], rating: 4.8 },
  { id: "DOC-003", name: "Dr. Ahmed Reza", specialization: "Neurology", department: "Neurology", phone: "01711-DOC003", email: "ahmed@nexora.com", status: "busy", patientsToday: 10, experience: 15, qualification: "MBBS, MD (Neurology)", schedule: ["Tue", "Wed", "Thu", "Sat"], rating: 4.7 },
  { id: "DOC-004", name: "Dr. Sumaiya Khan", specialization: "Dermatology", department: "Dermatology", phone: "01711-DOC004", email: "sumaiya@nexora.com", status: "available", patientsToday: 22, experience: 6, qualification: "MBBS, FCPS (Dermatology)", schedule: ["Mon", "Wed", "Fri"], rating: 4.6 },
  { id: "DOC-005", name: "Dr. Rafiq Uddin", specialization: "Orthopedics", department: "Orthopedics", phone: "01711-DOC005", email: "rafiq@nexora.com", status: "off_duty", patientsToday: 0, experience: 20, qualification: "MBBS, MS (Orthopedics)", schedule: ["Mon", "Tue", "Wed", "Thu"], rating: 4.9 },
  { id: "DOC-006", name: "Dr. Saidul Islam", specialization: "Emergency Medicine", department: "Emergency", phone: "01711-DOC006", email: "saidul@nexora.com", status: "busy", patientsToday: 35, experience: 10, qualification: "MBBS, MD (Emergency)", schedule: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], rating: 4.8 },
  { id: "DOC-007", name: "Dr. Tanvir Hassan", specialization: "General Medicine", department: "General Medicine", phone: "01711-DOC007", email: "tanvir@nexora.com", status: "available", patientsToday: 28, experience: 9, qualification: "MBBS, MD (Internal Medicine)", schedule: ["Mon", "Tue", "Wed", "Thu", "Fri"], rating: 4.5 },
  { id: "DOC-008", name: "Dr. Joynal Abedin", specialization: "ENT", department: "ENT", phone: "01711-DOC008", email: "joynal@nexora.com", status: "available", patientsToday: 16, experience: 11, qualification: "MBBS, MS (ENT)", schedule: ["Mon", "Wed", "Thu", "Sat"], rating: 4.7 },
  { id: "DOC-009", name: "Dr. Rashida Khatun", specialization: "Ophthalmology", department: "Ophthalmology", phone: "01711-DOC009", email: "rashida@nexora.com", status: "busy", patientsToday: 19, experience: 7, qualification: "MBBS, MS (Ophthalmology)", schedule: ["Mon", "Tue", "Thu", "Fri"], rating: 4.6 },
  { id: "DOC-010", name: "Dr. Imran Chowdhury", specialization: "Pediatrics", department: "Pediatrics", phone: "01711-DOC010", email: "imran@nexora.com", status: "on_leave", patientsToday: 0, experience: 14, qualification: "MBBS, DCH, MD (Pediatrics)", schedule: ["Tue", "Wed", "Thu", "Fri", "Sat"], rating: 4.9 },
];

export const mockBeds: Bed[] = [
  // Ward 1 - General
  { id: "W1-01", number: "101", ward: "Ward 1 - General", floor: 1, type: "general", status: "occupied", patientId: "NXR-2026-10005", patientName: "Mosaddek Ahmed", admissionDate: "2026-07-12" },
  { id: "W1-02", number: "102", ward: "Ward 1 - General", floor: 1, type: "general", status: "available" },
  { id: "W1-03", number: "103", ward: "Ward 1 - General", floor: 1, type: "general", status: "cleaning" },
  { id: "W1-04", number: "104", ward: "Ward 1 - General", floor: 1, type: "general", status: "occupied", patientName: "Jahangir Alam" },
  { id: "W1-05", number: "105", ward: "Ward 1 - General", floor: 1, type: "general", status: "reserved" },
  { id: "W1-06", number: "106", ward: "Ward 1 - General", floor: 1, type: "general", status: "available" },
  // Ward 2 - Cabin
  { id: "W2-01", number: "201", ward: "Ward 2 - Cabin", floor: 2, type: "cabin", status: "occupied", patientName: "Aminul Islam" },
  { id: "W2-02", number: "202", ward: "Ward 2 - Cabin", floor: 2, type: "cabin", status: "available" },
  { id: "W2-03", number: "203", ward: "Ward 2 - Cabin", floor: 2, type: "vip_cabin", status: "reserved" },
  { id: "W2-04", number: "204", ward: "Ward 2 - Cabin", floor: 2, type: "vip_cabin", status: "occupied", patientName: "Rina Begum" },
  // ICU
  { id: "ICU-1", number: "ICU-1", ward: "Intensive Care Unit", floor: 3, type: "icu", status: "occupied", patientName: "Harun Rashid" },
  { id: "ICU-2", number: "ICU-2", ward: "Intensive Care Unit", floor: 3, type: "icu", status: "occupied", patientName: "Fatima Khanom" },
  { id: "ICU-3", number: "ICU-3", ward: "Intensive Care Unit", floor: 3, type: "icu", status: "available" },
  { id: "ICU-4", number: "ICU-4", ward: "Intensive Care Unit", floor: 3, type: "icu", status: "occupied", patientId: "NXR-2026-10003", patientName: "Karim Hossain", admissionDate: "2026-07-10" },
  { id: "ICU-5", number: "ICU-5", ward: "Intensive Care Unit", floor: 3, type: "icu", status: "maintenance" },
  // Emergency
  { id: "EM-01", number: "EM-1", ward: "Emergency", floor: 0, type: "emergency", status: "occupied", patientName: "Unknown Male" },
  { id: "EM-02", number: "EM-2", ward: "Emergency", floor: 0, type: "emergency", status: "occupied", patientId: "NXR-2026-10006", patientName: "Shirin Sultana" },
  { id: "EM-03", number: "EM-3", ward: "Emergency", floor: 0, type: "emergency", status: "available" },
  { id: "EM-04", number: "EM-4", ward: "Emergency", floor: 0, type: "emergency", status: "available" },
  // CCU
  { id: "CCU-1", number: "CCU-1", ward: "Cardiac Care Unit", floor: 3, type: "icu", status: "occupied", patientName: "Shahidul Haque" },
  { id: "CCU-2", number: "CCU-2", ward: "Cardiac Care Unit", floor: 3, type: "icu", status: "occupied", patientId: "NXR-2026-10009", patientName: "Delwar Hossain" },
  // NICU
  { id: "NICU-1", number: "NICU-1", ward: "Neonatal ICU", floor: 4, type: "nicu", status: "occupied", patientName: "Baby Boy (Karim)" },
  { id: "NICU-2", number: "NICU-2", ward: "Neonatal ICU", floor: 4, type: "nicu", status: "available" },
  { id: "NICU-3", number: "NICU-3", ward: "Neonatal ICU", floor: 4, type: "nicu", status: "available" },
];

export const mockAppointments: Appointment[] = [
  { id: "APT-001", patientId: "NXR-2026-10001", patientName: "Rahman Ali", doctorId: "DOC-001", doctorName: "Dr. Priya Sharma", department: "Cardiology", date: "2026-07-13", time: "09:00", status: "completed", tokenNumber: "T-001", priority: "stable" },
  { id: "APT-002", patientId: "NXR-2026-10004", patientName: "Nasrin Akter", doctorId: "DOC-004", doctorName: "Dr. Sumaiya Khan", department: "Dermatology", date: "2026-07-13", time: "10:00", status: "in_progress", tokenNumber: "T-002", priority: "stable" },
  { id: "APT-003", patientId: "NXR-2026-10007", patientName: "Hanif Miah", doctorId: "DOC-008", doctorName: "Dr. Joynal Abedin", department: "ENT", date: "2026-07-13", time: "10:30", status: "waiting", tokenNumber: "T-003", priority: "stable" },
  { id: "APT-004", patientId: "NXR-2026-10008", patientName: "Rima Chowdhury", doctorId: "DOC-009", doctorName: "Dr. Rashida Khatun", department: "Ophthalmology", date: "2026-07-13", time: "11:00", status: "scheduled", tokenNumber: "T-004", priority: "stable" },
  { id: "APT-005", patientId: "NXR-2026-10010", patientName: "Ayesha Siddika", doctorId: "DOC-007", doctorName: "Dr. Tanvir Hassan", department: "General Medicine", date: "2026-07-13", time: "11:30", status: "scheduled", tokenNumber: "T-005", priority: "stable" },
  { id: "APT-006", patientId: "NXR-2026-10001", patientName: "Rahman Ali", doctorId: "DOC-007", doctorName: "Dr. Tanvir Hassan", department: "General Medicine", date: "2026-07-14", time: "09:00", status: "confirmed", tokenNumber: "T-006" },
  { id: "APT-007", patientId: "NXR-2026-10002", patientName: "Fatima Begum", doctorId: "DOC-002", doctorName: "Dr. Nadia Islam", department: "Gynecology", date: "2026-07-14", time: "10:00", status: "confirmed", tokenNumber: "T-007", priority: "urgent" },
];

export const mockVitals: VitalSign[] = Array.from({ length: 30 }, (_, i) => ({
  timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  heartRate: 72 + Math.floor(Math.random() * 20 - 10),
  bloodPressureSystolic: 120 + Math.floor(Math.random() * 30 - 15),
  bloodPressureDiastolic: 80 + Math.floor(Math.random() * 20 - 10),
  bloodSugar: 95 + Math.floor(Math.random() * 40 - 10),
  oxygenSaturation: 97 + Math.floor(Math.random() * 3 - 1),
  temperature: 36.5 + Math.random() * 1.5 - 0.5,
  respiratoryRate: 16 + Math.floor(Math.random() * 6 - 3),
  weight: 72 + Math.random() * 2 - 1,
  bmi: 24.5 + Math.random() * 1 - 0.5,
}));

export const mockLabTests: LabTest[] = [
  { id: "LAB-001", patientId: "NXR-2026-10001", patientName: "Rahman Ali", testName: "Complete Blood Count (CBC)", requestedBy: "Dr. Priya Sharma", requestDate: "2026-07-13", status: "completed", result: "WBC: 6.2, RBC: 4.8, HGB: 14.2, PLT: 245", normalRange: "WBC: 4-11 K/μL", isAbnormal: false, reportDate: "2026-07-13" },
  { id: "LAB-002", patientId: "NXR-2026-10003", patientName: "Karim Hossain", testName: "MRI Brain", requestedBy: "Dr. Ahmed Reza", requestDate: "2026-07-10", status: "approved", result: "Hyperintense lesion noted in left temporal lobe", isAbnormal: true, reportDate: "2026-07-11" },
  { id: "LAB-003", patientId: "NXR-2026-10009", patientName: "Delwar Hossain", testName: "ECG", requestedBy: "Dr. Priya Sharma", requestDate: "2026-07-13", status: "processing" },
  { id: "LAB-004", patientId: "NXR-2026-10004", patientName: "Nasrin Akter", testName: "Skin Biopsy", requestedBy: "Dr. Sumaiya Khan", requestDate: "2026-07-12", status: "sample_collected" },
  { id: "LAB-005", patientId: "NXR-2026-10002", patientName: "Fatima Begum", testName: "Ultrasound (Abdomen-Pelvis)", requestedBy: "Dr. Nadia Islam", requestDate: "2026-07-13", status: "pending" },
];

export const mockAmbulances: Ambulance[] = [
  { id: "AMB-001", vehicleNumber: "DM-KA-11-9001", driverName: "Kamal Hossain", status: "available", location: "Hospital Base", lastUpdated: new Date().toISOString() },
  { id: "AMB-002", vehicleNumber: "DM-KA-11-9002", driverName: "Rahim Uddin", status: "dispatched", location: "Mirpur 10, Dhaka", assignedTo: "Emergency Call #4721", lastUpdated: new Date().toISOString() },
  { id: "AMB-003", vehicleNumber: "DM-KA-11-9003", driverName: "Sumon Das", status: "returning", location: "Gulshan, Dhaka", lastUpdated: new Date().toISOString() },
  { id: "AMB-004", vehicleNumber: "DM-KA-11-9004", driverName: "Babul Mia", status: "maintenance", location: "Workshop", lastUpdated: new Date().toISOString() },
  { id: "AMB-005", vehicleNumber: "DM-KA-11-9005", driverName: "Jahid Hassan", status: "available", location: "Hospital Base", lastUpdated: new Date().toISOString() },
];

export const mockBloodBank: BloodUnit[] = [
  { bloodGroup: "A+", units: 24, lastUpdated: "2026-07-12", expiryDate: "2026-08-12" },
  { bloodGroup: "A-", units: 8, lastUpdated: "2026-07-10", expiryDate: "2026-08-10" },
  { bloodGroup: "B+", units: 31, lastUpdated: "2026-07-13", expiryDate: "2026-08-13" },
  { bloodGroup: "B-", units: 6, lastUpdated: "2026-07-11", expiryDate: "2026-08-11" },
  { bloodGroup: "O+", units: 42, lastUpdated: "2026-07-13", expiryDate: "2026-08-13" },
  { bloodGroup: "O-", units: 3, lastUpdated: "2026-07-09", expiryDate: "2026-08-09" },
  { bloodGroup: "AB+", units: 12, lastUpdated: "2026-07-12", expiryDate: "2026-08-12" },
  { bloodGroup: "AB-", units: 2, lastUpdated: "2026-07-08", expiryDate: "2026-08-08" },
];

export const mockStaff: StaffMember[] = [
  { id: "STF-001", name: "Nurse Salma Begum", role: "nurse", department: "ICU", phone: "01711-STF001", email: "salma@nexora.com", joiningDate: "2022-03-15", status: "active", shift: "morning" },
  { id: "STF-002", name: "Receptionist Rony Islam", role: "receptionist", department: "OPD", phone: "01711-STF002", email: "rony@nexora.com", joiningDate: "2023-01-10", status: "active", shift: "morning" },
  { id: "STF-003", name: "Pharmacist Nasim Ahmed", role: "pharmacist", department: "Pharmacy", phone: "01711-STF003", email: "nasim@nexora.com", joiningDate: "2021-06-20", status: "active", shift: "evening" },
  { id: "STF-004", name: "Lab Tech Tania Khatun", role: "pathologist", department: "Laboratory", phone: "01711-STF004", email: "tania@nexora.com", joiningDate: "2023-08-01", status: "active", shift: "morning" },
  { id: "STF-005", name: "Rad Tech Mizan Rahman", role: "radiology_technician", department: "Radiology", phone: "01711-STF005", email: "mizan@nexora.com", joiningDate: "2022-11-15", status: "active", shift: "evening" },
];

export const mockEquipment: MedicalEquipment[] = [
  { id: "EQP-001", name: "Ventilator V500", type: "Ventilator", location: "ICU-1", status: "operational", lastMaintenance: "2026-06-01", nextMaintenance: "2026-09-01", serialNumber: "VT-2024-0091" },
  { id: "EQP-002", name: "Patient Monitor PM-8000", type: "Monitor", location: "ICU-3", status: "maintenance", lastMaintenance: "2026-07-10", nextMaintenance: "2026-07-20", serialNumber: "PM-2023-0145" },
  { id: "EQP-003", name: "MRI Machine 3T", type: "MRI", location: "Radiology Wing", status: "operational", lastMaintenance: "2026-05-15", nextMaintenance: "2026-08-15", serialNumber: "MR-2022-0007" },
  { id: "EQP-004", name: "CT Scanner 64-Slice", type: "CT Scanner", location: "Radiology Wing", status: "operational", lastMaintenance: "2026-06-20", nextMaintenance: "2026-09-20", serialNumber: "CT-2023-0003" },
  { id: "EQP-005", name: "Oxygen Concentrator OC-5", type: "Oxygen", location: "Ward 1", status: "operational", lastMaintenance: "2026-07-01", nextMaintenance: "2026-10-01", serialNumber: "OX-2025-0221" },
];

export const mockNotifications: Notification[] = [
  { id: "NOT-001", title: "Critical Patient Alert", message: "Patient Karim Hossain (ICU-4) vitals are deteriorating. Immediate attention required.", type: "critical", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), read: false },
  { id: "NOT-002", title: "Emergency Admission", message: "New emergency patient admitted. Triage required in EM-01.", type: "warning", timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), read: false },
  { id: "NOT-003", title: "Blood Bank Alert", message: "AB- blood type critically low (2 units remaining). Donor required.", type: "warning", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), read: false },
  { id: "NOT-004", title: "Lab Report Ready", message: "CBC report for Rahman Ali is ready for review.", type: "info", timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), read: true },
  { id: "NOT-005", title: "Ambulance Dispatched", message: "AMB-002 has been dispatched to Mirpur 10 for emergency pickup.", type: "info", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), read: true },
  { id: "NOT-006", title: "Equipment Maintenance Due", message: "Patient Monitor PM-8000 in ICU-3 is due for maintenance.", type: "warning", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: true },
];

export const mockRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  opd: Math.floor(Math.random() * 50000 + 80000),
  ipd: Math.floor(Math.random() * 120000 + 150000),
  pharmacy: Math.floor(Math.random() * 30000 + 40000),
  lab: Math.floor(Math.random() * 20000 + 25000),
  total: 0,
})).map(d => ({ ...d, total: d.opd + d.ipd + d.pharmacy + d.lab }));

export const mockDepartmentStats = [
  { department: "Cardiology", patients: 145, revenue: 892000, occupancy: 87, doctors: 4 },
  { department: "Neurology", patients: 98, revenue: 1240000, occupancy: 72, doctors: 3 },
  { department: "Orthopedics", patients: 112, revenue: 756000, occupancy: 65, doctors: 4 },
  { department: "Gynecology", patients: 87, revenue: 445000, occupancy: 78, doctors: 5 },
  { department: "Pediatrics", patients: 203, revenue: 334000, occupancy: 91, doctors: 6 },
  { department: "Emergency", patients: 341, revenue: 567000, occupancy: 94, doctors: 8 },
  { department: "General Medicine", patients: 478, revenue: 612000, occupancy: 68, doctors: 10 },
  { department: "Dermatology", patients: 156, revenue: 289000, occupancy: 45, doctors: 3 },
];

export const mockMedicines = [
  { id: "MED-001", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 2450, unit: "Capsule", price: 5, expiryDate: "2027-06-30", manufacturer: "Square Pharma", reorderLevel: 500 },
  { id: "MED-002", name: "Metformin 500mg", category: "Antidiabetic", stock: 1890, unit: "Tablet", price: 3, expiryDate: "2027-03-31", manufacturer: "Incepta", reorderLevel: 400 },
  { id: "MED-003", name: "Atorvastatin 20mg", category: "Cardiovascular", stock: 340, unit: "Tablet", price: 12, expiryDate: "2026-12-31", manufacturer: "Beximco", reorderLevel: 300 },
  { id: "MED-004", name: "Omeprazole 20mg", category: "GI", stock: 1200, unit: "Capsule", price: 8, expiryDate: "2027-01-31", manufacturer: "ACI", reorderLevel: 250 },
  { id: "MED-005", name: "Amlodipine 5mg", category: "Cardiovascular", stock: 78, unit: "Tablet", price: 6, expiryDate: "2026-09-30", manufacturer: "Renata", reorderLevel: 200 },
  { id: "MED-006", name: "Paracetamol 500mg", category: "Analgesic", stock: 5600, unit: "Tablet", price: 1, expiryDate: "2027-08-31", manufacturer: "Square Pharma", reorderLevel: 1000 },
];

export const mockHospitalStats = {
  totalPatients: 12847,
  todayOPD: 183,
  admittedPatients: 247,
  emergencyToday: 34,
  icuOccupancy: 89,
  availableBeds: 43,
  revenueToday: 487500,
  surgeriesToday: 12,
  doctors: 68,
  departments: 24,
  totalBeds: 350,
  emergencyCasesToday: 34,
};
