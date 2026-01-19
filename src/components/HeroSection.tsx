import { MapPin, Stethoscope, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-hospital.jpg";

const hospitals = [
  "جميع المستشفيات",
  "مستشفى كليوباترا",
  "مستشفى القاهرة التخصصي",
  "مستشفى النيل بدراوي",
  "مستشفى الشروق",
  "مستشفى الكتيب",
];

const specialties = [
  "جميع التخصصات",
  "أمراض القلب",
  "الأورام",
  "العظام",
  "المخ والأعصاب",
  "الكلى",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="مستشفيات كليوباترا"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 text-center">
        {/* Logo & Title */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 hero-gradient rounded-2xl shadow-2xl mb-6">
            <span className="text-primary-foreground font-bold text-3xl">CHG</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            مجموعة مستشفيات كليوباترا
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-light tracking-wide">
            <span className="text-secondary font-semibold">التميز</span> في الرعاية الصحية
          </p>
        </div>

        {/* Booking Bar */}
        <div className="booking-bar max-w-4xl mx-auto p-4 md:p-6 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Hospital Select */}
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/70" />
              <select className="w-full h-12 pr-10 pl-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer">
                {hospitals.map((hospital) => (
                  <option key={hospital} value={hospital} className="text-foreground bg-background">
                    {hospital}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty Select */}
            <div className="relative">
              <Stethoscope className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/70" />
              <select className="w-full h-12 pr-10 pl-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer">
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty} className="text-foreground bg-background">
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Select */}
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/70" />
              <select className="w-full h-12 pr-10 pl-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer">
                <option className="text-foreground bg-background">جميع الأطباء</option>
              </select>
            </div>

            {/* Search Button */}
            <Button className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-lg">
              <Search className="h-5 w-5 ml-2" />
              احجز الآن
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/70 rounded-full animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
}
