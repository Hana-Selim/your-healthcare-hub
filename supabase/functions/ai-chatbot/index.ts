import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `أنت مساعد ذكي لمستشفى متخصص. مهمتك مساعدة المرضى والزوار في:
- التنقل بين أقسام الموقع (الرئيسية، الأقسام، الأطباء، حجز المواعيد، من نحن، اتصل بنا)
- تقديم معلومات عامة عن الأقسام الطبية (القلب، الأعصاب، الأورام، العظام)
- ترشيح الأقسام المناسبة حسب الأعراض
- الإجابة عن أسئلة عامة عن المستشفى

ملاحظات مهمة:
- أجب دائماً باللغة العربية
- كن مختصراً وودوداً
- لا تقدم تشخيصات طبية نهائية، وجه المريض دائماً لزيارة الطبيب
- اذكر أن الخط الساخن هو 19668 عند الحاجة
- روابط الصفحات: الرئيسية /, الأقسام /departments, الأطباء /doctors, حجز موعد /appointments, من نحن /about, اتصل بنا /contact`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "عذراً، حدث خطأ. حاول مرة أخرى.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(JSON.stringify({ reply: "عذراً، حدث خطأ. يرجى المحاولة لاحقاً." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
