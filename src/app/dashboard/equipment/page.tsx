"use client";

import { mockEquipment } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Settings2, AlertTriangle, CheckCircle, Clock, BrainCircuit, Wrench, Plus } from "lucide-react";

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Equipment & Asset Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Track, maintain & schedule hospital equipment • AI predictive maintenance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Equipment", value: mockEquipment.length + 189, icon: Settings2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Operational", value: mockEquipment.filter((e) => e.status === "operational").length + 176, icon: CheckCircle, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Under Maintenance", value: mockEquipment.filter((e) => e.status === "maintenance").length + 8, icon: Wrench, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Faulty", value: 5, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
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

      {/* AI Predictive Maintenance */}
      <div className="nexora-card p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold">AI Predictive Maintenance</h3>
          <span className="ml-auto text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">AI Active</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { equip: "Ventilator V500 (ICU-1)", risk: "Low", prediction: "Next 90 days — stable operation predicted", color: "text-nexora-600", bg: "bg-green-50 dark:bg-green-900/10", border: "border-green-200" },
            { equip: "Patient Monitor PM-8000", risk: "High", prediction: "Sensor degradation detected — schedule maintenance within 3 days", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-200" },
            { equip: "MRI Machine 3T", risk: "Low", prediction: "Cooling system performing optimally — next service in 3 months", color: "text-nexora-600", bg: "bg-green-50 dark:bg-green-900/10", border: "border-green-200" },
          ].map((a) => (
            <div key={a.equip} className={`${a.bg} border ${a.border} rounded-xl p-4`}>
              <p className="text-xs font-semibold text-foreground mb-1">{a.equip}</p>
              <p className={`text-sm font-bold ${a.color} mb-1`}>Risk: {a.risk}</p>
              <p className="text-[11px] text-muted-foreground">{a.prediction}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Table */}
      <div className="nexora-card overflow-hidden">
        <div className="p-5 border-b border-border"><h3 className="font-semibold">Equipment Registry</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Equipment", "Type", "Location", "Serial No.", "Status", "Last Service", "Next Service"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockEquipment.map((eq) => (
                <tr key={eq.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-medium">{eq.name}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{eq.type}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{eq.location}</td>
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{eq.serialNumber}</td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                      eq.status === "operational" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      eq.status === "maintenance" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
                      {eq.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{eq.lastMaintenance}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{eq.nextMaintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
