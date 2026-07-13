"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Heart,
  Brain,
  Shield,
  Clock,
  ChevronRight,
  Phone,
  MapPin,
  Mail,
  Star,
  Users,
  Stethoscope,
  Bed,
  AlertTriangle,
  BrainCircuit,
  Calendar,
  FileText,
  Ambulance,
  FlaskConical,
  PillIcon,
  RadioTower,
  Moon,
  Sun,
  ArrowRight,
  Zap,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "next-themes";

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCounter({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const count = useCounter(value);
  return (
    <div className="text-center p-6">
      <p className="text-4xl font-bold text-nexora-600 dark:text-nexora-400">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-muted-foreground mt-1 text-sm font-medium">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  const services = [
    { icon: Users, title: "OPD Services", desc: "World-class outpatient care with AI-assisted diagnostics and rapid queue management.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: Bed, title: "IPD Services", desc: "Comfortable inpatient wards with 24/7 nursing care and digital monitoring.", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { icon: AlertTriangle, title: "Emergency Care", desc: "Round-the-clock emergency services with advanced trauma care and rapid response teams.", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { icon: PillIcon, title: "Pharmacy", desc: "Comprehensive in-house pharmacy with AI drug interaction detection.", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { icon: FlaskConical, title: "Laboratory", desc: "State-of-the-art diagnostic lab with same-day results and digital report delivery.", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { icon: RadioTower, title: "Radiology", desc: "Advanced imaging with AI-powered analysis for X-Ray, CT, MRI, and Ultrasound.", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  ];

  const features = [
    { icon: BrainCircuit, title: "AI Symptom Checker", desc: "Describe your symptoms and get AI-powered preliminary insights before your consultation." },
    { icon: Calendar, title: "Online Appointments", desc: "Book appointments with any specialist 24/7 from anywhere in the world." },
    { icon: Bed, title: "Bed Booking", desc: "Check real-time bed availability and pre-book your admission with ease." },
    { icon: FileText, title: "Digital Medical Records", desc: "Access your complete medical history, prescriptions and lab reports anytime." },
    { icon: Heart, title: "AI Health Monitoring", desc: "Continuous AI-driven monitoring of vitals with predictive health alerts." },
    { icon: Ambulance, title: "Ambulance Tracking", desc: "Request and track ambulances in real-time for emergency situations." },
  ];

  const testimonials = [
    { name: "Dr. Priya Sharma", role: "Senior Cardiologist", text: "Nexora's AI-assisted diagnosis tools have transformed how I review patient cases. The system is intuitive and saves me hours every day.", rating: 5 },
    { name: "Rahima Begum", role: "Patient", text: "The patient portal is incredible. I can check my lab results, refill prescriptions and book follow-ups without leaving home.", rating: 5 },
    { name: "Tanvir Ahmed", role: "Hospital Administrator", text: "Command center dashboards give us real-time visibility across all departments. It's revolutionized our operations management.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-nexora-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-foreground">Nexora</span>
                <span className="text-nexora-600 font-bold"> Hospital</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              {["Services", "About", "Departments", "Doctors", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-muted-foreground hover:text-nexora-600 transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4" />
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 min-h-screen flex items-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-nexora-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-nexora-950/30" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-nexora-200/30 dark:bg-nexora-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-200/30 dark:bg-blue-800/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-nexora-100 dark:bg-nexora-900/40 rounded-full mb-6">
                <Zap className="w-4 h-4 text-nexora-600" />
                <span className="text-sm font-medium text-nexora-700 dark:text-nexora-400">AI-Powered Healthcare Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Smart Healthcare,{" "}
                <span className="text-nexora-600 bg-gradient-to-r from-nexora-600 to-nexora-400 bg-clip-text text-transparent">
                  Powered by Intelligence
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Nexora Hospital combines cutting-edge AI with compassionate care to deliver world-class healthcare services. Experience the future of medicine today.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-6 py-3 bg-nexora-600 hover:bg-nexora-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-nexora-500/25"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+8801911999000"
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-red-500/25"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Emergency Services
                </a>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-nexora-600 text-nexora-600 hover:bg-nexora-50 dark:hover:bg-nexora-900/20 font-semibold rounded-xl transition-all"
                >
                  <Users className="w-4 h-4" />
                  Patient Portal
                </Link>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-foreground hover:bg-muted font-semibold rounded-xl transition-all"
                >
                  <Stethoscope className="w-4 h-4" />
                  Doctor Portal
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                {[
                  { icon: Award, text: "ISO 9001 Certified" },
                  { icon: Shield, text: "HIPAA Compliant" },
                  { icon: Globe, text: "WHO Accredited" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-nexora-600" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hospital Illustration (SVG) */}
            <div className="relative animate-fade-in hidden lg:block">
              <div className="relative bg-gradient-to-br from-nexora-600 to-nexora-800 rounded-3xl p-8 shadow-2xl shadow-nexora-500/20">
                {/* SVG Hospital Illustration */}
                <svg viewBox="0 0 400 320" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Hospital building */}
                  <rect x="80" y="80" width="240" height="200" rx="8" fill="white" fillOpacity="0.15" />
                  <rect x="100" y="60" width="200" height="40" rx="6" fill="white" fillOpacity="0.2" />
                  {/* Cross symbol */}
                  <rect x="185" y="72" width="30" height="8" rx="4" fill="#4ade80" />
                  <rect x="196" y="63" width="8" height="26" rx="4" fill="#4ade80" />
                  {/* Windows */}
                  {[120, 160, 200, 240, 280].map((x, i) => (
                    <rect key={i} x={x} y="110" width="24" height="24" rx="4" fill="white" fillOpacity="0.3" />
                  ))}
                  {[120, 160, 200, 240, 280].map((x, i) => (
                    <rect key={i + 5} x={x} y="155" width="24" height="24" rx="4" fill="white" fillOpacity="0.25" />
                  ))}
                  {/* Door */}
                  <rect x="175" y="230" width="50" height="50" rx="4" fill="white" fillOpacity="0.2" />
                  {/* Ambulance */}
                  <rect x="30" y="240" width="60" height="35" rx="6" fill="#ef4444" fillOpacity="0.8" />
                  <rect x="70" y="235" width="25" height="20" rx="4" fill="#ef4444" fillOpacity="0.6" />
                  <circle cx="45" cy="278" r="8" fill="white" fillOpacity="0.5" />
                  <circle cx="75" cy="278" r="8" fill="white" fillOpacity="0.5" />
                  {/* ECG line */}
                  <polyline points="30,195 60,195 75,165 90,220 105,175 120,195 400,195" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                  {/* Staff figure */}
                  <circle cx="340" cy="200" r="12" fill="white" fillOpacity="0.4" />
                  <rect x="330" y="215" width="20" height="35" rx="4" fill="white" fillOpacity="0.3" />
                  {/* Heart rate monitor */}
                  <rect x="300" y="120" width="60" height="40" rx="6" fill="white" fillOpacity="0.2" />
                  <polyline points="307,142 315,142 320,132 325,150 330,135 335,142 355,142" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* AI brain icon */}
                  <circle cx="60" cy="140" r="25" fill="white" fillOpacity="0.15" />
                  <text x="52" y="147" fontSize="18" fill="white" fillOpacity="0.8">🧠</text>
                </svg>

                {/* Floating cards */}
                <div className="absolute -left-6 top-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">98 BPM</p>
                      <p className="text-[10px] text-muted-foreground">Heart Rate</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-6 bottom-12 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">SpO₂ 99%</p>
                      <p className="text-[10px] text-muted-foreground">Oxygen Level</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 right-16 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BrainCircuit className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">AI Active</p>
                      <p className="text-[10px] text-muted-foreground">Monitoring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-border">
            <StatCounter value={12847} label="Total Patients" suffix="+" />
            <StatCounter value={68} label="Expert Doctors" />
            <StatCounter value={24} label="Departments" />
            <StatCounter value={350} label="Total Beds" />
            <StatCounter value={34} label="Emergency Today" />
            <StatCounter value={98} label="Satisfaction %" suffix="%" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-white to-nexora-50/30 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-nexora-100 dark:bg-nexora-900/40 rounded-full mb-4">
              <BrainCircuit className="w-4 h-4 text-nexora-600" />
              <span className="text-sm font-medium text-nexora-700 dark:text-nexora-400">AI-Powered Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Healthcare Reimagined with AI
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our intelligent platform combines medical expertise with artificial intelligence to provide unprecedented care quality.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-border hover:border-nexora-300 dark:hover:border-nexora-700 shadow-sm hover:shadow-nexora transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-nexora-100 dark:bg-nexora-900/40 rounded-xl flex items-center justify-center mb-4 group-hover:bg-nexora-600 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-nexora-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-nexora-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Core Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive medical services delivered with cutting-edge technology and expert medical professionals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${service.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  <button className="mt-3 text-sm text-nexora-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-nexora-50/50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">What They Say</h2>
            <p className="text-muted-foreground">Trusted by patients and healthcare professionals worldwide.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-nexora-600 to-nexora-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Experience Smart Healthcare?
          </h2>
          <p className="text-nexora-200 mb-8 text-lg">
            Join thousands of patients and healthcare professionals on the Nexora platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/login"
              className="px-8 py-3.5 bg-white text-nexora-700 font-semibold rounded-xl hover:bg-nexora-50 transition-colors shadow-lg"
            >
              Get Started Today
            </Link>
            <a
              href="tel:+8801911999000"
              className="px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              <Phone className="inline w-4 h-4 mr-2" />
              Call Emergency: 10911
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-nexora-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Nexora Hospital</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">Smart Healthcare, Powered by Intelligence. Your trusted partner in comprehensive medical care.</p>
              <div className="flex gap-3">
                {["facebook", "twitter", "linkedin", "youtube"].map((s) => (
                  <a key={s} href="#" className="w-8 h-8 bg-gray-800 hover:bg-nexora-600 rounded-lg flex items-center justify-center transition-colors text-xs font-bold text-gray-300">
                    {s[0].toUpperCase()}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {["About Us", "Our Doctors", "Departments", "Patient Portal", "Careers", "News & Events"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-nexora-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                {["OPD Services", "IPD & Admission", "Emergency Care", "Pharmacy", "Laboratory", "Radiology"].map((s) => (
                  <li key={s}>
                    <a href="#" className="hover:text-nexora-400 transition-colors">{s}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-nexora-500 mt-0.5 flex-shrink-0" />
                  <span>123 Medical Center Road, Dhaka-1230, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-nexora-500 flex-shrink-0" />
                  <span>+880 1911-999000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-nexora-500 flex-shrink-0" />
                  <span>info@nexorahospital.com</span>
                </div>
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg">
                  <p className="text-red-400 font-semibold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Emergency Hotline
                  </p>
                  <p className="text-white font-bold text-lg mt-1">10911</p>
                  <p className="text-red-400 text-[10px]">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 Nexora Hospital. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-nexora-400">Privacy Policy</a>
              <a href="#" className="hover:text-nexora-400">Terms of Service</a>
              <a href="#" className="hover:text-nexora-400">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
