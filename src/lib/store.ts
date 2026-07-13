import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  Patient, Doctor, Bed, Appointment, LabTest, Ambulance, BloodUnit, StaffMember, MedicalEquipment, Medicine 
} from "@/types";
import { 
  mockPatients, mockDoctors, mockBeds, mockAppointments, mockLabTests, mockAmbulances, 
  mockBloodBank, mockStaff, mockEquipment, mockMedicines 
} from "./mock-data";
import { getPatients, getBeds, registerPatient as apiRegisterPatient, admitPatient as apiAdmitPatient } from "./api";

const initialInvoices = [
  { id: "BILL-2026-3421", patient: "Rahman Ali", type: "OPD", amount: 2500, status: "paid", date: "2026-07-13" },
  { id: "BILL-2026-3420", patient: "Fatima Begum", type: "IPD", amount: 48500, status: "pending", date: "2026-07-12" },
  { id: "BILL-2026-3419", patient: "Karim Hossain", type: "Emergency + ICU", amount: 125000, status: "insurance", date: "2026-07-10" },
  { id: "BILL-2026-3418", patient: "Nasrin Akter", type: "OPD + Lab", amount: 3800, status: "paid", date: "2026-07-11" },
  { id: "BILL-2026-3417", patient: "Mosaddek Ahmed", type: "Surgery + IPD", amount: 87500, status: "partial", date: "2026-07-12" },
];

interface AppState {
  patients: Patient[];
  doctors: Doctor[];
  beds: Bed[];
  appointments: Appointment[];
  labTests: LabTest[];
  ambulances: Ambulance[];
  bloodBank: BloodUnit[];
  staff: StaffMember[];
  equipment: MedicalEquipment[];
  medicines: any[];
  invoices: any[];
  
  // Loading states
  isLoadingPatients: boolean;
  isLoadingBeds: boolean;

  // Actions
  fetchPatients: () => Promise<void>;
  fetchBeds: () => Promise<void>;
  
