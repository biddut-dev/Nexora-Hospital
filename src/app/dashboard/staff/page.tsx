"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserCog, Users, Calendar, Clock, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

export default function StaffManagementPage() {
  const { staff, addStaffMember } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "nurse" as any,
    department: "General Medicine",
    phone: "",
    email: "",
    shift: "morning" as any
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    addStaffMember(formData);
    setIsOpen(false);
    setFormData({
      name: "",
      role: "nurse",
      department: "General Medicine",
      phone: "",
      email: "",
      shift: "morning"
    });
  };

  const stats = {
    total: staff.length,
    onDuty: staff.filter(s => s.status === 'active').length,
    morning: staff.filter(s => s.shift === 'morning').length,
    night: staff.filter(s => s.shift === 'night').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Employee directory, shifts, attendance & performance</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Staff", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "On Duty Today", value: stats.onDuty, icon: UserCog, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Morning Shift", value: stats.morning, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Night Shift", value: stats.night, icon: Clock, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
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

      {/* Staff Table */}
      <div className="nexora-card overflow-hidden border-border">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">Employee Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Role", "Department", "Phone", "Shift", "Status", "Joined"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-xs font-bold text-nexora-700">{member.name.charAt(0)}</div>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs capitalize text-muted-foreground">{member.role.replace("_", " ")}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{member.department}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{member.phone}</td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                      member.shift === "morning" ? "bg-amber-100 text-amber-700" :
                      member.shift === "evening" ? "bg-blue-100 text-blue-700" :
                      "bg-purple-100 text-purple-700")}>
                      {member.shift}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
                      member.status === "active" ? "bg-green-100 text-green-700" :
                      member.status === "on_leave" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600")}>
                      {member.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{member.joiningDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Employee">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Full Name</label>
            <input required placeholder="e.g., Nurse Jahanara" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
                <option value="nurse">Nurse</option>
                <option value="receptionist">Receptionist</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="pathologist">Pathologist</option>
                <option value="radiology_technician">Radiology Tech</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Department</label>
              <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
                <option>General Medicine</option>
                <option>ICU</option>
                <option>Pharmacy</option>
                <option>Laboratory</option>
                <option>Radiology</option>
                <option>Emergency</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Phone</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Shift</label>
            <select value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value as any})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-lg transition-colors">
              Save Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
