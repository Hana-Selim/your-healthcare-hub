import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Heart, User, Mail, Lock, Phone, Calendar, ShieldCheck, Pill, Activity } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type Mode = "login" | "register" | "verify";

interface FormErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm_password?: string;
  age?: string;
  blood_type?: string;
}

export default function PatientAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    full_name: "",
    phone: "",
    age: "",
    blood_type: "",
    chronic_diseases: "",
    current_medications: "",
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/patient-portal");
    });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateRegister = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name: letters only, min 3
    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (form.full_name.trim().length < 3) {
      newErrors.full_name = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(form.full_name.trim())) {
      newErrors.full_name = "Name must contain letters only (no numbers)";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone: 11 digits, starts with 01
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(form.phone.trim())) {
      newErrors.phone = "Phone must contain numbers only";
    } else if (form.phone.trim().length !== 11) {
      newErrors.phone = "Phone must be exactly 11 digits";
    } else if (!form.phone.trim().startsWith("01")) {
      newErrors.phone = "Phone must start with 01";
    }

    // Password: min 8, uppercase, lowercase, number, special
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Must contain an uppercase letter";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "Must contain a lowercase letter";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Must contain a number";
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password)) {
      newErrors.password = "Must contain a special character (!@#$...)";
    }

    // Confirm password
    if (form.confirm_password !== form.password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    // Age
    if (!form.age) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(form.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = "Age must be between 1 and 120";
      }
    }

    // Blood type
    if (!form.blood_type) {
      newErrors.blood_type = "Please select a blood type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      toast({ title: "Login Error", description: error.message, variant: "destructive" });
    } else {
      // Store patient info in localStorage
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await db.from("patient_profiles").select("*").eq("user_id", session.user.id).maybeSingle();
        if (profile) {
          localStorage.setItem("patient_profile", JSON.stringify(profile));
        }
      }
      toast({ title: "Login successful!" });
      navigate("/patient-portal");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: window.location.origin + "/patient-portal" },
    });

    if (error) {
      toast({ title: "Registration Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await db.from("patient_profiles").insert({
        user_id: data.user.id,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        age: parseInt(form.age),
        blood_type: form.blood_type,
        chronic_diseases: form.chronic_diseases.trim() || null,
        current_medications: form.current_medications.trim() || null,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }
    }

    setMode("verify");
    setLoading(false);
  };

  const handleResendVerification = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verification email resent!", description: "Please check your inbox." });
    }
    setResending(false);
  };

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-sm text-destructive mt-1 font-medium">{message}</p>;
  };

  if (mode === "verify") {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
            <p className="text-muted-foreground leading-relaxed">
              A verification link has been sent to <span className="font-bold text-foreground">{form.email}</span>.
              Please open your email and click the link to activate your account.
            </p>
            <Button onClick={handleResendVerification} disabled={resending} className="w-full gap-2">
              {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Resend Verification Email
            </Button>
            <Button onClick={() => setMode("login")} variant="outline" className="w-full">
              Back to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-9 h-9 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Patient Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "login" ? "Sign in to access your medical profile" : "Create your new account"}
            </p>
          </div>

          <div className="flex rounded-lg bg-muted p-1 mb-8">
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setMode("login")}
            >Sign In</button>
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setMode("register")}
            >Create Account</button>
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4" noValidate>
            {mode === "register" && (
              <>
                {/* Full Name */}
                <div className="space-y-1">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="full_name" name="full_name" placeholder="John Doe" value={form.full_name} onChange={handleChange} className={`pl-10 ${errors.full_name ? "border-destructive" : ""}`} />
                  </div>
                  <FieldError message={errors.full_name} />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="phone" name="phone" placeholder="01xxxxxxxxx" value={form.phone} onChange={handleChange} className={`pl-10 ${errors.phone ? "border-destructive" : ""}`} />
                  </div>
                  <FieldError message={errors.phone} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Age */}
                  <div className="space-y-1">
                    <Label htmlFor="age">Age *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="age" name="age" type="number" min={1} max={120} placeholder="25" value={form.age} onChange={handleChange} className={`pl-10 ${errors.age ? "border-destructive" : ""}`} />
                    </div>
                    <FieldError message={errors.age} />
                  </div>

                  {/* Blood Type */}
                  <div className="space-y-1">
                    <Label htmlFor="blood_type">Blood Type *</Label>
                    <select
                      id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.blood_type ? "border-destructive" : "border-input"}`}
                    >
                      <option value="">Select</option>
                      {bloodTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <FieldError message={errors.blood_type} />
                  </div>
                </div>

                {/* Chronic Diseases */}
                <div className="space-y-1">
                  <Label htmlFor="chronic_diseases">Chronic Diseases</Label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="chronic_diseases" name="chronic_diseases" placeholder="e.g. Diabetes, Hypertension" value={form.chronic_diseases} onChange={handleChange} className="pl-10" />
                  </div>
                </div>

                {/* Current Medications */}
                <div className="space-y-1">
                  <Label htmlFor="current_medications">Current Medications</Label>
                  <div className="relative">
                    <Pill className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="current_medications" name="current_medications" placeholder="e.g. Metformin, Aspirin" value={form.current_medications} onChange={handleChange} className="pl-10" />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="example@email.com" value={form.email} onChange={handleChange} className={`pl-10 ${errors.email ? "border-destructive" : ""}`} />
              </div>
              <FieldError message={errors.email} />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className={`pl-10 ${errors.password ? "border-destructive" : ""}`} minLength={8} />
              </div>
              {mode === "register" && (
                <p className="text-xs text-muted-foreground">Min 8 chars, uppercase, lowercase, number & special char</p>
              )}
              <FieldError message={errors.password} />
            </div>

            {/* Confirm Password */}
            {mode === "register" && (
              <div className="space-y-1">
                <Label htmlFor="confirm_password">Confirm Password *</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="confirm_password" name="confirm_password" type="password" placeholder="••••••••" value={form.confirm_password} onChange={handleChange} className={`pl-10 ${errors.confirm_password ? "border-destructive" : ""}`} />
                </div>
                <FieldError message={errors.confirm_password} />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            For emergencies call{" "}
            <a href="tel:911" className="text-destructive font-bold">911</a>
            {" "}or hotline{" "}
            <a href="tel:19668" className="text-primary font-bold">19668</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
