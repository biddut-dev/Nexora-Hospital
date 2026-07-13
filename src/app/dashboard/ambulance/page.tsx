"use client";
import { mockAmbulances } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Truck, MapPin, Phone, Clock, AlertTriangle, CheckCircle, Navigation } from "lucide-react";

export default function AmbulancePage() {
  const available = mockAmbulances.filter((a) => a.status === "available");
  const dispatched = mockAmbulances.filter((a) => a.status === "dispatched");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ambulance Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Fleet tracking, dispatch & emergency response management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <Truck className="w-4 h-4" />
          Dispatch Emergency
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Fleet", value: mockAmbulances.length, icon: Truck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Available", value: available.length, icon: CheckCircle, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "On Dispatch", value: dispatched.length, icon: Navigation, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { title: "Calls Today", value: 14, icon: Phone, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.title}</p></div>
          </div>
        ))}
      </div>

      {/* Fleet Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAmbulances.map((amb) => (
          <div key={amb.id} className={cn("nexora-card p-5", amb.status === "dispatched" && "border-blue-300 dark:border-blue-700")}>
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
            {amb.status === "available" && (
              <button className="mt-3 w-full py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Dispatch</button>
            )}
          </div>
        ))}
      </div>

      {/* Static Map Placeholder */}
      <div className="nexora-card p-5">
        <h3 className="font-semibold mb-4">Live Fleet Map</h3>
        <div className="h-64 bg-gradient-to-br from-nexora-50 to-blue-50 dark:from-nexora-900/10 dark:to-blue-900/10 rounded-xl border-2 border-dashed border-nexora-200 dark:border-nexora-800 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-12 h-12 text-nexora-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">GPS Tracking Map</p>
            <p className="text-xs text-muted-foreground mt-1">Integrate Google Maps / Mapbox API for live tracking</p>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              {mockAmbulances.filter((a) => a.status !== "maintenance").map((a) => (
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
    </div>
  );
}
