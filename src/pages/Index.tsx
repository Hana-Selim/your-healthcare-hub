import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CentersOfExcellence } from "@/components/CentersOfExcellence";
import { StatsSection } from "@/components/StatsSection";
import { NewsSection } from "@/components/NewsSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

const Index = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <CentersOfExcellence />
        <StatsSection />
        <WhyChooseUs />
        <NewsSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
