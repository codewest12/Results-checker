import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Award, 
  Bell, 
  User, 
  Lock, 
  ChevronRight, 
  ChevronLeft,
  GraduationCap,
  Calendar,
  Layers,
  FileText,
  Search,
  CheckCircle,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { Announcement, AcademicSession, Term } from '../types';
import { motion } from 'motion/react';

import bannerClassroom from '../assets/images/modern_learning_space_1783850989057.jpg';
import bannerCeremony from '../assets/images/excellence_awards_ceremony_1783850973327.jpg';

// Custom School Emblem SVG
export const SchoolEmblem: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => (
  <svg className={`${className} text-amber-500`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#5c061c" stroke="#f59e0b" strokeWidth="4"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2"/>
    {/* Open Book */}
    <path d="M28 62C38 62 44 56 50 50C56 56 62 62 72 62V36C62 36 56 42 50 46C44 42 38 36 28 36V62Z" fill="#fff" stroke="#f59e0b" strokeWidth="2"/>
    {/* Flame/Torch */}
    <path d="M50 25C51.5 28 53 29 52 32C51 35 49 35 48 32C47 29 48.5 28 50 25Z" fill="#ef4444" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="50" y1="32" x2="50" y2="44" stroke="#f59e0b" strokeWidth="3"/>
    {/* Gold stars */}
    <circle cx="50" cy="72" r="3" fill="#f59e0b"/>
    <circle cx="40" cy="71" r="2" fill="#f59e0b"/>
    <circle cx="60" cy="71" r="2" fill="#f59e0b"/>
    {/* Text curve placeholder (visual arcs) */}
    <path d="M22 50 A 28 28 0 0 1 78 50" fill="none" stroke="none" id="text-path-top"/>
  </svg>
);

interface LandingPageProps {
  sessions: AcademicSession[];
  announcements: Announcement[];
  onOpenStudentLogin: (prefilledReg?: string, prefilledSession?: string, prefilledTerm?: Term) => void;
  onOpenAdminLogin: () => void;
  onOpenContactModal: () => void;
}

export default function LandingPage({
  sessions,
  announcements,
  onOpenStudentLogin,
  onOpenAdminLogin,
  onOpenContactModal
}: LandingPageProps) {
  // Portal query state
  const [studentId, setStudentId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term>('First Term');
  const [selectedSession, setSelectedSession] = useState(sessions.find(s => s.isCurrent)?.id || '');
  const [queryError, setQueryError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Carousel Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      image: bannerClassroom,
      title: "SHP / MODERN LEARNING SPACE",
      tagline: "Empowering Students to Think, Learn, and Excel Together",
      badge: "State-of-the-Art Facilities"
    },
    {
      image: bannerCeremony,
      title: "IDO EXCELLENCE FOUNDATION",
      tagline: "Celebrating Outstanding Academic Performance & Support",
      badge: "Excellence & Integrity"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Testimonials Slider state
  const testimonials = [
    {
      id: 1,
      role: 'Student Representative',
      name: 'Oluwaseun Adebayo (SS3 Science)',
      comment: 'The online result portal has made checking report cards seamless. No more anxious waiting in queues or losing physical papers. We can view grades and track performance trends instantly.',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      role: 'Parents Coordinator',
      name: 'Mrs. Evelyn Amadi',
      comment: 'As a parent, I can monitor my children\'s performance from any location in Nigeria. The security PIN setup guarantees that my child\'s information remains strictly confidential.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      role: 'Academic Director',
      name: 'Mr. Christopher Okeke',
      comment: 'Community Secondary School Ido has always put technology at the service of learning. This portal allows teachers to upload CA scores, calculate averages, and publish results instantly.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const [testiIndex, setTestiIndex] = useState(0);

  const nextTesti = () => {
    setTestiIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTesti = () => {
    setTestiIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setQueryError('Please enter your Student Registration Number');
      return;
    }

    // Pattern Validation Check
    const regNoPattern = /^CSS\/IDO\/\d{4}\/\d+$/;
    if (!regNoPattern.test(studentId.trim())) {
      setQueryError('Error: Registration number must follow the capitalized pattern CSS/IDO/YYYY/NNN (e.g. CSS/IDO/2026/001). Lowercase letters are not allowed.');
      return;
    }

    setQueryError('');
    // Direct student to login, prefilling their details
    onOpenStudentLogin(studentId.trim(), selectedSession, selectedTerm);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="css-ido-landing">
      {/* Top Bar for contact */}
      <div className="bg-[#4a0414] text-amber-100 text-xs py-2 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center border-b border-amber-500/20">
        <div className="flex items-center space-x-4 mb-1 sm:mb-0">
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-amber-400" />
            +234 803 123 4567
          </span>
          <span className="flex items-center gap-1">
            <Mail size={12} className="text-amber-400" />
            info@cssido.edu.ng
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Official CSS Ido Portal — Active Term: 2025/2026</span>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 px-4 sm:px-6 py-3 transition-all">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3">
            <SchoolEmblem className="h-9 w-9 sm:h-12 sm:w-12 shrink-0" />
            <div>
              <h1 className="text-xs sm:text-base md:text-lg font-bold text-[#5c061c] leading-tight font-sans tracking-tight">
                Community Secondary School Ido
              </h1>
              <p className="text-[9px] sm:text-xs text-slate-500 font-mono tracking-wider uppercase font-semibold">
                Motto: Knowledge & Character
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-[16px] font-medium leading-[1.5] tracking-[0.01em] text-slate-600">
            <a href="#about" className="hover:text-[#5c061c] transition-colors">About Portal</a>
            <a href="#quick-checker" className="hover:text-[#5c061c] transition-colors">Check Result</a>
            <a href="#announcements" className="hover:text-[#5c061c] transition-colors">Announcements</a>
            <a href="#contact" className="hover:text-[#5c061c] transition-colors">Contact</a>
          </nav>

          {/* Portal Entry Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button 
              id="student-login-nav-btn"
              onClick={() => onOpenStudentLogin()}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-[14px] sm:text-[16px] font-semibold leading-[1.5] tracking-[0.02em] text-[#5c061c] hover:bg-red-50 rounded-lg border border-red-100 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <User size={14} />
              <span className="hidden sm:inline">Student Portal</span>
              <span className="inline sm:hidden">Student</span>
            </button>
            
            <button 
              id="admin-login-nav-btn"
              onClick={onOpenAdminLogin}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-[14px] sm:text-[16px] font-semibold leading-[1.5] tracking-[0.02em] bg-[#5c061c] hover:bg-[#720a25] text-white rounded-lg shadow-sm transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <Lock size={14} className="text-amber-400" />
              <span className="hidden sm:inline">Admin Portal</span>
              <span className="inline sm:hidden">Admin</span>
            </button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 md:hidden transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Menu Drawer with Smooth transition */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 border-t border-slate-100 pt-3 pb-2 space-y-2 animate-fadeIn max-w-7xl mx-auto">
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-[#5c061c] rounded-lg transition-colors"
            >
              About Portal
            </a>
            <a 
              href="#quick-checker" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-[#5c061c] rounded-lg transition-colors"
            >
              Check Result
            </a>
            <a 
              href="#announcements" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-[#5c061c] rounded-lg transition-colors"
            >
              Announcements
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-[#5c061c] rounded-lg transition-colors"
            >
              Contact Administration
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[560px] flex items-center bg-slate-950 text-white py-12 md:py-20 px-4 sm:px-6 overflow-hidden">
        {/* Sliding Background Carousel */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? 'opacity-40' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
          {/* Rich elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a0414] via-[#5c061c]/95 to-black/85 z-10"></div>
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-20 w-full">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider font-mono">
              <Award size={12} className="animate-pulse" />
              <span>{slides[activeSlide].badge}</span>
            </div>
            
            <h2 className="text-[32px] md:text-[48px] font-extrabold text-white leading-[1.2] tracking-[-0.02em]">
              INSTANT ACCESS: <br />
              <span className="text-amber-400">Check Your Academic Results Online</span>
            </h2>
            
            <p className="text-slate-300 text-[16px] font-normal leading-[1.6] max-w-xl">
              Welcome to the official School Result Management Portal of Community Secondary School Ido. 
              Our modernized platform provides secure, transparent, and immediate access to terminal examination records for both students and parents.
            </p>

            {/* Carousel Slide Indicators & Captions */}
            <div className="pt-2 flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === activeSlide ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/60'
                    }`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <p className="text-[13px] font-normal leading-[1.5] text-amber-300/95 font-mono flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>Active Showcase: <strong className="text-white">{slides[activeSlide].title}</strong> — {slides[activeSlide].tagline}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#quick-checker" 
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-[#5c061c] text-[16px] font-semibold leading-[1.5] tracking-[0.02em] rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <span>Check My Results Now</span>
                <ArrowRight size={16} />
              </a>
              <a 
                href="#about" 
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-[16px] font-semibold leading-[1.5] tracking-[0.02em] rounded-lg border border-white/25 transition-all"
              >
                <span>Learn More</span>
              </a>
            </div>
          </div>

          {/* Hero Form / Quick result checker */}
          <div className="lg:col-span-5" id="quick-checker">
            <div className="bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-6 md:p-8 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-amber-500 rounded-t-2xl"></div>
              
              <h3 className="text-[20px] md:text-[22px] font-semibold text-[#5c061c] leading-[1.2] tracking-[-0.02em] mb-2 flex items-center gap-2">
                <GraduationCap className="text-amber-500" />
                <span>Quick Result Access</span>
              </h3>
              <p className="text-[13px] font-normal leading-[1.5] text-slate-500 mb-6">
                Enter your student details below to initiate result verification. You will require your secret verification PIN.
              </p>

              <form onSubmit={handleQuickCheck} className="space-y-4">
                {queryError && (
                  <div className="p-3 bg-red-50 text-red-700 text-[13px] rounded-lg border border-red-100 flex items-center gap-2 animate-shake">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{queryError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5">
                    Registration Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <User size={16} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="e.g. CSS/IDO/2026/001" 
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-2 focus:ring-[#5c061c]/20 focus:border-[#5c061c] text-slate-900 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5">
                      Session
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Calendar size={14} />
                      </span>
                      <select 
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-2 focus:ring-[#5c061c]/20 focus:border-[#5c061c] text-slate-700 appearance-none font-sans"
                      >
                        {sessions.map(s => (
                          <option key={s.id} value={s.id}>{s.name} {s.isCurrent ? '(Current)' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5">
                      Term
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Layers size={14} />
                      </span>
                      <select 
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value as Term)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-2 focus:ring-[#5c061c]/20 focus:border-[#5c061c] text-slate-700 appearance-none font-sans"
                      >
                        <option value="First Term">First Term</option>
                        <option value="Second Term">Second Term</option>
                        <option value="Third Term">Third Term</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#5c061c] hover:bg-[#720a25] text-white text-[16px] font-semibold leading-[1.5] tracking-[0.02em] rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Search size={16} className="text-amber-400" />
                  <span>Verify and Log In</span>
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[13px] font-normal leading-[1.5] text-slate-500">
                <span>Forgot your secret PIN?</span>
                <span className="text-[#5c061c] font-semibold hover:underline cursor-pointer" onClick={onOpenContactModal}>
                  Contact Administration
                </span>
              </div>
            </div>

            {/* Banner Image immediately below the Quick Result Access Card */}
            <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 bg-white p-2 animate-fadeIn">
              <img 
                src={bannerCeremony} 
                alt="Ido Excellence Awards Ceremony Banner" 
                className="w-full rounded-xl object-cover h-36 sm:h-44 md:h-48"
                referrerPolicy="no-referrer"
              />
              <div className="p-3 bg-white text-slate-800 text-center">
                <p className="text-[10px] font-mono font-extrabold text-amber-600 uppercase tracking-wider">EDU EXCELLENCE FOUNDATION</p>
                <h4 className="text-xs font-bold text-[#5c061c] tracking-tight">Supporting Outstanding Academic Excellence</h4>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Quick strip */}
      <div className="bg-white border-y border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-[28px] md:text-[32px] font-bold text-[#5c061c] leading-[1.2] tracking-[-0.02em]">6+</div>
            <div className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono uppercase tracking-wider">Academic Classes</div>
          </div>
          <div>
            <div className="text-[28px] md:text-[32px] font-bold text-[#5c061c] leading-[1.2] tracking-[-0.02em]">11+</div>
            <div className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono uppercase tracking-wider">Subjects Taught</div>
          </div>
          <div>
            <div className="text-[28px] md:text-[32px] font-bold text-[#5c061c] leading-[1.2] tracking-[-0.02em]">100%</div>
            <div className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono uppercase tracking-wider">Secure Access</div>
          </div>
          <div>
            <div className="text-[28px] md:text-[32px] font-bold text-[#5c061c] leading-[1.2] tracking-[-0.02em]">Digital</div>
            <div className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono uppercase tracking-wider">Automated Records</div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 space-y-16">
        
        {/* About Section */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-md aspect-square border border-slate-100 group/img1 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-[#5c061c]/85 via-transparent to-transparent z-10"></div>
                <img 
                  src={bannerClassroom} 
                  alt="SHP Modern Learning Space" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <p className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Learning Space</p>
                  <h5 className="text-white text-xs font-bold leading-tight">Modernized Classroom</h5>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md aspect-square border border-slate-100 group/img2 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-[#5c061c]/85 via-transparent to-transparent z-10"></div>
                <img 
                  src={bannerCeremony} 
                  alt="Ido Excellence Awards Ceremony" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <p className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Foundation</p>
                  <h5 className="text-white text-xs font-bold leading-tight">Excellence Awards</h5>
                </div>
              </div>
            </div>
            
            <div className="relative bg-[#5c061c] rounded-2xl p-4 shadow-md border border-amber-500/10 text-center flex items-center justify-center gap-3">
              <SchoolEmblem className="h-8 w-8 shrink-0 bg-white/10 p-1 rounded-full" />
              <div className="text-left">
                <h4 className="text-xs font-extrabold text-white tracking-tight">Community Secondary School Ido</h4>
                <p className="text-[10px] text-amber-300 font-mono">Knowledge & Character</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-[28px] md:text-[36px] font-bold text-[#5c061c] leading-[1.2] tracking-[-0.02em]">
              Empowering Our Students Through Academic Transparency
            </h3>
            <p className="text-slate-600 text-[16px] font-normal leading-[1.6]">
              Educational excellence is the core promise of Community Secondary School Ido. This result portal is designed with transparency, efficiency, and speed as our guiding principles. 
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
                <div className="p-2 bg-red-50 text-[#5c061c] rounded-lg shrink-0">
                  <Lock size={16} />
                </div>
                <div>
                  <h4 className="text-[14px] font-medium leading-[1.5] text-[#5c061c]">PIN Protected Sheets</h4>
                  <p className="text-[13px] font-normal leading-[1.5] text-slate-500 mt-1">Unique randomized system-generated security PIN codes to safeguard student records.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h4 className="text-[14px] font-medium leading-[1.5] text-[#5c061c]">Automated Grades</h4>
                  <p className="text-[13px] font-normal leading-[1.5] text-slate-500 mt-1">Error-free computational assessment engine calculating total marks, grade letters, and positions automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Announcements section */}
        <section id="announcements" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-[24px] md:text-[28px] font-bold text-[#5c061c] leading-[1.2] tracking-[-0.02em] flex items-center gap-2">
                <Bell className="text-amber-500" />
                <span>Portal Announcements</span>
              </h3>
              <p className="text-[13px] font-normal leading-[1.5] text-slate-500 mt-1">Important updates regarding academic sessions, schedules, and result processing.</p>
            </div>
            <div className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono mt-2 sm:mt-0 bg-slate-100 px-2.5 py-1 rounded-full">
              Updated: July 2026
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((ann) => (
              <div 
                key={ann.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5c061c]"></div>
                <div>
                  <div className="flex items-center justify-between text-[13px] font-normal leading-[1.5] text-slate-400 font-mono mb-2">
                    <span className="uppercase tracking-wider font-bold text-amber-600">{ann.category}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="text-[16px] font-semibold text-[#5c061c] group-hover:text-[#720a25] transition-colors leading-[1.5] mb-2">
                    {ann.title}
                  </h4>
                  <p className="text-[13px] font-normal leading-[1.5] text-slate-500 line-clamp-4">
                    {ann.content}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-[13px] font-normal leading-[1.5] text-slate-400">
                  <span>Community School Board</span>
                  <span className="text-[#5c061c] group-hover:underline cursor-pointer flex items-center gap-1 font-semibold" onClick={() => alert(`Announcement Details:\n\nTitle: ${ann.title}\nDate: ${ann.date}\n\n${ann.content}`)}>
                    Read Full <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Slider */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-800/10 rounded-full blur-3xl translate-y-24 translate-x-12"></div>
          
          <div className="max-w-3xl mx-auto space-y-6 text-center relative z-10">
            <div className="inline-flex items-center justify-center p-2.5 bg-amber-500/15 text-amber-400 rounded-full mb-2">
              <FileText size={24} />
            </div>
            
            <h3 className="text-[24px] md:text-[28px] font-bold text-amber-400 leading-[1.2] tracking-[-0.02em]">
              Trusted by Students, Parents & Teachers
            </h3>

            {/* Testimonial Active Comment */}
            <blockquote className="text-[16px] font-normal leading-[1.6] italic text-slate-200 min-h-[100px] flex items-center justify-center px-4">
              &ldquo;{testimonials[testiIndex].comment}&rdquo;
            </blockquote>

            {/* Testimonial Author Info */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <img 
                src={testimonials[testiIndex].avatar} 
                alt={testimonials[testiIndex].name}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-amber-500 object-cover"
              />
              <div className="text-left">
                <div className="text-[16px] font-semibold leading-[1.5] text-white">{testimonials[testiIndex].name}</div>
                <div className="text-[13px] font-normal leading-[1.5] text-amber-300 font-mono">{testimonials[testiIndex].role}</div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex justify-center items-center gap-4 pt-4">
              <button 
                onClick={prevTesti}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setTestiIndex(idx)}
                    className={`h-2 rounded-full transition-all ${idx === testiIndex ? 'w-6 bg-amber-500' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTesti}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Contact area */}
      <footer id="contact" className="bg-[#24020a] text-slate-300 border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Footer Emblem */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <SchoolEmblem className="h-12 w-12" />
              <div>
                <h4 className="text-[16px] font-semibold leading-[1.5] tracking-[0.01em] text-white">Community Secondary School Ido</h4>
                <p className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono uppercase tracking-wider">Motto: Knowledge & Character</p>
              </div>
            </div>
            <p className="text-[13px] md:text-[14px] font-normal leading-[1.6] text-slate-400 max-w-sm">
              We cultivate excellence in academic work, physical education, and moral character. Providing reliable terminal records since inception.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[13px] font-normal leading-[1.5] uppercase tracking-wider text-amber-400 font-mono">School Portal</h4>
            <ul className="text-[13px] md:text-[14px] font-normal leading-[1.6] space-y-2 text-slate-400">
              <li><span className="hover:text-white cursor-pointer transition-colors" onClick={() => onOpenStudentLogin()}>Check Term Results</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors" onClick={onOpenAdminLogin}>Administrator Access</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors" onClick={() => alert('Access Code lists are distributed by Class Teachers.')}>Verification PIN Issuance</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors" onClick={() => alert('Student photographs can be uploaded from the administrator panel.')}>Student Identity & Photograph Uploads</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[13px] font-normal leading-[1.5] uppercase tracking-wider text-amber-400 font-mono">Location & Inquiries</h4>
            <div className="text-[13px] md:text-[14px] font-normal leading-[1.6] space-y-3 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <span>School Road, Ido Administrative Area, Rivers State, Nigeria.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-amber-500 shrink-0" />
                <span>+234 803 123 4567, +234 812 345 6789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-amber-500 shrink-0" />
                <span>admin@cssido.edu.ng, info@cssido.edu.ng</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Legal bar */}
        <div className="bg-[#140106] py-4 px-4 text-center text-[13px] text-slate-500 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Community Secondary School Ido. All Rights Reserved.</span>
            <span>Powered by CSS Ido Technical Department & School Board.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
