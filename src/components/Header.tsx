import { useState } from "react";
import { Phone, Menu, X, ChevronDown, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "الرئيسية", href: "#" },
  { 
    label: "من نحن", 
    href: "#about",
    submenu: ["عن المجموعة", "المركز الإعلامي"]
  },
  { 
    label: "المنشآت", 
    href: "#facilities",
    submenu: ["مستشفى كليوباترا", "مستشفى القاهرة التخصصي", "مستشفى النيل بدراوي"]
  },
  { 
    label: "مراكز التميز", 
    href: "#centers",
    submenu: ["مركز القلب", "مركز الأورام", "مركز العظام", "مركز المخ والأعصاب"]
  },
  { label: "السياحة العلاجية", href: "#tourism" },
  { label: "الوظائف", href: "#careers" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:19668" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">19668</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <User className="h-4 w-4 mr-2" />
              تسجيل الدخول
            </Button>
            <span className="hidden md:inline text-primary-foreground/80">|</span>
            <a href="#" className="hidden md:inline hover:opacity-80">English</a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="flex items-center gap-2">
                <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">CHG</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-primary">مجموعة مستشفيات كليوباترا</h1>
                  <p className="text-xs text-muted-foreground">التميز في الرعاية الصحية</p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.href}
                    className="nav-link px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-medium"
                  >
                    {item.label}
                    {item.submenu && <ChevronDown className="h-3 w-3" />}
                  </a>
                  
                  {item.submenu && activeDropdown === item.label && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-card rounded-lg shadow-lg border border-border py-2 animate-fade-in">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem}
                          href="#"
                          className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Search className="h-5 w-5" />
              </Button>
              <Button className="hidden md:flex hero-gradient text-primary-foreground hover:opacity-90 shadow-button">
                احجز الآن
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border animate-slide-up">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button className="w-full mt-4 hero-gradient text-primary-foreground">
                احجز الآن
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
