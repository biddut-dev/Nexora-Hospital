"use client";

import { useState } from "react";
import { mockBeds } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Bed, Filter, Search, LayoutGrid, List, RefreshCw } from "lucide-react";
import type { BedType, BedStatus } from "@/types";

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

  const filteredBeds = mockBeds.filter((bed) => {
    const wardMatch = selectedWard === "All Wards" || bed.ward === selectedWard;
    const statusMatch = selectedStatus === "all" || bed.status === selectedStatus;
    return wardMatch && statusMatch;
  });

  const stats = {
    total: mockBeds.length,
    available: mockBeds.filter((b) => b.status === "available").length,
    occupied: mockBeds.filter((b) => b.status === "occupied").length,
    reserved: mockBeds.filter((b) => b.status === "reserved").length,
    cleaning: mockBeds.filter((b) => b.status === "cleaning").length,
    maintenance: mockBeds.filter((b) => b.status === "maintenance").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bed & Cabin Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Visual floor management system — Real-time bed availability</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Bed className="w-4 h-4" />
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
              "nexora-card p-3 text-center transition-all",
              selectedStatus === s.status && "ring-2",
              selectedStatus === s.status ? `ring-${s.color.split("-")[1]}-500` : ""
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
          <span className="text-sm font-medium">Overall Occupancy Rate</span>
          <span className="text-sm font-bold text-amber-600">{Math.round((stats.occupied / stats.total) * 100)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-nexora-500 to-amber-500 rounded-full transition-all"
            style={{ width: `${Math.round((stats.occupied / stats.total) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>{stats.occupied} occupied</span>
          <span>{stats.total} total beds</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 flex-wrap">
          {WARDS.map((ward) => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                selectedWard === ward
                  ? "bg-nexora-600 text-white border-nexora-600"
                  : "bg-white dark:bg-gray-900 text-muted-foreground border-border hover:border-nexora-400"
              )}
            >
              {ward === "All Wards" ? "All" : ward.split(" ")[0] + " " + (ward.split(" ")[1] || "")}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-2 rounded-lg border transition-colors", viewMode === "grid" ? "bg-nexora-100 border-nexora-300 text-nexora-700" : "border-border text-muted-foreground hover:bg-muted")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-2 rounded-lg border transition-colors", viewMode === "list" ? "bg-nexora-100 border-nexora-300 text-nexora-700" : "border-border text-muted-foreground hover:bg-muted")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bed Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredBeds.map((bed) => (
            <div
              key={bed.id}
              className={cn(
                "rounded-xl border-2 p-3 cursor-pointer hover:shadow-md transition-all group",
                statusColors[bed.status]
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Bed className="w-4 h-4" />
                <div className={cn("w-2 h-2 rounded-full", statusDot[bed.status])} />
              </div>
              <p className="font-bold text-sm">{bed.number}</p>
              <p className="text-[10px] opacity-70 mt-0.5">{bedTypeLabels[bed.type]}</p>
              {bed.patientName && (
                <p className="text-[10px] font-medium mt-1.5 truncate opacity-90">{bed.patientName}</p>
              )}
              <p className="text-[10px] capitalize mt-1 opacity-70">{bed.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="nexora-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Bed #", "Ward", "Floor", "Type", "Status", "Patient", "Admitted", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBeds.map((bed) => (
                <tr key={bed.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-mono font-bold">{bed.number}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{bed.ward}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">Floor {bed.floor}</td>
                  <td className="py-3 px-4 text-xs">{bedTypeLabels[bed.type]}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-2 h-2 rounded-full", statusDot[bed.status])} />
                      <span className="text-xs capitalize">{bed.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs">{bed.patientName || "—"}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{bed.admissionDate || "—"}</td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-nexora-600 hover:text-nexora-700 font-medium">
                      {bed.status === "available" ? "Book" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
