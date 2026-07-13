"use client";
import { cn } from "@/lib/utils";
import { RadioTower, Camera, Scan, Activity, BrainCircuit, CheckCircle, Clock } from "lucide-react";

const radiologyTests = [
  { id: "RAD-001", patient: "Karim Hossain", type: "MRI Brain", modality: "MRI", requestedBy: "Dr. Ahmed Reza", status: "completed", aiFlag: true, date: "2026-07-10" },
  { id: "RAD-002", patient: "Mosaddek Ahmed", type: "X-Ray Knee (R)", modality: "X-Ray", requestedBy: "Dr. Rafiq Uddin", status: "completed", aiFlag: false, date: "2026-07-12" },
  { id: "RAD-003", patient: "Delwar Hossain", type: "CT Chest", modality: "CT", requestedBy: "Dr. Priya Sharma", status: "processing", aiFlag: false, date: "2026-07-13" },
  { id: "RAD-004", patient: "Fatima Begum", type: "Ultrasound Abdomen-Pelvis", modality: "Ultrasound", requestedBy: "Dr. Nadia Islam", status: "pending", aiFlag: false, date: "2026-07-13" },
  { id: "RAD-005", patient: "Nasrin Akter", type: "ECG", modality: "ECG", requestedBy: "Dr. Sumaiya Khan", status: "completed", aiFlag: false, date: "2026-07-11" },
];

const modalityIcons: Record<string, React.ElementType> = {
  MRI: Scan,
  "X-Ray": Camera,
  CT: RadioTower,
  Ultrasound: Activity,
  ECG: Activity,
};

export default function RadiologyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Radiology</h1>
          <p className="text-muted-foreground text-sm mt-1">X-Ray, CT, MRI, Ultrasound, ECG — AI-powered image analysis</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors">
          <RadioTower className="w-4 h-4" />
          New Scan Request
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {["X-Ray", "CT Scan", "MRI", "Ultrasound", "ECG"].map((m, i) => (
          <div key={m} className="nexora-card p-4 text-center">
            <div className="w-10 h-10 bg-nexora-50 dark:bg-nexora-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <RadioTower className="w-5 h-5 text-nexora-600" />
            </div>
            <p className="font-bold text-lg">{[12, 5, 3, 8, 9][i]}</p>
            <p className="text-xs text-muted-foreground">{m}</p>
            <p className="text-[10px] text-muted-foreground">Today</p>
          </div>
        ))}
      </div>

      {/* AI Panel */}
      <div className="nexora-card p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">AI Radiology Analysis</h3>
          <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">AI Active</span>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">🔴 AI Abnormality Detected — MRI Brain (Karim Hossain)</p>
          <p className="text-xs text-muted-foreground">
            AI analysis detected a hyperintense lesion in the left temporal lobe (T2/FLAIR sequence, ~2.3cm). Differential: Acute ischemic infarct vs. low-grade glioma. 
            Confidence: 91%. Radiologist review recommended.
          </p>
        </div>
      </div>

      <div className="nexora-card overflow-hidden">
        <div className="p-5 border-b border-border"><h3 className="font-semibold">Radiology Requests</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["ID", "Patient", "Study Type", "Modality", "Requested By", "Date", "Status", "AI"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {radiologyTests.map((t) => {
                const Icon = modalityIcons[t.modality] || RadioTower;
                return (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 font-mono text-xs text-nexora-600">{t.id}</td>
                    <td className="py-3 px-4 font-medium">{t.patient}</td>
                    <td className="py-3 px-4 text-sm">{t.type}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-nexora-500" /><span className="text-xs">{t.modality}</span></div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{t.requestedBy}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{t.date}</td>
                    <td className="py-3 px-4">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
                        t.status === "completed" ? "bg-green-100 text-green-700" :
                        t.status === "processing" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700")}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {t.aiFlag ? <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Flagged</span> : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
