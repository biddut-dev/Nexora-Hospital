"use client";

import { useState } from "react";
import { mockMedicines } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { PillIcon, AlertTriangle, TrendingDown, ShoppingCart, Search, Package, BrainCircuit } from "lucide-react";

export default function PharmacyPage() {
  const [search, setSearch] = useState("");
  const lowStock = mockMedicines.filter((m) => m.stock < m.reorderLevel * 0.5);
  const filtered = mockMedicines.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pharmacy</h1>
          <p className="text-muted-foreground text-sm mt-1">Medicine inventory, dispensing & AI drug interaction detection</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <ShoppingCart className="w-4 h-4" />
          New Purchase Order
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Medicines", value: mockMedicines.length + 284, icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Low Stock Alerts", value: lowStock.length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Dispensed Today", value: 142, icon: PillIcon, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Expiring Soon", value: 3, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3">
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

      {/* AI Drug Interaction Panel */}
      <div className="nexora-card p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold">AI Drug Interaction Detector</h3>
          <span className="ml-auto text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">AI Active</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">⚠ Interaction Detected</p>
            <p className="text-xs text-muted-foreground">Warfarin + Aspirin: Increased bleeding risk detected for Patient Delwar Hossain. Consider alternative.</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">✓ AI Suggestion</p>
            <p className="text-xs text-muted-foreground">Clopidogrel 75mg may be a safer alternative for patient profile. Consult prescribing physician.</p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="nexora-card">
        <div className="p-5 border-b border-border flex items-center gap-3 flex-wrap">
          <h3 className="font-semibold">Medicine Inventory</h3>
          <div className="ml-auto relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..." className="pl-8 pr-3 py-2 text-xs bg-muted rounded-lg focus:outline-none w-48" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Category", "Stock", "Unit", "Price", "Expiry", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((med) => {
                const isLow = med.stock < med.reorderLevel;
                const isCritical = med.stock < med.reorderLevel * 0.5;
                return (
                  <tr key={med.id} className={cn("border-b border-border/50 hover:bg-muted/30", isCritical && "bg-red-50/30 dark:bg-red-900/5")}>
                    <td className="py-3 px-4 font-medium">{med.name}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{med.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-semibold", isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-nexora-600")}>
                          {med.stock.toLocaleString()}
                        </span>
                        {(isLow || isCritical) && <AlertTriangle className={cn("w-3.5 h-3.5", isCritical ? "text-red-500" : "text-amber-500")} />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{med.unit}</td>
                    <td className="py-3 px-4 text-xs">৳{med.price}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{med.expiryDate}</td>
                    <td className="py-3 px-4">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
                        isCritical ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        isLow ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400")}>
                        {isCritical ? "Critical" : isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
