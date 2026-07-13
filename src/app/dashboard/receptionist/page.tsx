"use client";
import { mockPatients, mockAppointments, mockDoctors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Users, Calendar, Ticket, UserPlus, Search, Phone } from "lucide-react";

export default function ReceptionistPage() {
  const todayAppts = mockAppointments.filter((a) => a.date === "2026-07-13");

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
          <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
            <UserPlus className="w-4 h-4" />
            Register Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Today's OPD", value: todayAppts.length + 178, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "New Registrations", value: 24, icon: UserPlus, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
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
        {/* Quick Search */}
        <div className="nexora-card p-5">
          <h3 className="font-semibold mb-4">Quick Patient Search</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input placeholder="Search by name, ID, phone..." className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400" />
          </div>
          <div className="space-y-2">
            {mockPatients.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-xs font-bold text-nexora-700">{p.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.id} · {p.phone}</p>
                </div>
                <button className="text-xs text-nexora-600 font-medium">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Queue */}
        <div className="nexora-card p-5">
          <h3 className="font-semibold mb-4">Today's Appointment Queue</h3>
          <div className="space-y-2">
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
    </div>
  );
}
