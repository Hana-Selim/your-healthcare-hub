import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Clock, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Find a Doctor" },
  { href: "/departments", label: "Specialties" },
  { href: "/appointments", label: "Appointments" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary-dark text-white text-xs py-2 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5 opacity-90">
              <Clock className="w-4 h-4" /> Open 24/7 for Emergency
            </span>
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin className="w-4 h-4" /> 123 Medical Center Dr, City
            </span>
          </div>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-white/80 transition-colors flex items-center gap-1">
              Patient Portal <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="hover:text-white/80 transition-colors">Pay Bill Online</a>
            <a href="#" className="hover:text-white/80 transition-colors">Careers</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 dark:bg-card/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold leading-none tracking-tight text-foreground">City General</h2>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Hospital & Medical Center</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Button asChild>
                <Link to="/appointments">Book Appointment</Link>
              </Button>
              <Button variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                <Phone className="w-4 h-4 mr-1" /> 911
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-white dark:bg-card">
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link to="/appointments" onClick={() => setIsOpen(false)}>Book Appointment</Link>
                </Button>
                <Button variant="outline" className="w-full bg-red-50 text-red-700 border-red-200">
                  <Phone className="w-4 h-4 mr-1" /> Emergency: 911
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
