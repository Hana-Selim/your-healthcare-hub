import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Brain, Bone, Baby, Stethoscope, Eye, Pill, Activity, Syringe, Thermometer, Microscope, Shield } from "lucide-react";

const categories = ["All Services", "Surgical", "Internal Medicine", "Women & Children", "Diagnostic", "Emergency"];

const departments = [
  { icon: Heart, name: "Cardiology", desc: "Comprehensive heart care ranging from preventative screening to advanced surgical interventions.", category: "Internal Medicine" },
  { icon: Bone, name: "Orthopedics", desc: "Expert care for bones, joints, and musculoskeletal conditions with minimally invasive procedures.", category: "Surgical" },
  { icon: Brain, name: "Neurology", desc: "Specialized treatment for brain, spine, and nervous system disorders.", category: "Internal Medicine" },
  { icon: Baby, name: "Pediatrics", desc: "Dedicated care for infants, children, and adolescents in a child-friendly environment.", category: "Women & Children" },
  { icon: Stethoscope, name: "Oncology", desc: "Advanced cancer treatment including chemotherapy, radiation, and immunotherapy.", category: "Internal Medicine" },
  { icon: Eye, name: "Ophthalmology", desc: "Complete eye care from routine exams to complex surgical procedures.", category: "Surgical" },
  { icon: Pill, name: "Dermatology", desc: "Treatment for all skin, hair, and nail conditions with cosmetic services.", category: "Internal Medicine" },
  { icon: Activity, name: "Gastroenterology", desc: "Digestive system care including endoscopy and liver disease treatment.", category: "Internal Medicine" },
  { icon: Syringe, name: "General Surgery", desc: "Comprehensive surgical services with advanced laparoscopic techniques.", category: "Surgical" },
  { icon: Thermometer, name: "Emergency Medicine", desc: "24/7 emergency care with rapid response and trauma services.", category: "Emergency" },
  { icon: Microscope, name: "Pathology & Lab", desc: "State-of-the-art diagnostic testing and laboratory services.", category: "Diagnostic" },
  { icon: Shield, name: "Radiology", desc: "Advanced imaging including MRI, CT scan, and ultrasound.", category: "Diagnostic" },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Departments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [selectedLetter, setSelectedLetter] = useState("A");

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Services" || dept.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <div className="w-full relative">
        <div 
          className="flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-6 md:p-10"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 25, 34, 0.6), rgba(16, 25, 34, 0.8)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5Ivanq4CZrc4WnRt5LC8GwSt-_FbYyQkV3qxLhPMX0GR9JDeIdiTqOtiJcUzJ6Ze65UcWo5Eh9UZf0j16kgNfJE5PdKpkP0093wa_A2fa9wl9QAHsk1B8f7ZptNIbOCA7U6EBWxN0BNvOUymkgv7RPa1p9Q7QiG6yQn6qD5joFuwrGbEv6r4sv5VkCim8zTEu33yx_Y_NjcF6-Sd2-kCu8yXJ7uRyfBpVVRN2hguJId0mJGyO0ash_bv1k-U_enXnudTbYtosVz6z")`
          }}
        >
          <div className="flex flex-col gap-3 text-center z-10 max-w-2xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Departments & Services
            </h1>
            <p className="text-slate-200 text-lg md:text-xl">
              World-Class Care, Specialized for You.
            </p>
          </div>
          <div className="flex w-full max-w-xl z-10 mt-4">
            <div className="flex w-full items-stretch rounded-lg h-14 overflow-hidden shadow-xl">
              <div className="flex bg-white items-center justify-center pl-4 pr-2">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <Input
                className="flex-1 border-none bg-white h-full rounded-none focus-visible:ring-0"
                placeholder="Search for a specialty, treatment, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="rounded-none h-full px-6">Search</Button>
            </div>
          </div>
        </div>
      </div>

      {/* A-Z Index */}
      <div className="border-b border-border bg-card sticky top-[64px] md:top-[80px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex items-center gap-2 overflow-x-auto py-3 hide-scrollbar">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2 shrink-0">Index:</span>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? "bg-primary text-white shadow-sm"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 pb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex h-9 items-center justify-center gap-x-2 rounded-lg pl-4 pr-3 transition-colors ${
                selectedCategory === category
                  ? "bg-slate-200 dark:bg-slate-800"
                  : "bg-white dark:bg-slate-800 border border-border hover:border-primary/50"
              }`}
            >
              <span className="text-sm font-medium">{category}</span>
            </button>
          ))}
        </div>

        {/* Department Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Medical Specialties</h2>
            <p className="text-muted-foreground max-w-2xl">Browse our comprehensive list of departments providing expert care for you and your family.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <div 
                key={dept.name}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <dept.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">{dept.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{dept.desc}</p>
                </div>
                <div className="mt-auto pt-2 flex items-center gap-4">
                  <Link to={`/departments/${dept.name.toLowerCase()}`} className="text-sm font-bold text-primary hover:underline">
                    Learn More
                  </Link>
                  <span className="text-border">|</span>
                  <Link to="/appointments" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
