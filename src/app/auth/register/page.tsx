"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { createClient } from "@/lib/supabase/client";
import { BloodGroup } from "@/types";
import {
  Activity,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("A+");
  const [address, setAddress] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !email || !password || !confirmPassword || !phone || !address || !dob) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Check if Supabase is configured
      const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_url' &&
                          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_project_url';

      if (hasSupabase) {
        const supabase = createClient();
        
        // 1. Sign up user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // 2. Insert profile record (using same auth UUID)
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: authData.user.id,
              name: name,
              email: email,
              role: 'patient',
              phone: phone
            }]);

          if (profileError) {
            console.error("Profile creation error:", profileError);
          }

          // 3. Insert patient record (using same auth UUID to link them)
          const age = new Date().getFullYear() - new Date(dob).getFullYear() || 30;
          const { error: patientError } = await supabase
            .from('patients')
            .insert([{
              id: authData.user.id,
              name: name,
              age: age,
              gender: gender.toLowerCase(),
              blood_group: bloodGroup,
              phone: phone,
              email: email,
              address: address,
              emergency_contact: phone, // fallback
              patient_type: 'opd',
              priority: 'stable',
              status: 'waiting',
              department: 'General Medicine'
            }]);

          if (patientError) {
             throw patientError;
          }

          login({
            id: authData.user.id,
            name: name,
            email: email,
            role: 'patient'
          });
        }
      } else {
        // Fallback demo register
        await new Promise((r) => setTimeout(r, 1200));
        login({
          id: "PAT-" + Math.floor(Math.random() * 10000),
          name: name,
          email: email,
          role: 'patient'
        });
      }

      router.push("/dashboard/patient");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4 py-12">
      <div className="w-full max-w-lg">
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

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Patient Account</h1>
          <p className="text-muted-foreground text-sm">Register to access portals, appointments, and medical history</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 bg-white dark:bg-gray-900 border border-border p-6 rounded-2xl shadow-sm">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01711-xxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
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

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gender */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hidden md:block" />
                <input
                  required
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full md:pl-10 pr-3 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Address */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Contact Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your street address, city, country"
                rows={2}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border"
              />
            </div>
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-nexora-600 hover:bg-nexora-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>

          <div className="text-center text-sm text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-nexora-600 hover:text-nexora-700 font-medium">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
