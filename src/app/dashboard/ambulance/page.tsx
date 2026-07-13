"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Truck, MapPin, Phone, Clock, AlertTriangle, CheckCircle, Navigation } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

export default function AmbulancePage() {
  const { ambulances, dispatchAmbulance, returnAmbulance } = useAppStore();

  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [selectedAmbId, setSelectedAmbId] = useState<string | null>(null);
  
  // Dispatch form state
  const [formData, setFormData] = useState({
    location: "",
    refDetails: ""
  });

  const available = ambulances.filter((a) => a.status === "available");
  const dispatched = ambulances.filter((a) => a.status === "dispatched");

  const handleOpenDispatch = (id: string) => {
    setSelectedAmbId(id);
    setIsDispatchOpen(true);
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmbId || !formData.location || !formData.refDetails) return;
    
    dispatchAmbulance(selectedAmbId, formData.location, formData.refDetails);
    setIsDispatchOpen(false);
    setSelectedAmbId(null);
    setFormData({ location: "", refDetails: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ambulance Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Fleet tracking, dispatch & emergency response management</p>
        </div>
        {available.length > 0 && (
          <button 
            onClick={() => handleOpenDispatch(available[0].id)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Truck className="w-4 h-4" />
            Dispatch Emergency
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Fleet", value: ambulances.length, icon: Truck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Available", value: available.length, icon: CheckCircle, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "On Dispatch", value: dispatched.length, icon: Navigation, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { title: "Calls Today", value: dispatched.length + 12, icon: Phone, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3 border-border">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.title}</p></div>
          </div>
        ))}
      </div>

      {/* Fleet Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ambulances.map((amb) => (
          <div key={amb.id} className={cn("nexora-card p-5 border-border", amb.status === "dispatched" && "border-blue-300 dark:border-blue-700")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-foreground">{amb.vehicleNumber}</p>
                <p className="text-xs text-muted-foreground">{amb.id}</p>
              </div>
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                amb.status === "available" ? "bg-green-100 text-green-700" :
                amb.status === "dispatched" ? "bg-blue-100 text-blue-700" :
                amb.status === "returning" ? "bg-amber-100 text-amber-700" :
                "bg-gray-100 text-gray-600")}>
                {amb.status}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground"><Truck className="w-3.5 h-3.5" />{amb.driverName}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{amb.location}</div>
              {amb.assignedTo && <div className="flex items-center gap-1.5 text-blue-600 font-medium"><AlertTriangle className="w-3.5 h-3.5" />{amb.assignedTo}</div>}
            </div>
            
            <div className="mt-4 pt-3 border-t border-border flex gap-2">
              {amb.status === "available" ? (
                <button 
                  onClick={() => handleOpenDispatch(amb.id)}
                  className="w-full py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Dispatch
                </button>
              ) : (
                <button 
                  onClick={() => returnAmbulance(amb.id)}
                  className="w-full py-2 text-xs font-medium border border-border hover:bg-muted text-foreground rounded-lg transition-colors"
                >
                  Return to Base
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Static Map Placeholder */}
      <div className="nexora-card p-5 border-border">
        <h3 className="font-semibold mb-4">Live Fleet Map</h3>
        <div className="h-64 bg-gradient-to-br from-nexora-50 to-blue-50 dark:from-nexora-900/10 dark:to-blue-900/10 rounded-xl border-2 border-dashed border-nexora-200 dark:border-nexora-800 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-12 h-12 text-nexora-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">GPS Tracking Map</p>
            <p className="text-xs text-muted-foreground mt-1">Integrate Google Maps / Mapbox API for live tracking</p>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              {ambulances.filter((a) => a.status !== "maintenance").map((a) => (
                <div key={a.id} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full",
                  a.status === "available" ? "bg-green-100 text-green-700" : a.status === "dispatched" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>
                  <Truck className="w-3 h-3" />
                  {a.vehicleNumber.slice(-4)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      <Modal isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} title="Dispatch Emergency Ambulance">
        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Emergency Location / Address</label>
            <input required placeholder="e.g., House 12, Road 4, Sector 7, Uttara" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium">Assigned Case Reference / Details</label>
            <input required placeholder="e.g., Trauma Call #8821 / Cardiac Patient" value={formData.refDetails} onChange={e => setFormData({...formData, refDetails: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsDispatchOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
              Dispatch Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
