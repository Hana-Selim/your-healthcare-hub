import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (req.method === "GET" && action === "scan") {
      // Doctor scans QR - get patient data by token
      const token = url.searchParams.get("token");
      if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Find QR code
      const { data: qrCode, error: qrError } = await supabase
        .from("patient_qr_codes")
        .select("patient_id")
        .eq("token", token)
        .single();

      if (qrError || !qrCode) {
        return new Response(JSON.stringify({ error: "QR code not found or expired" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get patient profile
      const { data: patient, error: patientError } = await supabase
        .from("patient_profiles")
        .select("*")
        .eq("id", qrCode.patient_id)
        .single();

      if (patientError || !patient) {
        return new Response(JSON.stringify({ error: "Patient not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get medical records
      const { data: records } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", qrCode.patient_id)
        .order("created_at", { ascending: false });

      return new Response(JSON.stringify({ patient, records: records || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && action === "add-record") {
      // Doctor adds medical record via QR token
      const body = await req.json();
      const { token, record } = body;

      if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate token
      const { data: qrCode, error: qrError } = await supabase
        .from("patient_qr_codes")
        .select("patient_id")
        .eq("token", token)
        .single();

      if (qrError || !qrCode) {
        return new Response(JSON.stringify({ error: "Invalid QR code" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Insert medical record using service role (bypasses RLS)
      const { data: newRecord, error: insertError } = await supabase
        .from("medical_records")
        .insert({
          patient_id: qrCode.patient_id,
          visit_date: record.visit_date || new Date().toISOString().split("T")[0],
          doctor_name: record.doctor_name,
          department: record.department,
          diagnosis: record.diagnosis,
          medications: record.medications,
          lab_results: record.lab_results,
          radiology: record.radiology,
          surgeries: record.surgeries,
          allergies: record.allergies,
          notes: record.notes,
          created_by: "doctor_scan",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: "Failed to add record" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ record: newRecord }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("QR scan error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
