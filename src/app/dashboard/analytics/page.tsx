"use client";

import { useState } from "react";
import { mockRevenueData, mockDepartmentStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { BarChart3, TrendingUp, Users, Bed, BrainCircuit } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";

const COLORS = ["#16a34a", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

const patientGrowthData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2026, i, 1).toLocaleDateString("en-US", { month: "short" }),
  patients: Math.floor(800 + i * 120 + Math.random() * 100),
  opd: Math.floor(600 + i * 80 + Math.random() * 60),
  ipd: Math.floor(150 + i * 30 + Math.random() * 20),
}));

const occupancyHeatmap = Array.from({ length: 7 }, (_, dayIdx) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIdx],
  ...Object.fromEntries(Array.from({ length: 8 }, (_, h) => [`h${h + 6}`, Math.floor(Math.random() * 100)])),
}));

export default function AnalyticsPage() {
  const [revenueView, setRevenueView] = useState<"7d" | "30d">("30d");
  const revenue = revenueView === "7d" ? mockRevenueData.slice(-7) : mockRevenueData;

  const radarData = mockDepartmentStats.slice(0, 6).map((d) => ({
    subject: d.department.slice(0, 10),
    occupancy: d.occupancy,
    patients: Math.round((d.patients / 500) * 100),
    revenue: Math.round((d.revenue / 1500000) * 100),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Executive dashboards — Patient growth, revenue, occupancy & performance</p>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Monthly Patients", value: "1,284", change: "+12.3%", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Monthly Revenue", value: "৳12.4M", change: "+8.7%", icon: TrendingUp, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Avg. Bed Occupancy", value: "78.4%", change: "+3.2%", icon: Bed, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Patient Satisfaction", value: "96.2%", change: "+1.1%", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-muted-foreground">{s.title}</p>
              <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-nexora-600 font-medium mt-0.5">{s.change} vs last month</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="nexora-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Revenue Breakdown</h3>
          <div className="flex rounded-lg border border-border overflow-hidden text-xs">
            {(["7d", "30d"] as const).map((v) => (
              <button key={v} onClick={() => setRevenueView(v)}
                className={cn("px-3 py-1.5 font-medium transition-colors",
                  revenueView === v ? "bg-nexora-600 text-white" : "bg-white dark:bg-gray-900 text-muted-foreground hover:bg-muted")}>
                {v === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenue}>
            <defs>
              {["opd", "ipd", "pharmacy", "lab"].map((k, i) => (
                <linearGradient key={k} id={`grad_${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
              formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, undefined]} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Area type="monotone" dataKey="opd" stroke={COLORS[0]} strokeWidth={2} fill={`url(#grad_opd)`} name="OPD" />
            <Area type="monotone" dataKey="ipd" stroke={COLORS[1]} strokeWidth={2} fill={`url(#grad_ipd)`} name="IPD" />
            <Area type="monotone" dataKey="pharmacy" stroke={COLORS[2]} strokeWidth={2} fill={`url(#grad_pharmacy)`} name="Pharmacy" />
            <Area type="monotone" dataKey="lab" stroke={COLORS[3]} strokeWidth={2} fill={`url(#grad_lab)`} name="Lab" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Patient Growth + Department Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="nexora-card p-5">
          <h3 className="font-semibold mb-4">Patient Growth (2026)</h3>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={patientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line type="monotone" dataKey="patients" stroke="#16a34a" strokeWidth={2.5} dot={false} name="Total" />
              <Line type="monotone" dataKey="opd" stroke="#0ea5e9" strokeWidth={2} dot={false} name="OPD" />
              <Line type="monotone" dataKey="ipd" stroke="#f59e0b" strokeWidth={2} dot={false} name="IPD" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="nexora-card p-5">
          <h3 className="font-semibold mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <Radar name="Occupancy" dataKey="occupancy" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
              <Radar name="Patient Load" dataKey="patients" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Table */}
      <div className="nexora-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">Department Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["#", "Department", "Patients", "Revenue", "Occupancy", "Doctors", "Performance"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...mockDepartmentStats].sort((a, b) => b.patients - a.patients).map((d, i) => (
                <tr key={d.department} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-bold text-muted-foreground">#{i + 1}</td>
                  <td className="py-3 px-4 font-medium">{d.department}</td>
                  <td className="py-3 px-4">{d.patients}</td>
                  <td className="py-3 px-4">৳{(d.revenue / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", d.occupancy >= 90 ? "bg-red-500" : d.occupancy >= 70 ? "bg-amber-500" : "bg-nexora-500")}
                          style={{ width: `${d.occupancy}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{d.occupancy}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{d.doctors}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className={cn("w-3 h-3 rounded-sm", j < Math.round(d.occupancy / 20) ? "bg-nexora-500" : "bg-muted")} />
                      ))}
                    </div>
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
