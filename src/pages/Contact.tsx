import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, AlertCircle, Calendar, Headphones } from "lucide-react";

const contactCards = [
  {
    icon: AlertCircle,
    title: "Emergency",
    desc: "For immediate medical attention.",
    phone: "911",
    subPhone: "Direct Line: 555-0199",
    isEmergency: true,
  },
  {
    icon: Calendar,
    title: "Appointments",
    desc: "Schedule a visit with a specialist.",
    phone: "555-0123",
    email: "book@cityhospital.com",
    isEmergency: false,
  },
  {
    icon: Headphones,
    title: "General Inquiries",
    desc: "Information and front desk.",
    phone: "555-0100",
    email: "info@cityhospital.com",
    isEmergency: false,
  },
];

const visitingHours = [
  { ward: "General Wards", hours: "8:00 AM – 8:00 PM" },
  { ward: "ICU", hours: "10:00 AM – 12:00 PM" },
  { ward: "Weekends", hours: "10:00 AM – 6:00 PM" },
];

const departments = ["General Inquiry", "Cardiology", "Neurology", "Pediatrics", "Billing & Insurance"];

export default function Contact() {
  return (
    <Layout>
      {/* Hero Section */}
      <div
        className="relative flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 25, 34, 0.7), rgba(16, 25, 34, 0.5)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmJ0wqwqdmCdqgJ2U3MWZsT2gerVvhjExK5OLZyBCKueOcCysU_2KvrDMHmvoeoFHMuezXNxroENEz8XqNMlAFQofbCn_C9789Eky4r5NGVV7JcvkI95TIicFz9gcJLWaUQbt84cVe4KJ9Iz7kpPQr6HpjJeP4CUaNnE_Kyrspzn1mBS_VJzbaDRpfR2q7Rw7qsEPKY4aizd-OMKavHiQ8E5xlcMVpF9dRZZW2ujyhkF7XuyYRLI3WKotBFNOyWgjsCvnsTaQWb71R")`
        }}
      >
        <div className="flex flex-col gap-4 max-w-2xl">
          <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl">
            How can we help?
          </h1>
          <p className="text-slate-100 text-base font-normal leading-relaxed md:text-lg">
            We are here to help you 24/7. Reach out for appointments, general inquiries, or immediate emergency support.
          </p>
        </div>
        <Button size="lg" variant="destructive" className="shadow-lg shadow-red-600/20">
          <Phone className="w-5 h-5 mr-2" />
          Emergency: 911
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Quick Access */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight">Quick Access</h2>
              <p className="text-muted-foreground">Find the right contact for your needs directly.</p>
            </div>

            {/* Contact Cards */}
            <div className="flex flex-col gap-4">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className={`group flex gap-4 rounded-xl p-5 transition-all ${
                    card.isEmergency
                      ? "border border-red-100 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10"
                      : "border border-border bg-card hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    card.isEmergency
                      ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                      : "bg-primary/10 text-primary"
                  }`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                    <a
                      href={`tel:${card.phone}`}
                      className={`mt-1 text-lg font-bold ${
                        card.isEmergency ? "text-red-600 dark:text-red-400" : ""
                      } hover:underline`}
                    >
                      {card.phone}
                    </a>
                    {card.subPhone && (
                      <p className="text-sm text-muted-foreground">{card.subPhone}</p>
                    )}
                    {card.email && (
                      <a href={`mailto:${card.email}`} className="text-sm text-primary hover:underline">
                        {card.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Visiting Hours */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Visiting Hours</h3>
              </div>
              <div className="space-y-3">
                {visitingHours.map((item, index) => (
                  <div
                    key={item.ward}
                    className={`flex justify-between ${
                      index < visitingHours.length - 1 ? "border-b border-border pb-2" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-muted-foreground">{item.ward}</span>
                    <span className="text-sm font-bold">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-bold">Our Location</h3>
                  <p className="text-sm text-muted-foreground">123 Medical Center Dr, Healthy City</p>
                </div>
              </div>
              <div className="h-48 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Map Placeholder</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold leading-tight tracking-tight">Send us a message</h2>
                <p className="mt-2 text-muted-foreground">
                  Please fill out the form below and we will get back to you as soon as possible.
                </p>
              </div>
              <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-5 md:flex-row">
                  <label className="flex flex-1 flex-col">
                    <span className="text-sm font-medium pb-2">First Name</span>
                    <Input placeholder="Jane" />
                  </label>
                  <label className="flex flex-1 flex-col">
                    <span className="text-sm font-medium pb-2">Last Name</span>
                    <Input placeholder="Doe" />
                  </label>
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                  <label className="flex flex-1 flex-col">
                    <span className="text-sm font-medium pb-2">Email Address</span>
                    <Input type="email" placeholder="jane@example.com" />
                  </label>
                  <label className="flex flex-1 flex-col">
                    <span className="text-sm font-medium pb-2">Phone Number</span>
                    <Input type="tel" placeholder="(555) 000-0000" />
                  </label>
                </div>
                <label className="flex flex-col">
                  <span className="text-sm font-medium pb-2">Department</span>
                  <select className="h-12 px-4 rounded-lg border border-input bg-muted text-foreground focus:border-primary focus:outline-none">
                    {departments.map((dept) => (
                      <option key={dept}>{dept}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium pb-2">Message</span>
                  <Textarea
                    placeholder="How can we help you today?"
                    className="min-h-[140px] resize-none"
                  />
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" size="lg">Send Message</Button>
                  <p className="text-xs text-muted-foreground">
                    By submitting this form, you agree to our{" "}
                    <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
