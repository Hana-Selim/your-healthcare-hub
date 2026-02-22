import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Star, Check, MapPin, Phone, GraduationCap, Award, Calendar } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    experience: "15 Years Exp.",
    rating: 4.9,
    reviews: 124,
    available: true,
    nextSlot: null,
    bio: "Expert in preventative heart care, hypertension management, and non-invasive cardiac imaging.",
    fullBio: "Dr. Sarah Jenkins is a board-certified cardiologist with over 15 years of experience in diagnosing and treating cardiovascular conditions. She specializes in preventive cardiology, echocardiography, and managing complex cases of hypertension and heart failure. Dr. Jenkins completed her fellowship at Johns Hopkins Hospital and has published numerous papers on non-invasive cardiac imaging techniques.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwBmBQPqUSBN-uj_lttWbJyCahHpbMDKc9O9JW68ezMlg0rCTKdnmAeeeOIIzd8pf2GRuvJvXOpwXVmk8ocU-W4VTmfgiKQdzzBi9_PiGGhm5MpsFCjyX3ZZpBolln37w0V_lZmIsMv_TCKxUq3aIKpnKsVIdTkQXWQqhogj0arhLp9c49qh4_4TvBTBvlwuFz3UcHYzASoM33pPIcBTRkVHTPj-S37u-A3_9dv29et70em_pYfCgV9kQy3qk6seNeQ-LPIU2EZzq",
    education: ["MD - Harvard Medical School", "Fellowship in Cardiology - Johns Hopkins Hospital"],
    languages: ["English", "Spanish"],
    location: "Building A, 3rd Floor, Room 312",
    phone: "+1 (555) 123-4567",
    consultationFee: "$150",
    conditions: ["Hypertension", "Heart Failure", "Arrhythmia", "Coronary Artery Disease", "Valve Disorders"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:15 AM", "02:00 PM", "03:30 PM"],
  },
  {
    id: 2,
    name: "Dr. Mark Alistair",
    specialty: "Neurology",
    experience: "12 Years Exp.",
    rating: 4.8,
    reviews: 89,
    available: false,
    nextSlot: "Tue, 14th",
    bio: "Specializing in migraine treatment, cognitive therapy, and complex neurological disorders.",
    fullBio: "Dr. Mark Alistair is a renowned neurologist with 12 years of experience in treating complex neurological conditions. He has a special interest in migraine management, cognitive neurology, and neurodegenerative diseases. Dr. Alistair is known for his patient-centric approach and has been recognized for his research in headache medicine.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS",
    education: ["MD - Stanford University", "Residency in Neurology - Mayo Clinic"],
    languages: ["English", "French"],
    location: "Building B, 2nd Floor, Room 205",
    phone: "+1 (555) 234-5678",
    consultationFee: "$175",
    conditions: ["Migraines", "Epilepsy", "Multiple Sclerosis", "Parkinson's Disease", "Stroke Recovery"],
    availableSlots: ["10:00 AM", "11:00 AM", "03:00 PM", "04:00 PM"],
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Pediatrics",
    experience: "8 Years Exp.",
    rating: 5.0,
    reviews: 156,
    available: true,
    nextSlot: null,
    bio: "Dedicated to providing compassionate care for children of all ages, from newborns to adolescents.",
    fullBio: "Dr. Emily Chen is a compassionate pediatrician devoted to providing exceptional healthcare for children from birth through adolescence. With 8 years of experience, she focuses on preventive care, developmental assessments, and managing chronic childhood conditions. Parents appreciate her warm, gentle approach that puts children at ease.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoda_ygx8DlG-8IrF7IxJGtlOn7r3wautoxZD7dUHwngKli8Pku7XRDxIogI3Osx3O0Yi8T5KT12JyPhzUNsVvnKG4R9qXuVQpOFylhHHNIXt-kfmv-2hfRSPgTngEHCl1mc9qQ3SE-ABouayOBlPjU75l9UpKn_5KOO5TBbyP4xt9csswoD2-bZ7hENLJmAdIWvQCOmddL5h6hyF3IZ2F6prjbLIiWuOdZrKwV_PdJ9UFVcpbFfBSIeJ6qqexomnk6wAKJU4BJr_O",
    education: ["MD - UCLA", "Residency in Pediatrics - Children's Hospital LA"],
    languages: ["English", "Mandarin"],
    location: "Children's Wing, 1st Floor, Room 110",
    phone: "+1 (555) 345-6789",
    consultationFee: "$120",
    conditions: ["Asthma", "Allergies", "Growth Disorders", "ADHD", "Childhood Infections"],
    availableSlots: ["08:30 AM", "09:30 AM", "10:30 AM", "01:00 PM", "02:30 PM"],
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    experience: "20 Years Exp.",
    rating: 4.7,
    reviews: 203,
    available: true,
    nextSlot: null,
    bio: "Board-certified orthopedic surgeon specializing in joint replacement and sports medicine.",
    fullBio: "Dr. James Wilson is one of the most experienced orthopedic surgeons in the region with over 20 years of surgical expertise. He specializes in total joint replacement, arthroscopic surgery, and sports medicine. Dr. Wilson has performed thousands of successful surgeries and is recognized for his innovative approaches to minimally invasive procedures.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS",
    education: ["MD - Columbia University", "Fellowship in Orthopedic Surgery - HSS"],
    languages: ["English"],
    location: "Building A, 4th Floor, Room 415",
    phone: "+1 (555) 456-7890",
    consultationFee: "$200",
    conditions: ["Joint Pain", "Fractures", "Sports Injuries", "Arthritis", "Back Pain"],
    availableSlots: ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
  },
  {
    id: 5,
    name: "Dr. Lisa Anderson",
    specialty: "Dermatology",
    experience: "10 Years Exp.",
    rating: 4.9,
    reviews: 178,
    available: false,
    nextSlot: "Wed, 15th",
    bio: "Expert in medical and cosmetic dermatology, including skin cancer treatment.",
    fullBio: "Dr. Lisa Anderson is a dual board-certified dermatologist with expertise in both medical and cosmetic dermatology. With 10 years of experience, she treats conditions ranging from acne and eczema to skin cancer detection and treatment. She also offers advanced cosmetic procedures including laser therapy and injectable treatments.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwBmBQPqUSBN-uj_lttWbJyCahHpbMDKc9O9JW68ezMlg0rCTKdnmAeeeOIIzd8pf2GRuvJvXOpwXVmk8ocU-W4VTmfgiKQdzzBi9_PiGGhm5MpsFCjyX3ZZpBolln37w0V_lZmIsMv_TCKxUq3aIKpnKsVIdTkQXWQqhogj0arhLp9c49qh4_4TvBTBvlwuFz3UcHYzASoM33pPIcBTRkVHTPj-S37u-A3_9dv29et70em_pYfCgV9kQy3qk6seNeQ-LPIU2EZzq",
    education: ["MD - NYU School of Medicine", "Residency in Dermatology - Mount Sinai"],
    languages: ["English", "German"],
    location: "Building C, 1st Floor, Room 102",
    phone: "+1 (555) 567-8901",
    consultationFee: "$160",
    conditions: ["Acne", "Eczema", "Psoriasis", "Skin Cancer", "Cosmetic Procedures"],
    availableSlots: [],
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Oncology",
    experience: "18 Years Exp.",
    rating: 4.8,
    reviews: 145,
    available: true,
    nextSlot: null,
    bio: "Leading oncologist with expertise in immunotherapy and targeted cancer treatments.",
    fullBio: "Dr. Robert Kim is a distinguished oncologist with 18 years of experience in treating various forms of cancer. He is a pioneer in immunotherapy approaches and targeted cancer treatments. Dr. Kim leads clinical trials and has contributed significantly to advancing cancer care through research and innovation.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS",
    education: ["MD - University of Pennsylvania", "Fellowship in Oncology - Memorial Sloan Kettering"],
    languages: ["English", "Korean"],
    location: "Oncology Center, 2nd Floor, Room 220",
    phone: "+1 (555) 678-9012",
    consultationFee: "$190",
    conditions: ["Breast Cancer", "Lung Cancer", "Lymphoma", "Leukemia", "Immunotherapy"],
    availableSlots: ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"],
  },
];

