import { Shield, Clock, Award, HeartPulse, Users, Building } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "أعلى معايير الجودة",
    description: "نلتزم بأعلى معايير الجودة العالمية في جميع خدماتنا الطبية",
  },
  {
    icon: Clock,
    title: "خدمة على مدار الساعة",
    description: "نوفر رعاية طبية متواصلة 24/7 لضمان راحتكم وأمانكم",
  },
  {
    icon: Award,
    title: "أطباء متميزون",
    description: "فريق من أفضل الأطباء والاستشاريين في مختلف التخصصات",
  },
  {
    icon: HeartPulse,
    title: "تكنولوجيا متقدمة",
    description: "نستخدم أحدث التقنيات والأجهزة الطبية في التشخيص والعلاج",
  },
  {
    icon: Users,
    title: "رعاية شخصية",
    description: "نهتم بكل مريض بشكل فردي ونوفر خطة علاج مخصصة",
  },
  {
    icon: Building,
    title: "شبكة واسعة",
    description: "أكبر شبكة من المستشفيات والعيادات في مصر",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30" id="about">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              لماذا <span className="text-primary">نحن</span> الخيار الأمثل؟
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              منذ تأسيس مجموعة مستشفيات كليوباترا عام 2014، كانت الوجهة المفضلة لمن يبحثون عن رعاية صحية شاملة وتكنولوجيا متطورة ودعم لا يتزعزع. 
              كونها واحدة من أوائل وأكبر مقدمي الرعاية الصحية الخاصة في مصر، فقد اعتزت المجموعة دائماً بتقديم أعلى مستويات العناية للمرضى.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              نهجنا المتمحور حول المريض يضمن أن احتياجاتكم تأتي في مقدمة كل قرار نتخذه.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-button">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
