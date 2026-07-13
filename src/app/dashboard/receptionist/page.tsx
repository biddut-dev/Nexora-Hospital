"use client";
import { mockAppointments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Users, Calendar, Ticket, UserPlus, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/lib/store";

export default function ReceptionistPage() {
  const todayAppts = mockAppointments.filter((a) => a.date === "2026-07-13");
  
  const { patients, fetchPatients, registerPatient, isLoadingPatients } = useAppStore();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male" as "Male" | "Female" | "Other",
    dob: "",
    phone: "",
    bloodGroup: "A+" as any,
    contactAddress: "",
  });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerPatient({
        name: formData.name,
        gender: formData.gender.toLowerCase() as any,
        age: new Date().getFullYear() - new Date(formData.dob).getFullYear() || 30,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        address: formData.contactAddress,
        emergencyContact: formData.phone, // default
        patientType: "opd"
      });
      setIsRegisterOpen(false);
      setFormData({ name: "", gender: "Male", dob: "", phone: "", bloodGroup: "A+", contactAddress: "" });
    } catch (error) {
      console.error("Failed to register", error);
      alert("Failed to register patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Receptionist Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Patient registration, admissions, appointments & visitor management</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-border hover:bg-muted text-sm font-medium rounded-xl transition-colors">
            <Ticket className="w-4 h-4" />
            Issue Visitor Pass
          </button>
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Register Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Today's OPD", value: todayAppts.length + 178, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Registered Patients", value: patients.length, icon: UserPlus, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Appointments", value: todayAppts.length, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { title: "Visitor Passes", value: 37, icon: Ticket, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Patient Directory */}
        <div className="nexora-card p-5 flex flex-col h-[500px]">
          <h3 className="font-semibold mb-4">Patient Directory</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input placeholder="Search by name, phone..." className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400" />
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2 scrollbar-thin">
            {isLoadingPatients ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-nexora-600" />
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">No patients found.</div>
            ) : patients.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-xs font-bold text-nexora-700">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.gender} · {p.phone}</p>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full capitalize font-medium", 
                  p.status === 'admitted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                )}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Queue */}
        <div className="nexora-card p-5 h-[500px] flex flex-col">
          <h3 className="font-semibold mb-4">Today's Appointment Queue</h3>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2 scrollbar-thin">
            {todayAppts.map((appt) => (
              <div key={appt.id} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-colors",
                appt.status === "in_progress" ? "border-blue-200 bg-blue-50 dark:bg-blue-900/10" : "border-border hover:bg-muted/30")}>
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center font-bold text-xs">{appt.tokenNumber?.replace("T-", "")}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{appt.patientName}</p>
                  <p className="text-xs text-muted-foreground">{appt.doctorName} · {appt.time}</p>
                </div>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                  appt.status === "completed" ? "bg-green-100 text-green-700" :
                  appt.status === "in_progress" ? "bg-blue-100 text-blue-700 animate-pulse" :
                  appt.status === "waiting" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600")}>
                  {appt.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register New Patient">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Full Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Date of Birth</label>
              <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Phone Number</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Blood Group</label>
              <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value as any})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400">
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => <option key={bg}>{bg}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Contact Address</label>
            <textarea required value={formData.contactAddress} onChange={e => setFormData({...formData, contactAddress: e.target.value})} rows={2} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400" />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Patient
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
