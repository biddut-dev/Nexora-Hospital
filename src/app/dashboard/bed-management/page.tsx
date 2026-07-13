"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bed as BedIcon, Filter, Search, LayoutGrid, List, UserPlus, Loader2 } from "lucide-react";
import type { BedType, BedStatus } from "@/types";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

const bedTypeLabels: Record<BedType, string> = {
  general: "General",
  cabin: "Cabin",
  vip_cabin: "VIP Cabin",
  icu: "ICU",
  nicu: "NICU",
  picu: "PICU",
  emergency: "Emergency",
  isolation: "Isolation",
};

const statusColors: Record<BedStatus, string> = {
  available: "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300",
  occupied: "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300",
  reserved: "bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300",
  cleaning: "bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300",
  maintenance: "bg-gray-100 border-gray-400 text-gray-600 dark:bg-gray-900/30 dark:border-gray-700 dark:text-gray-400",
};

const statusDot: Record<BedStatus, string> = {
  available: "bg-green-500",
  occupied: "bg-red-500",
  reserved: "bg-amber-500",
  cleaning: "bg-blue-500",
  maintenance: "bg-gray-400",
};

const WARDS = ["All Wards", "Ward 1 - General", "Ward 2 - Cabin", "Intensive Care Unit", "Cardiac Care Unit", "Neonatal ICU", "Emergency"];

export default function BedManagementPage() {
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [selectedStatus, setSelectedStatus] = useState<"all" | BedStatus>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const { 
    patients, beds, doctors, fetchPatients, fetchBeds, admitPatient, 
    isLoadingBeds, isLoadingPatients 
  } = useAppStore();

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    bedId: "",
    doctorId: ""
  });

  useEffect(() => {
    fetchBeds();
    fetchPatients();
  }, [fetchBeds, fetchPatients]);

  const handleBookBed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.bedId || !formData.doctorId) return;
    
    setIsSubmitting(true);
    try {
      await admitPatient(formData.patientId, formData.bedId, formData.doctorId);
      setIsBookOpen(false);
      setFormData({ patientId: "", bedId: "", doctorId: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to book bed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBeds = beds.filter((bed) => {
    const wardMatch = selectedWard === "All Wards" || bed.ward.includes(selectedWard) || (selectedWard === "Emergency" && bed.ward === "Emergency");
    const statusMatch = selectedStatus === "all" || bed.status === selectedStatus;
    const searchMatch = search === "" || bed.number.includes(search) || (bed.patientName && bed.patientName.toLowerCase().includes(search.toLowerCase()));
    return wardMatch && statusMatch && searchMatch;
  });

  const availableBeds = beds.filter((b) => b.status === "available");

  const stats = {
    total: beds.length,
    available: beds.filter((b) => b.status === "available").length,
    occupied: beds.filter((b) => b.status === "occupied").length,
    reserved: beds.filter((b) => b.status === "reserved").length,
    cleaning: beds.filter((b) => b.status === "cleaning").length,
    maintenance: beds.filter((b) => b.status === "maintenance").length,
  };

  const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bed & Cabin Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Visual floor management system — Real-time bed availability</p>
        </div>
        <button 
          onClick={() => setIsBookOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <BedIcon className="w-4 h-4" />
          Book a Bed
        </button>
      </div>

      {/* Status Legend & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { status: "available" as BedStatus, label: "Available", count: stats.available, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
          { status: "occupied" as BedStatus, label: "Occupied", count: stats.occupied, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { status: "reserved" as BedStatus, label: "Reserved", count: stats.reserved, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { status: "cleaning" as BedStatus, label: "Cleaning", count: stats.cleaning, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { status: "maintenance" as BedStatus, label: "Maintenance", count: stats.maintenance, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-900/20" },
        ].map((s) => (
          <button
            key={s.status}
            onClick={() => setSelectedStatus(selectedStatus === s.status ? "all" : s.status)}
            className={cn(
              "nexora-card p-3 text-center transition-all border-border",
              selectedStatus === s.status && "ring-2 ring-nexora-500"
            )}
          >
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mx-auto mb-1.5`}>
              <div className={`w-3 h-3 rounded-full ${statusDot[s.status]}`} />
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Occupancy Rate */}
      <div className="nexora-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-sm">Overall Bed Occupancy</h3>
            <p className="text-xs text-muted-foreground">{stats.occupied} out of {stats.total} beds occupied</p>
          </div>
          <span className="text-lg font-bold text-nexora-600">{occupancyRate}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-nexora-500 rounded-full transition-all" style={{ width: `${occupancyRate}%` }} />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {WARDS.map((ward) => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                selectedWard === ward 
                  ? "bg-nexora-600 text-white border-nexora-600" 
                  : "bg-card text-muted-foreground border-border hover:bg-muted"
              )}
            >
              {ward}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bed, patient..."
              className="pl-8 pr-3 py-1.5 text-xs bg-muted rounded-lg focus:outline-none w-48 border border-border"
            />
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-muted" : "bg-card hover:bg-muted")}
            >
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-2 transition-colors", viewMode === "list" ? "bg-muted" : "bg-card hover:bg-muted")}
            >
              <List className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Beds Grid / List */}
      {isLoadingBeds ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-nexora-600" /></div>
      ) : filteredBeds.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-2xl text-muted-foreground text-sm">No beds found matching the criteria.</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredBeds.map((bed) => (
            <div key={bed.id} className={cn("nexora-card p-4 border-2 flex flex-col justify-between h-36 transition-all", 
              bed.status === "available" ? "border-green-100 hover:border-green-300" :
              bed.status === "occupied" ? "border-red-100 hover:border-red-300" :
              bed.status === "reserved" ? "border-amber-100 hover:border-amber-300" :
              "border-gray-100 hover:border-gray-300"
            )}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{bed.number}</span>
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase", 
                    bed.status === "available" ? "bg-green-100 text-green-700" :
                    bed.status === "occupied" ? "bg-red-100 text-red-700" :
                    "bg-muted text-muted-foreground"
                  )}>{bed.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{bed.ward}</p>
                <p className="text-[9px] text-muted-foreground capitalize">{bedTypeLabels[bed.type]}</p>
              </div>
              <div className="mt-2 text-xs font-semibold truncate text-foreground">
                {bed.patientName || bed.patientId ? (
                  <span>Patient ID: {bed.patientId?.slice(-6) || 'Admitted'}</span>
                ) : (
                  <span className="text-muted-foreground font-normal">Empty</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="nexora-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Bed Number", "Ward", "Floor", "Type", "Status", "Patient"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBeds.map((bed) => (
                <tr key={bed.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-bold">{bed.number}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{bed.ward}</td>
                  <td className="py-3 px-4 text-xs">{bed.floor}</td>
                  <td className="py-3 px-4 text-xs capitalize">{bedTypeLabels[bed.type]}</td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", statusColors[bed.status])}>
                      {bed.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">{bed.patientName || bed.patientId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Bed Modal */}
      <Modal isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} title="Book / Assign Bed">
        <form onSubmit={handleBookBed} className="space-y-4">
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
              <label className="text-xs font-medium">Doctor Assigned</label>
              <select required value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400">
                <option value="">-- Choose Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsBookOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Assign Bed
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
