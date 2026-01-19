import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Ambulance, Video, FileText, Calendar, Heart, Brain, 
  Bone, Baby, Stethoscope, Eye, ArrowRight, Star, Quote
} from "lucide-react";

const quickServices = [
  { icon: Ambulance, title: "Emergency", subtitle: "24/7 Ambulance Svc." },
  { icon: Video, title: "Telemedicine", subtitle: "Virtual Consultations" },
  { icon: FileText, title: "Lab Reports", subtitle: "View Results Online" },
  { icon: Calendar, title: "Appointments", subtitle: "Book or Reschedule" },
];

const departments = [
  { icon: Heart, name: "Cardiology", desc: "Interventional cardiology, heart failure clinic, and cardiac rehab." },
  { icon: Brain, name: "Neurology", desc: "Stroke care, movement disorders, and advanced neuroimaging." },
  { icon: Bone, name: "Orthopedics", desc: "Joint replacement, sports medicine, and spine surgery." },
  { icon: Baby, name: "Pediatrics", desc: "Comprehensive care for infants, children, and adolescents." },
  { icon: Stethoscope, name: "Oncology", desc: "Cancer treatment with advanced radiation and chemotherapy." },
  { icon: Eye, name: "Ophthalmology", desc: "LASIK, cataract surgery, and retina treatments." },
];

const stats = [
  { value: "50+", label: "Years Service" },
  { value: "120+", label: "Specialists" },
  { value: "24/7", label: "Emergency" },
  { value: "10k+", label: "Patients/Year" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    content: "The care I received at City General was exceptional. The staff treated me like family.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Patient",
    content: "World-class facilities and compassionate doctors. Highly recommend!",
    rating: 5,
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white dark:from-background dark:to-background py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col gap-5 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Open 24/7 for Emergency Care
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
                  Compassionate Care,<br />
                  <span className="text-primary">Advanced Medicine.</span>
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                  We combine cutting-edge technology with a human touch. Ranked #1 in patient safety and clinical excellence for over 50 years.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-md">
                  <Link to="/doctors">Find a Doctor</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/appointments">Patient Portal Login</Link>
                </Button>
              </div>
              <div className="flex gap-6 mt-4 pt-6 border-t border-border">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-1 lg:order-2 h-[280px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC36LckcuYTv1gtLZivggfq-2dF3c7-wEcnX3J421vogYJlIcSdaR8x-LyngoPN-qWx2UFk-0wTAKI4mwKNEK6FImx-vXDXq3RzYLuyyoUUjagXqG3Z1C2puug7XKkRK45cqkhS899NfZBrLrhY8lG6WBYTgdTMw64tV3OsPLZ0qDIrV2yGa924qlOHSgmqppz3l2yN8ahvjmSfvwQqNpK6fDTYll3gkskXtVwHfEOF8hdNj2ZcYyC-_ugqdIds-7O10Ub4Q_xc3ODb"
                alt="Doctor smiling in hospital"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Bar */}
      <section className="w-full bg-primary dark:bg-primary-dark shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {quickServices.map((service) => (
              <Link 
                key={service.title}
                to="/departments"
                className="flex items-center gap-4 py-6 px-4 hover:bg-white/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <service.icon className="w-5 h-5" />
                </div>
                <div className="text-white">
                  <h3 className="text-base font-bold">{service.title}</h3>
                  <p className="text-xs text-blue-100 opacity-90">{service.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="w-full py-14 px-4 md:px-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Centers of Excellence</h2>
              <p className="text-muted-foreground text-sm">World-class specialized care across multiple disciplines.</p>
            </div>
            <Link to="/departments" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              View All Departments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => (
              <Link
                key={dept.name}
                to="/departments"
                className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <dept.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{dept.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{dept.desc}</p>
                </div>
                <span className="text-sm font-bold text-primary group-hover:underline mt-auto">
                  Learn More →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-14 px-4 md:px-10 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What Our Patients Say</h2>
            <p className="text-muted-foreground">Real stories from real patients</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-sm border border-border"
              >
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-foreground mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-14 px-4 md:px-10 bg-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Schedule Your Visit?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team of expert physicians is here to provide you with the best care possible. Book an appointment today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Link to="/appointments">Book Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
