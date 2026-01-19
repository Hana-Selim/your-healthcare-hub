import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Check, Clock } from "lucide-react";

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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwBmBQPqUSBN-uj_lttWbJyCahHpbMDKc9O9JW68ezMlg0rCTKdnmAeeeOIIzd8pf2GRuvJvXOpwXVmk8ocU-W4VTmfgiKQdzzBi9_PiGGhm5MpsFCjyX3ZZpBolln37w0V_lZmIsMv_TCKxUq3aIKpnKsVIdTkQXWQqhogj0arhLp9c49qh4_4TvBTBvlwuFz3UcHYzASoM33pPIcBTRkVHTPj-S37u-A3_9dv29et70em_pYfCgV9kQy3qk6seNeQ-LPIU2EZzq"
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS"
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoda_ygx8DlG-8IrF7IxJGtlOn7r3wautoxZD7dUHwngKli8Pku7XRDxIogI3Osx3O0Yi8T5KT12JyPhzUNsVvnKG4R9qXuVQpOFylhHHNIXt-kfmv-2hfRSPgTngEHCl1mc9qQ3SE-ABouayOBlPjU75l9UpKn_5KOO5TBbyP4xt9csswoD2-bZ7hENLJmAdIWvQCOmddL5h6hyF3IZ2F6prjbLIiWuOdZrKwV_PdJ9UFVcpbFfBSIeJ6qqexomnk6wAKJU4BJr_O"
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS"
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwBmBQPqUSBN-uj_lttWbJyCahHpbMDKc9O9JW68ezMlg0rCTKdnmAeeeOIIzd8pf2GRuvJvXOpwXVmk8ocU-W4VTmfgiKQdzzBi9_PiGGhm5MpsFCjyX3ZZpBolln37w0V_lZmIsMv_TCKxUq3aIKpnKsVIdTkQXWQqhogj0arhLp9c49qh4_4TvBTBvlwuFz3UcHYzASoM33pPIcBTRkVHTPj-S37u-A3_9dv29et70em_pYfCgV9kQy3qk6seNeQ-LPIU2EZzq"
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS"
  },
];

const specialties = ["All", "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "Oncology"];

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    const matchesAvailability = !showAvailableOnly || doctor.available;
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex flex-wrap gap-2 text-sm">
          <Link to="/" className="font-medium text-muted-foreground hover:text-primary">Home</Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-primary">Doctors</span>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Our Specialists</h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
            Find dedicated medical professionals ready to care for you. Browse by specialty or search for a specific doctor.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                className="w-full pl-10 bg-muted border-none"
                placeholder="Search by doctor name or condition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="hidden lg:block h-8 w-px bg-border" />

            {/* Filters */}
            <div className="flex flex-1 flex-wrap items-center gap-3">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
                    selectedSpecialty === specialty
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {specialty}
                </button>
              ))}
              <label className="flex cursor-pointer items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-muted-foreground">Available Today</span>
              </label>
            </div>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border transition-all hover:shadow-md hover:ring-primary/20"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-semibold backdrop-blur ${
                  doctor.available
                    ? "bg-white/90 text-green-700"
                    : "bg-white/90 text-slate-700"
                }`}>
                  {doctor.available ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Available Today
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Next: {doctor.nextSlot}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">{doctor.specialty}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-medium text-muted-foreground">{doctor.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.experience}</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{doctor.bio}</p>
                <div className="mt-auto pt-5 flex flex-col gap-3">
                  <Button asChild className="w-full">
                    <Link to="/appointments">Book Appointment</Link>
                  </Button>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
