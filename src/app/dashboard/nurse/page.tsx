"use client";

import { mockVitals } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Heart, Activity, AlertTriangle, Clock, CheckCircle, Pill, Bell } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function NursePage() {
  const { patients } = useAppStore();
  const assignedPatients = patients.filter((p) => p.status === "admitted");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nurse Station</h1>
          <p className="text-muted-foreground text-sm mt-1">Patient monitoring, vitals, medication schedule & shift notes</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors">
            <Bell className="w-4 h-4" />
            Emergency Alert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Assigned Patients", value: assignedPatients.length, icon: Heart, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { title: "Med Due Now", value: 4, icon: Pill, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Vitals Recorded", value: 18, icon: Activity, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Critical Alerts", value: assignedPatients.filter(p=>p.priority==='critical').length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3 border-border">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Patient Cards */}
        <div className="nexora-card p-5 border-border">
          <h3 className="font-semibold mb-4">My Patients — Ward Status</h3>
          <div className="space-y-3">
            {assignedPatients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No patients currently admitted to your ward.</p>
            ) : assignedPatients.map((p) => {
              const lastVital = mockVitals[mockVitals.length - 1];
              return (
                <div key={p.id} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors border-border",
                  p.priority === "critical" ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/5" :
                  p.priority === "urgent" ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/5" :
                  "hover:bg-muted/30"
                )}>
                  <div className="relative flex-shrink-0">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold",
                      p.priority === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30" :
                      "bg-nexora-100 text-nexora-700 dark:bg-nexora-900/30")}>
                      {p.name.charAt(0)}
                    </div>
                    <div className={cn("absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900",
                      p.priority === "critical" ? "bg-red-500" : p.priority === "urgent" ? "bg-amber-500" : "bg-nexora-500")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.bedAssigned || "TBD Bed"} · {p.department}</p>
                  </div>
                  <div className="text-right text-xs flex-shrink-0">
                    <p className="font-bold text-foreground">{lastVital.heartRate} BPM</p>
                    <p className="text-muted-foreground">SpO₂ {lastVital.oxygenSaturation}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medication Schedule */}
        <div className="nexora-card p-5 border-border">
          <h3 className="font-semibold mb-4">Medication Schedule</h3>
          <div className="space-y-2">
            {[
              { patient: "Karim Hossain", drug: "Mannitol 20% IV", time: "10:00 AM", status: "due" },
              { patient: "Shirin Sultana", drug: "Morphine 5mg IV", time: "10:30 AM", status: "due" },
              { patient: "Fatima Begum", drug: "Iron Sucrose IV", time: "11:00 AM", status: "upcoming" },
              { patient: "Mosaddek Ahmed", drug: "Cefuroxime 750mg IV", time: "12:00 PM", status: "upcoming" },
              { patient: "Delwar Hossain", drug: "Aspirin 75mg Oral", time: "01:00 PM", status: "upcoming" },
            ].map((med, i) => (
              <div key={i} className={cn(
                "flex items-center gap-3 p-3 rounded-xl border text-sm transition-colors border-border",
                med.status === "due" ? "border-red-200 bg-red-50 dark:bg-red-900/10" :
                "hover:bg-muted/30"
              )}>
                <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0",
                  med.status === "due" ? "bg-red-500" : "bg-amber-500")} />
                <div className="flex-1">
                  <p className="font-medium text-xs text-muted-foreground">{med.patient}</p>
                  <p className="font-bold text-foreground text-sm">{med.drug}</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{med.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
