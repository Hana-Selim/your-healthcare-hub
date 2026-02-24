import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Stethoscope, Mail, Lock } from "lucide-react";

export default function DoctorAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has doctor role
        const { data: roles } = await (supabase as any).from("user_roles").select("role").eq("user_id", session.user.id);
        if (roles?.some((r: any) => r.role === "doctor")) {
          navigate("/doctor-dashboard");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check doctor role
    const { data: roles } = await (supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);

    if (!roles?.some((r: any) => r.role === "doctor")) {
      await supabase.auth.signOut();
      toast({ title: "Access Denied", description: "This account does not have doctor privileges.", variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Welcome back, Doctor!" });
    navigate("/doctor-dashboard");
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-9 h-9 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Doctor Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 bg-card rounded-xl border border-border p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="doctor@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Only registered hospital doctors can access this portal.
            <br />
            Contact administration for account setup.
          </p>
        </div>
      </div>
    </Layout>
  );
}
