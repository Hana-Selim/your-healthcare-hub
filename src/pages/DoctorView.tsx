import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  User, Heart, FileText, Calendar, Pill, FlaskConical,
  AlertTriangle, Stethoscope, Scissors, Plus, Loader2, CheckCircle, Radiation
} from "lucide-react";

interface PatientData {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  phone: string | null;
  blood_type: string | null;
  address: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function DoctorView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [newRecord, setNewRecord] = useState({
    doctor_name: "",
    department: "",
    visit_date: new Date().toISOString().split("T")[0],
    diagnosis: "",
    medications: "",
    lab_results: "",
    radiology: "",
    surgeries: "",
    allergies: "",
    notes: "",
  });

  useEffect(() => {
    if (!token) {
      setError("رمز QR غير صالح");
      setLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/qr-scan?action=scan&token=${encodeURIComponent(token)}`,
          {
            headers: {
              "apikey": SUPABASE_ANON_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "حدث خطأ");
        } else {
          setPatient(data.patient);
          setRecords(data.records || []);
        }
      } catch {
        setError("تعذر الاتصال بالخادم");
      }
      setLoading(false);
    };

    fetchPatientData();
  }, [token]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.diagnosis && !newRecord.notes) {
      toast({ title: "يرجى إدخال التشخيص أو الملاحظات على الأقل", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/qr-scan?action=add-record`,
        {
          method: "POST",
          headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, record: newRecord }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "خطأ في إضافة السجل", description: data.error, variant: "destructive" });
      } else {
        setRecords(prev => [data.record, ...prev]);
        setSuccess(true);
        setShowForm(false);
        setNewRecord({
          doctor_name: "", department: "", visit_date: new Date().toISOString().split("T")[0],
          diagnosis: "", medications: "", lab_results: "", radiology: "",
          surgeries: "", allergies: "", notes: "",
        });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      toast({ title: "خطأ في الاتصال", variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">جاري تحميل بيانات المريض...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground">رمز QR غير صالح</h1>
          <p className="text-muted-foreground">{error}</p>
          <Link to="/">
            <Button variant="outline">العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Doctor Header */}
      <div className="bg-primary text-primary-foreground py-4 px-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">واجهة الطبيب</h1>
              <p className="text-primary-foreground/70 text-xs">مسح QR Code للمريض</p>
            </div>
          </div>
          <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">
            الموقع الرئيسي
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Success Banner */}
        {success && (
          <div className="bg-accent border border-border rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <p className="text-foreground font-semibold">تم إضافة السجل الطبي بنجاح</p>
          </div>
        )}

        {/* Patient Info */}
        {patient && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="bg-primary/5 border-b border-border px-5 py-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{patient.full_name}</h2>
                <div className="flex gap-3 mt-1">
                  {patient.blood_type && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                      <Heart className="w-3 h-3" /> {patient.blood_type}
                    </span>
                  )}
                  {patient.date_of_birth && (
                    <span className="text-xs text-muted-foreground">
                      تاريخ الميلاد: {patient.date_of_birth}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {patient.phone && <InfoRow label="رقم الهاتف" value={patient.phone} />}
              {patient.address && <InfoRow label="العنوان" value={patient.address} />}
              {patient.emergency_contact && <InfoRow label="جهة الطوارئ" value={patient.emergency_contact} />}
              {patient.emergency_phone && <InfoRow label="هاتف الطوارئ" value={patient.emergency_phone} />}
            </div>
          </div>
        )}

        {/* Add Record Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">السجل الطبي ({records.length})</h3>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة سجل جديد
          </Button>
        </div>

        {/* Add Record Form */}
        {showForm && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-5">إضافة سجل طبي جديد</h3>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="اسم الطبيب" id="doctor_name">
                  <Input id="doctor_name" value={newRecord.doctor_name} onChange={e => setNewRecord({...newRecord, doctor_name: e.target.value})} placeholder="د. محمد أحمد" />
                </FormField>
                <FormField label="القسم" id="department">
                  <Input id="department" value={newRecord.department} onChange={e => setNewRecord({...newRecord, department: e.target.value})} placeholder="القلب والأوعية الدموية" />
                </FormField>
              </div>
              <FormField label="تاريخ الزيارة" id="visit_date">
                <Input id="visit_date" type="date" value={newRecord.visit_date} onChange={e => setNewRecord({...newRecord, visit_date: e.target.value})} />
              </FormField>
              <FormField label="التشخيص" id="diagnosis" icon={<Stethoscope className="w-4 h-4" />}>
                <textarea id="diagnosis" value={newRecord.diagnosis} onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} placeholder="وصف التشخيص..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
              </FormField>
              <FormField label="الأدوية الموصوفة" id="medications" icon={<Pill className="w-4 h-4" />}>
                <textarea id="medications" value={newRecord.medications} onChange={e => setNewRecord({...newRecord, medications: e.target.value})} placeholder="قائمة الأدوية والجرعات..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="نتائج التحاليل" id="lab_results" icon={<FlaskConical className="w-4 h-4" />}>
                  <textarea id="lab_results" value={newRecord.lab_results} onChange={e => setNewRecord({...newRecord, lab_results: e.target.value})} placeholder="نتائج التحاليل المخبرية..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
                </FormField>
                <FormField label="الأشعة والتصوير" id="radiology" icon={<Radiation className="w-4 h-4" />}>
                  <textarea id="radiology" value={newRecord.radiology} onChange={e => setNewRecord({...newRecord, radiology: e.target.value})} placeholder="نتائج الأشعة والـ MRI..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="العمليات الجراحية" id="surgeries" icon={<Scissors className="w-4 h-4" />}>
                  <Input id="surgeries" value={newRecord.surgeries} onChange={e => setNewRecord({...newRecord, surgeries: e.target.value})} placeholder="اسم العملية..." />
                </FormField>
                <FormField label="الحساسية" id="allergies" icon={<AlertTriangle className="w-4 h-4" />}>
                  <Input id="allergies" value={newRecord.allergies} onChange={e => setNewRecord({...newRecord, allergies: e.target.value})} placeholder="حساسية الدواء..." />
                </FormField>
              </div>
              <FormField label="ملاحظات إضافية" id="notes">
                <textarea id="notes" value={newRecord.notes} onChange={e => setNewRecord({...newRecord, notes: e.target.value})} placeholder="أي ملاحظات إضافية..." className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
              </FormField>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  حفظ السجل
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
              </div>
            </form>
          </div>
        )}

        {/* Medical Records List */}
        {records.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد سجلات طبية بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((rec) => (
              <DoctorRecordCard key={rec.id} record={rec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="text-foreground font-medium mt-0.5">{value}</p>
    </div>
  );
}

function FormField({ label, id, icon, children }: { label: string; id: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-muted-foreground">
        {icon}{label}
      </Label>
      {children}
    </div>
  );
}

function DoctorRecordCard({ record }: { record: MedicalRecord }) {
  const [expanded, setExpanded] = useState(false);

  const fields = [
    { icon: Stethoscope, label: "التشخيص", value: record.diagnosis },
    { icon: Pill, label: "الأدوية", value: record.medications },
    { icon: FlaskConical, label: "التحاليل", value: record.lab_results },
    { icon: Radiation, label: "الأشعة", value: record.radiology },
    { icon: Scissors, label: "العمليات", value: record.surgeries },
    { icon: AlertTriangle, label: "الحساسية", value: record.allergies },
    { icon: FileText, label: "ملاحظات", value: record.notes },
  ].filter(f => f.value);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        className="w-full text-right p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{record.visit_date}</p>
            <p className="text-sm text-muted-foreground">
              {record.doctor_name && `د. ${record.doctor_name}`}
              {record.department && ` • ${record.department}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            record.created_by === "doctor_scan" ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
          }`}>
            {record.created_by === "doctor_scan" ? "طبيب" : "المريض"}
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
