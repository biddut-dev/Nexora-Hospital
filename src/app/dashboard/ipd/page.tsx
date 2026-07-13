"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bed, Users, Activity, ChevronRight, UserPlus, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

export default function IPDPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "admissions" | "beds">("overview");
  
  const { 
    patients, beds, doctors, fetchPatients, fetchBeds, admitPatient, 
    isLoadingPatients, isLoadingBeds 
  } = useAppStore();

  // Modal State
  const [isAdmitOpen, setIsAdmitOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    bedId: "",
    doctorId: ""
  });

  useEffect(() => {
    fetchPatients();
    fetchBeds();
  }, [fetchPatients, fetchBeds]);

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.bedId || !formData.doctorId) return;
    
    setIsSubmitting(true);
    try {
      await admitPatient(formData.patientId, formData.bedId, formData.doctorId);
      setIsAdmitOpen(false);
      setFormData({ patientId: "", bedId: "", doctorId: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to admit patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ipdPatients = patients.filter(p => p.status === 'admitted');
  const availableBeds = beds.filter(b => b.status === 'available');
  const occupiedBeds = beds.filter(b => b.status === 'occupied');
  const icuBeds = beds.filter((b) => b.ward.includes("ICU") || b.ward.includes("CCU"));
  const icuOccupied = icuBeds.filter((b) => b.status === "occupied");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">IPD Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Indoor Patient Department — Admissions, Bed Management & Monitoring</p>
        </div>
        <button 
          onClick={() => setIsAdmitOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          New Admission
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Current Admissions", value: ipdPatients.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
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
              { ward: "Ward 1 — General", total: 20, occupied: occupiedBeds.filter(b=>b.ward.includes('General')).length },
              { ward: "Intensive Care Unit", total: 8, occupied: occupiedBeds.filter(b=>b.ward.includes('ICU')).length },
              { ward: "Emergency Ward", total: 12, occupied: occupiedBeds.filter(b=>b.ward.includes('Emergency')).length },
            ].map((w) => {
              const total = w.total || 1;
              const pct = Math.round((w.occupied / total) * 100);
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
            <h3 className="font-semibold mb-4">Admitted Patients</h3>
            <div className="space-y-3 h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {isLoadingPatients || isLoadingBeds ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
              ) : ipdPatients.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No admitted patients.</p>
              ) : ipdPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-sm font-bold text-nexora-700 flex-shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Bed {p.bedAssigned || 'TBD'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admission Modal */}
      <Modal isOpen={isAdmitOpen} onClose={() => setIsAdmitOpen(false)} title="New Admission">
        <form onSubmit={handleAdmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Select Patient</label>
            <select required value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400">
              <option value="">-- Choose Patient --</option>
              {patients.filter(p => p.status !== 'admitted').map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Assign Bed</label>
              <select required value={formData.bedId} onChange={e => setFormData({...formData, bedId: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400">
                <option value="">-- Choose Bed --</option>
                {availableBeds.map(b => (
                  <option key={b.id} value={b.id}>{b.number} ({b.ward})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Admitting Doctor</label>
              <select required value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400">
                <option value="">-- Choose Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdmitOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Admit Patient
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
