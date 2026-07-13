"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Droplets, AlertTriangle, CheckCircle, Navigation } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

export default function BloodBankPage() {
  const { bloodBank, recordBloodDonor } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Donor Form State
  const [formData, setFormData] = useState({
    donorName: "",
    bloodGroup: "A+",
    units: 1,
    phone: ""
  });

  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName || !formData.units) return;

    recordBloodDonor(formData.bloodGroup, Number(formData.units));
    setIsOpen(false);
    setFormData({
      donorName: "",
      bloodGroup: "A+",
      units: 1,
      phone: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Blood Bank</h1>
          <p className="text-muted-foreground text-sm mt-1">Blood inventory, donor management & request tracking</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Droplets className="w-4 h-4 text-white" />
            Add Donor
          </button>
        </div>
      </div>

      {/* Blood Inventory Grid */}
      <div>
        <h3 className="font-semibold mb-3">Blood Inventory</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {bloodBank.map((blood) => {
            const isCritical = blood.units < 5;
            const isLow = blood.units < 10;
            return (
              <div key={blood.bloodGroup} className={cn(
                "nexora-card p-5 text-center transition-all hover:shadow-md border-border",
                isCritical && "border-red-300 dark:border-red-700",
                isLow && !isCritical && "border-amber-300 dark:border-amber-700"
              )}>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold",
                  isCritical ? "bg-red-100 text-red-600 dark:bg-red-900/30" :
                  isLow ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                  "bg-red-50 text-red-500 dark:bg-red-900/20"
                )}>
                  {blood.bloodGroup}
                </div>
                <p className={cn("text-3xl font-bold",
                  isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-foreground")}>
                  {blood.units}
                </p>
                <p className="text-xs text-muted-foreground">units available</p>
                {isCritical && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] text-red-600 font-medium">Critical!</span>
                  </div>
                )}
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", isCritical ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-nexora-500")}
                    style={{ width: `${Math.min(100, (blood.units / 50) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">Last Updated: {blood.lastUpdated}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Alert */}
      <div className="nexora-card p-4 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-red-700 dark:text-red-400">Critical Blood Shortage Alert</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            O- (3 units) and AB- (2 units) are critically low. Urgent donor recruitment required.
          </p>
        </div>
      </div>

      {/* Blood Requests */}
      <div className="nexora-card p-5 border-border">
        <h3 className="font-semibold mb-4">Active Blood Requests</h3>
        <div className="space-y-3">
          {[
            { patient: "Karim Hossain", type: "O+", units: 2, dept: "Neurology", urgency: "urgent", status: "pending" },
            { patient: "Scheduled Surgery (OT-2)", type: "A+", units: 4, dept: "Operation Theater", urgency: "planned", status: "reserved" },
            { patient: "Fatima Begum", type: "AB+", units: 1, dept: "Gynecology", urgency: "normal", status: "fulfilled" },
          ].map((req, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0",
                req.urgency === "urgent" ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-nexora-100 text-nexora-700")}>
                {req.type}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{req.patient}</p>
                <p className="text-xs text-muted-foreground">{req.units} unit(s) · {req.dept}</p>
              </div>
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", 
                req.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              )}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Donor Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Record Blood Donation / Add Donor">
        <form onSubmit={handleAddDonor} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Donor Full Name</label>
            <input required placeholder="e.g., Md. Karim Ali" value={formData.donorName} onChange={e => setFormData({...formData, donorName: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Blood Group</label>
              <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => <option key={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Units Donated</label>
              <input required type="number" min={1} max={10} value={formData.units} onChange={e => setFormData({...formData, units: Number(e.target.value)})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Donor Contact Phone</label>
            <input required type="tel" placeholder="01XXXXXXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-white" />
              Save Donation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
