import { Phone, MessageCircle, HelpCircle } from "lucide-react";

export function FloatingButtons() {
  return (
    <div className="floating-btn bottom-24">
      {/* Phone */}
      <a
        href="tel:19668"
        className="w-12 h-12 hero-gradient text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        aria-label="اتصل بنا"
      >
        <Phone className="h-5 w-5" />
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/20219668"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        aria-label="واتساب"
      >
        <MessageCircle className="h-5 w-5" />
      </a>

      {/* Help */}
      <button
        className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        aria-label="مساعدة"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
