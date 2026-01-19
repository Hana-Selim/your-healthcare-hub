import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Award, Shield, Star, Flag, Building, Users, TrendingUp } from "lucide-react";

const stats = [
  { value: "50+", label: "Years of Service" },
  { value: "10k+", label: "Surgeries Performed" },
  { value: "500+", label: "Dedicated Doctors" },
  { value: "450", label: "Hospital Beds" },
];

const values = [
  { icon: Heart, title: "Compassion", desc: "We treat every patient with the same kindness and respect we would show our own families." },
  { icon: Award, title: "Excellence", desc: "We strive for the highest standards in clinical outcomes and patient safety." },
  { icon: Shield, title: "Integrity", desc: "We conduct our practice with honesty, transparency, and ethical responsibility." },
];

const timeline = [
  { year: "1970", icon: Flag, title: "Foundation", desc: "Founded by Dr. Smith with a vision to provide accessible healthcare to the local community." },
  { year: "1985", icon: Building, title: "First Expansion", desc: "Opened new wing with 200 additional beds and state-of-the-art surgical suites." },
  { year: "2000", icon: Users, title: "Community Outreach", desc: "Launched free health clinics serving over 10,000 underserved patients annually." },
  { year: "2020", icon: TrendingUp, title: "Digital Transformation", desc: "Implemented telemedicine platform and AI-powered diagnostic tools." },
];

const leadership = [
  {
    name: "Dr. Michael Roberts",
    role: "Chief Executive Officer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS"
  },
  {
    name: "Dr. Patricia Lee",
    role: "Chief Medical Officer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwBmBQPqUSBN-uj_lttWbJyCahHpbMDKc9O9JW68ezMlg0rCTKdnmAeeeOIIzd8pf2GRuvJvXOpwXVmk8ocU-W4VTmfgiKQdzzBi9_PiGGhm5MpsFCjyX3ZZpBolln37w0V_lZmIsMv_TCKxUq3aIKpnKsVIdTkQXWQqhogj0arhLp9c49qh4_4TvBTBvlwuFz3UcHYzASoM33pPIcBTRkVHTPj-S37u-A3_9dv29et70em_pYfCgV9kQy3qk6seNeQ-LPIU2EZzq"
  },
  {
    name: "James Wilson",
    role: "Chief Operations Officer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS"
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative w-full h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 25, 34, 0.6), rgba(16, 25, 34, 0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjG6mqd0nEeAApPxbmudGEDRz3KlweqscJ7Hd5-KqEhPvUiHD7pncjuWpFIrne5W6VDGBVufluZ56qMSIXY5jQtsNF4kDy07WmT12K0GkopLYwZPGE-_x5K7xDkAUo3LaccC2VNuZvwlQDGD00vEhmR_sZdG_9XKO6Q28utT8shZ-TOW_KgqyANybQbhAO3cFq8yZtYd2c8-sk9lUXKHYlPao67phetW4vaJ0WfaZjIh7aHdLyX1BkfOWZD0T0gDIrmsQIZaFEee-B')`
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Dedicated to Hope, Healing, and Health</h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto font-light">
            Providing world-class medical care with compassion for over 50 years. We are committed to being your partner in health.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Our Services</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-xl border border-border hover:shadow-md transition-shadow">
                <p className="text-primary text-4xl font-black mb-1">{stat.value}</p>
                <p className="text-muted-foreground font-medium text-sm uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Our Philosophy</span>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">Our Mission & Values</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We are committed to providing the highest quality patient care, supporting the health of our community, and advancing medicine through education and research.
                </p>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {values.map((value) => (
                  <div key={value.title} className="flex gap-4 p-4 rounded-xl bg-card shadow-sm border border-border">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <value.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFQNRhuPD1j04Zg8n3w1ANF4PSgMQDpQhywBVkScCv8wpqOgNbngWrv8LjbH3ey8ItAD6nxIr6ez9tS8ptcAsD8ycfWgouZIRDNlTTB65gPLmvnQQlgt3wDLL3wuTZ5aIXs6uzqMeV9VUvzN5KFh0KF-IjAazZW32luz94X3PLbvwOqjoNdpcIl9yvr2nyXe8q-lrcFw87sQPGPKDhxGRtYHfx9j7iTS8rTSt5Vp5vBSZlzF9nijj23V8UZu5PeMbHxPTENO6Ab3I_"
                alt="Doctor caring for patient"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="font-medium text-lg">"The care I received at City General was nothing short of exceptional. The staff treated me like family."</p>
                <p className="mt-4 font-bold text-sm opacity-80">- Patient Testimonial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-5xl mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Our History</span>
            <h2 className="text-3xl md:text-4xl font-bold">A Legacy of Care</h2>
          </div>
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
            
            {/* Timeline Items */}
            <div className="flex flex-col gap-12">
              {timeline.map((item, index) => (
                <div key={item.year} className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 group ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} order-2 ${index % 2 === 0 ? "md:order-1" : "md:order-3"} pl-12 md:pl-0`}>
                    <h3 className="text-xl font-bold">{item.year} - {item.title}</h3>
                    <p className="text-muted-foreground mt-2">{item.desc}</p>
                  </div>
                  <div className="absolute left-0 md:left-1/2 size-10 rounded-full bg-card border-4 border-primary flex items-center justify-center -translate-x-[2px] md:-translate-x-1/2 z-10 order-1 md:order-2">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"} ${index % 2 === 0 ? "order-3" : "order-1"}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((person) => (
              <div key={person.name} className="flex flex-col items-center text-center">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-primary/20"
                />
                <h3 className="text-lg font-bold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 px-4 md:px-10 bg-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented healthcare professionals to join our family. Explore career opportunities at City General Hospital.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            View Careers
          </Button>
        </div>
      </section>
    </Layout>
  );
}
