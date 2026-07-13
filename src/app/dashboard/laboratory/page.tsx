"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FlaskConical, AlertTriangle, CheckCircle, Clock, Microscope, BrainCircuit, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

export default function LaboratoryPage() {
  const { labTests, patients, doctors, addLabTest } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: "",
    testName: "Complete Blood Count (CBC)",
    requestedBy: "",
    result: "",
    isAbnormal: "false"
  });

  const handleRequestTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.requestedBy) return;

    const selectedPatient = patients.find(p => p.id === formData.patientId);
    const selectedDoctor = doctors.find(d => d.id === formData.requestedBy);

    addLabTest({
      patientId: formData.patientId,
      patientName: selectedPatient ? selectedPatient.name : "Patient",
      testName: formData.testName,
      requestedBy: selectedDoctor ? selectedDoctor.name : "Doctor",
      result: formData.result || undefined,
      isAbnormal: formData.isAbnormal === "true",
      reportDate: formData.result ? new Date().toISOString().split('T')[0] : undefined
    });

    setIsOpen(false);
    setFormData({
      patientId: "",
      testName: "Complete Blood Count (CBC)",
      requestedBy: "",
      result: "",
      isAbnormal: "false"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laboratory</h1>
          <p className="text-muted-foreground text-sm mt-1">Diagnostic lab — Test management, sample tracking & AI analysis</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Test Request
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Pending Tests", value: labTests.filter((t) => t.status === "pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { title: "Processing", value: labTests.filter((t) => t.status === "processing").length, icon: Microscope, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Completed Today", value: labTests.filter((t) => t.status === "completed" || t.status === "approved").length, icon: CheckCircle, color: "text-nexora-600", bg: "bg-nexora-50 dark:bg-nexora-900/20" },
          { title: "Abnormal Results", value: labTests.filter((t) => t.isAbnormal).length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
        ].map((s) => (
          <div key={s.title} className="nexora-card p-4 flex items-center gap-3 border-border">
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

      {/* AI Analysis Panel */}
      <div className="nexora-card p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold">AI Report Analysis</h3>
          <span className="ml-auto text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">AI Active</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">🔴 Abnormal Value Detected</p>
            <p className="text-xs text-muted-foreground">Patient Karim Hossain: MRI Brain shows hyperintense lesion in left temporal lobe. Neurology review recommended immediately.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-2">📋 AI Report Summary</p>
            <p className="text-xs text-muted-foreground">CBC for Rahman Ali: All parameters within normal range. WBC slightly elevated at 6.2 K/μL — likely due to minor inflammation. No immediate concern.</p>
          </div>
        </div>
      </div>

      {/* Test Table */}
      <div className="nexora-card overflow-hidden border-border">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">All Test Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Test ID", "Patient", "Test Name", "Requested By", "Date", "Status", "Result"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labTests.map((test) => (
                <tr key={test.id} className={cn(
                  "border-b border-border/50 hover:bg-muted/30",
                  test.isAbnormal && "bg-red-50/30 dark:bg-red-900/5"
                )}>
                  <td className="py-3 px-4 font-mono text-xs text-nexora-600">{test.id}</td>
                  <td className="py-3 px-4 font-medium text-sm">{test.patientName}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      {test.testName}
                      {test.isAbnormal && <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{test.requestedBy}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{test.requestDate}</td>
                  <td className="py-3 px-4">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                      test.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      test.status === "completed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      test.status === "processing" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                      test.status === "sample_collected" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400")}>
                      {test.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground max-w-[200px] truncate">{test.result || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Test Request Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Diagnostics Test Request">
        <form onSubmit={handleRequestTest} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Select Patient</label>
            <select required value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
              <option value="">-- Choose Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Test Type</label>
              <select value={formData.testName} onChange={e => setFormData({...formData, testName: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
                <option>Complete Blood Count (CBC)</option>
                <option>MRI Brain</option>
                <option>ECG / Electrocardiogram</option>
                <option>Skin Biopsy</option>
                <option>Ultrasound (Abdomen-Pelvis)</option>
                <option>Lipid Profile</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Requested By (Doctor)</label>
              <select required value={formData.requestedBy} onChange={e => setFormData({...formData, requestedBy: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
                <option value="">-- Choose Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Result Findings (Optional)</label>
              <input placeholder="e.g., Hb: 14.2 g/dL" value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Is Result Abnormal?</label>
              <select value={formData.isAbnormal} onChange={e => setFormData({...formData, isAbnormal: e.target.value})} className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nexora-400 border border-border">
                <option value="false">No (Normal)</option>
                <option value="true">Yes (Abnormal)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-nexora-600 hover:bg-nexora-700 text-white text-sm font-medium rounded-lg transition-colors">
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
