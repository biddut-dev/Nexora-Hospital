"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Settings2, CheckCircle, AlertTriangle, Wrench, BrainCircuit, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

export default function EquipmentPage() {
  const { equipment, addEquipment } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "Ventilator",
    location: "ICU-1",
    status: "operational" as any,
    serialNumber: ""
  });

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.serialNumber) return;

    addEquipment(formData);
    setIsOpen(false);
    setFormData({
      name: "",
      type: "Ventilator",
      location: "ICU-1",
      status: "operational",
      serialNumber: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Equipment & Asset Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Track, maintain & schedule hospital equipment • AI predictive maintenance</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Equipment", value: equipment.length, icon: Settings2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Operational", value: equipment.filter((e) => e.status === "operational").length, icon: CheckCircle, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Under Maintenance", value: equipment.filter((e) => e.status === "maintenance").length, icon: Wrench, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Faulty", value: equipment.filter((e) => e.status === "faulty").length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3 border-border">
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
      <div className="nexora-card overflow-hidden border-border">
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
              {equipment.map((eq) => (
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

      {/* Add Equipment Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Medical Asset">
        <form onSubmit={handleAddEquipment} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Equipment Name</label>
            <input required placeholder="e.g., Defibrillator Philips XL+" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Equipment Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
                <option>Ventilator</option>
                <option>Monitor</option>
                <option>MRI</option>
                <option>CT Scanner</option>
                <option>Oxygen Concentrator</option>
                <option>Defibrillator</option>
                <option>ECG Machine</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Location (Ward/Room)</label>
              <input required placeholder="e.g., OT-2, Ward 1, ICU-2" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Serial Number</label>
              <input required placeholder="e.g., SN-2026-9901" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Operational Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="faulty">Faulty</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-lg transition-colors">
              Register Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
