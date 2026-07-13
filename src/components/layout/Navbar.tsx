"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { mockNotifications } from "@/lib/mock-data";
import {
  Bell,
  Search,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Shield,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Menu,
} from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="h-16 border-b border-border bg-white dark:bg-gray-950 flex items-center px-4 gap-4 relative z-20">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients, doctors, reports..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted rounded-lg border border-transparent focus:outline-none focus:border-nexora-400 focus:bg-white dark:focus:bg-gray-900 transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nexora-50 dark:bg-nexora-900/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexora-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-nexora-600"></span>
          </span>
          <span className="text-xs font-medium text-nexora-700 dark:text-nexora-400">Live</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-950 border border-border rounded-xl shadow-xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                      !notif.read && "bg-nexora-50/50 dark:bg-nexora-900/10"
                    )}
                  >
                    <div className="mt-0.5 flex-shrink-0">{getNotifIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-medium truncate", !notif.read && "text-foreground")}>{notif.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(notif.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-nexora-500 flex-shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <button className="w-full text-center text-xs text-nexora-600 hover:text-nexora-700 font-medium">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-nexora-600 flex items-center justify-center text-white text-xs font-bold">{user?.name?.charAt(0) || "A"}</div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium leading-tight truncate max-w-[100px]">{user?.name || "Admin User"}</p>
              <p className="text-[10px] text-muted-foreground leading-tight capitalize truncate max-w-[100px]">{user?.role?.replace("_", " ") || "Administrator"}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-950 border border-border rounded-xl shadow-xl z-50 py-1">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold truncate">{user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@nexora.com"}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-nexora-600" />
                  <span className="text-[10px] text-nexora-600 font-medium capitalize">{user?.role?.replace("_", " ") || "System Administrator"}</span>
                </div>
              </div>
              {[
                { icon: User, label: "Profile" },
                { icon: Settings, label: "Settings" },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {label}
                </button>
              ))}
              <div className="border-t border-border mt-1 pt-1">
                <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotifications(false); setShowProfile(false); }}
        />
      )}
    </header>
  );
}