export default function DoctorProfile() {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === Number(id));

  if (!doctor) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Doctor Not Found</h1>
          <Link to="/doctors">
            <Button>Back to Doctors</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex flex-wrap gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary font-medium">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/doctors" className="text-muted-foreground hover:text-primary font-medium">Doctors</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary font-medium">{doctor.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Card */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-6 p-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-40 h-40 rounded-xl object-cover object-top"
                  />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold ${
                    doctor.available ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  }`}>
                    {doctor.available ? "Available Today" : `Next: ${doctor.nextSlot}`}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black">{doctor.name}</h1>
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-primary font-semibold">{doctor.specialty}</p>
                  <p className="text-sm text-muted-foreground">{doctor.experience}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm">{doctor.rating}</span>
                    <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                      <MapPin className="w-3.5 h-3.5" /> {doctor.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                      <Phone className="w-3.5 h-3.5" /> {doctor.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{doctor.fullBio}</p>
            </div>

            {/* Education */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" /> Education & Training
              </h2>
              <ul className="space-y-2">
                {doctor.education.map((edu, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {edu}
                  </li>
                ))}
              </ul>
            </div>

            {/* Conditions Treated */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold mb-3">Conditions Treated</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.conditions.map((condition) => (
                  <span key={condition} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full">
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold mb-3">Languages</h2>
              <div className="flex gap-2">
                {doctor.languages.map((lang) => (
                  <span key={lang} className="bg-muted text-muted-foreground text-sm font-medium px-3 py-1.5 rounded-lg">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-bold mb-1">Book Appointment</h3>
                <p className="text-sm text-muted-foreground mb-4">Select a time slot to proceed</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" /> Available Slots - Today
                  </p>
                  {doctor.availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {doctor.availableSlots.map((slot) => (
                        <Link
                          key={slot}
                          to={`/appointments?doctor=${doctor.id}&slot=${encodeURIComponent(slot)}`}
                          className="px-3 py-2 border border-border rounded-lg text-sm font-medium text-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
                        >
                          {slot}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
                      No slots available today. Next available: {doctor.nextSlot}
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground">Consultation Fee</span>
                    <span className="font-bold">{doctor.consultationFee}</span>
                  </div>
                  <Button asChild className="w-full" size="lg">
                    <Link to={`/appointments?doctor=${doctor.id}`}>Book Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
