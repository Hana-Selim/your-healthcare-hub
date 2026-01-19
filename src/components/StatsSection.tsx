import { useEffect, useState, useRef } from "react";
import { Users, UserCheck, BedDouble, Heart } from "lucide-react";

const stats = [
  {
    icon: UserCheck,
    value: 1000,
    suffix: "+",
    label: "استشاري متخصص",
    color: "text-primary",
  },
  {
    icon: Users,
    value: 4600,
    suffix: "+",
    label: "الطاقم الطبي",
    color: "text-secondary",
  },
  {
    icon: BedDouble,
    value: 782,
    suffix: "+",
    label: "سرير",
    color: "text-primary",
  },
  {
    icon: Heart,
    value: 1,
    suffix: "M+",
    label: "مريض سعيد",
    color: "text-secondary",
  },
];

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return { count, ref };
}

export function StatsSection() {
  return (
    <section className="py-16 lg:py-24 hero-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            قصة <span className="text-secondary">نجاحنا</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            نفخر بكوننا أكبر مجموعة مستشفيات خاصة في مصر، نقدم رعاية صحية متميزة لملايين المرضى
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const { count, ref } = useCountUp(stat.value);
            return (
              <div
                key={stat.label}
                ref={ref}
                className="stat-card bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4">
                  <stat.icon className={`h-10 w-10 mx-auto ${stat.color === "text-primary" ? "text-secondary" : "text-primary-foreground"}`} />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                  {count.toLocaleString()}{stat.suffix}
                </div>
                <p className="text-primary-foreground/80 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
