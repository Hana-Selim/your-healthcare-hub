import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Heart, User, Mail, Lock, Phone, Calendar } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type Mode = "login" | "register" | "verify";

export default function PatientAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    date_of_birth: "",
    blood_type: "",
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      toast({ title: "خطأ في تسجيل الدخول", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم تسجيل الدخول بنجاح" });
      navigate("/patient-portal");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: window.location.origin + "/patient-portal" },
    });

    if (error) {
      toast({ title: "خطأ في التسجيل", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create patient profile
      const { error: profileError } = await db.from("patient_profiles").insert({
        user_id: data.user.id,
        full_name: form.full_name,
        phone: form.phone || null,
        date_of_birth: form.date_of_birth || null,
        blood_type: form.blood_type || null,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }
    }

    setMode("verify");
    setLoading(false);
  };

  if (mode === "verify") {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">تحقق من بريدك الإلكتروني</h1>
            <p className="text-muted-foreground leading-relaxed">
              تم إرسال رابط التحقق إلى <span className="font-bold text-foreground">{form.email}</span>.
              يرجى فتح البريد والضغط على الرابط لتفعيل حسابك.
            </p>
            <Button onClick={() => setMode("login")} variant="outline" className="w-full">
              العودة لتسجيل الدخول
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-9 h-9 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">بوابة المريض</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "login" ? "سجّل دخولك للوصول لملفك الطبي" : "أنشئ حسابك الجديد"}
            </p>
          </div>

          <div className="flex rounded-lg bg-muted p-1 mb-8">
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setMode("login")}
            >تسجيل الدخول</button>
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setMode("register")}
            >إنشاء حساب</button>
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
            {mode === "register" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="full_name">الاسم الكامل *</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="full_name" name="full_name" placeholder="محمد أحمد علي" value={form.full_name} onChange={handleChange} className="pr-10" required dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="phone" name="phone" placeholder="01xxxxxxxxx" value={form.phone} onChange={handleChange} className="pr-10" dir="ltr" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blood_type">فصيلة الدم</Label>
                    <select
                      id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">اختر</option>
                      {bloodTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">تاريخ الميلاد</Label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="date_of_birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className="pr-10" />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="example@email.com" value={form.email} onChange={handleChange} className="pr-10" required dir="ltr" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="pr-10" required minLength={6} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            للطوارئ اتصل على{" "}
            <a href="tel:911" className="text-destructive font-bold">911</a>
            {" "}أو الخط الساخن{" "}
            <a href="tel:19668" className="text-primary font-bold">19668</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
