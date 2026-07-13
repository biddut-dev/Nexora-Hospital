"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BrainCircuit, Stethoscope, MessageSquare, Activity, AlertTriangle, Zap, Send, Loader, ChevronRight, Heart, Shield, Search } from "lucide-react";

const symptoms = ["Headache", "Fever", "Chest Pain", "Shortness of Breath", "Nausea", "Fatigue", "Dizziness", "Back Pain", "Cough", "Abdominal Pain"];

const aiChatMessages = [
  { role: "ai", content: "Hello! I'm Nexora AI Health Assistant. I can help you with symptom analysis, health queries, medication information, and clinical insights. How can I assist you today?" },
];

export default function AICenterPage() {
  const [activeModule, setActiveModule] = useState<"chatbot" | "symptom" | "risk" | "bed">("chatbot");
  const [chatMessages, setChatMessages] = useState(aiChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomResult, setSymptomResult] = useState<null | { conditions: string[]; recommendation: string }>(null);
  const [symptomLoading, setSymptomLoading] = useState(false);

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setChatMessages((prev) => [...prev, {
      role: "ai",
      content: "Based on your query, I've analyzed the relevant clinical data. " +
        "The symptoms you've described may indicate several conditions. " +
        "For accurate diagnosis, I recommend consulting with a specialist. " +
        "Would you like me to help you book an appointment with the relevant department?"
    }]);
    setAiLoading(false);
  };

  const handleSymptomCheck = async () => {
    if (selectedSymptoms.length === 0) return;
    setSymptomLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSymptomResult({
      conditions: selectedSymptoms.includes("Chest Pain") && selectedSymptoms.includes("Shortness of Breath")
        ? ["Angina Pectoris (High probability)", "Pulmonary Embolism (Moderate)", "Anxiety Disorder (Low)"]
        : selectedSymptoms.includes("Fever") && selectedSymptoms.includes("Headache")
        ? ["Viral Fever (High probability)", "Meningitis (Low — monitor)", "COVID-19 (Moderate)"]
        : ["Tension Headache (High)", "Migraine (Moderate)", "Hypertension (Low — check BP)"],
      recommendation: "⚠ Please consult a doctor within 24 hours. AI analysis is preliminary and not a substitute for professional medical advice.",
    });
    setSymptomLoading(false);
  };

  const modules = [
    { id: "chatbot", label: "AI Medical Chatbot", icon: MessageSquare, desc: "Chat with AI for health guidance", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "symptom", label: "AI Symptom Checker", icon: Stethoscope, desc: "Analyze symptoms intelligently", color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
    { id: "risk", label: "AI Risk Assessment", icon: Shield, desc: "Patient health risk prediction", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
    { id: "bed", label: "AI Bed Predictor", icon: Activity, desc: "Forecast bed demand", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold">AI Healthcare Center</h1>
          </div>
          <p className="text-muted-foreground text-sm">Nexora AI Suite — Powered by medical intelligence & predictive analytics</p>
        </div>
        <span className="text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          AI Active
        </span>
      </div>

      {/* Module Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id as any)}
            className={cn(
              "nexora-card p-4 text-left transition-all hover:shadow-md",
              activeModule === mod.id && "ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-950"
            )}
          >
            <div className={`w-10 h-10 ${mod.bg} rounded-xl flex items-center justify-center mb-3`}>
              <mod.icon className={`w-5 h-5 ${mod.color}`} />
            </div>
            <p className="font-semibold text-sm text-foreground">{mod.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{mod.desc}</p>
          </button>
        ))}
      </div>

      {/* AI Chatbot */}
      {activeModule === "chatbot" && (
        <div className="nexora-card flex flex-col h-[500px]">
          <div className="p-4 border-b border-border flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">Nexora AI Health Assistant</p>
              <p className="text-[10px] text-muted-foreground">Medical AI • Real-time analysis • Evidence-based</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexora-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-nexora-600" />
              </span>
              <span className="text-xs text-nexora-600 font-medium">Online</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                  msg.role === "ai" ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white" : "bg-nexora-600 text-white")}>
                  {msg.role === "ai" ? <BrainCircuit className="w-4 h-4" /> : "U"}
                </div>
                <div className={cn("max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "ai" ? "bg-muted text-foreground rounded-tl-sm" : "bg-nexora-600 text-white rounded-tr-sm")}>
                  {msg.content}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Analyzing with AI...</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex gap-2 mb-2 flex-wrap">
              {["What are the symptoms of diabetes?", "Drug interaction check", "Recommend a specialist"].map((s) => (
                <button key={s} onClick={() => setChatInput(s)} className="text-[11px] px-2.5 py-1 bg-muted hover:bg-nexora-100 dark:hover:bg-nexora-900/20 rounded-lg text-muted-foreground hover:text-nexora-700 transition-colors">
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Ask anything about health, symptoms, medications..."
                className="flex-1 px-4 py-2.5 text-sm bg-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-nexora-400"
              />
              <button onClick={handleChat} className="p-2.5 bg-nexora-600 hover:bg-nexora-700 text-white rounded-xl transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Symptom Checker */}
      {activeModule === "symptom" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Stethoscope className="w-4 h-4 text-nexora-600" />Select Your Symptoms</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {symptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all",
                    selectedSymptoms.includes(s)
                      ? "border-nexora-500 bg-nexora-100 text-nexora-700 dark:bg-nexora-900/40 dark:text-nexora-400"
                      : "border-border bg-white dark:bg-gray-900 text-muted-foreground hover:border-nexora-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Additional details (optional):</p>
              <textarea
                className="w-full px-3 py-2 text-sm bg-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-nexora-400 resize-none"
                rows={3}
                placeholder="Describe how long you've had these symptoms, severity, etc..."
              />
            </div>
            <button
              onClick={handleSymptomCheck}
              disabled={selectedSymptoms.length === 0 || symptomLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-nexora-600 hover:bg-nexora-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {symptomLoading ? <Loader className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
              {symptomLoading ? "AI Analyzing..." : "Analyze Symptoms"}
            </button>
          </div>

          <div className="nexora-card p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-nexora-600" />AI Analysis Result</h3>
            {symptomResult ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Possible Conditions:</p>
                  {symptomResult.conditions.map((c, i) => (
                    <div key={i} className={cn(
                      "flex items-center gap-3 p-3 rounded-xl mb-2 border",
                      i === 0 ? "border-red-200 bg-red-50 dark:bg-red-900/10" :
                      i === 1 ? "border-amber-200 bg-amber-50 dark:bg-amber-900/10" :
                      "border-border bg-muted/30"
                    )}>
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                        i === 0 ? "bg-red-500" : i === 1 ? "bg-amber-500" : "bg-gray-400")} />
                      <p className="text-sm font-medium">{c}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">{symptomResult.recommendation}</p>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  Book Specialist Appointment
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <BrainCircuit className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Select symptoms and click Analyze to get AI-powered insights</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Risk Assessment */}
      {activeModule === "risk" && (
        <div className="nexora-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-red-600" />Patient Risk Assessment</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { patient: "Karim Hossain", risk: 94, category: "Critical", factors: ["Neurological deterioration", "Age > 65", "Multiple comorbidities"] },
              { patient: "Delwar Hossain", risk: 78, category: "High", factors: ["Cardiac enzymes elevated", "Hypertension", "Diabetes"] },
              { patient: "Fatima Begum", risk: 45, category: "Moderate", factors: ["Pregnancy complications", "Iron deficiency"] },
              { patient: "Mosaddek Ahmed", risk: 32, category: "Low", factors: ["Orthopedic — stable post-op"] },
            ].map((p) => (
              <div key={p.patient} className={cn("nexora-card p-4 border-2",
                p.risk >= 80 ? "border-red-300 dark:border-red-700" :
                p.risk >= 60 ? "border-amber-300 dark:border-amber-700" :
                p.risk >= 40 ? "border-blue-300 dark:border-blue-700" :
                "border-nexora-300 dark:border-nexora-700")}>
                <p className="font-semibold text-sm mb-2">{p.patient}</p>
                <div className="flex items-end gap-2 mb-3">
                  <p className={cn("text-4xl font-bold",
                    p.risk >= 80 ? "text-red-600" : p.risk >= 60 ? "text-amber-600" : p.risk >= 40 ? "text-blue-600" : "text-nexora-600")}>
                    {p.risk}%
                  </p>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full mb-1",
                    p.risk >= 80 ? "bg-red-100 text-red-700" : p.risk >= 60 ? "bg-amber-100 text-amber-700" :
                    p.risk >= 40 ? "bg-blue-100 text-blue-700" : "bg-nexora-100 text-nexora-700")}>
                    {p.category}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className={cn("h-full rounded-full", p.risk >= 80 ? "bg-red-500" : p.risk >= 60 ? "bg-amber-500" : p.risk >= 40 ? "bg-blue-500" : "bg-nexora-500")}
                    style={{ width: `${p.risk}%` }}
                  />
                </div>
                <ul className="space-y-1">
                  {p.factors.map((f) => (
                    <li key={f} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Bed Predictor */}
      {activeModule === "bed" && (
        <div className="nexora-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-amber-600" />AI Bed Demand Forecast</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { ward: "General Ward", current: 78, predicted: 92, label: "Tonight 10PM" },
              { ward: "ICU", current: 89, predicted: 94, label: "Next 6 Hours" },
              { ward: "Emergency", current: 65, predicted: 88, label: "Peak Hour 3PM" },
            ].map((p) => (
              <div key={p.ward} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">{p.ward}</p>
                <div className="flex items-end gap-3 mb-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Now</p>
                    <p className="text-2xl font-bold text-foreground">{p.current}%</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-500 mb-1" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">{p.label}</p>
                    <p className="text-2xl font-bold text-amber-600">{p.predicted}%</p>
                  </div>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  {p.predicted >= 90 ? "⚠ Prepare overflow plan" : "↑ Increasing demand"}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">AI Recommendations</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-blue-500" />Activate 5 overflow beds in Ward 3 by 6PM</li>
              <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-blue-500" />Schedule 2 additional night nurses for ICU</li>
              <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-blue-500" />Process pending discharges to free 8 beds</li>
              <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-blue-500" />Alert Emergency team — high influx predicted after 3PM</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
