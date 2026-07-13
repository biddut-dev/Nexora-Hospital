"use client";

import { useState } from "react";
import { mockAppointments, mockPatients, mockDoctors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Users, Clock, Calendar, Plus, Search, Filter, ChevronRight, Activity, CheckCircle, Loader, AlertCircle, UserPlus } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const waitingData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${8 + i}:00`,
  patients: Math.floor(Math.random() * 30 + 10),
}));

export default function OPDPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "queue" | "registration">("overview");
  const [search, setSearch] = useState("");

  const todayAppts = mockAppointments.filter((a) => a.date === "2026-07-13");
  const waitingPatients = todayAppts.filter((a) => a.status === "waiting" || a.status === "scheduled");
  const completedToday = todayAppts.filter((a) => a.status === "completed");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
      case "in_progress": return <Loader className="w-3.5 h-3.5 text-blue-500 animate-spin" />;
      case "waiting": return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      default: return <Calendar className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      waiting: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      scheduled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      confirmed: "bg-nexora-100 text-nexora-700 dark:bg-nexora-900/30 dark:text-nexora-400",
    };
    return styles[status] || styles.scheduled;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">OPD Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Outdoor Patient Department — {new Date().toLocaleDateString()}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <UserPlus className="w-4 h-4" />
          Register Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Waiting Now", value: waitingPatients.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "In Consultation", value: todayAppts.filter((a) => a.status === "in_progress").length, icon: Activity, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Completed Today", value: completedToday.length, icon: CheckCircle, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Total Today", value: todayAppts.length + 178, icon: Users, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {(["overview", "appointments", "queue", "registration"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all",
              activeTab === tab ? "bg-white dark:bg-gray-900 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "queue" ? "Queue" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Waiting time chart */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold text-foreground mb-4">Hourly Patient Flow</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={waitingData}>
                <defs>
                  <linearGradient id="opdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="patients" stroke="#16a34a" strokeWidth={2} fill="url(#opdGrad)" name="Patients" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Doctor availability */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold text-foreground mb-4">Doctor Availability</h3>
            <div className="space-y-3">
              {mockDoctors.filter((d) => d.status !== "on_leave").slice(0, 6).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-xs font-bold text-nexora-700 flex-shrink-0">
                    {doc.name.charAt(4)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{doc.specialization} · {doc.patientsToday} patients today</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", doc.status === "available" ? "bg-green-500" : "bg-amber-500")} />
                    <span className="text-xs text-muted-foreground capitalize">{doc.status.replace("_", " ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(activeTab === "appointments" || activeTab === "overview") && (
        <div className="nexora-card">
          <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-semibold text-foreground">Today's Appointments</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search patients..."
                  className="pl-8 pr-3 py-2 text-xs bg-muted rounded-lg focus:outline-none w-48"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Token", "Patient", "Doctor", "Department", "Time", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 px-5 first:pl-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockAppointments
                  .filter((a) => a.patientName.toLowerCase().includes(search.toLowerCase()))
                  .map((appt) => (
                    <tr key={appt.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-5 font-mono font-semibold text-nexora-600 text-xs">{appt.tokenNumber}</td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-xs font-bold text-nexora-700">
                            {appt.patientName.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{appt.patientName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-muted-foreground text-xs">{appt.doctorName}</td>
                      <td className="py-3 px-5 text-muted-foreground text-xs">{appt.department}</td>
                      <td className="py-3 px-5 text-muted-foreground text-xs">{appt.time}</td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(appt.status)}
                          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full capitalize", getStatusBadge(appt.status))}>
                            {appt.status.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <button className="text-xs text-nexora-600 hover:text-nexora-700 font-medium flex items-center gap-0.5">
                          View <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "queue" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="nexora-card p-5">
            <h3 className="font-semibold text-foreground mb-4">Live Token Queue</h3>
            <div className="space-y-2">
              {mockAppointments.filter((a) => ["waiting", "scheduled", "in_progress"].includes(a.status)).map((appt, i) => (
                <div key={appt.id} className={cn(
                  "flex items-center gap-4 p-3 rounded-xl border transition-colors",
                  appt.status === "in_progress"
                    ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                    : "border-border hover:bg-muted/30"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                    appt.status === "in_progress"
                      ? "bg-blue-500 text-white"
                      : "bg-muted text-foreground"
                  )}>
                    {appt.tokenNumber?.replace("T-", "")}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{appt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{appt.doctorName}</p>
                  </div>
                  {appt.status === "in_progress" && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium animate-pulse">NOW</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-4">Avg. Wait Times by Department</h3>
            {[
              { dept: "General Medicine", wait: "12 min", color: "bg-nexora-500" },
              { dept: "Cardiology", wait: "28 min", color: "bg-blue-500" },
              { dept: "Dermatology", wait: "18 min", color: "bg-purple-500" },
              { dept: "ENT", wait: "22 min", color: "bg-amber-500" },
              { dept: "Ophthalmology", wait: "15 min", color: "bg-indigo-500" },
            ].map((d) => (
              <div key={d.dept} className="flex items-center gap-3 mb-3">
                <div className="w-32 text-xs text-muted-foreground flex-shrink-0">{d.dept}</div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full`} style={{ width: `${Math.random() * 60 + 20}%` }} />
                </div>
                <div className="w-16 text-xs font-medium text-right">{d.wait}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
