// Partial re-export to fix import in patient page
export const mockPrescriptions = [
  { id: "RX-001", patientId: "NXR-2026-10001", doctorId: "DOC-001", doctorName: "Dr. Priya Sharma", date: "2026-07-01", diagnosis: "Hypertension, Dyslipidemia", notes: "Follow-up in 1 month", followUpDate: "2026-08-01",
    medicines: [
      { name: "Atorvastatin 20mg", dosage: "20mg", frequency: "Once daily at night", duration: "3 months", instructions: "Take at night" },
      { name: "Aspirin 75mg", dosage: "75mg", frequency: "Once daily", duration: "Ongoing", instructions: "Take with food" },
    ]
  }
];
