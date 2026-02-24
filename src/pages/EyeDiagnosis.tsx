import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Eye, Upload, Loader2, AlertTriangle, CheckCircle,
  Camera, FileImage, X, ShieldAlert, Activity
} from "lucide-react";

interface DiagnosisResult {
  diagnosis_title: string;
  confidence: number;
  severity: "normal" | "mild" | "moderate" | "severe" | "unknown";
  recommendation: string;
  details: string;
}

const severityColors: Record<string, { bg: string; text: string; label: string }> = {
  normal: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Normal" },
  mild: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", label: "Mild" },
  moderate: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", label: "Moderate" },
  severe: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Severe" },
  unknown: { bg: "bg-muted", text: "text-muted-foreground", label: "Unknown" },
};

export default function EyeDiagnosis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id || null);
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Only JPG and PNG files are accepted.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }

    setSelectedFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      if (userId) formData.append("user_id", userId);

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/eye-diagnosis`,
        {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Analysis Failed", description: data.error || "Please try again.", variant: "destructive" });
      } else {
        setResult(data.diagnosis);
      }
    } catch {
      toast({ title: "Connection Error", description: "Failed to connect to the server.", variant: "destructive" });
    }
    setLoading(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const sev = result ? severityColors[result.severity] || severityColors.unknown : null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">AI Eye Diagnosis</h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Upload a retinal or eye photo for instant AI-powered analysis. Get preliminary insights before your specialist visit.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-6">
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileSelect}
          />

          {!preview ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Click to upload eye image</p>
                <p className="text-sm text-muted-foreground mt-1">JPG or PNG only • Max 10MB</p>
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img src={preview} alt="Eye preview" className="w-full max-h-80 object-contain rounded-xl bg-muted" />
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 w-8 h-8 bg-card/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileImage className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium truncate">{selectedFile?.name}</span>
                <span className="text-muted-foreground">({((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB)</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {preview && !result && (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 text-base gap-2 mb-6"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing your retina image...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Submit for Diagnosis
              </>
            )}
          </Button>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6 text-center space-y-4 animate-fade-in">
            <Activity className="w-10 h-10 text-primary mx-auto animate-pulse" />
            <p className="font-semibold text-foreground">Analyzing your retina image...</p>
            <p className="text-sm text-muted-foreground">Our AI is examining the image for any abnormalities. This may take a few seconds.</p>
            <Progress value={undefined} className="h-2" />
          </div>
        )}

        {/* Result Card */}
        {result && sev && (
          <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden animate-slide-up">
            {/* Result Header */}
            <div className={`px-6 py-4 ${sev.bg} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-6 h-6 ${sev.text}`} />
                <div>
                  <h2 className="font-bold text-foreground text-lg">{result.diagnosis_title}</h2>
                  <span className={`text-sm font-semibold ${sev.text}`}>Severity: {sev.label}</span>
                </div>
              </div>
            </div>

            {/* Confidence */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Confidence Level</span>
                <span className="text-lg font-black text-primary">{result.confidence.toFixed(1)}%</span>
              </div>
              <Progress value={result.confidence} className="h-3" />
            </div>

            {/* Details */}
            <div className="px-6 py-4 border-b border-border space-y-2">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Analysis Details</h3>
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{result.details}</p>
            </div>

            {/* Recommendation */}
            <div className="px-6 py-4 border-b border-border space-y-2">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Recommendation</h3>
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{result.recommendation}</p>
            </div>

            {/* Disclaimer */}
            <div className="px-6 py-4 bg-muted/50 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Disclaimer:</strong> This AI-powered analysis is for preliminary screening purposes only and should not be considered a definitive medical diagnosis. 
                Always consult a qualified ophthalmologist for proper examination and treatment. AI predictions may vary in accuracy depending on image quality and conditions present.
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 flex gap-3">
              <Button onClick={clearFile} variant="outline" className="flex-1">
                Analyze Another Image
              </Button>
              <Button asChild className="flex-1">
                <a href="/appointments">Book Specialist Appointment</a>
              </Button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          {[
            { icon: Eye, title: "Retinal Analysis", desc: "Detects diabetic retinopathy, glaucoma, and macular degeneration" },
            { icon: Activity, title: "Instant Results", desc: "Get AI-powered analysis in seconds with confidence scoring" },
            { icon: ShieldAlert, title: "Privacy First", desc: "Your images are analyzed securely and not stored permanently" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-xl border border-border p-4 text-center">
              <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <h4 className="font-bold text-foreground text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
