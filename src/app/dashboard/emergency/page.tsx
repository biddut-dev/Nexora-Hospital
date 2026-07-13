"use client";

import { useState } from "react";
import { mockAmbulances } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { AlertTriangle, Activity, Clock, Truck, Phone, MapPin, Zap, Heart, CheckCircle, User } from "lucide-react";

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

  const filtered = selectedPriority === "all" ? emergencyPatients : emergencyPatients.filter((p) => p.priority === selectedPriority);

  const counts = {
    critical: emergencyPatients.filter((p) => p.priority === "critical").length,
    urgent: emergencyPatients.filter((p) => p.priority === "urgent").length,
    stable: emergencyPatients.filter((p) => p.priority === "stable").length,
  };

  const priorityStyle = {
    critical: "border-red-500 bg-red-50 dark:bg-red-900/10",
    urgent: "border-amber-500 bg-amber-50 dark:bg-amber-900/10",
    stable: "border-green-500 bg-green-50 dark:bg-green-900/10",
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
        <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <Phone className="w-4 h-4" />
          Dispatch Ambulance
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
              "nexora-card p-4 flex items-center gap-3 transition-all",
              selectedPriority === s.priority && "ring-2",
              selectedPriority === s.priority && s.priority === "critical" ? "ring-red-500" :
              selectedPriority === s.priority && s.priority === "urgent" ? "ring-amber-500" :
              selectedPriority === s.priority && s.priority === "stable" ? "ring-green-500" : ""
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

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Triage Board — takes 2 cols */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-foreground">Triage Board</h3>
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className={cn("rounded-xl border-l-4 p-4 transition-all hover:shadow-md", priorityStyle[patient.priority])}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border-2 border-current flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ borderColor: patient.priority === "critical" ? "#ef4444" : patient.priority === "urgent" ? "#f59e0b" : "#22c55e" }}>
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">{patient.name}</p>
                      <span className="text-xs text-muted-foreground">{patient.age}y</span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", priorityBadge[patient.priority])}>
                        {patient.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{patient.issue}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">Arrived</p>
                  <p className="text-sm font-bold text-foreground">{patient.arrivalTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-black/5 dark:border-white/5 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Bed: <strong className="text-foreground">{patient.bed}</strong></span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {patient.doctor}</span>
                <span className="ml-auto font-medium text-foreground">{patient.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Ambulance Arrival */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              Ambulance Status
            </h3>
            <div className="space-y-2">
              {mockAmbulances.map((amb) => (
                <div key={amb.id} className={cn(
                  "flex items-center gap-2 p-2.5 rounded-lg text-xs border",
                  amb.status === "available" ? "border-green-200 bg-green-50 dark:bg-green-900/10 text-green-700" :
                  amb.status === "dispatched" ? "border-blue-200 bg-blue-50 dark:bg-blue-900/10 text-blue-700" :
                  amb.status === "returning" ? "border-amber-200 bg-amber-50 dark:bg-amber-900/10 text-amber-700" :
                  "border-gray-200 bg-gray-50 dark:bg-gray-900/10 text-gray-600"
                )}>
                  <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{amb.vehicleNumber}</p>
                    <p className="opacity-70 truncate">{amb.location}</p>
                  </div>
                  <span className="capitalize font-medium">{amb.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Vitals Monitor */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Critical Vitals Monitor
            </h3>
            <div className="space-y-3">
              {[
                { name: "Unknown Male", hr: 112, bp: "148/92", spo2: 91, status: "critical" },
                { name: "Shirin Sultana", hr: 134, bp: "88/60", spo2: 94, status: "critical" },
              ].map((v) => (
                <div key={v.name} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">{v.name}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-red-600">{v.hr}</p>
                      <p className="text-[10px] text-muted-foreground">BPM</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-600">{v.bp}</p>
                      <p className="text-[10px] text-muted-foreground">B/P</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-600">{v.spo2}%</p>
                      <p className="text-[10px] text-muted-foreground">SpO₂</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Call Code Blue", color: "bg-blue-600 hover:bg-blue-700" },
                { label: "OT Booking", color: "bg-purple-600 hover:bg-purple-700" },
                { label: "Blood Request", color: "bg-red-600 hover:bg-red-700" },
                { label: "ICU Transfer", color: "bg-amber-600 hover:bg-amber-700" },
              ].map((a) => (
                <button key={a.label} className={`${a.color} text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
