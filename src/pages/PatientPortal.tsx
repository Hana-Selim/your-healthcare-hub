import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react";
import {
  User, FileText, QrCode, LogOut, Plus,
  Calendar, Pill, FlaskConical, Radiation, Scissors,
  AlertTriangle, Stethoscope, RefreshCw, Loader2, Activity
} from "lucide-react";

interface PatientProfile {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string | null;
  phone: string | null;
  blood_type: string | null;
  address: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  age: number | null;
  chronic_diseases: string | null;
  current_medications: string | null;
}

interface MedicalRecord {
  id: string;
  visit_date: string;
  doctor_name: string | null;
  department: string | null;
  diagnosis: string | null;
  medications: string | null;
  lab_results: string | null;
  radiology: string | null;
  surgeries: string | null;
  allergies: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
}

interface QRCodeData {
  id: string;
  token: string;
}

type Tab = "profile" | "records" | "qr";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export default function PatientPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  const [generatingQR, setGeneratingQR] = useState(false);

  const fetchData = useCallback(async (profileId: string) => {
    const [recordsRes, qrRes] = await Promise.all([
      db.from("medical_records").select("*").eq("patient_id", profileId).order("created_at", { ascending: false }),
      db.from("patient_qr_codes").select("*").eq("patient_id", profileId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    if (recordsRes.data) setRecords(recordsRes.data);
    if (qrRes.data) setQrCode(qrRes.data);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/patient-auth");
        return;
      }

      const { data: profileData, error } = await db
        .from("patient_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error || !profileData) {
        toast({ title: "Profile not found", variant: "destructive" });
        navigate("/patient-auth");
        return;
      }

      const typedProfile = profileData as PatientProfile;
      setProfile(typedProfile);
      localStorage.setItem("patient_profile", JSON.stringify(typedProfile));
      await fetchData(typedProfile.id);
      setLoading(false);
    };
    init();
  }, [navigate, fetchData]);

  const generateQR = async () => {
    if (!profile) return;
    setGeneratingQR(true);
    const { data, error } = await db
      .from("patient_qr_codes")
      .insert({ patient_id: profile.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error generating QR", description: error.message, variant: "destructive" });
    } else {
      setQrCode(data as QRCodeData);
      toast({ title: "QR Code generated successfully!" });
    }
    setGeneratingQR(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem("patient_profile");
    await supabase.auth.signOut();
    navigate("/patient-auth");
  };

  // Build QR data with patient medical info
  const qrPayload = profile ? JSON.stringify({
    id: profile.id,
    name: profile.full_name,
    age: profile.age,
    blood_type: profile.blood_type,
    chronic_diseases: profile.chronic_diseases,
    current_medications: profile.current_medications,
    token: qrCode?.token,
  }) : "";

  const qrUrl = qrCode
    ? `${window.location.origin}/doctor-view?token=${qrCode.token}`
    : "";

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Hello, {profile?.full_name}</h1>
              <p className="text-sm text-muted-foreground">Patient Portal</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{records.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Medical Records</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{profile?.blood_type || "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">Blood Type</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{profile?.age || "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">Age</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{qrCode ? "✓" : "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">QR Code</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-muted p-1 rounded-lg mb-6">
          {[
            { key: "profile", label: "Profile", icon: User },
            { key: "records", label: "Medical Records", icon: FileText },
            { key: "qr", label: "QR Code", icon: QrCode },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeTab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && profile && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground mb-4">Personal & Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={profile.full_name} />
              <InfoRow label="Phone" value={profile.phone} />
              <InfoRow label="Age" value={profile.age?.toString()} />
              <InfoRow label="Blood Type" value={profile.blood_type} />
              <InfoRow label="Address" value={profile.address} />
              <InfoRow label="Date of Birth" value={profile.date_of_birth} />
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-md font-bold text-foreground mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Medical Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Chronic Diseases" value={profile.chronic_diseases} />
                <InfoRow label="Current Medications" value={profile.current_medications} />
                <InfoRow label="Emergency Contact" value={profile.emergency_contact} />
                <InfoRow label="Emergency Phone" value={profile.emergency_phone} />
              </div>
            </div>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === "records" && (
          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No medical records yet</p>
                <p className="text-xs text-muted-foreground mt-2">Records will appear here after each doctor visit</p>
              </div>
            ) : (
              records.map((rec) => (
                <MedicalRecordCard key={rec.id} record={rec} />
              ))
            )}
          </div>
        )}

        {/* QR Code Tab */}
        {activeTab === "qr" && (
          <div className="bg-card rounded-xl border border-border p-8 text-center space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Your QR Code</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your doctor can scan this code to view your full medical profile and add new records
              </p>
            </div>

            {qrCode ? (
              <div className="space-y-4">
                <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border border-border">
                  <QRCodeSVG value={qrPayload || qrUrl} size={220} level="H" includeMargin />
                </div>
                <div className="bg-muted rounded-lg p-3 max-w-sm mx-auto text-left text-xs space-y-1">
                  <p><span className="font-bold">ID:</span> {profile?.id?.slice(0, 8)}...</p>
                  <p><span className="font-bold">Name:</span> {profile?.full_name}</p>
                  <p><span className="font-bold">Age:</span> {profile?.age || "—"}</p>
                  <p><span className="font-bold">Blood Type:</span> {profile?.blood_type || "—"}</p>
                </div>
                <Button variant="outline" onClick={generateQR} disabled={generatingQR} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Code
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-48 h-48 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
                <Button onClick={generateQR} disabled={generatingQR} className="gap-2">
                  {generatingQR ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Generate QR Code
                </Button>
              </div>
            )}

            <div className="bg-secondary border border-border rounded-lg p-4 text-left">
              <p className="text-foreground text-sm font-semibold">⚠️ Security Notice</p>
              <p className="text-muted-foreground text-xs mt-1">
                Do not share this code with untrusted individuals. Anyone who scans it can view your full medical record.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-foreground font-medium">{value || "—"}</p>
    </div>
  );
}

function MedicalRecordCard({ record }: { record: MedicalRecord }) {
  const [expanded, setExpanded] = useState(false);

  const fields = [
    { icon: Stethoscope, label: "Diagnosis", value: record.diagnosis },
    { icon: Pill, label: "Medications", value: record.medications },
    { icon: FlaskConical, label: "Lab Results", value: record.lab_results },
    { icon: Radiation, label: "Radiology", value: record.radiology },
    { icon: Scissors, label: "Surgeries", value: record.surgeries },
    { icon: AlertTriangle, label: "Allergies", value: record.allergies },
    { icon: FileText, label: "Notes", value: record.notes },
  ].filter(f => f.value);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{record.visit_date}</p>
            <p className="text-sm text-muted-foreground">
              {record.doctor_name && `Dr. ${record.doctor_name}`}
              {record.department && ` • ${record.department}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            record.created_by === "doctor_scan" ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
          }`}>
            {record.created_by === "doctor_scan" ? "Doctor" : "Patient"}
          </span>
          <span className="text-muted-foreground">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-3">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">{label}</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
