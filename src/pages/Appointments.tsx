import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Star, Check, Video } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiologist",
    experience: "12 Yrs Exp.",
    rating: 4.9,
    reviews: 124,
    fee: 150,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL5QfB6whGnNWmdwYBZYmMWsgktlLsIIHVTKTv4rg8qfkPW9FKuCN0DE1JDHHlHpKx7nZmZC3fV-fbZg_cjqyz39e7Pzk_qag1VwtoGL8bie1Rdt9tvBPzi4i94Mt07Qh1kQUAAop_nKeZdGNCK_G8VLeKPARwci7rullppkVYd8WiF7oSUpIGzGO6qwyI2zaEg16zNhfpz8hN-PUJpLSSIlIdGwArve_MuOi9QYOWGQnus6CDb8PDzReC-BDp_YXb9kRJaJ0vw44u",
    slots: ["09:00 AM", "09:30 AM", "10:00 AM", "11:15 AM", "02:00 PM", "02:30 PM"],
    services: ["Video Consult", "In-Person"],
    verified: true,
    online: true,
  },
  {
    id: 2,
    name: "Dr. Mark Alistair",
    specialty: "Neurologist",
    experience: "15 Yrs Exp.",
    rating: 4.8,
    reviews: 89,
    fee: 175,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UUaUHP7jAw_RJhm6gCnbR0Iey-baPTbGAgzyd88Lx8gtHjWHPna8eR9PlAT53Kge7bSq4l4uxOFaKK8MC6rbgUp48Qg38HmPLfB8Yy_I7Ie8eTBAZZz97VzwJUw75cj5LpO9GE5RpPrzyhmf0Cvk3dtj_ST9Oo8rCS7XWW8za94y7JzNTmTZjce5re7HPok6TnN-Rbpt6ExcNRRXDmftr7XXY99mkZdwW0wKpZDHP3vz9PuA68ASxPPodabzlyc6C18uCBAUxKYS",
    slots: ["10:00 AM", "11:00 AM", "03:00 PM", "04:00 PM"],
    services: ["In-Person"],
    verified: true,
    online: false,
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Pediatrician",
    experience: "8 Yrs Exp.",
    rating: 5.0,
    reviews: 156,
    fee: 120,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoda_ygx8DlG-8IrF7IxJGtlOn7r3wautoxZD7dUHwngKli8Pku7XRDxIogI3Osx3O0Yi8T5KT12JyPhzUNsVvnKG4R9qXuVQpOFylhHHNIXt-kfmv-2hfRSPgTngEHCl1mc9qQ3SE-ABouayOBlPjU75l9UpKn_5KOO5TBbyP4xt9csswoD2-bZ7hENLJmAdIWvQCOmddL5h6hyF3IZ2F6prjbLIiWuOdZrKwV_PdJ9UFVcpbFfBSIeJ6qqexomnk6wAKJU4BJr_O",
    slots: ["08:30 AM", "09:30 AM", "10:30 AM", "01:00 PM", "02:30 PM"],
    services: ["Video Consult", "In-Person"],
    verified: true,
    online: true,
  },
];

const dates = [
  { day: "Today", date: "24 Oct" },
  { day: "Fri", date: "25 Oct" },
  { day: "Sat", date: "26 Oct" },
  { day: "Sun", date: "27 Oct" },
];

const departments = ["All Departments", "Cardiology", "Dermatology", "Neurology", "Pediatrics"];

