"use client";

import { useState } from "react";
import { mockVitals, mockLabTests } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Heart, Activity, Thermometer, Wind, Droplets, Weight, BrainCircuit, Bell, Calendar, FileText, Pill, User, TrendingUp, TrendingDown
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

type TimeRange = "daily" | "weekly" | "monthly";

export default function PatientPortalPage() {
  const [activeTab, setActiveTab] = useState<"health" | "prescriptions" | "reports" | "appointments">("health");
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");

  // Slice vitals for time range
  const vitalsData = timeRange === "daily"
    ? mockVitals.slice(-1)
    : timeRange === "weekly"
    ? mockVitals.slice(-7)
    : mockVitals.slice(-30);

  const latest = mockVitals[mockVitals.length - 1];

  const vitalCards = [
    { label: "Heart Rate", value: `${latest?.heartRate ?? 72}`, unit: "BPM", icon: Heart, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", normal: "60-100 BPM", status: "normal" },
    { label: "Blood Pressure", value: `${latest?.bloodPressureSystolic ?? 120}/${latest?.bloodPressureDiastolic ?? 80}`, unit: "mmHg", icon: Activity, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", normal: "120/80 mmHg", status: "normal" },
    { label: "Blood Sugar", value: `${latest?.bloodSugar ?? 95}`, unit: "mg/dL", icon: Droplets, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", normal: "70-110 mg/dL", status: "normal" },
    { label: "Oxygen (SpO₂)", value: `${latest?.oxygenSaturation ?? 98}%`, unit: "", icon: Wind, color: "text-nexora-500", bg: "bg-nexora-50 dark:bg-nexora-900/20", normal: "95-100%", status: "normal" },
    { label: "Temperature", value: `${(latest?.temperature ?? 36.8).toFixed(1)}°C`, unit: "", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", normal: "36.1-37.2°C", status: "normal" },
    { label: "BMI", value: `${(latest?.bmi ?? 24.5).toFixed(1)}`, unit: "kg/m²", icon: Weight, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", normal: "18.5-24.9", status: "normal" },
  ];

  const chartData = vitalsData.map((v, i) => ({
    day: new Date(v.timestamp).toLocaleDateString("en-US", timeRange === "daily" ? { hour: "numeric" } : { month: "short", day: "numeric" }),
    heartRate: v.heartRate,
    bp: v.bloodPressureSystolic,
    sugar: v.bloodSugar,
    spo2: v.oxygenSaturation,
  }));

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="nexora-card p-5 flex items-center gap-4 bg-gradient-to-r from-nexora-50 to-blue-50 dark:from-nexora-900/10 dark:to-blue-900/10">
        <div className="w-16 h-16 rounded-2xl bg-nexora-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">R</div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Rahman Ali</h1>
          <p className="text-muted-foreground text-sm">Patient ID: NXR-2026-10001 · 45y · Male · Blood: B+</p>
          <p className="text-xs text-muted-foreground mt-0.5">Primary Physician: Dr. Priya Sharma · Cardiology</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-nexora-600 hover:bg-nexora-700 text-white text-xs font-medium rounded-lg transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            Book Appointment
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-border hover:bg-muted text-xs font-medium rounded-lg transition-colors">
            <Bell className="w-3.5 h-3.5" />
            Reminders
          </button>
        </div>
      </div>

      {/* AI Health Score */}
      <div className="nexora-card p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-foreground">AI Health Score & Insights</h3>
          <span className="ml-auto text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">AI Active</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-border">
            <div className="text-4xl font-bold text-nexora-600 mb-1">87</div>
            <div className="text-xs text-muted-foreground">Overall Health Score</div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-nexora-500 rounded-full" style={{ width: "87%" }} />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-border">
            <p className="text-xs font-semibold text-amber-600 mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Risk Factors</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Slightly elevated resting HR</li>
              <li>• Watch carbohydrate intake</li>
              <li>• Maintain regular exercise</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-border">
            <p className="text-xs font-semibold text-nexora-600 mb-2 flex items-center gap-1"><BrainCircuit className="w-3 h-3" /> AI Suggestions</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Schedule follow-up in 14 days</li>
              <li>• Morning walk — 30 min daily</li>
              <li>• Reduce sodium intake</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {(["health", "prescriptions", "reports", "appointments"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all",
              activeTab === tab ? "bg-white dark:bg-gray-900 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "health" && (
        <div className="space-y-6">
          {/* Vital Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {vitalCards.map((v) => (
              <div key={v.label} className={`nexora-card p-4 text-center ${v.bg} border-0`}>
                <div className={`w-9 h-9 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                  <v.icon className={`w-4 h-4 ${v.color}`} />
                </div>
                <p className={`text-xl font-bold ${v.color}`}>{v.value}</p>
                {v.unit && <p className="text-[10px] text-muted-foreground">{v.unit}</p>}
                <p className="text-xs font-medium text-foreground mt-1">{v.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Normal: {v.normal}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="nexora-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Health Trends</h3>
              <div className="flex rounded-lg border border-border overflow-hidden text-xs">
                {(["daily", "weekly", "monthly"] as TimeRange[]).map((v) => (
                  <button key={v} onClick={() => setTimeRange(v)}
                    className={cn("px-3 py-1.5 font-medium capitalize transition-colors",
                      timeRange === v ? "bg-nexora-600 text-white" : "bg-white dark:bg-gray-900 text-muted-foreground hover:bg-muted")}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={false} name="Heart Rate" />
                <Line type="monotone" dataKey="bp" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Blood Pressure" />
                <Line type="monotone" dataKey="sugar" stroke="#f59e0b" strokeWidth={2} dot={false} name="Blood Sugar" />
                <Line type="monotone" dataKey="spo2" stroke="#16a34a" strokeWidth={2} dot={false} name="SpO₂%" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "prescriptions" && (
        <div className="nexora-card p-5">
          <h3 className="font-semibold mb-4">Current Prescriptions</h3>
          <div className="space-y-3">
            {[
              { drug: "Atorvastatin 20mg", dose: "Once daily at night", duration: "3 months", by: "Dr. Priya Sharma", date: "2026-07-01" },
              { drug: "Aspirin 75mg", dose: "Once daily with food", duration: "Ongoing", by: "Dr. Priya Sharma", date: "2026-07-01" },
              { drug: "Metoprolol 25mg", dose: "Twice daily", duration: "3 months", by: "Dr. Priya Sharma", date: "2026-07-01" },
              { drug: "Omeprazole 20mg", dose: "Once daily before breakfast", duration: "1 month", by: "Dr. Tanvir Hassan", date: "2026-06-15" },
            ].map((rx, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className="w-10 h-10 bg-nexora-100 dark:bg-nexora-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Pill className="w-5 h-5 text-nexora-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{rx.drug}</p>
                  <p className="text-xs text-muted-foreground">{rx.dose} · {rx.duration}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Prescribed by {rx.by} on {rx.date}</p>
                </div>
                <button className="text-xs text-nexora-600 font-medium">View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="nexora-card p-5">
          <h3 className="font-semibold mb-4">Lab Reports</h3>
          <div className="space-y-3">
            {mockLabTests.map((test) => (
              <div key={test.id} className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-colors",
                test.isAbnormal ? "border-red-200 bg-red-50/30 dark:border-red-800 dark:bg-red-900/10" : "border-border hover:bg-muted/30"
              )}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  test.isAbnormal ? "bg-red-100 dark:bg-red-900/30" : "bg-nexora-100 dark:bg-nexora-900/30")}>
                  <FileText className={cn("w-5 h-5", test.isAbnormal ? "text-red-600" : "text-nexora-600")} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{test.testName}</p>
                    {test.isAbnormal && <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">ABNORMAL</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{test.requestedBy} · {test.requestDate}</p>
                  {test.result && <p className="text-xs text-muted-foreground mt-1">{test.result}</p>}
                </div>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                  test.status === "completed" || test.status === "approved" ? "bg-green-100 text-green-700" :
                  test.status === "processing" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>
                  {test.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
