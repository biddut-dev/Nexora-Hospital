"use client";

import { mockStaff } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { UserCog, Users, Calendar, Clock, TrendingUp, Plus } from "lucide-react";

export default function StaffManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Employee directory, shifts, attendance & performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Staff", value: 284, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "On Duty Today", value: 198, icon: UserCog, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "On Leave", value: 12, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Night Shift", value: 47, icon: Clock, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
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

      {/* Staff Table */}
      <div className="nexora-card overflow-hidden">
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
              {mockStaff.map((staff) => (
                <tr key={staff.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-xs font-bold text-nexora-700">{staff.name.charAt(0)}</div>
                      <span className="font-medium">{staff.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs capitalize text-muted-foreground">{staff.role.replace("_", " ")}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{staff.department}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{staff.phone}</td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                      staff.shift === "morning" ? "bg-amber-100 text-amber-700" :
                      staff.shift === "evening" ? "bg-blue-100 text-blue-700" :
                      "bg-purple-100 text-purple-700")}>
                      {staff.shift}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
                      staff.status === "active" ? "bg-green-100 text-green-700" :
                      staff.status === "on_leave" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600")}>
                      {staff.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{staff.joiningDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shift Schedule */}
      <div className="nexora-card p-5">
        <h3 className="font-semibold mb-4">Today's Shift Overview</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { shift: "Morning (6AM-2PM)", count: 98, color: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-900/10" },
            { shift: "Evening (2PM-10PM)", count: 87, color: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-900/10" },
            { shift: "Night (10PM-6AM)", count: 47, color: "bg-purple-500", light: "bg-purple-50 dark:bg-purple-900/10" },
          ].map((s) => (
            <div key={s.shift} className={`${s.light} rounded-xl p-4 border border-border`}>
              <p className="text-xs text-muted-foreground mb-1">{s.shift}</p>
              <p className="text-2xl font-bold text-foreground">{s.count}</p>
              <p className="text-xs text-muted-foreground">staff members</p>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${s.color} rounded-full`} style={{ width: `${Math.round((s.count / 284) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
