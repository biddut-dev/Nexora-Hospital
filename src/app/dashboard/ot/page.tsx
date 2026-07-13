"use client";
import { cn } from "@/lib/utils";
import { Scissors, Calendar, Clock, User, Plus, CheckCircle, AlertTriangle } from "lucide-react";

const surgeries = [
  { id: "OT-001", patient: "Mosaddek Ahmed", surgeon: "Dr. Rafiq Uddin", procedure: "Total Knee Replacement (R)", room: "OT-1", date: "2026-07-13", time: "08:00 AM", status: "completed", duration: "3h 20m" },
  { id: "OT-002", patient: "Anwar Hossain", surgeon: "Dr. Ahmed Reza", procedure: "Craniotomy — Tumor Excision", room: "OT-2", date: "2026-07-13", time: "11:00 AM", status: "in_progress", duration: "Ongoing" },
  { id: "OT-003", patient: "Karim Hossain", surgeon: "Dr. Ahmed Reza", procedure: "VP Shunt Insertion", room: "OT-2", date: "2026-07-13", time: "03:00 PM", status: "scheduled", duration: "~2h" },
  { id: "OT-004", patient: "Shirin Sultana", surgeon: "Dr. Rafiq Uddin", procedure: "Open Reduction Internal Fixation", room: "OT-3", date: "2026-07-13", time: "04:30 PM", status: "scheduled", duration: "~2.5h" },
  { id: "OT-005", patient: "Emergency Case", surgeon: "On-call Surgeon", procedure: "Emergency Laparotomy", room: "OT-Emergency", date: "2026-07-13", time: "On demand", status: "ready", duration: "TBD" },
];

export default function OTPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Operation Theater</h1>
          <p className="text-muted-foreground text-sm mt-1">Surgery scheduling, OT booking, surgeon assignment & equipment</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Schedule Surgery
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Completed Today", value: 1, icon: CheckCircle, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "In Progress", value: 1, icon: Scissors, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Scheduled Today", value: 3, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Emergency Ready", value: 1, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.title}</p></div>
          </div>
        ))}
      </div>

      {/* OT Rooms Status */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { room: "OT-1", status: "free", next: "No more today" },
          { room: "OT-2", status: "occupied", next: "Craniotomy — ongoing" },
          { room: "OT-3", status: "preparing", next: "ORIF at 4:30 PM" },
          { room: "OT-Emergency", status: "ready", next: "Emergency standby" },
        ].map((ot) => (
          <div key={ot.room} className={cn("nexora-card p-4 text-center",
            ot.status === "occupied" ? "border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/5" :
            ot.status === "preparing" ? "border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/5" :
            ot.status === "ready" ? "border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/5" : "")}>
            <p className="font-bold text-foreground mb-1">{ot.room}</p>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
              ot.status === "free" ? "bg-green-100 text-green-700" :
              ot.status === "occupied" ? "bg-blue-100 text-blue-700" :
              ot.status === "preparing" ? "bg-amber-100 text-amber-700" :
              "bg-red-100 text-red-700")}>
              {ot.status === "free" ? "Free" : ot.status === "occupied" ? "In Use" : ot.status === "preparing" ? "Preparing" : "Emergency"}
            </span>
            <p className="text-[11px] text-muted-foreground mt-2">{ot.next}</p>
          </div>
        ))}
      </div>

      {/* Surgery Schedule */}
      <div className="nexora-card overflow-hidden">
        <div className="p-5 border-b border-border"><h3 className="font-semibold">Today's Surgery Schedule</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["OT ID", "Patient", "Procedure", "Surgeon", "Room", "Time", "Duration", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {surgeries.map((s) => (
                <tr key={s.id} className={cn("border-b border-border/50 hover:bg-muted/30", s.status === "in_progress" && "bg-blue-50/50 dark:bg-blue-900/5")}>
                  <td className="py-3 px-4 font-mono text-xs text-nexora-600">{s.id}</td>
                  <td className="py-3 px-4 font-medium">{s.patient}</td>
                  <td className="py-3 px-4 text-xs max-w-[180px]">{s.procedure}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{s.surgeon}</td>
                  <td className="py-3 px-4 font-mono text-xs font-medium">{s.room}</td>
                  <td className="py-3 px-4 text-xs">{s.time}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{s.duration}</td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
                      s.status === "completed" ? "bg-green-100 text-green-700" :
                      s.status === "in_progress" ? "bg-blue-100 text-blue-700 animate-pulse" :
                      s.status === "ready" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700")}>
                      {s.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
