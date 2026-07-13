"use client";

import { useState } from "react";
import {
  Users,
  Bed,
  AlertTriangle,
  TrendingUp,
  Activity,
  Heart,
  Stethoscope,
  DollarSign,
  Scissors,
  BrainCircuit,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Droplets,
  MapPin,
  BarChart3,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { mockHospitalStats, mockPatients, mockDoctors, mockAmbulances, mockRevenueData, mockDepartmentStats } from "@/lib/mock-data";
import { getCommandCenterStats } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description?: string;
}

function KPICard({ title, value, change, icon: Icon, color, bgColor, description }: KPICardProps) {
  return (
    <div className="nexora-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{typeof value === "number" ? value.toLocaleString() : value}</p>
        </div>
        <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      {(change !== undefined || description) && (
        <div className="flex items-center gap-1.5 text-xs">
          {change !== undefined && (
            <>
              {change >= 0 ? (
                <ArrowUp className="w-3 h-3 text-nexora-600" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span className={change >= 0 ? "text-nexora-600" : "text-red-500"}>
                {Math.abs(change)}%
              </span>
            </>
          )}
          {description && <span className="text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  );
}

const AMBULANCE_COLORS: Record<string, string> = {
  available: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200",
  dispatched: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200",
  returning: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200",
  maintenance: "text-gray-500 bg-gray-50 dark:bg-gray-900/20 border-gray-200",
};

const PIE_COLORS = ["#16a34a", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function CommandCenterPage() {
  const [revenueView, setRevenueView] = useState<"7d" | "30d">("30d");
  const [stats, setStats] = useState({ patients: 0, doctors: 0, availableBeds: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const liveStats = await getCommandCenterStats();
        setStats(liveStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const emergencyPatients = mockPatients.filter((p) => p.patientType === "emergency");
  const criticalPatients = mockPatients.filter((p) => p.priority === "critical");

  const revenueSlice = revenueView === "7d" ? mockRevenueData.slice(-7) : mockRevenueData;

  const deptPieData = mockDepartmentStats.slice(0, 6).map((d) => ({
    name: d.department,
    value: d.patients,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time hospital operations overview • {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-nexora-50 dark:bg-nexora-900/20 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexora-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-nexora-600" />
          </span>
          <span className="text-xs font-medium text-nexora-700 dark:text-nexora-400">Live Data</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full h-32 flex items-center justify-center bg-muted/20 rounded-xl border border-dashed">
            <span className="text-muted-foreground animate-pulse">Loading live dashboard metrics...</span>
          </div>
        ) : (
          <>
            <KPICard title="Total Patients" value={stats.patients} icon={Users} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-900/20" description="Live from Supabase" />
            <KPICard title="Available Beds" value={stats.availableBeds} icon={Bed} color="text-nexora-600" bgColor="bg-nexora-50 dark:bg-nexora-900/20" description="Live from Supabase" />
            <KPICard title="Total Doctors" value={stats.doctors} icon={Stethoscope} color="text-purple-600" bgColor="bg-purple-50 dark:bg-purple-900/20" description="Live from Supabase" />
            
            {/* Keeping some mock stats for visual completeness since we didn't migrate revenue/surgeries yet */}
            <KPICard title="Emergency Today" value={mockHospitalStats.emergencyToday} change={18.7} icon={AlertTriangle} color="text-red-600" bgColor="bg-red-50 dark:bg-red-900/20" description="cases today" />
            <KPICard title="ICU Occupancy" value={`${mockHospitalStats.icuOccupancy}%`} icon={Heart} color="text-rose-600" bgColor="bg-rose-50 dark:bg-rose-900/20" description="of 18 beds" />
            <KPICard title="Revenue Today" value={`৳${(mockHospitalStats.revenueToday / 1000).toFixed(0)}K`} change={5.4} icon={TrendingUp} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-900/20" description="today" />
            <KPICard title="Surgeries Today" value={mockHospitalStats.surgeriesToday} icon={Scissors} color="text-indigo-600" bgColor="bg-indigo-50 dark:bg-indigo-900/20" description="completed/scheduled" />
            <KPICard title="OPD Today" value={mockHospitalStats.todayOPD} change={12.5} icon={Users} color="text-nexora-600" bgColor="bg-nexora-50 dark:bg-nexora-900/20" description="patients today" />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 nexora-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">OPD + IPD + Pharmacy + Lab revenue</p>
            </div>
            <div className="flex rounded-lg border border-border overflow-hidden text-xs">
              {(["7d", "30d"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setRevenueView(v)}
                  className={cn(
                    "px-3 py-1.5 font-medium transition-colors",
                    revenueView === v ? "bg-nexora-600 text-white" : "bg-white dark:bg-gray-900 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {v === "7d" ? "7 Days" : "30 Days"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueSlice} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="opdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [`৳${v.toLocaleString()}`, undefined]}
              />
              <Area type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} fill="url(#totalGrad)" name="Total" />
              <Area type="monotone" dataKey="opd" stroke="#0ea5e9" strokeWidth={1.5} fill="url(#opdGrad)" name="OPD" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="nexora-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Patient Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deptPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {deptPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {deptPieData.map((dept, i) => (
              <div key={dept.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-muted-foreground truncate">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Critical Patients */}
        <div className="nexora-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Critical Patients</h3>
            <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
              {criticalPatients.length} Critical
            </span>
          </div>
          <div className="space-y-3">
            {criticalPatients.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-600">
                    {p.name.charAt(0)}
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.bedAssigned} · {p.department}</p>
                </div>
                <span className="badge-critical text-[10px]">CRITICAL</span>
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xs font-bold text-amber-600">D</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Delwar Hossain</p>
                <p className="text-xs text-muted-foreground">CCU-2 · Cardiology</p>
              </div>
              <span className="badge-urgent text-[10px]">URGENT</span>
            </div>
          </div>
        </div>

        {/* Emergency Queue */}
        <div className="nexora-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Emergency Queue</h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              <span className="text-xs text-red-600 font-medium">Live</span>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Unknown Male", age: 45, priority: "critical", time: "2m ago", issue: "Chest Pain, Difficulty Breathing" },
              { name: "Shirin Sultana", age: 41, priority: "critical", time: "8m ago", issue: "Major trauma, Road accident" },
              { name: "Unnamed Child", age: 6, priority: "urgent", time: "15m ago", issue: "High fever, Seizures" },
              { name: "Anwar Hossain", age: 62, priority: "urgent", time: "22m ago", issue: "Sudden loss of consciousness" },
              { name: "Rahela Khatun", age: 35, priority: "stable", time: "31m ago", issue: "Abdominal pain" },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  p.priority === "critical" ? "bg-red-500" : p.priority === "urgent" ? "bg-amber-500" : "bg-green-500"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <span className="text-xs text-muted-foreground">({p.age}y)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{p.issue}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-muted-foreground">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Availability + Ambulances */}
        <div className="space-y-4">
          {/* Doctor Availability */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Doctor Availability</h3>
            <div className="space-y-2">
              {mockDoctors.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-xs font-bold text-nexora-700 flex-shrink-0">
                    {doc.name.split(" ")[1]?.charAt(0) || "D"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{doc.name.replace("Dr. ", "Dr. ")}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{doc.specialization}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    doc.status === "available" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    doc.status === "busy" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  )}>
                    {doc.status === "available" ? "Available" : doc.status === "busy" ? "Busy" : doc.status === "off_duty" ? "Off Duty" : "On Leave"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ambulance Status */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Ambulance Fleet</h3>
            <div className="space-y-2">
              {mockAmbulances.map((amb) => (
                <div key={amb.id} className={cn("flex items-center gap-2 p-2 rounded-lg border text-xs", AMBULANCE_COLORS[amb.status])}>
                  <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{amb.vehicleNumber}</p>
                    <p className="opacity-70 text-[10px] truncate">{amb.location}</p>
                  </div>
                  <span className="capitalize font-medium flex-shrink-0">{amb.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="nexora-card p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Intelligence Center</h3>
            <p className="text-xs text-muted-foreground">Predictive insights powered by Nexora AI</p>
          </div>
          <span className="ml-auto text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">
            AI Active
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Bed Occupancy Forecast", value: "94%", detail: "Expected by 8PM tonight", icon: Bed, color: "text-amber-600", trend: "↑ High demand" },
            { title: "High-Risk Patients", value: "8", detail: "Require immediate review", icon: Heart, color: "text-red-600", trend: "3 new flags" },
            { title: "Readmission Risk", value: "12", detail: "Patients flagged this week", icon: Activity, color: "text-blue-600", trend: "AI confidence: 87%" },
            { title: "ICU Demand (24h)", value: "High", detail: "2 beds may free up", icon: AlertTriangle, color: "text-purple-600", trend: "Forecast: stable" },
          ].map((insight) => (
            <div key={insight.title} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <insight.icon className={`w-4 h-4 ${insight.color}`} />
                <p className="text-xs font-medium text-muted-foreground">{insight.title}</p>
              </div>
              <p className={`text-xl font-bold ${insight.color}`}>{insight.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{insight.detail}</p>
              <div className="mt-2 flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-500" />
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">{insight.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Performance */}
      <div className="nexora-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Department Performance</h3>
          <span className="text-xs text-muted-foreground">This month</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockDepartmentStats} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="department" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={40} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="patients" fill="#16a34a" radius={[4, 4, 0, 0]} name="Patients" />
            <Bar dataKey="occupancy" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Occupancy %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