  registerPatient: (patientData: Omit<Patient, "id" | "registrationDate" | "status">) => Promise<void>;
  admitPatient: (patientId: string, bedId: string, doctorId: string) => Promise<void>;
  bookAppointment: (appt: Omit<Appointment, "id" | "tokenNumber" | "status">) => void;
  dispatchAmbulance: (id: string, location: string, assignedTo: string) => void;
  returnAmbulance: (id: string) => void;
  addStaffMember: (member: Omit<StaffMember, "id" | "joiningDate" | "status">) => void;
  addEquipment: (item: Omit<MedicalEquipment, "id" | "lastMaintenance" | "nextMaintenance">) => void;
  addMedicine: (med: Omit<any, "id">) => void;
  addLabTest: (test: Omit<LabTest, "id" | "requestDate" | "status">) => void;
  recordBloodDonor: (bloodGroup: string, units: number) => void;
  addInvoice: (invoice: { patientId: string; type: string; amount: number; status: string }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      patients: mockPatients,
      doctors: mockDoctors,
      beds: mockBeds,
      appointments: mockAppointments,
      labTests: mockLabTests,
      ambulances: mockAmbulances,
      bloodBank: mockBloodBank,
      staff: mockStaff,
      equipment: mockEquipment,
      medicines: mockMedicines,
      invoices: initialInvoices,
      
      isLoadingPatients: false,
      isLoadingBeds: false,

      fetchPatients: async () => {
        set({ isLoadingPatients: true });
        try {
          const apiPatients = await getPatients();
          if (apiPatients && apiPatients.length > 0) {
            const mapped: Patient[] = apiPatients.map((p: any) => ({
              id: p.id,
              name: p.name,
              age: p.age,
              gender: p.gender,
              bloodGroup: p.blood_group,
              phone: p.phone,
              email: p.email,
              address: p.address,
              emergencyContact: p.emergency_contact,
              registrationDate: p.registration_date,
              patientType: p.patient_type || "opd",
              priority: p.priority || "stable",
              department: p.department || "General",
              doctorAssigned: p.doctor_assigned,
              bedAssigned: p.bed_assigned ? p.bed_assigned.number : undefined,
              status: p.status || "active"
            }));
            set({ patients: mapped });
          }
        } catch (error) {
          console.error("Failed to fetch patients from API, using cached/mock:", error);
        } finally {
          set({ isLoadingPatients: false });
        }
      },

      fetchBeds: async () => {
        set({ isLoadingBeds: true });
        try {
          const apiBeds = await getBeds();
          if (apiBeds && apiBeds.length > 0) {
            const mapped: Bed[] = apiBeds.map((b: any) => ({
              id: b.id,
              number: b.number,
              ward: b.ward,
              floor: b.floor,
              type: b.type,
              status: b.status,
              patientId: b.patient_id,
              admissionDate: b.admission_date
            }));
            set({ beds: mapped });
          }
        } catch (error) {
          console.error("Failed to fetch beds from API, using cached/mock:", error);
        } finally {
          set({ isLoadingBeds: false });
        }
      },

      registerPatient: async (patientData) => {
        try {
          const newPatient = await apiRegisterPatient(patientData);
          if (newPatient) {
            await get().fetchPatients();
          }
        } catch (error) {
          console.error("Supabase patient registration failed, registering locally:", error);
          const localPat: Patient = {
            ...patientData,
            id: `NXR-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
            registrationDate: new Date().toISOString().split('T')[0],
            status: "active"
          };
          set({ patients: [...get().patients, localPat] });
        }
      },

      admitPatient: async (patientId, bedId, doctorId) => {
        try {
          await apiAdmitPatient(patientId, bedId, doctorId);
          await Promise.all([get().fetchPatients(), get().fetchBeds()]);
        } catch (error) {
          console.error("Supabase patient admission failed, performing locally:", error);
          const updatedPatients = get().patients.map(p => {
            if (p.id === patientId) {
              const bed = get().beds.find(b => b.id === bedId);
              const doctor = get().doctors.find(d => d.id === doctorId);
              return { 
                ...p, 
                status: "admitted" as const, 
                bedAssigned: bed ? bed.number : undefined,
                doctorAssigned: doctor ? doctor.name : undefined
              };
            }
            return p;
          });
          
          const updatedBeds = get().beds.map(b => {
            if (b.id === bedId) {
              const patient = get().patients.find(p => p.id === patientId);
              return {
                ...b,
                status: "occupied" as const,
                patientId,
                patientName: patient ? patient.name : "Admitted Patient",
                admissionDate: new Date().toISOString().split('T')[0]
              };
            }
            return b;
          });

          set({ patients: updatedPatients, beds: updatedBeds });
        }
      },

      bookAppointment: (appt) => {
        const tokenNum = `T-${String(get().appointments.length + 1).padStart(3, '0')}`;
        const newAppt: Appointment = {
          ...appt,
          id: `APT-${Math.floor(Math.random() * 9000 + 1000)}`,
          tokenNumber: tokenNum,
          status: "waiting"
        };
        set({ appointments: [...get().appointments, newAppt] });
      },

      dispatchAmbulance: (id, location, assignedTo) => {
        const updated = get().ambulances.map(a => {
          if (a.id === id) {
            return { ...a, status: "dispatched" as const, location, assignedTo, lastUpdated: new Date().toISOString() };
          }
          return a;
        });
        set({ ambulances: updated });
      },

      returnAmbulance: (id) => {
        const updated = get().ambulances.map(a => {
          if (a.id === id) {
            return { ...a, status: "available" as const, location: "Hospital Base", assignedTo: undefined, lastUpdated: new Date().toISOString() };
          }
          return a;
        });
        set({ ambulances: updated });
      },

      addStaffMember: (member) => {
        const newMember: StaffMember = {
          ...member,
          id: `STF-${String(get().staff.length + 1).padStart(3, '0')}`,
          joiningDate: new Date().toISOString().split('T')[0],
          status: "active"
        };
        set({ staff: [...get().staff, newMember] });
      },

      addEquipment: (item) => {
        const newItem: MedicalEquipment = {
          ...item,
          id: `EQP-${String(get().equipment.length + 1).padStart(3, '0')}`,
          lastMaintenance: new Date().toISOString().split('T')[0],
          nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        set({ equipment: [...get().equipment, newItem] });
      },

      addMedicine: (med) => {
        const newMed = {
          ...med,
          id: `MED-${String(get().medicines.length + 1).padStart(3, '0')}`
        };
        set({ medicines: [...get().medicines, newMed] });
      },

      addLabTest: (test) => {
        const newTest: LabTest = {
          ...test,
          id: `LAB-${String(get().labTests.length + 1).padStart(3, '0')}`,
          requestDate: new Date().toISOString().split('T')[0],
          status: "pending"
        };
        set({ labTests: [...get().labTests, newTest] });
      },

      recordBloodDonor: (bloodGroup, units) => {
        const updated = get().bloodBank.map(b => {
          if (b.bloodGroup === bloodGroup) {
            return { 
              ...b, 
              units: b.units + Number(units), 
              lastUpdated: new Date().toISOString().split('T')[0] 
            };
          }
          return b;
        });
        set({ bloodBank: updated });
      },

      addInvoice: (invoice) => {
        const selectedPatient = get().patients.find(p => p.id === invoice.patientId);
        const newInvoice = {
          id: `BILL-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
          patient: selectedPatient ? selectedPatient.name : "Patient",
          type: invoice.type,
          amount: Number(invoice.amount),
          status: invoice.status,
          date: new Date().toISOString().split('T')[0]
        };
        set({ invoices: [newInvoice, ...get().invoices] });
      }
    }),
    {
      name: "nexora-hospital-storage",
      partialize: (state) => ({
        appointments: state.appointments,
        labTests: state.labTests,
        ambulances: state.ambulances,
        bloodBank: state.bloodBank,
        staff: state.staff,
        equipment: state.equipment,
        medicines: state.medicines,
        invoices: state.invoices
      })
    }
  )
);
