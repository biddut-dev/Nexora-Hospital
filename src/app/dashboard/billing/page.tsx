"use client";

import { mockRevenueData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Receipt, TrendingUp, FileText, CreditCard, Shield, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const recentBills = [
  { id: "BILL-2026-3421", patient: "Rahman Ali", type: "OPD", amount: 2500, status: "paid", date: "2026-07-13" },
  { id: "BILL-2026-3420", patient: "Fatima Begum", type: "IPD", amount: 48500, status: "pending", date: "2026-07-12" },
  { id: "BILL-2026-3419", patient: "Karim Hossain", type: "Emergency + ICU", amount: 125000, status: "insurance", date: "2026-07-10" },
  { id: "BILL-2026-3418", patient: "Nasrin Akter", type: "OPD + Lab", amount: 3800, status: "paid", date: "2026-07-11" },
  { id: "BILL-2026-3417", patient: "Mosaddek Ahmed", type: "Surgery + IPD", amount: 87500, status: "partial", date: "2026-07-12" },
];

export default function BillingPage() {
  const weeklyData = mockRevenueData.slice(-7).map((d) => ({ ...d, date: d.date.split(" ")[1] }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing & Insurance</h1>
          <p className="text-muted-foreground text-sm mt-1">OPD, IPD, pharmacy, lab billing & insurance claim management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Receipt className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Today's Revenue", value: "৳487,500", icon: TrendingUp, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Pending Bills", value: 28, icon: Receipt, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Insurance Claims", value: 14, icon: Shield, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Monthly Revenue", value: "৳12.4M", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="nexora-card p-5">
          <h3 className="font-semibold mb-4">Weekly Revenue by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`৳${v.toLocaleString()}`, undefined]} />
              <Bar dataKey="opd" fill="#16a34a" name="OPD" radius={[2, 2, 0, 0]} />
              <Bar dataKey="ipd" fill="#0ea5e9" name="IPD" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pharmacy" fill="#f59e0b" name="Pharmacy" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="nexora-card p-5">
          <h3 className="font-semibold mb-4">Payment Breakdown</h3>
          {[
            { label: "Cash Payments", amount: 187500, pct: 38, color: "bg-nexora-500" },
            { label: "Insurance Claims", amount: 195000, pct: 40, color: "bg-blue-500" },
            { label: "Online/Card", amount: 85000, pct: 17, color: "bg-purple-500" },
            { label: "Partial/Pending", amount: 20000, pct: 5, color: "bg-amber-500" },
          ].map((p) => (
            <div key={p.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{p.label}</span>
                <span className="font-medium">৳{p.amount.toLocaleString()} ({p.pct}%)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="nexora-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Recent Bills</h3>
          <button className="text-xs text-nexora-600 hover:text-nexora-700 font-medium flex items-center gap-1"><Download className="w-3.5 h-3.5" />Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Bill ID", "Patient", "Type", "Amount", "Date", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBills.map((bill) => (
                <tr key={bill.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-mono text-xs text-nexora-600">{bill.id}</td>
                  <td className="py-3 px-4 font-medium">{bill.patient}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{bill.type}</td>
                  <td className="py-3 px-4 font-semibold">৳{bill.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{bill.date}</td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                      bill.status === "paid" ? "bg-green-100 text-green-700" :
                      bill.status === "insurance" ? "bg-blue-100 text-blue-700" :
                      bill.status === "partial" ? "bg-purple-100 text-purple-700" :
                      "bg-amber-100 text-amber-700")}>
                      {bill.status}
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
