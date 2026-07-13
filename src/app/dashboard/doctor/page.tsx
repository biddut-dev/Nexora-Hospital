"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Stethoscope, Users, Calendar, FileText, Pill, BrainCircuit, MessageSquare, Send, Loader, ChevronRight, Star, Activity } from "lucide-react";
import { useAppStore } from "@/lib/store";

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

  const { patients, appointments } = useAppStore();

  const myPatients = patients.filter((p) => p.status === 'admitted');
  const todayAppts = appointments.filter((a) => a.doctorId === "DOC-001" || a.doctorName.includes("Priya"));

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
      <div className="nexora-card p-5 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-nexora-50 dark:from-blue-900/10 dark:to-nexora-900/10 border-border">
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
          { label: "Admitted Patients", value: myPatients.length, icon: Users, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { label: "Pending Lab Reviews", value: 4, icon: FileText, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Prescriptions Today", value: 11, icon: Pill, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((s) => (
          <div key={s.label} className="nexora-card p-4 flex items-center gap-3 border-border">
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
          <div className="nexora-card p-5 border-border">
            <h3 className="font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-2 h-[350px] overflow-y-auto pr-2 scrollbar-thin">
              {todayAppts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No appointments scheduled for today.</p>
              ) : todayAppts.map((appt) => (
                <div key={appt.id} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                  appt.status === "in_progress" ? "border-blue-200 bg-blue-50 dark:bg-blue-900/10" : "border-border hover:bg-muted/30"
                )}>
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center font-bold text-xs">{appt.tokenNumber?.replace("T-", "")}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{appt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{appt.time} · {appt.priority}</p>
                  </div>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                    appt.status === "completed" ? "bg-green-100 text-green-700" :
                    appt.status === "in_progress" ? "bg-blue-100 text-blue-700 animate-pulse" :
                    "bg-amber-100 text-amber-700")}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Clinical Insights */}
          <div className="nexora-card p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-800 flex flex-col h-[410px]">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-purple-600 animate-pulse" />
              <h3 className="font-semibold text-purple-950 dark:text-purple-300">AI Clinical Copilot</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin text-xs text-muted-foreground">
              <p>Active cases analysis complete. 3 alerts generated.</p>
              <div className="p-3 bg-white dark:bg-gray-900 border border-purple-100 rounded-xl space-y-2">
                <p className="font-bold text-purple-950 dark:text-purple-300">Case Review Flagged: Karim Hossain</p>
                <p>GCS has dropped to 11. Suggest ordering serum electrolytes, ammonia levels, and scheduling urgent CT Brain.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "patients" && (
        <div className="nexora-card border-border">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold">My Admitted Patients</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Age/Sex", "Bed", "Status", "Priority", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myPatients.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{p.age}y / {p.gender.charAt(0).toUpperCase()}</td>
                    <td className="py-3 px-4 text-xs font-mono">{p.bedAssigned || "TBD"}</td>
                    <td className="py-3 px-4 text-xs capitalize text-muted-foreground">{p.status}</td>
                    <td className="py-3 px-4">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                        p.priority === "critical" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      )}>{p.priority}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-xs text-nexora-600 font-semibold flex items-center gap-0.5">
                        Clinical File <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="nexora-card border-border flex flex-col h-[500px]">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">AI Clinical Assistant Consultation</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex max-w-[80%] flex-col rounded-2xl p-3 text-xs leading-relaxed",
                msg.role === "user" 
                  ? "bg-nexora-600 text-white ml-auto rounded-tr-none" 
                  : "bg-muted text-foreground rounded-tl-none"
              )}>
                {msg.content.split('\n').map((line, idx) => <p key={idx} className="mb-1 last:mb-0">{line}</p>)}
              </div>
            ))}
            {aiLoading && (
              <div className="bg-muted text-foreground rounded-2xl rounded-tl-none p-3 w-fit text-xs flex items-center gap-2">
                <Loader className="w-3.5 h-3.5 animate-spin" /> Thinking...
              </div>
            )}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about diagnosis, treatment or drug interactions..." 
              className="flex-1 px-3 py-2 bg-muted rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" 
            />
            <button onClick={handleSend} className="p-2 bg-nexora-600 hover:bg-nexora-700 text-white rounded-xl transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
