import { Heart, Ribbon, Bone, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import cardiovascularImg from "@/assets/cardiovascular-center.jpg";
import oncologyImg from "@/assets/oncology-center.jpg";
import orthopedicImg from "@/assets/orthopedic-center.jpg";
import neurologyImg from "@/assets/neurology-center.jpg";

const centers = [
  {
    id: 1,
    title: "مركز القلب والأوعية الدموية",
    subtitle: "CENTER OF EXCELLENCE",
    image: cardiovascularImg,
    icon: Heart,
    color: "from-rose-500 to-rose-600",
  },
  {
    id: 2,
    title: "مركز الأورام",
    subtitle: "CENTER OF EXCELLENCE",
    image: oncologyImg,
    icon: Ribbon,
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 3,
    title: "مركز العظام",
    subtitle: "CENTER OF EXCELLENCE",
    image: orthopedicImg,
    icon: Bone,
    color: "from-amber-500 to-amber-600",
  },
  {
    id: 4,
    title: "مركز المخ والأعصاب",
    subtitle: "CENTER OF EXCELLENCE",
    image: neurologyImg,
    icon: Brain,
    color: "from-blue-500 to-blue-600",
  },
];

export function CentersOfExcellence() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/50" id="centers">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            مراكز <span className="text-primary">التميز</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نقدم أعلى مستويات الرعاية الطبية المتخصصة في مختلف المجالات
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background hidden md:flex"
              onClick={() => scroll("left")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background hidden md:flex"
              onClick={() => scroll("right")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Cards Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {centers.map((center, index) => (
              <div
                key={center.id}
                className="center-card flex-shrink-0 w-[280px] md:w-[300px] snap-start cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-[200px] overflow-hidden">
                  <img
                    src={center.image}
                    alt={center.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-primary-foreground font-medium">اعرف المزيد</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-gradient-to-b from-background to-accent/30 border-t-4 border-primary">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${center.color} flex items-center justify-center shadow-md`}>
                      <center.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{center.title}</h3>
                      <p className="text-xs text-primary font-medium tracking-wider">{center.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            عرض جميع المراكز
          </Button>
        </div>
      </div>
    </section>
  );
}
