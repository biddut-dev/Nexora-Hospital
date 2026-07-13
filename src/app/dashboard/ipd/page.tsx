"use client";

import { useState } from "react";
import { mockPatients, mockBeds } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Bed, Users, Activity, AlertTriangle, Plus, Search, UserPlus, ChevronRight, Clock } from "lucide-react";

export default function IPDPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "admissions" | "beds">("overview");
  const [search, setSearch] = useState("");

  const ipdPatients = mockPatients.filter((p) => p.patientType === "ipd");
  const availableBeds = mockBeds.filter((b) => b.status === "available");
  const occupiedBeds = mockBeds.filter((b) => b.status === "occupied");
  const icuBeds = mockBeds.filter((b) => b.ward.includes("ICU") || b.ward.includes("CCU"));
  const icuOccupied = icuBeds.filter((b) => b.status === "occupied");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">IPD Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Indoor Patient Department — Admissions, Bed Management & Monitoring</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <UserPlus className="w-4 h-4" />
          New Admission
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Current Admissions", value: ipdPatients.length + 244, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "ICU Patients", value: icuOccupied.length, icon: Activity, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { title: "Available Beds", value: availableBeds.length, icon: Bed, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Discharges Today", value: 8, icon: ChevronRight, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
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
        {(["overview", "admissions", "beds"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all",
              activeTab === tab ? "bg-white dark:bg-gray-900 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ward Occupancy */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-4">Ward Occupancy</h3>
            {[
              { ward: "Ward 1 — General", total: 20, occupied: 16 },
              { ward: "Ward 2 — Cabin", total: 10, occupied: 7 },
              { ward: "Intensive Care Unit", total: 8, occupied: 7 },
              { ward: "Cardiac Care Unit", total: 6, occupied: 5 },
              { ward: "Neonatal ICU", total: 8, occupied: 3 },
              { ward: "Emergency Ward", total: 12, occupied: 8 },
            ].map((w) => {
              const pct = Math.round((w.occupied / w.total) * 100);
              return (
                <div key={w.ward} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{w.ward}</span>
                    <span className={cn("font-medium", pct >= 90 ? "text-red-600" : pct >= 70 ? "text-amber-600" : "text-nexora-600")}>
                      {w.occupied}/{w.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-nexora-500")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Admissions */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-4">Recent Admissions</h3>
            <div className="space-y-3">
              {ipdPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-sm font-bold text-nexora-700 flex-shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.bedAssigned} · {p.department} · Dr. {p.doctorAssigned?.split(". ")[1]}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      p.priority === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      p.priority === "urgent" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-nexora-100 text-nexora-700"
                    )}>
                      {p.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "admissions" && (
        <div className="nexora-card">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold">All Admitted Patients</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Patient ID", "Name", "Age/Sex", "Department", "Bed", "Doctor", "Admitted", "Priority"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockPatients.filter((p) => p.patientType === "ipd").map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 font-mono text-xs text-nexora-600">{p.id}</td>
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{p.age}y / {p.gender.charAt(0).toUpperCase()}</td>
                    <td className="py-3 px-4 text-xs">{p.department}</td>
                    <td className="py-3 px-4 font-mono text-xs font-medium">{p.bedAssigned}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{p.doctorAssigned}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{p.registrationDate}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full",
                        p.priority === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {(p.priority || "stable").toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
