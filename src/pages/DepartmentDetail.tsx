import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Bone, Baby, Stethoscope, Eye, Pill, Activity, Users, Clock, Award, CheckCircle } from "lucide-react";

const departmentsData: Record<string, {
  icon: React.ElementType;
  name: string;
  fullName: string;
  desc: string;
  overview: string;
  services: string[];
  doctors: { name: string; title: string; image: string }[];
  facilities: string[];
  workingHours: string;
  phone: string;
  location: string;
  stats: { label: string; value: string }[];
}> = {
  cardiology: {
    icon: Heart,
    name: "Cardiology",
    fullName: "Cardiology & Cardiovascular Medicine",
    desc: "Comprehensive heart care ranging from preventative screening to advanced surgical interventions.",
    overview: "Our Cardiology Department is equipped with state-of-the-art technology and staffed by world-renowned cardiologists. We offer a full spectrum of cardiovascular services including diagnostic testing, interventional procedures, cardiac surgery, and cardiac rehabilitation. Our team is committed to providing personalized care for every patient, from routine check-ups to complex heart surgeries.",
    services: ["Echocardiography", "Cardiac Catheterization", "Pacemaker Implantation", "Coronary Angioplasty", "Heart Failure Management", "Preventive Cardiology", "Electrophysiology Studies", "Cardiac Rehabilitation"],
    doctors: [
      { name: "Dr. Sarah Jenkins", title: "Head of Cardiology", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwBmBQPqUSBN-uj_lttWbJyCahHpbMDKc9O9JW68ezMlg0rCTKdnmAeeeOIIzd8pf2GRuvJvXOpwXVmk8ocU-W4VTmfgiKQdzzBi9_PiGGhm5MpsFCjyX3ZZpBolln37w0V_lZmIsMv_TCKxUq3aIKpnKsVIdTkQXWQqhogj0arhLp9c49qh4_4TvBTBvlwuFz3UcHYzASoM33pPIcBTRkVHTPj-S37u-A3_9dv29et70em_pYfCgV9kQy3qk6seNeQ-LPIU2EZzq" },
    ],
    facilities: ["Cardiac ICU", "Catheterization Lab", "ECG & Stress Testing Lab", "Cardiac Imaging Center"],
    workingHours: "Sunday - Thursday: 8:00 AM - 5:00 PM | Emergency: 24/7",
    phone: "+1 (555) 100-2000",
    location: "Building A, 3rd Floor",
    stats: [{ label: "Surgeries/Year", value: "2,500+" }, { label: "Specialists", value: "12" }, { label: "Success Rate", value: "98%" }, { label: "Beds", value: "45" }],
  },
  orthopedics: {
    icon: Bone, name: "Orthopedics", fullName: "Orthopedic Surgery & Sports Medicine",
    desc: "Expert care for bones, joints, and musculoskeletal conditions.",
    overview: "Our Orthopedic Department offers cutting-edge treatments for bone, joint, and muscle disorders. From sports injuries to total joint replacements, our surgeons use the latest minimally invasive techniques to ensure faster recovery.",
    services: ["Joint Replacement", "Arthroscopy", "Spine Surgery", "Sports Medicine", "Fracture Care", "Physical Therapy"],
    doctors: [{ name: "Dr. James Wilson", title: "Head of Orthopedics", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS" }],
    facilities: ["Orthopedic OR Suite", "Rehabilitation Center", "Biomechanics Lab"],
    workingHours: "Sunday - Thursday: 8:00 AM - 5:00 PM", phone: "+1 (555) 100-3000", location: "Building A, 4th Floor",
    stats: [{ label: "Surgeries/Year", value: "3,000+" }, { label: "Specialists", value: "8" }, { label: "Success Rate", value: "97%" }, { label: "Beds", value: "30" }],
  },
  neurology: {
    icon: Brain, name: "Neurology", fullName: "Neurology & Neuroscience Center",
    desc: "Specialized treatment for brain, spine, and nervous system disorders.",
    overview: "Our Neurology Department provides comprehensive care for neurological conditions. Our neurologists and neurosurgeons work together to diagnose and treat complex conditions affecting the brain, spinal cord, and peripheral nerves.",
    services: ["EEG & EMG Studies", "Stroke Treatment", "Epilepsy Management", "Movement Disorders", "Headache Clinic", "Neuromuscular Care"],
    doctors: [{ name: "Dr. Mark Alistair", title: "Head of Neurology", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS" }],
    facilities: ["Neuro ICU", "MRI Suite", "Neurodiagnostics Lab"],
    workingHours: "Sunday - Thursday: 8:00 AM - 5:00 PM", phone: "+1 (555) 100-4000", location: "Building B, 2nd Floor",
    stats: [{ label: "Patients/Year", value: "5,000+" }, { label: "Specialists", value: "10" }, { label: "Success Rate", value: "96%" }, { label: "Beds", value: "35" }],
  },
  pediatrics: {
    icon: Baby, name: "Pediatrics", fullName: "Pediatrics & Child Health",
    desc: "Dedicated care for infants, children, and adolescents.",
    overview: "Our Pediatrics Department provides warm, child-friendly healthcare for children of all ages. From routine check-ups to specialized care, our pediatricians are dedicated to keeping your child healthy and happy.",
    services: ["Well-Child Visits", "Vaccination Programs", "Developmental Screening", "Pediatric Emergency", "Neonatal Care", "Child Psychology"],
    doctors: [{ name: "Dr. Emily Chen", title: "Head of Pediatrics", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoda_ygx8DlG-8IrF7IxJGtlOn7r3wautoxZD7dUHwngKli8Pku7XRDxIogI3Osx3O0Yi8T5KT12JyPhzUNsVvnKG4R9qXuVQpOFylhHHNIXt-kfmv-2hfRSPgTngEHCl1mc9qQ3SE-ABouayOBlPjU75l9UpKn_5KOO5TBbyP4xt9csswoD2-bZ7hENLJmAdIWvQCOmddL5h6hyF3IZ2F6prjbLIiWuOdZrKwV_PdJ9UFVcpbFfBSIeJ6qqexomnk6wAKJU4BJr_O" }],
    facilities: ["Pediatric ICU", "Playroom", "Neonatal Unit"],
    workingHours: "Daily: 8:00 AM - 8:00 PM | Emergency: 24/7", phone: "+1 (555) 100-5000", location: "Children's Wing, 1st Floor",
    stats: [{ label: "Patients/Year", value: "8,000+" }, { label: "Specialists", value: "15" }, { label: "Satisfaction", value: "99%" }, { label: "Beds", value: "40" }],
  },
  oncology: {
    icon: Stethoscope, name: "Oncology", fullName: "Oncology & Cancer Center",
    desc: "Advanced cancer treatment including chemotherapy, radiation, and immunotherapy.",
    overview: "Our Oncology Center is a beacon of hope for cancer patients, offering the most advanced treatments available. From early detection to comprehensive treatment plans, our multidisciplinary team works together to fight cancer with cutting-edge technology and compassionate care.",
    services: ["Chemotherapy", "Radiation Therapy", "Immunotherapy", "Surgical Oncology", "Cancer Screening", "Palliative Care"],
    doctors: [{ name: "Dr. Robert Kim", title: "Head of Oncology", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS" }],
    facilities: ["Radiation Suite", "Infusion Center", "PET/CT Scanner"],
    workingHours: "Sunday - Thursday: 7:00 AM - 6:00 PM", phone: "+1 (555) 100-6000", location: "Oncology Center, 2nd Floor",
    stats: [{ label: "Patients/Year", value: "3,500+" }, { label: "Specialists", value: "14" }, { label: "Clinical Trials", value: "25+" }, { label: "Beds", value: "50" }],
  },
  ophthalmology: {
    icon: Eye, name: "Ophthalmology", fullName: "Ophthalmology & Eye Care",
    desc: "Complete eye care from routine exams to complex surgical procedures.",
    overview: "Our Ophthalmology Department provides comprehensive eye care with advanced diagnostic and surgical capabilities. We specialize in treating all eye conditions from simple refractive errors to complex retinal surgeries.",
    services: ["LASIK Surgery", "Cataract Surgery", "Glaucoma Treatment", "Retinal Surgery", "Pediatric Ophthalmology", "Contact Lens Fitting"],
    doctors: [], facilities: ["Laser Surgery Suite", "Retinal Imaging Center"],
    workingHours: "Sunday - Thursday: 8:00 AM - 4:00 PM", phone: "+1 (555) 100-7000", location: "Building C, 3rd Floor",
    stats: [{ label: "Surgeries/Year", value: "4,000+" }, { label: "Specialists", value: "6" }, { label: "Success Rate", value: "99%" }, { label: "Lasers", value: "5" }],
  },
  dermatology: {
    icon: Pill, name: "Dermatology", fullName: "Dermatology & Skin Care",
    desc: "Treatment for all skin, hair, and nail conditions with cosmetic services.",
    overview: "Our Dermatology Department offers expert care for all skin conditions. Whether you need treatment for a medical skin condition or are looking for cosmetic enhancements, our dermatologists provide personalized treatment plans.",
    services: ["Skin Cancer Screening", "Acne Treatment", "Laser Therapy", "Cosmetic Dermatology", "Mohs Surgery", "Allergy Testing"],
    doctors: [{ name: "Dr. Lisa Anderson", title: "Head of Dermatology", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwBmBQPqUSBN-uj_lttWbJyCahHpbMDKc9O9JW68ezMlg0rCTKdnmAeeeOIIzd8pf2GRuvJvXOpwXVmk8ocU-W4VTmfgiKQdzzBi9_PiGGhm5MpsFCjyX3ZZpBolln37w0V_lZmIsMv_TCKxUq3aIKpnKsVIdTkQXWQqhogj0arhLp9c49qh4_4TvBTBvlwuFz3UcHYzASoM33pPIcBTRkVHTPj-S37u-A3_9dv29et70em_pYfCgV9kQy3qk6seNeQ-LPIU2EZzq" }],
    facilities: ["Laser Center", "Dermatopathology Lab"],
    workingHours: "Sunday - Thursday: 9:00 AM - 5:00 PM", phone: "+1 (555) 100-8000", location: "Building C, 1st Floor",
    stats: [{ label: "Patients/Year", value: "6,000+" }, { label: "Specialists", value: "5" }, { label: "Procedures", value: "50+" }, { label: "Lasers", value: "8" }],
  },
  gastroenterology: {
    icon: Activity, name: "Gastroenterology", fullName: "Gastroenterology & Digestive Health",
    desc: "Digestive system care including endoscopy and liver disease treatment.",
    overview: "Our Gastroenterology Department provides comprehensive care for digestive disorders. We specialize in advanced endoscopic procedures, liver disease management, and inflammatory bowel disease treatment.",
    services: ["Colonoscopy", "Upper Endoscopy", "Liver Disease Treatment", "IBD Management", "ERCP", "Motility Studies"],
    doctors: [], facilities: ["Endoscopy Suite", "GI Lab"],
    workingHours: "Sunday - Thursday: 8:00 AM - 5:00 PM", phone: "+1 (555) 100-9000", location: "Building B, 3rd Floor",
    stats: [{ label: "Procedures/Year", value: "5,500+" }, { label: "Specialists", value: "7" }, { label: "Success Rate", value: "98%" }, { label: "Scopes", value: "12" }],
  },
};

export default function DepartmentDetail() {
  const { slug } = useParams();
  const dept = slug ? departmentsData[slug.toLowerCase()] : null;

  if (!dept) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
          <Link to="/departments"><Button>Back to Departments</Button></Link>
        </div>
      </Layout>
    );
  }

  const Icon = dept.icon;

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <div className="flex flex-wrap gap-2 text-sm mb-6">
            <Link to="/" className="text-muted-foreground hover:text-primary font-medium">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/departments" className="text-muted-foreground hover:text-primary font-medium">Departments</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary font-medium">{dept.name}</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-primary text-white">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{dept.fullName}</h1>
              <p className="text-muted-foreground mt-1">{dept.desc}</p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {dept.stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-black text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{dept.overview}</p>
            </div>

            {/* Services */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold mb-4">Our Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dept.services.map((service) => (
                  <div key={service} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctors */}
            {dept.doctors.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Our Specialists
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dept.doctors.map((doc) => (
                    <div key={doc.name} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                      <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Facilities & Equipment
              </h2>
              <div className="flex flex-wrap gap-2">
                {dept.facilities.map((f) => (
                  <span key={f} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-bold mb-4">Contact & Hours</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Working Hours</p>
                      <p className="text-muted-foreground">{dept.workingHours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{dept.location}</p>
                    </div>
                  </div>
                </div>
                <Button asChild className="w-full mt-6" size="lg">
                  <Link to="/appointments">Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" className="w-full mt-3">
                  <Link to="/doctors">Find a Doctor</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

function MapPin(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
