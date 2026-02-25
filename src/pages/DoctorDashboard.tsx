import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Stethoscope, Calendar, Users, CheckCircle, Clock, XCircle,
  LogOut, Home, User, BarChart3, Loader2, Menu, X, QrCode, Eye, Save
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

interface DoctorProfile {
  id: string;
  user_id: string;
  full_name: string;
  specialty: string;
  department: string | null;
  avatar_url: string | null;
}

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string | null;
  notes: string | null;
  created_at: string;
}

interface ScannedPatient {
  id: string;
  full_name: string;
  age: number | null;
  blood_type: string | null;
  chronic_diseases: string | null;
  current_medications: string | null;
  phone: string | null;
}

type Tab = "overview" | "appointments" | "scanner" | "profile";

// Mock appointments for demo
const mockAppointments: Appointment[] = [
  {
    id: "mock-1",
    patient_name: "Ahmed Hassan",
    patient_email: "ahmed@example.com",
    patient_phone: "01012345678",
    appointment_date: new Date().toISOString().split("T")[0],
    appointment_time: "09:00 AM",
    status: "confirmed",
    reason: "Follow-up visit",
    notes: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    patient_name: "Sara Mohamed",
    patient_email: "sara@example.com",
    patient_phone: "01098765432",
    appointment_date: new Date().toISOString().split("T")[0],
    appointment_time: "10:30 AM",
    status: "pending",
    reason: "Initial consultation",
    notes: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-3",
    patient_name: "Omar Ali",
    patient_email: null,
    patient_phone: "01155556666",
    appointment_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    appointment_time: "02:00 PM",
    status: "pending",
    reason: "Chest pain",
    notes: null,
    created_at: new Date().toISOString(),
  },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Scanner state
  const [scannedPatient, setScannedPatient] = useState<ScannedPatient | null>(null);
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [prescribedMeds, setPrescribedMeds] = useState("");
  const [savingRecord, setSavingRecord] = useState(false);
  const [qrInput, setQrInput] = useState("");

  const fetchAppointments = useCallback(async (doctorId: string) => {
    const { data } = await db
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("appointment_date", { ascending: true });
    // Merge real + mock data
    const realData = data || [];
    setAppointments([...realData, ...mockAppointments]);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/doctor-auth"); return; }

      const { data: roles } = await db.from("user_roles").select("role").eq("user_id", session.user.id);
      if (!roles?.some((r: any) => r.role === "doctor")) {
        toast({ title: "Access Denied", variant: "destructive" });
        navigate("/doctor-auth");
        return;
      }

      const { data: prof } = await db.from("doctor_profiles").select("*").eq("user_id", session.user.id).maybeSingle();
      if (!prof) {
        toast({ title: "Doctor profile not found", variant: "destructive" });
        navigate("/doctor-auth");
        return;
      }

      setProfile(prof);
      await fetchAppointments(prof.id);
      setLoading(false);
    };
    init();
  }, [navigate, fetchAppointments]);

  // Realtime subscription
  useEffect(() => {
    if (!profile) return;
    const channel = supabase
      .channel("doctor-appointments")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments", filter: `doctor_id=eq.${profile.id}` }, () => {
        fetchAppointments(profile.id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile, fetchAppointments]);

  const updateStatus = async (id: string, status: string) => {
    if (id.startsWith("mock-")) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast({ title: `Appointment ${status}` });
      return;
    }
    setUpdatingId(id);
    const { error } = await db.from("appointments").update({ status }).eq("id", id);
    if (error) toast({ title: "Error updating", variant: "destructive" });
    else {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast({ title: `Appointment ${status}` });
    }
    setUpdatingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/doctor-auth");
  };

  // QR Scanner - scan by token input (camera-based scanning needs html5-qrcode which we avoid)
  const handleScanByToken = async () => {
    if (!qrInput.trim()) return;
    
    // Try to parse as JSON (direct QR payload)
    try {
      const parsed = JSON.parse(qrInput);
      if (parsed.token) {
        await lookupByToken(parsed.token);
        return;
      }
    } catch { /* not JSON, try as URL or token */ }

    // Try extracting token from URL
    const urlMatch = qrInput.match(/token=([a-f0-9]+)/);
    if (urlMatch) {
      await lookupByToken(urlMatch[1]);
      return;
    }

    // Try as raw token
    await lookupByToken(qrInput.trim());
  };

  const lookupByToken = async (token: string) => {
    const { data: qr, error } = await db
      .from("patient_qr_codes")
      .select("patient_id")
      .eq("token", token)
      .maybeSingle();

    if (error || !qr) {
      toast({ title: "Patient not found", description: "Invalid QR code or token", variant: "destructive" });
      return;
    }

    const { data: patient } = await db
      .from("patient_profiles")
      .select("id, full_name, age, blood_type, chronic_diseases, current_medications, phone")
      .eq("id", qr.patient_id)
      .maybeSingle();

    if (patient) {
      setScannedPatient(patient as ScannedPatient);
      setDiagnosisNotes("");
      setPrescribedMeds("");
      toast({ title: "Patient found!", description: patient.full_name });
    } else {
      toast({ title: "Patient profile not found", variant: "destructive" });
    }
  };

  const handleSaveRecord = async () => {
    if (!scannedPatient || !profile) return;
    if (!diagnosisNotes.trim()) {
      toast({ title: "Please enter diagnosis notes", variant: "destructive" });
      return;
    }
    setSavingRecord(true);

    const { error } = await db.from("medical_records").insert({
      patient_id: scannedPatient.id,
      doctor_id: profile.id,
      doctor_name: profile.full_name,
      department: profile.department || profile.specialty,
      diagnosis: diagnosisNotes.trim(),
      medications: prescribedMeds.trim() || null,
      created_by: "doctor_scan",
    });

    if (error) {
      toast({ title: "Error saving record", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Medical record saved successfully!" });
      setDiagnosisNotes("");
      setPrescribedMeds("");
    }
    setSavingRecord(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(a => a.appointment_date === today);
  const pendingAppts = appointments.filter(a => a.status === "pending");
  const completedAppts = appointments.filter(a => a.status === "completed");

  const stats = [
    { label: "Total Appointments", value: appointments.length, icon: Calendar, color: "text-primary" },
    { label: "Today", value: todayAppts.length, icon: Clock, color: "text-orange-500" },
    { label: "Pending", value: pendingAppts.length, icon: Users, color: "text-yellow-500" },
    { label: "Completed", value: completedAppts.length, icon: CheckCircle, color: "text-green-500" },
  ];

  const sidebarItems = [
    { key: "overview" as Tab, label: "Overview", icon: BarChart3 },
    { key: "appointments" as Tab, label: "Appointments", icon: Calendar },
    { key: "scanner" as Tab, label: "QR Scanner", icon: QrCode },
    { key: "profile" as Tab, label: "My Profile", icon: User },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-sm">Doctor Portal</h2>
            <p className="text-xs text-muted-foreground truncate">{profile?.full_name}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {sidebarItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-2">
            <Home className="w-4 h-4" /> Back to Website
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 px-3 py-2 w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground capitalize">{activeTab === "scanner" ? "QR Scanner" : activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">{profile?.specialty}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <p className="text-2xl font-black text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-xl border border-border">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Today's Appointments</h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{todayAppts.length}</span>
                </div>
                {todayAppts.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {todayAppts.map((apt) => (
                      <AppointmentRow key={apt.id} apt={apt} statusBadge={statusBadge} updateStatus={updateStatus} updatingId={updatingId} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div className="bg-card rounded-xl border border-border">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-bold text-foreground">All Appointments ({appointments.length})</h3>
              </div>
              {appointments.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {appointments.map((apt) => (
                    <AppointmentRow key={apt.id} apt={apt} statusBadge={statusBadge} updateStatus={updateStatus} updatingId={updatingId} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QR Scanner */}
          {activeTab === "scanner" && (
            <div className="space-y-6 max-w-3xl">
              {/* Scan Input */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" /> Scan Patient QR Code
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the patient's QR token or paste the full QR URL to look up their medical profile.
                </p>
                <div className="flex gap-3">
                  <Input
                    placeholder="Paste QR token or URL here..."
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScanByToken()}
                    className="flex-1"
                  />
                  <Button onClick={handleScanByToken} className="gap-2">
                    <Eye className="w-4 h-4" /> Look Up
                  </Button>
                </div>
              </div>

              {/* Scanned Patient Profile */}
              {scannedPatient && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" /> Patient Profile
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Read-only patient info */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <ReadOnlyField label="Full Name" value={scannedPatient.full_name} />
                      <ReadOnlyField label="Age" value={scannedPatient.age?.toString()} />
                      <ReadOnlyField label="Blood Type" value={scannedPatient.blood_type} />
                      <ReadOnlyField label="Phone" value={scannedPatient.phone} />
                      <ReadOnlyField label="Chronic Diseases" value={scannedPatient.chronic_diseases} />
                      <ReadOnlyField label="Current Medications" value={scannedPatient.current_medications} />
                    </div>

                    {/* Editable fields */}
                    <div className="border-t border-border pt-6 space-y-4">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-primary" /> Add Medical Record
                      </h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label>Diagnosis Notes *</Label>
                          <textarea
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Enter diagnosis details..."
                            value={diagnosisNotes}
                            onChange={(e) => setDiagnosisNotes(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Prescribed Medications</Label>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Enter prescribed medications..."
                            value={prescribedMeds}
                            onChange={(e) => setPrescribedMeds(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleSaveRecord} disabled={savingRecord} className="gap-2">
                          {savingRecord ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Medical Record
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && profile && (
            <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{profile.full_name}</h2>
                  <p className="text-muted-foreground">{profile.specialty}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Department" value={profile.department} />
                <InfoItem label="Specialty" value={profile.specialty} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function AppointmentRow({
  apt, statusBadge, updateStatus, updatingId
}: {
  apt: Appointment;
  statusBadge: (s: string) => string;
  updateStatus: (id: string, status: string) => void;
  updatingId: string | null;
}) {
  return (
    <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{apt.patient_name}</p>
        <p className="text-sm text-muted-foreground">
          {apt.appointment_date} at {apt.appointment_time}
          {apt.reason && ` • ${apt.reason}`}
        </p>
      </div>
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold w-fit ${statusBadge(apt.status)}`}>
        {apt.status}
      </span>
      {(apt.status === "pending" || apt.status === "confirmed") && (
        <div className="flex gap-2">
          {apt.status === "pending" && (
            <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "confirmed")} disabled={updatingId === apt.id}>
              {updatingId === apt.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
              <span className="ml-1">Confirm</span>
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "completed")} disabled={updatingId === apt.id}>
            <CheckCircle className="w-3 h-3" />
            <span className="ml-1">Complete</span>
          </Button>
          <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateStatus(apt.id, "cancelled")} disabled={updatingId === apt.id}>
            <XCircle className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-foreground font-medium mt-0.5">{value || "—"}</p>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-foreground font-medium bg-muted/50 rounded-md px-3 py-2 text-sm">{value || "—"}</p>
    </div>
  );
}
