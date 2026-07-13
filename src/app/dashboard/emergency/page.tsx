"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Activity, Clock, Truck, Phone, MapPin, Zap, Heart, CheckCircle, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

interface EmergencyPatient {
  id: string;
  name: string;
  age: number;
  priority: "critical" | "urgent" | "stable";
  issue: string;
  arrivalTime: string;
  bed: string;
  doctor: string;
  status: string;
}

const emergencyPatients: EmergencyPatient[] = [
  { id: "EM-001", name: "Unknown Male", age: 45, priority: "critical", issue: "Chest pain, Cardiac arrest suspected", arrivalTime: "09:32", bed: "EM-01", doctor: "Dr. Saidul Islam", status: "In Treatment" },
  { id: "EM-002", name: "Shirin Sultana", age: 41, priority: "critical", issue: "Major trauma — road accident, multiple fractures", arrivalTime: "09:41", bed: "EM-02", doctor: "Dr. Saidul Islam", status: "Stabilizing" },
  { id: "EM-003", name: "Unnamed Child (6y)", age: 6, priority: "urgent", issue: "High fever 104°F, febrile seizures", arrivalTime: "09:55", bed: "EM-05", doctor: "Dr. Imran Chowdhury", status: "Under Observation" },
  { id: "EM-004", name: "Anwar Hossain", age: 62, priority: "urgent", issue: "Sudden loss of consciousness, stroke suspected", arrivalTime: "10:08", bed: "EM-03", doctor: "Dr. Ahmed Reza", status: "CT Ordered" },
  { id: "EM-005", name: "Rahela Khatun", age: 35, priority: "stable", issue: "Severe abdominal pain, nausea", arrivalTime: "10:22", bed: "EM-04", doctor: "Dr. Tanvir Hassan", status: "Waiting Labs" },
  { id: "EM-006", name: "Jabir Ahmed", age: 28, priority: "stable", issue: "Laceration — left hand, requires stitches", arrivalTime: "10:31", bed: "WAIT-1", doctor: "Dr. Tanvir Hassan", status: "Waiting" },
];

export default function EmergencyPage() {
  const [selectedPriority, setSelectedPriority] = useState<"all" | "critical" | "urgent" | "stable">("all");
  const { ambulances, dispatchAmbulance } = useAppStore();
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [selectedAmbId, setSelectedAmbId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    location: "",
    refDetails: ""
  });

  const availableAmbulances = ambulances.filter(a => a.status === 'available');

  const handleOpenDispatch = () => {
    if (availableAmbulances.length > 0) {
      setSelectedAmbId(availableAmbulances[0].id);
      setIsDispatchOpen(true);
    } else {
      alert("No ambulances available currently!");
    }
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmbId || !formData.location || !formData.refDetails) return;
    
    dispatchAmbulance(selectedAmbId, formData.location, formData.refDetails);
    setIsDispatchOpen(false);
    setSelectedAmbId(null);
    setFormData({ location: "", refDetails: "" });
    alert("Ambulance dispatched successfully!");
  };

  const filtered = selectedPriority === "all" ? emergencyPatients : emergencyPatients.filter((p) => p.priority === selectedPriority);

  const counts = {
    critical: emergencyPatients.filter((p) => p.priority === "critical").length,
    urgent: emergencyPatients.filter((p) => p.priority === "urgent").length,
    stable: emergencyPatients.filter((p) => p.priority === "stable").length,
  };

  const priorityStyle = {
    critical: "border-red-500 bg-red-50 dark:bg-red-900/10 border-2",
    urgent: "border-amber-500 bg-amber-50 dark:bg-amber-900/10 border-2",
    stable: "border-green-500 bg-green-50 dark:bg-green-900/10 border-2",
  };

  const priorityBadge = {
    critical: "bg-red-500 text-white",
    urgent: "bg-amber-500 text-white",
    stable: "bg-green-500 text-white",
  };

  return (
    <div className="space-y-6">
      {/* Header with live indicator */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-foreground">Emergency Department</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              <span className="text-xs font-medium text-red-600 dark:text-red-400">LIVE</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Real-time emergency triage and patient management</p>
        </div>
        <button 
          onClick={handleOpenDispatch}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Phone className="w-4 h-4" />
          Dispatch Ambulance ({availableAmbulances.length} available)
        </button>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { priority: "critical", label: "Critical", count: counts.critical, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { priority: "urgent", label: "Urgent", count: counts.urgent, icon: Zap, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { priority: "stable", label: "Stable", count: counts.stable, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
        ].map((s) => (
          <button
            key={s.priority}
            onClick={() => setSelectedPriority(selectedPriority === s.priority as any ? "all" : s.priority as any)}
            className={cn(
              "nexora-card p-4 flex items-center gap-3 transition-all border-border",
              selectedPriority === s.priority && "ring-2 ring-nexora-500"
            )}
          >
            <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label} Patients</p>
            </div>
          </button>
        ))}
      </div>

      {/* Triage list */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Active Triage Queue</h3>
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className={cn("nexora-card p-4 border flex items-start gap-4 transition-all", priorityStyle[p.priority])}>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", priorityBadge[p.priority])}>
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-foreground">{p.name}</h4>
                    <span className="text-xs text-muted-foreground">({p.age}y)</span>
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase", priorityBadge[p.priority])}>
                      {p.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2"><span className="font-medium text-foreground">Issue:</span> {p.issue}</p>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Arrived: {p.arrivalTime}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" />Doctor: {p.doctor}</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />Bed: {p.bed}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs bg-white dark:bg-gray-800 border border-border px-2 py-1 rounded-lg text-foreground font-medium shadow-sm">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live ambulances */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Ambulance Status</h3>
          <div className="space-y-3">
            {ambulances.slice(0, 4).map((amb) => (
              <div key={amb.id} className="nexora-card p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">{amb.vehicleNumber}</span>
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full capitalize",
                    amb.status === "available" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}>{amb.status}</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{amb.location}</p>
                  {amb.assignedTo && <p className="flex items-center gap-1.5 text-blue-600 font-medium"><AlertTriangle className="w-3.5 h-3.5" />{amb.assignedTo}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      <Modal isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} title="Dispatch Emergency Ambulance">
        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Emergency Location / Address</label>
            <input required placeholder="e.g., Road 2, Sector 3, Uttara, Dhaka" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium">Assigned Case Reference / Details</label>
            <input required placeholder="e.g., Trauma Call #9042" value={formData.refDetails} onChange={e => setFormData({...formData, refDetails: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsDispatchOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
              Dispatch Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
