"use client";

import { useState } from "react";
import { mockPatients, mockAppointments, mockLabTests } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Stethoscope, Users, Calendar, FileText, Pill, BrainCircuit, MessageSquare, Send, Loader, ChevronRight, Star, Activity } from "lucide-react";

const aiMessages = [
  { role: "ai", content: "Hello Dr. Sharma! I've analyzed your patient cases for today. I've flagged 3 patients who may need immediate attention based on their vitals and history. Would you like a detailed review?" },
  { role: "user", content: "Yes, please show me the high-risk patients." },
  { role: "ai", content: "Based on my analysis:\n\n1. **Karim Hossain (ICU-4)** — Neurological decline detected. GCS dropped from 14 to 11 in 6 hours. Consider urgent neurology consult.\n\n2. **Delwar Hossain (CCU-2)** — Cardiac biomarkers trending upward. Troponin I: 0.8 ng/mL. Recommend repeat ECG.\n\n3. **Shirin Sultana (EM-02)** — Hemodynamic instability. BP: 88/60 mmHg. Consider vasopressor therapy." },
];

export default function DoctorPortalPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "patients" | "ai">("overview");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(aiMessages);
  const [aiLoading, setAiLoading] = useState(false);

  const myPatients = mockPatients.filter((p) => p.doctorAssigned === "Dr. Priya Sharma");
  const todayAppts = mockAppointments.filter((a) => a.doctorId === "DOC-001" && a.date === "2026-07-13");

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setMessages((prev) => [...prev, {
      role: "ai",
      content: "Based on the clinical data and current evidence-based guidelines, I recommend reviewing the patient's medication regimen. Consider dosage adjustment based on recent renal function tests. Would you like me to generate a complete treatment suggestion report?"
    }]);
    setAiLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header */}
      <div className="nexora-card p-5 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-nexora-50 dark:from-blue-900/10 dark:to-nexora-900/10">
        <div className="w-14 h-14 rounded-2xl bg-nexora-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">P</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Dr. Priya Sharma</h1>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">MBBS, MD (Cardiology) · Senior Cardiologist · 12 years experience</p>
          <p className="text-xs text-muted-foreground mt-0.5">Today: {todayAppts.length} appointments · {myPatients.length} admitted patients</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 bg-nexora-100 dark:bg-nexora-900/30 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-nexora-600 animate-pulse" />
          <span className="text-xs font-medium text-nexora-700 dark:text-nexora-400">On Duty</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Appointments", value: todayAppts.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Admitted Patients", value: myPatients.length + 12, icon: Users, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { label: "Pending Lab Reviews", value: 4, icon: FileText, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Prescriptions Today", value: 11, icon: Pill, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((s) => (
          <div key={s.label} className="nexora-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {(["overview", "patients", "ai"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === tab ? "bg-white dark:bg-gray-900 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
              tab === "ai" && "flex items-center gap-1.5")}>
            {tab === "ai" ? <><BrainCircuit className="w-3.5 h-3.5" />AI Assistant</> : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-2">
              {todayAppts.map((appt) => (
                <div key={appt.id} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                  appt.status === "in_progress" ? "border-blue-200 bg-blue-50 dark:bg-blue-900/10" : "border-border hover:bg-muted/30"
                )}>
                  <div className="text-center w-12 flex-shrink-0">
                    <p className="text-sm font-bold text-foreground">{appt.time}</p>
                    <p className="text-[10px] text-muted-foreground">AM</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{appt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{appt.tokenNumber}</p>
                  </div>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                    appt.status === "completed" ? "bg-green-100 text-green-700" :
                    appt.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                    appt.status === "waiting" ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-600")}>
                    {appt.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Admitted Patients */}
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-4">My Admitted Patients</h3>
            <div className="space-y-3">
              {[...myPatients, { id: "NXR-2026-10009", name: "Delwar Hossain", age: 71, bedAssigned: "CCU-2", priority: "urgent" as const, department: "Cardiology" }].map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-sm font-bold text-nexora-700 flex-shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.bedAssigned} · {p.age}y</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
                      p.priority === "critical" ? "bg-red-100 text-red-700" :
                      p.priority === "urgent" ? "bg-amber-100 text-amber-700" :
                      "bg-nexora-100 text-nexora-700")}>
                      {(p.priority || "stable").toUpperCase()}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Chat */}
          <div className="lg:col-span-2 nexora-card flex flex-col h-[500px]">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Nexora AI Clinical Assistant</p>
                <p className="text-[10px] text-muted-foreground">Powered by medical AI • Real-time analysis</p>
              </div>
              <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">AI Active</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                    msg.role === "ai" ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white" : "bg-nexora-600 text-white")}>
                    {msg.role === "ai" ? "AI" : "P"}
                  </div>
                  <div className={cn("max-w-[80%] p-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "ai" ? "bg-muted text-foreground rounded-tl-sm" : "bg-nexora-600 text-white rounded-tr-sm")}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">AI</div>
                  <div className="bg-muted p-3 rounded-xl rounded-tl-sm flex items-center gap-1.5">
                    <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask the AI assistant..."
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-lg focus:outline-none focus:ring-1 focus:ring-nexora-400"
              />
              <button onClick={handleSend} className="p-2.5 bg-nexora-600 hover:bg-nexora-700 text-white rounded-lg transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Tools Panel */}
          <div className="space-y-4">
            <div className="nexora-card p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-purple-600" />AI Tools</h3>
              {[
                { title: "AI Diagnosis Assistant", desc: "Symptom-to-diagnosis mapping", icon: Stethoscope, color: "text-blue-600" },
                { title: "AI Risk Prediction", desc: "30-day readmission risk", icon: Activity, color: "text-red-600" },
                { title: "AI Report Summarizer", desc: "Instant lab report summaries", icon: FileText, color: "text-amber-600" },
                { title: "AI Drug Checker", desc: "Interaction detection", icon: Pill, color: "text-nexora-600" },
              ].map((tool) => (
                <button key={tool.title} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-muted transition-colors text-left mb-1">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <tool.icon className={`w-4 h-4 ${tool.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{tool.title}</p>
                    <p className="text-[10px] text-muted-foreground">{tool.desc}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
