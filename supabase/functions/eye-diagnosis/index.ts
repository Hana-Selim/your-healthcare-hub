import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const userId = formData.get("user_id") as string | null;

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "Image file is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(imageFile.type)) {
      return new Response(JSON.stringify({ error: "Only JPG and PNG files are accepted" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate size (10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File size must be less than 10MB" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const mimeType = imageFile.type;

    // Call AI for diagnosis
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert ophthalmologist AI assistant that analyzes retinal/eye images. 
Analyze the provided eye image and return a JSON response with the following structure:
{
  "diagnosis_title": "Name of the condition detected (e.g., Diabetic Retinopathy, Glaucoma, Normal Retina, Macular Degeneration, etc.)",
  "confidence": 85.5,
  "severity": "normal|mild|moderate|severe",
  "recommendation": "Detailed recommendation for the patient",
  "details": "Detailed medical analysis of what was found in the image"
}

Important:
- Always respond with valid JSON only, no markdown
- Confidence should be 0-100
- Be thorough but clear in recommendations
- If the image is not a retinal/eye image, still provide analysis but note it in the diagnosis
- Add a disclaimer that this is AI-assisted and should be confirmed by a specialist`
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`
                }
              },
              {
                type: "text",
                text: "Please analyze this retinal/eye image and provide your diagnosis."
              }
            ]
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response (handle potential markdown wrapping)
    let diagnosis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      diagnosis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      diagnosis = {
        diagnosis_title: "Analysis Inconclusive",
        confidence: 0,
        severity: "unknown",
        recommendation: "Unable to parse AI response. Please try again or consult a specialist.",
        details: content,
      };
    }

    // Save to database if user is authenticated
    if (userId) {
      try {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );
        await supabase.from("ai_diagnoses").insert({
          user_id: userId,
          diagnosis_title: diagnosis.diagnosis_title,
          confidence: diagnosis.confidence,
          recommendation: diagnosis.recommendation,
          details: diagnosis.details,
          severity: diagnosis.severity,
        });
      } catch (dbErr) {
        console.error("DB save error:", dbErr);
      }
    }

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Eye diagnosis error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
