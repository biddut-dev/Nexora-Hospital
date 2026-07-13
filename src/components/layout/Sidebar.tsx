"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Users,
  Bed,
  Stethoscope,
  UserRound,
  Heart,
  FlaskConical,
  RadioTower,
  Scissors,
  Truck,
  Droplets,
  Receipt,
  Settings2,
  UserCog,
  BrainCircuit,
  BarChart3,
  Building2,
  Syringe,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Activity,
  ClipboardList,
  Shield,
  PillIcon,
  Microscope,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Command Center", href: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Clinical",
    items: [
      { title: "OPD", href: "/dashboard/opd", icon: ClipboardList, badge: "183", badgeColor: "bg-blue-500" },
      { title: "IPD", href: "/dashboard/ipd", icon: Bed, badge: "247", badgeColor: "bg-purple-500" },
      { title: "Emergency", href: "/dashboard/emergency", icon: AlertTriangle, badge: "34", badgeColor: "bg-red-500" },
      { title: "Bed Management", href: "/dashboard/bed-management", icon: Building2 },
      { title: "Operation Theater", href: "/dashboard/ot", icon: Scissors },
    ],
  },
  {
    label: "Patient Care",
    items: [
      { title: "Patient Portal", href: "/dashboard/patient", icon: UserRound },
      { title: "Doctor Portal", href: "/dashboard/doctor", icon: Stethoscope },
      { title: "Nurse Station", href: "/dashboard/nurse", icon: Heart },
      { title: "Receptionist", href: "/dashboard/receptionist", icon: Users },
    ],
  },
  {
    label: "Diagnostics",
    items: [
      { title: "Pharmacy", href: "/dashboard/pharmacy", icon: PillIcon },
      { title: "Laboratory", href: "/dashboard/laboratory", icon: Microscope },
      { title: "Radiology", href: "/dashboard/radiology", icon: RadioTower },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Ambulance", href: "/dashboard/ambulance", icon: Truck },
      { title: "Blood Bank", href: "/dashboard/blood-bank", icon: Droplets },
      { title: "Billing & Insurance", href: "/dashboard/billing", icon: Receipt },
      { title: "Equipment", href: "/dashboard/equipment", icon: Settings2 },
      { title: "Staff Management", href: "/dashboard/staff", icon: UserCog },
    ],
  },
  {
    label: "AI Suite",
    items: [
      { title: "AI Health Center", href: "/dashboard/ai-center", icon: BrainCircuit, badge: "AI", badgeColor: "bg-gradient-to-r from-purple-500 to-blue-500" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  useEffect(() => {
    setMounted(true);
  }, []);

  const getFilteredNavGroups = (userRole: UserRole) => {
    if (userRole === "admin" || userRole === "manager") return navGroups;
    
    const allowedGroups: NavGroup[] = [];
  
    navGroups.forEach(group => {
      const items = group.items.filter(item => {
         if (userRole === "patient") return item.href === "/dashboard/patient" || item.href === "/dashboard/billing";
         if (userRole === "doctor") return ["/dashboard/doctor", "/dashboard/opd", "/dashboard/ipd", "/dashboard/ot", "/dashboard/ai-center"].includes(item.href);
         if (userRole === "nurse") return ["/dashboard/nurse", "/dashboard/ipd", "/dashboard/emergency", "/dashboard/bed-management"].includes(item.href);
         if (userRole === "receptionist") return ["/dashboard/receptionist", "/dashboard/opd", "/dashboard/billing", "/dashboard/ambulance", "/dashboard/bed-management"].includes(item.href);
         if (userRole === "pharmacist") return ["/dashboard/pharmacy"].includes(item.href);
         if (userRole === "pathologist") return ["/dashboard/laboratory"].includes(item.href);
         if (userRole === "radiology_technician") return ["/dashboard/radiology", "/dashboard/ai-center"].includes(item.href);
         if (userRole === "equipment_operator") return ["/dashboard/equipment", "/dashboard/ambulance"].includes(item.href);
         if (userRole === "medical_assistant") return ["/dashboard/opd", "/dashboard/ipd", "/dashboard/doctor", "/dashboard/nurse"].includes(item.href);
         if (userRole === "ward_boy") return ["/dashboard/bed-management", "/dashboard/ipd"].includes(item.href);
         
         return false;
      });
  
      if (items.length > 0) {
        allowedGroups.push({ ...group, items });
      }
    });
  
    return allowedGroups;
  };

  const filteredNavGroups = getFilteredNavGroups(role);

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-white dark:bg-gray-950 border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border min-h-[64px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-nexora-600 flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-foreground text-sm leading-tight">Nexora</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Hospital System</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {filteredNavGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.title : undefined}
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5 group relative",
                    isActive
                      ? "bg-nexora-100 text-nexora-700 dark:bg-nexora-900/40 dark:text-nexora-400 font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isActive ? "text-nexora-600 dark:text-nexora-400" : ""
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                            item.badgeColor || "bg-nexora-500"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-nexora-600 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 z-10 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border border-border shadow-sm flex items-center justify-center hover:bg-nexora-50 dark:hover:bg-nexora-900/20 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-nexora-50 dark:bg-nexora-900/20">
            <div className="w-7 h-7 rounded-full bg-nexora-600 flex items-center justify-center text-white text-xs font-bold">{user?.name.charAt(0) || "A"}</div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-foreground truncate">{user?.name || "Admin User"}</p>
              <p className="text-[10px] text-muted-foreground truncate capitalize">{user?.role?.replace("_", " ") || "System Administrator"}</p>
            </div>
            <Shield className="w-3 h-3 text-nexora-600 ml-auto flex-shrink-0" />
          </div>
        </div>
      )}
    </aside>
  );
}