export default function Appointments() {
  const [searchParams] = useSearchParams();
  const preselectedDoctor = searchParams.get("doctor");
  const preselectedSlot = searchParams.get("slot");

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(
    preselectedDoctor ? Number(preselectedDoctor) : null
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(preselectedSlot || null);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [step, setStep] = useState(1);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [visitReason, setVisitReason] = useState("");

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const handleSelectSlot = (doctorId: number, slot: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedSlot(slot);
  };

  const canContinue = selectedDoctor && selectedSlot;

  const handleContinue = () => {
    if (step === 1 && canContinue) setStep(2);
    else if (step === 2 && patientName && patientPhone) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const steps = [
    { num: 1, label: "Selection" },
    { num: 2, label: "Details" },
    { num: 3, label: "Confirmation" },
  ];

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 items-center text-sm mb-6">
          <Link to="/" className="text-muted-foreground hover:text-primary font-medium">Home</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Book Now</span>
        </div>

        {/* Page Header with Progress */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center mb-10 border-b border-border pb-8">
          <div className="max-w-xl">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">Book an Appointment</h1>
            <p className="text-muted-foreground">Select a specialist and schedule your visit in a few clicks.</p>
          </div>
          <div className="flex items-center overflow-x-auto">
            {steps.map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center gap-1 min-w-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step >= s.num ? "bg-primary text-primary-foreground" : "bg-card border-2 border-border text-muted-foreground"
                  }`}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.num ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 rounded mx-2 ${step > s.num ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {step === 1 && (
              <>
                {/* Search Filters */}
                <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Search Doctor or Condition</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input className="pl-10 bg-muted border-none" placeholder="ex. Dr. Smith, Cardiology..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Department</label>
                      <select
                        className="w-full h-12 pl-4 pr-10 bg-muted border-none rounded-lg text-sm appearance-none"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        {departments.map((dept) => (
                          <option key={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="flex items-center justify-between bg-card p-4 rounded-xl shadow-sm border border-border">
                  <button className="p-2 hover:bg-muted rounded-full text-muted-foreground">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-4 text-center overflow-x-auto no-scrollbar">
                    {dates.map((date, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(index)}
                        className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg cursor-pointer min-w-[80px] ${
                          selectedDate === index
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className={`text-xs font-medium ${selectedDate === index ? "opacity-80" : "text-muted-foreground"}`}>
                          {date.day}
                        </span>
                        <span className="text-sm font-bold">{date.date}</span>
                      </button>
                    ))}
                  </div>
                  <button className="p-2 hover:bg-muted rounded-full text-muted-foreground">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Doctor Cards */}
                <div className="space-y-6">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className={`bg-card rounded-xl shadow-sm border overflow-hidden flex flex-col md:flex-row transition-all ${
                      selectedDoctorId === doctor.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}>
                      {/* Doctor Info */}
                      <div className="p-5 flex flex-col sm:flex-row gap-5 border-b md:border-b-0 md:border-r border-border md:w-7/12">
                        <div className="relative flex-shrink-0">
                          <img src={doctor.image} alt={doctor.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover" />
                          {doctor.online && (
                            <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-card" title="Available Online" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold">{doctor.name}</h3>
                            {doctor.verified && <Check className="w-5 h-5 text-blue-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">
                            {doctor.specialty} • {doctor.experience}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold">{doctor.rating}</span>
                            <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {doctor.services.map((service) => (
                              <span
                                key={service}
                                className={`px-2 py-1 text-xs font-semibold rounded ${
                                  service === "Video Consult"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-accent text-accent-foreground"
                                }`}
                              >
                                {service === "Video Consult" && <Video className="w-3 h-3 inline mr-1" />}
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="p-5 flex-1 flex flex-col justify-center bg-muted/50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Available Today</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {doctor.slots.map((slot) => {
                            const isSelected = selectedDoctorId === doctor.id && selectedSlot === slot;
                            return (
                              <button
                                key={slot}
                                onClick={() => handleSelectSlot(doctor.id, slot)}
                                className={`px-3 py-2 border rounded text-sm font-medium transition-all ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-card border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                        {selectedDoctorId === doctor.id && selectedSlot && (
                          <p className="mt-3 text-sm font-semibold text-primary text-center">
                            ✓ {doctor.name} — {selectedSlot}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-5">
                <h2 className="text-xl font-bold">Patient Details</h2>
                <p className="text-muted-foreground text-sm">Please fill in your information to complete the booking.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <Input value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="john@example.com" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                    <Input value={visitReason} onChange={(e) => setVisitReason(e.target.value)} placeholder="e.g. Chest pain, Follow-up..." />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-black">Appointment Confirmed!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your appointment with <span className="font-semibold text-foreground">{selectedDoctor?.name}</span> has been booked for{" "}
                  <span className="font-semibold text-foreground">{dates[selectedDate].date}</span> at{" "}
                  <span className="font-semibold text-primary">{selectedSlot}</span>.
                </p>
                <p className="text-sm text-muted-foreground">A confirmation will be sent to {patientEmail || "your email"}.</p>
                <div className="flex gap-3 justify-center pt-4">
                  <Button asChild variant="outline">
                    <Link to="/">Back to Home</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/patient-portal">Go to Portal</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor</span>
                  <span className="font-medium">{selectedDoctor?.name || "Select a doctor"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialty</span>
                  <span className="font-medium">{selectedDoctor?.specialty || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{dates[selectedDate].day}, {dates[selectedDate].date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-primary">{selectedSlot || "Select a time"}</span>
                </div>
                {step >= 2 && patientName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patient</span>
                    <span className="font-medium">{patientName}</span>
                  </div>
                )}
                <hr className="border-border" />
                <div className="flex justify-between font-bold">
                  <span>Consultation Fee</span>
                  <span>${selectedDoctor?.fee || "—"}</span>
                </div>
              </div>
              {step < 3 && (
                <div className="space-y-3 mt-6">
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={step === 1 ? !canContinue : !patientName || !patientPhone}
                    onClick={handleContinue}
                  >
                    {step === 1 ? "Continue to Details" : "Confirm Booking"}
                  </Button>
                  {step > 1 && (
                    <Button variant="outline" className="w-full" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center mt-4">
                By booking, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
