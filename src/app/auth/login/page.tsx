"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types";
import {
  Activity,
  Eye,
  EyeOff,
  Shield,
  ChevronDown,
  AlertCircle,
  Loader2,
  ArrowRight,
  Stethoscope,
  Heart,
  Users,
  UserCog,
  PillIcon,
  Microscope,
  RadioTower,
  Settings2,
  ClipboardList,
  UserRound,
} from "lucide-react";

const roles = [
  { value: "admin", label: "System Administrator", icon: Shield },
  { value: "manager", label: "Hospital Manager", icon: UserCog },
  { value: "doctor", label: "Doctor", icon: Stethoscope },
  { value: "nurse", label: "Nurse", icon: Heart },
  { value: "receptionist", label: "Receptionist", icon: Users },
  { value: "pharmacist", label: "Pharmacist", icon: PillIcon },
  { value: "pathologist", label: "Pathologist / Lab Tech", icon: Microscope },
  { value: "radiology_technician", label: "Radiology Technician", icon: RadioTower },
  { value: "equipment_operator", label: "Equipment Operator", icon: Settings2 },
  { value: "medical_assistant", label: "Medical Assistant", icon: ClipboardList },
  { value: "ward_boy", label: "Ward Boy", icon: UserRound },
  { value: "patient", label: "Patient", icon: UserRound },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nexora.com");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedRole = roles.find((r) => r.value === role);

  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter your credentials.");
      setLoading(false);
      return;
    }

    try {
      let finalRole = role;
      
      // Check if Supabase is configured (not empty and not a placeholder)
      const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_url' &&
                          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_project_url';

      if (hasSupabase) {
        const supabase = createClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
             console.error("Profile fetch error:", profileError);
          }

          if (profile) {
            finalRole = profile.role;
            login({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              department: profile.department
            });
          } else {
             // Fallback if user exists in auth but not profiles table
             login({
              id: authData.user.id,
              name: email.split('@')[0],
              email: email,
              role: role as UserRole,
              department: "General"
            });
          }
        }
      } else {
        // Fallback demo login
        await new Promise((r) => setTimeout(r, 1200));
        login({
          id: "USER-" + Math.floor(Math.random() * 10000),
          name: selectedRole?.label || "Demo User",
          email: email,
          role: role as UserRole,
          department: "General"
        });
      }

      const roleRoutes: Record<string, string> = {
        admin: "/dashboard",
        manager: "/dashboard",
        pharmacist: "/dashboard/pharmacy",
        pathologist: "/dashboard/laboratory",
        radiology_technician: "/dashboard/radiology",
        equipment_operator: "/dashboard/equipment",
        medical_assistant: "/dashboard/opd",
        ward_boy: "/dashboard/bed-management"
      };

      const targetRoute = roleRoutes[finalRole] || `/dashboard/${finalRole}`;
      router.push(targetRoute);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center gap-3 mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-nexora-600 flex items-center justify-center shadow-lg shadow-nexora-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-2xl text-foreground block tracking-tight">Nexora Hospital</span>
              <span className="text-xs text-muted-foreground font-medium">Smart Healthcare Platform</span>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to your account</h1>
            <p className="text-muted-foreground text-sm">Enter your credentials to access the platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-border rounded-xl text-sm hover:border-nexora-400 focus:outline-none focus:border-nexora-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {selectedRole && <selectedRole.icon className="w-4 h-4 text-nexora-600" />}
                    <span>{selectedRole?.label || "Select your role"}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showRoleDropdown ? "rotate-180" : ""}`} />
                </button>
                {showRoleDropdown && (
                  <div className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-gray-900 border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => { setRole(r.value); setShowRoleDropdown(false); }}
                        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-nexora-50 dark:hover:bg-nexora-900/20 transition-colors ${role === r.value ? "text-nexora-600 font-medium bg-nexora-50 dark:bg-nexora-900/20" : ""}`}
                      >
                        <r.icon className="w-4 h-4 text-muted-foreground" />
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-border rounded-xl text-sm focus:outline-none focus:border-nexora-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-900 border border-border rounded-xl text-sm focus:outline-none focus:border-nexora-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-nexora-600" defaultChecked />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-nexora-600 hover:text-nexora-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-nexora-600 hover:bg-nexora-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="text-center text-sm text-muted-foreground">
              New patient?{" "}
              <Link href="/auth/register" className="text-nexora-600 hover:text-nexora-700 font-medium">
                Create account
              </Link>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-muted rounded-xl text-xs">
            <p className="font-semibold text-foreground mb-1">Demo Credentials</p>
            <p className="text-muted-foreground">Email: admin@nexora.com | Password: admin123</p>
          </div>
        </div>

        {showRoleDropdown && (
          <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
        )}
      </div>
  );
}
