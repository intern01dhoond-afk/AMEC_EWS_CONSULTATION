"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

function useCountUp(end: number, duration: number = 2000, delay: number = 0) {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    const startTimer = setTimeout(() => {
      animationFrameId = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration, delay]);

  return count;
}

export default function AmecSaaSPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  const router = useRouter();
  React.useEffect(() => {
    router.prefetch('/checkout');
  }, [router]);

  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [heroQuantity, setHeroQuantity] = useState(1);
  const [isQtyDropdownOpen, setIsQtyDropdownOpen] = useState(false);
  const [isCustomQty, setIsCustomQty] = useState(false);
  const isMounted = useRef(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('amec_qty');
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          setHeroQuantity(parsed);
          if (parsed > 10) {
            setIsCustomQty(true);
          }
        }
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isMounted.current) {
        localStorage.setItem('amec_qty', heroQuantity.toString());
      } else {
        isMounted.current = true;
      }
    }
  }, [heroQuantity]);

  const handleTestimonialsScroll = () => {
    const container = testimonialsRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.querySelector('div')?.clientWidth || container.clientWidth;
    const index = Math.round(scrollLeft / cardWidth);
    const activeIdx = Math.max(0, Math.min(2, index));
    setActiveTestimonialIndex(activeIdx);
  };

  const scrollToTestimonial = (index: number) => {
    const container = testimonialsRef.current;
    if (!container) return;
    const cardWidth = container.querySelector('div')?.clientWidth || container.clientWidth;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setActiveTestimonialIndex(index);
  };
  const heroImages = [
    { src: '/ews/hero-images/01.webp', alt: 'AMEC Early Warning System Unit', isDark: false, contain: false },
    { src: '/ews/hero-images/002.webp', alt: 'AMEC Early Warning System Alternative', isDark: false, contain: false },
    { src: '/ews/hero-images/02.webp', alt: 'AMEC Unit Assembly', isDark: false, contain: false },
    { src: '/ews/hero-images/03.webp', alt: 'AMEC Security Deployment', isDark: false, contain: false },
    { src: '/ews/hero-images/04.webp', alt: 'AMEC Sensor Unit detail', isDark: false, contain: false },
    { src: '/ews/hero-images/05.webp', alt: 'AMEC EWS Image 5', isDark: false, contain: false },
    { src: '/ews/hero-images/06.webp', alt: 'AMEC EWS Image 6', isDark: false, contain: false },
    { src: '/ews/hero-images/07.webp', alt: 'AMEC EWS Image 7', isDark: false, contain: false },
    { src: '/ews/hero-images/08.webp', alt: 'AMEC EWS Image 8', isDark: false, contain: false },
    { src: '/ews/hero-images/09.webp', alt: 'AMEC EWS Image 9', isDark: false, contain: false },
    { src: '/ews/hero-images/10.webp', alt: 'AMEC EWS Image 10', isDark: false, contain: false },
    { src: '/ews/hero-images/11.webp', alt: 'AMEC EWS Image 11', isDark: false, contain: false },
    { src: '/ews/hero-images/12.webp', alt: 'AMEC EWS Image 12', isDark: false, contain: false },
    { src: '/ews/hero-images/13.webp', alt: 'AMEC EWS Image 13', isDark: false, contain: false }
  ];

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setCurrentHeroImageIndex(prev => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrentHeroImageIndex(prev => (prev === 0 ? heroImages.length - 1 : prev - 1));
    }
  };



  const deploymentsCount = useCountUp(2180, 1500, 100);
  const boundaryCount = useCountUp(85000, 2000, 200);
  const activeHubsCount = useCountUp(140, 1500, 200);

  React.useEffect(() => {
    let ticking = false;
    const handleScrollEvent = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const section = document.getElementById('process');
          if (section) {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
              const height = rect.height;
              const current = windowHeight * 0.7 - rect.top;
              const pct = (current / height) * 100;
              
              setScrollProgress(Math.max(0, Math.min(100, (pct / 75) * 100)));
              
              const nextStep = pct < 25 ? 1 : pct < 50 ? 2 : pct < 75 ? 3 : 4;
              setActiveStep((prev) => {
                if (prev !== nextStep) return nextStep;
                return prev;
              });
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScrollEvent, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  const [showStickyBtn, setShowStickyBtn] = useState(false);
  React.useEffect(() => {
    let ticking = false;
    const handleScrollCheck = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 400;
          setShowStickyBtn((prev) => {
            if (prev !== shouldShow) return shouldShow;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScrollCheck, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollCheck);
  }, []);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqItems = [
    {
      q: "What types of sites does AMEC protect?",
      a: "AMEC is engineered for high-value industrial and government sites - oil & gas infrastructure, power generation facilities, government compounds, remote energy installations, strategic military perimeters, and similar critical infrastructure requiring autonomous protection."
    },
    {
      q: "Does AMEC work in remote locations without power?",
      a: "Yes. Every unit runs on solar power with a built-in battery backup. The system operates fully off-grid, ensuring continuous protection even during power outages."
    },
    {
      q: "How does AMEC handle false alarms?",
      a: "We use AI-powered multi-sensor fusion and LIDAR signature verification. This allows the system to distinguish between actual human or vehicle intrusions and wildlife, weather, or moving vegetation."
    },
    {
      q: "What happens if a device is tampered or goes offline?",
      a: "The LoRa mesh network automatically self-heals and reroutes signal paths. If a unit is tampered with or loses connection, the system immediately alerts the command center with its last known status."
    },
    {
      q: "How long does installation take?",
      a: "Most standard deployments can be fully installed and commissioned within 2-3 days. Our team handles the setup, calibration, and training for your staff."
    },
    {
      q: "Can I integrate AMEC with my existing systems?",
      a: "Yes, AMEC is designed to integrate seamlessly with existing VMS, CCTV, alarm panels, and other industrial security platforms via standard APIs and dry contacts."
    },
    {
      q: "What kind of maintenance is required?",
      a: "Virtually none. The solar panels and units are designed to be self-cleaning and maintenance-free. System diagnostics are run automatically to monitor unit health."
    },
    {
      q: "Are there ongoing subscription or annual costs?",
      a: "No. We charge a one-time hardware and deployment fee. There are no mandatory SaaS subscriptions or per-alert charges, keeping your total cost of ownership extremely low."
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative bg-surface text-on-surface font-sans antialiased selection:bg-primary selection:text-on-primary">
      
      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/40 shadow-lg">
        <div className="flex justify-between items-center px-6 md:px-16 pt-7 pb-4 md:py-5 max-w-[1440px] mx-auto">
          <a href="https://amectechnology.com/" className="flex items-center gap-1.5 cursor-pointer">
            <img alt="AMEC Shield Logo" className="h-[50px] w-auto object-contain" src="/ews/logo_shield.png" />
            <img alt="AMEC Logo" className="h-[25px] w-auto object-contain brightness-0 invert translate-y-[4px]" src="/ews/logo_amec_new.png" />
          </a>
          <div className="hidden lg:flex gap-8 items-center">
            {[
              { label: 'Product', id: 'systems' },
              { label: 'Technology', id: 'safety' },
              { label: 'Applications', id: 'applications' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => handleScroll(item.id)} 
                className="dice-container font-semibold text-xs text-zinc-400 hover:text-white transition-colors duration-300 uppercase tracking-widest cursor-pointer font-sans px-2"
              >
                {/* Static reference to hold layout sizes */}
                <span className="invisible select-none block">{item.label}</span>
                
                {/* 3D Dice Cylinder */}
                <span className="dice-cube">
                  <span className="dice-face dice-face-front">{item.label}</span>
                  <span className="dice-face dice-face-bottom">{item.label}</span>
                  <span className="dice-face dice-face-back">{item.label}</span>
                  <span className="dice-face dice-face-top">{item.label}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/checkout')}
              className="hidden lg:flex bg-zinc-950 text-white font-bold text-xs px-6 uppercase tracking-widest hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-950/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-md shadow-zinc-950/10 font-sans items-center justify-center"
              style={{ height: '50.71px', borderRadius: '12px' }}
            >
              Buy Now
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-white text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute inset-x-0 top-full bg-white border-b border-zinc-200 shadow-xl flex flex-col p-6 gap-4 z-40 animate-in slide-in-from-top duration-200">
            {[
              { label: 'Product', id: 'systems' },
              { label: 'Technology', id: 'safety' },
              { label: 'Applications', id: 'applications' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleScroll(item.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left font-bold text-sm text-zinc-800 uppercase tracking-widest py-2 border-b border-zinc-100 last:border-0 hover:text-error transition-colors cursor-pointer font-sans"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-[88px]">
        
        {/* --- HERO SECTION --- */}
        <section id="hero" className="relative z-20 min-h-[70vh] md:min-h-[580px] lg:min-h-[640px] flex items-center justify-center px-4 md:px-16 overflow-x-clip overflow-y-visible">
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-up {
              animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .delay-100 { animation-delay: 100ms; }
            .delay-150 { animation-delay: 150ms; }
            .delay-200 { animation-delay: 200ms; }
            .delay-250 { animation-delay: 250ms; }
            .delay-300 { animation-delay: 300ms; }
            .delay-350 { animation-delay: 350ms; }
            .delay-400 { animation-delay: 400ms; }
            .delay-450 { animation-delay: 450ms; }
            .delay-500 { animation-delay: 500ms; }
            .dice-container {
              perspective: 1000px;
              display: inline-block;
              position: relative;
              overflow: visible;
              height: 1.2em;
              vertical-align: middle;
            }
            .dice-cube {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              transform-style: preserve-3d;
              transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              pointer-events: none;
            }
            .dice-face {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              backface-visibility: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              transition: color 0.3s ease;
            }
            .dice-face-front {
              transform: rotateX(0deg) translateZ(0.6em);
            }
            .dice-face-bottom {
              transform: rotateX(90deg) translateZ(0.6em);
            }
            .dice-face-back {
              transform: rotateX(180deg) translateZ(0.6em);
            }
            .dice-face-top {
              transform: rotateX(270deg) translateZ(0.6em);
            }
            .dice-container:hover .dice-cube {
              transform: rotateX(-180deg);
            }
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div 
            className="absolute inset-0 z-0 opacity-[0.32] pointer-events-none" 
            style={{ 
              backgroundImage: "url('/ews/hero_bg.jpg')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          ></div>
          <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 relative z-10 items-center pt-2 pb-8 md:pt-6 md:pb-12">
            <div className="flex flex-col gap-4 order-2 md:order-1">
              <h1 className="font-sans text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-bold text-primary max-w-4xl tracking-tight animate-fade-up delay-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Multipurpose Early <span className="text-error">Warning</span> System
              </h1>
              <p className="text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed font-sans font-medium animate-fade-up delay-150">
                AI-powered adaptive early warning system designed for industrial sites, mining, solar farms and critical infrastructure.
              </p>
              <div className="flex items-center gap-2 -mt-2 font-sans animate-fade-up delay-200">
                <div className="flex text-error">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                </div>
                <span className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider">4.9 · {deploymentsCount.toLocaleString()} verified deployments</span>
              </div>
              <div className="flex flex-col gap-0.5 animate-fade-up delay-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>₹35,992</span>
                  <span className="text-sm md:text-base font-semibold text-zinc-400 line-through">₹44,991</span>
                  <span className="text-[10px] md:text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded">20% Off</span>
                </div>
                <span className="text-xs text-on-surface-variant/85 font-medium tracking-wide">(+18% GST) · No subscription or annual contract required</span>
              </div>
              <div className="flex flex-col gap-2 mt-2 font-sans animate-fade-up delay-250">
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-stretch md:items-center">
                  <div className="flex flex-row gap-2 w-full md:w-auto items-stretch">
                    {isCustomQty ? (
                      <div className="relative flex items-center bg-white border border-zinc-300 rounded-xl px-3 shrink-0" style={{ height: '50.71px', width: '95px' }}>
                        <input
                          type="number"
                          min="1"
                          value={heroQuantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setHeroQuantity(isNaN(val) ? 1 : val);
                          }}
                          className="w-full h-full bg-transparent border-0 outline-none text-zinc-800 font-extrabold text-sm font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoFocus
                          placeholder="Qty"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomQty(false);
                            if (heroQuantity > 10) {
                              setHeroQuantity(10);
                            }
                          }}
                          className="text-zinc-400 hover:text-zinc-850 transition-colors ml-1 cursor-pointer shrink-0"
                          title="Switch back to list"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="relative shrink-0" style={{ height: '50.71px', width: '80px' }}>
                        <button
                          type="button"
                          onClick={() => setIsQtyDropdownOpen(!isQtyDropdownOpen)}
                          className="w-full h-full bg-white border border-zinc-300 text-zinc-800 font-extrabold text-sm rounded-xl flex items-center justify-between px-3.5 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 cursor-pointer font-sans"
                          aria-label="Select Quantity"
                        >
                          <span>{heroQuantity}</span>
                          <svg 
                            viewBox="0 0 20 20" 
                            className={`h-4 w-4 text-zinc-550 transition-transform duration-200 ${isQtyDropdownOpen ? 'rotate-180' : ''}`}
                            fill="currentColor"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </button>

                        {isQtyDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40 cursor-default" 
                              onClick={() => setIsQtyDropdownOpen(false)} 
                            />
                            <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-zinc-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 py-1">
                              {[...Array(10)].map((_, i) => {
                                const val = i + 1;
                                return (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => {
                                      setHeroQuantity(val);
                                      setIsQtyDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-zinc-50 transition-colors ${
                                      heroQuantity === val ? 'text-error bg-red-50/50' : 'text-zinc-705'
                                    }`}
                                  >
                                    {val}
                                  </button>
                                );
                              })}
                              <div className="h-px bg-zinc-100 my-1" />
                              <button
                                type="button"
                                onClick={() => {
                                  setIsCustomQty(true);
                                  setIsQtyDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-error hover:bg-zinc-50 transition-colors"
                              >
                                Custom...
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <button 
                      onClick={() => router.push('/checkout')}
                      className="flex-1 md:flex-none bg-zinc-950 text-white font-bold text-xs px-10 uppercase tracking-widest hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-950/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer font-sans shadow-lg shadow-zinc-950/15 flex items-center justify-center"
                      style={{ height: '50.71px', borderRadius: '12px' }}
                    >
                      Buy Now
                    </button>
                  </div>
                  <a 
                    href="https://www.youtube.com/shorts/thLkbLjd9LI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto bg-white border border-zinc-300 text-zinc-700 font-bold text-xs px-10 uppercase tracking-widest hover:bg-zinc-100 hover:shadow-md hover:border-zinc-400 hover:-translate-y-0.5 transition-all duration-300 text-center cursor-pointer inline-flex items-center justify-center font-sans"
                    style={{ height: '50.71px', borderRadius: '12px' }}
                  >
                    <span className="material-symbols-outlined text-base mr-2" style={{ fontVariationSettings: "'FILL' 0" }}>videocam</span>
                    Watch Demo
                  </a>
                </div>
              </div>
            </div>
            
            {/* Visually balanced product visual container with technical blueprint overlays and horizontal image carousel */}
            <div className="relative flex flex-col justify-center items-center w-full md:h-full order-1 md:order-2">
              {/* Pulsing glow background shapes */}
              <div className="hidden md:block absolute w-80 h-80 rounded-full bg-error/8 blur-3xl opacity-50 animate-pulse pointer-events-none" />
              <div className="hidden md:block absolute w-[420px] h-[420px] rounded-full bg-zinc-400/8 blur-3xl opacity-40 pointer-events-none" />
              
              {/* Tech blueprint concentric circles */}
              <div className="hidden md:block absolute border border-zinc-200/40 rounded-full w-80 h-80 animate-[spin_80s_linear_infinite] pointer-events-none" style={{ borderStyle: 'dashed' }} />
              <div className="hidden md:block absolute border border-zinc-200/20 rounded-full w-96 h-96 pointer-events-none" />
              
              {/* Carousel Container Wrapper */}
              <div className="relative z-20 w-full max-w-[420px] md:max-w-[460px] lg:max-w-[480px] flex flex-col items-center">
                
                {/* Main viewport with arrow buttons - Styled with aspect-square to ensure height matches width */}
                <div 
                  className="relative w-full aspect-square overflow-hidden rounded-[12px] flex items-center justify-center group"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  

                  {/* Left Chevron Arrow Button */}
                  <button 
                    onClick={() => setCurrentHeroImageIndex(prev => (prev === 0 ? heroImages.length - 1 : prev - 1))}
                    className={`absolute left-3 z-30 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 cursor-pointer select-none active:scale-95 border ${
                      heroImages[currentHeroImageIndex].isDark 
                        ? 'bg-transparent text-white border-white/40 group-hover:bg-white group-hover:text-zinc-950 group-hover:border-white shadow-md' 
                        : 'bg-transparent text-zinc-950 border-zinc-950/30 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 shadow-md'
                    }`}
                    aria-label="Previous Slide"
                  >
                    <svg className="w-5 h-5 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Right Chevron Arrow Button */}
                  <button 
                    onClick={() => setCurrentHeroImageIndex(prev => (prev === heroImages.length - 1 ? 0 : prev + 1))}
                    className={`absolute right-3 z-30 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 cursor-pointer select-none active:scale-95 border ${
                      heroImages[currentHeroImageIndex].isDark 
                        ? 'bg-transparent text-white border-white/40 group-hover:bg-white group-hover:text-zinc-950 group-hover:border-white shadow-md' 
                        : 'bg-transparent text-zinc-950 border-zinc-950/30 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 shadow-md'
                    }`}
                    aria-label="Next Slide"
                  >
                    <svg className="w-5 h-5 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Carousel sliding image wrapper */}
                  <div className="w-full h-full absolute inset-0 rounded-[12px] overflow-hidden bg-zinc-950">
                    {heroImages.map((img, idx) => (
                      <div 
                        key={idx}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                          currentHeroImageIndex === idx 
                            ? 'opacity-100 z-10' 
                            : 'opacity-0 z-0'
                        }`}
                      >
                        <img 
                          alt={img.alt} 
                          className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out" 
                          style={{
                            transform: currentHeroImageIndex === idx ? 'scale(1.05)' : 'scale(1.00)',
                          }}
                          src={img.src} 
                        />
                      </div>
                    ))}
                  </div>

                  {/* Indicator Dots - Inside the image at the bottom */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex justify-center gap-1.5 bg-black/25 backdrop-blur-md rounded-full py-1.5 px-3 border border-white/10 shadow-sm">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentHeroImageIndex === idx 
                            ? 'bg-error w-5' 
                            : 'bg-white/60 hover:bg-white w-1.5'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </section>

        {/* --- FEATURE BAR --- */}
        <div className="relative w-full bg-surface-container-lowest border-y border-outline-variant/20 py-4 overflow-hidden">
          {/* Fading gradient overlays on the sides for a premium look */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex w-max">
            {/* First Set of Items */}
            <div className="flex gap-12 md:gap-24 items-center shrink-0 pr-12 md:pr-24">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span className="font-semibold text-xs uppercase tracking-widest whitespace-nowrap">Sub-second detection</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>hub</span>
                <span className="font-semibold text-xs uppercase tracking-widest whitespace-nowrap">LoRa mesh network</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>battery_charging_full</span>
                <span className="font-semibold text-xs uppercase tracking-widest whitespace-nowrap">Autonomous power supply</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-blue-500" style={{ fontVariationSettings: "'FILL' 0" }}>wifi_off</span>
                <span className="font-semibold text-xs uppercase tracking-widest whitespace-nowrap">No internet required</span>
              </div>
            </div>

            {/* Second Set of Items for Seamless Loop */}
            <div className="flex gap-12 md:gap-24 items-center shrink-0 pr-12 md:pr-24" aria-hidden="true">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span className="font-semibold text-xs uppercase tracking-widest whitespace-nowrap">Sub-second detection</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>hub</span>
                <span className="font-semibold text-xs uppercase tracking-widest whitespace-nowrap">LoRa mesh network</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>battery_charging_full</span>
                <span className="font-semibold text-xs uppercase tracking-widest whitespace-nowrap">Autonomous power supply</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-blue-500" style={{ fontVariationSettings: "'FILL' 0" }}>wifi_off</span>
                <span className="font-semibold text-xs uppercase tracking-widest whitespace-nowrap">No internet required</span>
              </div>
            </div>
          </div>
        </div>


        {/* --- GRID FEATURES (SYSTEMS) --- */}
        <section id="systems" className="py-8 md:py-20 px-4 md:px-16 bg-surface-container-low text-on-surface relative overflow-hidden">
          {/* High-tech dot grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          {/* Subtle top glow highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-error/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="flex justify-between items-end mb-16 max-w-6xl mx-auto">
              <div className="text-left max-w-2xl">
                <span className="font-bold text-xs text-error uppercase tracking-widest block mb-4 font-sans">Proprietary Technology</span>
                <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-primary tracking-tight font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Why AMEC Outperforms <br className="hidden md:block" />Traditional Systems
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
              
              {/* Left Column - Features 1 & 2 */}
              <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 order-2 lg:order-1 w-full">
                
                {/* Card 1 */}
                <div className="glass-pane rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-row gap-3 md:gap-4 items-start text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full group animate-fade-up delay-100">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-error/10 border border-error/5 flex items-center justify-center text-error shrink-0 shadow-sm group-hover:bg-error/20 group-hover:border-error/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>radar</span>
                  </div>
                  <div className="flex flex-col gap-1 md:gap-1.5">
                    <h3 className="font-bold text-sm md:text-base text-primary font-sans tracking-tight">
                      LIDAR Verification
                    </h3>
                    <p className="text-xs text-on-surface-variant font-sans font-medium leading-relaxed max-w-[280px]">
                      LIDAR sensor units classify perimeter movement signatures in sub-seconds, eliminating false alarms and alert fatigue.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="glass-pane rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-row gap-3 md:gap-4 items-start text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full group animate-fade-up delay-150">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-600/10 border border-blue-600/5 flex items-center justify-center text-blue-600 shrink-0 shadow-sm group-hover:bg-blue-600/20 group-hover:border-blue-600/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>language</span>
                  </div>
                  <div className="flex flex-col gap-1 md:gap-1.5">
                    <h3 className="font-bold text-sm md:text-base text-primary font-sans tracking-tight">
                      Self-Healing Mesh
                    </h3>
                    <p className="text-xs text-on-surface-variant font-sans font-medium leading-relaxed max-w-[280px]">
                      Units form an autonomous wireless mesh via long-range LoRa, requiring no local cellular or internet connectivity.
                    </p>
                  </div>
                </div>

              </div>

              {/* Center Column - Product Visual & Badge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 py-6 lg:py-0 relative w-full">
                
                {/* "4 Core Technologies" Pill Badge */}
                <div className="mb-8 bg-error/10 text-error border border-error/20 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest shadow-sm animate-pulse z-10">
                  4 Core Technologies
                </div>
                
                {/* Graphic concentric radar rings behind the product render */}
                <div className="absolute w-72 h-72 rounded-full border border-zinc-300/40 flex items-center justify-center pointer-events-none z-0">
                  <div className="w-56 h-56 rounded-full border border-zinc-300/20 flex items-center justify-center">
                     <div className="w-40 h-40 rounded-full border border-zinc-300/10"></div>
                  </div>
                </div>
                
                {/* Product Image Wrapper */}
                <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center z-10 animate-fade-up delay-100">
                  <img 
                    alt="AMEC Multipurpose Early Warning System" 
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_15px_35px_rgba(0,0,0,0.06)]" 
                    src="/ews/hero-images/product-image-2-png.webp" 
                  />
                </div>

              </div>

              {/* Right Column - Features 3 & 4 */}
              <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 order-3 lg:order-3 w-full">
                
                {/* Card 3 */}
                <div className="glass-pane rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-row gap-3 md:gap-4 items-start text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full group animate-fade-up delay-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-green-600/10 border border-green-600/5 flex items-center justify-center text-green-600 shrink-0 shadow-sm group-hover:bg-green-600/20 group-hover:border-green-600/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>battery_charging_full</span>
                  </div>
                  <div className="flex flex-col gap-1 md:gap-1.5">
                    <h3 className="font-bold text-sm md:text-base text-primary font-sans tracking-tight">
                      Solar Autonomy
                    </h3>
                    <p className="text-xs text-on-surface-variant font-sans font-medium leading-relaxed max-w-[280px]">
                      Each unit is entirely solar-powered with built-in battery storage, engineered for continuous off-grid operation.
                    </p>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="glass-pane rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-row gap-3 md:gap-4 items-start text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full group animate-fade-up delay-250">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-purple-600/10 border border-purple-600/5 flex items-center justify-center text-purple-650 shrink-0 shadow-sm group-hover:bg-purple-600/20 group-hover:border-purple-600/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>security</span>
                  </div>
                  <div className="flex flex-col gap-1 md:gap-1.5">
                    <h3 className="font-bold text-sm md:text-base text-primary font-sans tracking-tight">
                      Hardware Redundancy
                    </h3>
                    <p className="text-xs text-on-surface-variant font-sans font-medium leading-relaxed max-w-[280px]">
                      Multi-path communications prevent single points of failure. The mesh self-heals in real time if any unit goes offline.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* --- OPERATIONAL LOGIC (PROCESS) --- */}
        <section id="process" className="py-8 md:py-20 px-4 md:px-16 bg-surface relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="text-center mb-8 md:mb-20">
              <span className="font-semibold text-xs text-error uppercase tracking-widest block mb-4">Operational Logic</span>
              <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-primary font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>How AMEC Works</h2>
            </div>
            
            {/* Dynamic Timeline Flow */}
            <div className="relative max-w-5xl mx-auto py-8">
              
              {/* Progress Line Background */}
              <div className="absolute top-[64px] left-[12%] right-[12%] h-[3px] bg-zinc-200/50 rounded-full z-0 hidden md:block">
                {/* Active Progress line fill */}
                <div 
                  className="h-full bg-[#f04424] transition-all duration-300 ease-out shadow-[0_0_12px_rgba(240,68,36,0.55)] rounded-full" 
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {[
                  {
                    num: 1,
                    title: 'Detect',
                    desc: 'LIDAR sensor units scan your perimeter, detecting and classifying threats in real time.',
                    icon: 'radar'
                  },
                  {
                    num: 2,
                    title: 'Verify',
                    desc: 'Multi-sensor analysis verifies every detection, completely eliminating false alarms.',
                    icon: 'verified_user'
                  },
                  {
                    num: 3,
                    title: 'Alert',
                    desc: 'Instant alerts are sent to your team via mobile app, SMS, and central dashboard.',
                    icon: 'notifications_active'
                  },
                  {
                    num: 4,
                    title: 'Respond',
                    desc: 'Detailed location, time, and sensor footage enables your team to respond with speed.',
                    icon: 'security'
                  }
                ].map((step) => {
                  const isActive = activeStep >= step.num;
                  const isCurrent = activeStep === step.num;
                  return (
                    <div 
                      key={step.num}
                      onClick={() => setActiveStep(step.num)}
                      className="flex flex-col items-center text-center cursor-pointer group"
                    >
                      {/* Step Indicator Badge */}
                      <div className="relative mb-6">
                        {/* Outer Glow Ring for current active step */}
                        {isCurrent && (
                          <div className="absolute inset-[-8px] rounded-full bg-error/20 animate-ping opacity-75" />
                        )}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 border-2 z-10 relative ${
                          isCurrent
                            ? 'bg-[#f04424] text-white border-[#f04424] shadow-[0_8px_30px_rgba(240,68,36,0.55)] scale-125 ring-4 ring-error/20' 
                            : isActive 
                              ? 'bg-[#f04424] text-white border-[#f04424] shadow-[0_4px_20px_rgba(240,68,36,0.25)] scale-110' 
                              : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'
                        }`}>
                          <span className="material-symbols-outlined text-2xl font-bold">{step.icon}</span>
                        </div>

                      </div>

                      {/* Step Text Details */}
                      <div className="flex flex-col gap-2 transition-all duration-300">
                        <h3 className="font-bold text-xl tracking-tight transition-colors font-sans text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {step.title}
                        </h3>
                        <p className={`text-xs md:text-sm leading-relaxed transition-opacity max-w-[240px] mx-auto font-sans ${
                          isActive ? 'text-on-surface-variant font-medium' : 'text-zinc-400 font-normal'
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- MESH NETWORK (SAFETY) --- */}
        <section id="safety" className="py-8 md:py-20 px-4 md:px-16 bg-surface-container-low">
          <div className="max-w-[1000px] mx-auto relative">
            <div className="text-left max-w-[650px] mb-24 md:mb-8">
              <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-primary mb-4 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>Mesh Network</h2>
              <p className="text-base text-on-surface-variant leading-relaxed">Wireless LoRa units verify each detection - no internet required.</p>
            </div>
            {/* Network Diagram container made relative to anchor the device preview image */}
            <div className="py-4 relative">
              {/* Absolutely positioned small device preview image directly above the Hub (green dot) */}
              <div 
                key="hub-device-wrapper"
                className="absolute right-0 left-auto sm:right-auto sm:left-[90%] -top-16 sm:-top-24 md:-top-28 translate-x-0 sm:-translate-x-1/2 w-[85px] sm:w-[110px] md:w-[130px] z-20 pointer-events-none"
              >
                {/* Radiation ripples behind the device */}
                <div 
                  key="hub-radiation-1"
                  className="absolute left-[60%] top-[22%] w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full border-4 border-[#f04424]/90 bg-[#f04424]/20 -z-10"
                  style={{ 
                    transform: 'translate(-50%, -50%)',
                    animation: 'hubLightRadiation 1.5s infinite',
                  }}
                />
                <div 
                  key="hub-radiation-2"
                  className="absolute left-[60%] top-[22%] w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full border-4 border-[#f04424]/60 bg-transparent -z-10"
                  style={{ 
                    transform: 'translate(-50%, -50%)',
                    animation: 'hubLightRadiation 1.5s infinite',
                    animationDelay: '0.15s',
                  }}
                />

                <img 
                  alt="AMEC Hub Device" 
                  className="w-full h-auto object-contain drop-shadow-lg relative z-10" 
                  src="/ews/hero-images/product-image-2-png.webp" 
                />
                {/* Glowing Alert Indicator Light Overlays (flashes exactly when signal reaches Hub, positioned over the 4 physical LEDs) */}
                {/* LED 1 */}
                <div 
                  key="hub-led-1"
                  className="absolute w-[6px] h-[6px] rounded-full bg-[#f04424] z-20"
                  style={{ 
                    left: '85.69%', 
                    top: '8.21%', 
                    transform: 'translate(-50%, -50%)',
                    animation: 'hubLightFlash 1.5s infinite',
                    boxShadow: '0 0 6px rgba(240, 68, 36, 0.8), 0 0 12px rgba(240, 68, 36, 0.4)'
                  }}
                />
                {/* LED 2 */}
                <div 
                  key="hub-led-2"
                  className="absolute w-[6px] h-[6px] rounded-full bg-[#f04424] z-20"
                  style={{ 
                    left: '85.69%', 
                    top: '14.96%', 
                    transform: 'translate(-50%, -50%)',
                    animation: 'hubLightFlash 1.5s infinite',
                    boxShadow: '0 0 6px rgba(240, 68, 36, 0.8), 0 0 12px rgba(240, 68, 36, 0.4)'
                  }}
                />
                {/* LED 3 */}
                <div 
                  key="hub-led-3"
                  className="absolute w-[6px] h-[6px] rounded-full bg-[#f04424] z-20"
                  style={{ 
                    left: '85.69%', 
                    top: '21.87%', 
                    transform: 'translate(-50%, -50%)',
                    animation: 'hubLightFlash 1.5s infinite',
                    boxShadow: '0 0 6px rgba(240, 68, 36, 0.8), 0 0 12px rgba(240, 68, 36, 0.4)'
                  }}
                />
                {/* LED 4 */}
                <div 
                  key="hub-led-4"
                  className="absolute w-[6px] h-[6px] rounded-full bg-[#f04424] z-20"
                  style={{ 
                    left: '85.69%', 
                    top: '28.42%', 
                    transform: 'translate(-50%, -50%)',
                    animation: 'hubLightFlash 1.5s infinite',
                    boxShadow: '0 0 6px rgba(240, 68, 36, 0.8), 0 0 12px rgba(240, 68, 36, 0.4)'
                  }}
                />
              </div>
              <svg className="w-full h-auto overflow-visible" viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Glowing gradient for the expanding protected coverage area */}
                  <linearGradient id="meshGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.01" />
                  </linearGradient>
                  
                  {/* Glowing filters for signal packets */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
 
                <style>{`
                  @keyframes dataFlow {
                    0% { stroke-dashoffset: 24; }
                    100% { stroke-dashoffset: 0; }
                  }
                  @keyframes pulseNode {
                    0% { transform: scale(0.6); opacity: 0.9; }
                    100% { transform: scale(2.0); opacity: 0; }
                  }
                  @keyframes glowDot {
                    0%, 100% { r: 5px; filter: drop-shadow(0 0 2px rgba(240, 68, 36, 0.7)); }
                    50% { r: 6.5px; filter: drop-shadow(0 0 7px rgba(240, 68, 36, 1)); }
                  }
                  @keyframes pulseArea {
                    0%, 100% { fill-opacity: 0.45; }
                    50% { fill-opacity: 0.8; }
                  }
                  @keyframes hubLightFlash {
                    0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(0.9); }
                    5%, 15% { opacity: 1; transform: translate(-50%, -50%) scale(1.4); }
                    40% { opacity: 0.15; transform: translate(-50%, -50%) scale(0.9); }
                  }
                  @keyframes hubLightRadiation {
                    0%, 5% {
                      transform: translate(-50%, -50%) scale(0.8);
                      opacity: 0;
                    }
                    6% {
                      opacity: 0.8;
                    }
                    40% {
                      transform: translate(-50%, -50%) scale(2.0);
                      opacity: 0;
                    }
                    100% {
                      transform: translate(-50%, -50%) scale(2.0);
                      opacity: 0;
                    }
                  }
                  .animated-path {
                    stroke-dasharray: 6 10;
                    animation: dataFlow 1.2s linear infinite;
                  }
                  .node-glow {
                    transform-origin: center;
                    animation: pulseNode 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                  }
                  .glow-1 { animation-delay: 0s; transform-box: fill-box; }
                  .glow-2 { animation-delay: 0.6s; transform-box: fill-box; }
                  .glow-3 { animation-delay: 1.2s; transform-box: fill-box; }
                  .glow-4 { animation-delay: 1.8s; transform-box: fill-box; }
 
                  .node-dot-active {
                    animation: glowDot 2s ease-in-out infinite;
                  }
                  .mesh-polygon {
                    animation: pulseArea 4s ease-in-out infinite;
                  }
                `}</style>
 
                {/* Shaded/Glowing Protected Area Grid below the nodes */}
                <polygon 
                  points="50,150 250,100 500,160 750,120 900,150 900,230 50,230" 
                  fill="url(#meshGlow)" 
                  className="mesh-polygon" 
                />
 
                {/* Base dashed line */}
                <path d="M50 150 L250 100 L500 160 L750 120 L900 150" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
 
                {/* Animated flowing link line */}
                <path d="M50 150 L250 100 L500 160 L750 120 L900 150" stroke="#f04424" strokeWidth="2.5" strokeLinecap="round" className="animated-path" />
 
                {/* Animated glowing signal dots travelling from Node 1 to Hub */}
                <circle r="4.5" fill="#ba1a1a" filter="url(#glow)">
                  <animateMotion 
                    path="M50 150 L250 100 L500 160 L750 120 L900 150" 
                    dur="4.5s" 
                    begin="0s"
                    repeatCount="indefinite" 
                  />
                </circle>
                <circle r="4.5" fill="#ba1a1a" filter="url(#glow)">
                  <animateMotion 
                    path="M50 150 L250 100 L500 160 L750 120 L900 150" 
                    dur="4.5s" 
                    begin="1.5s"
                    repeatCount="indefinite" 
                  />
                </circle>
                <circle r="4.5" fill="#ba1a1a" filter="url(#glow)">
                  <animateMotion 
                    path="M50 150 L250 100 L500 160 L750 120 L900 150" 
                    dur="4.5s" 
                    begin="3.0s"
                    repeatCount="indefinite" 
                  />
                </circle>
 
                {/* Node 1 */}
                <circle cx="50" cy="150" r="18" fill="rgba(240, 68, 36, 0.15)" className="node-glow glow-1" />
                <circle cx="50" cy="150" r="18" fill="white" stroke="#f04424" strokeWidth="4" />
                <circle cx="50" cy="150" r="5" fill="#f04424" className="node-dot-active" />
                <text x="50" y="195" textAnchor="middle" fill="#1b1b1b" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '12px' }}>N1</text>
 
                {/* Node 2 */}
                <circle cx="250" cy="100" r="18" fill="rgba(240, 68, 36, 0.15)" className="node-glow glow-2" />
                <circle cx="250" cy="100" r="18" fill="white" stroke="#f04424" strokeWidth="4" />
                <circle cx="250" cy="100" r="5" fill="#f04424" className="node-dot-active" />
                <text x="250" y="145" textAnchor="middle" fill="#1b1b1b" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '12px' }}>N2</text>
 
                {/* Node 3 */}
                <circle cx="500" cy="160" r="18" fill="rgba(240, 68, 36, 0.15)" className="node-glow glow-3" />
                <circle cx="500" cy="160" r="18" fill="white" stroke="#f04424" strokeWidth="4" />
                <circle cx="500" cy="160" r="5" fill="#f04424" className="node-dot-active" />
                <text x="500" y="205" textAnchor="middle" fill="#1b1b1b" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '12px' }}>N3</text>
 
                {/* Node 4 */}
                <circle cx="750" cy="120" r="18" fill="rgba(240, 68, 36, 0.15)" className="node-glow glow-4" />
                <circle cx="750" cy="120" r="18" fill="white" stroke="#f04424" strokeWidth="4" />
                <circle cx="750" cy="120" r="5" fill="#f04424" className="node-dot-active" />
                <text x="750" y="165" textAnchor="middle" fill="#1b1b1b" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '12px' }}>N4</text>
 
                {/* Hub */}
                <circle cx="900" cy="150" r="32" fill="rgba(22, 163, 74, 0.15)" className="node-glow glow-1" />
                <circle cx="900" cy="150" r="24" fill="white" stroke="#16a34a" strokeWidth="4" />
                <circle cx="900" cy="150" r="6" fill="#16a34a" className="node-dot-active" />
                <text x="900" y="205" textAnchor="middle" fill="#1b1b1b" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '12px' }}>Hub</text>
              </svg>
            </div>
 
            {/* Results Grid */}
            <div className="mt-8 md:mt-24">
              <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-primary mb-12 text-center font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>The Result:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* No Internet Required */}
                <div className="bg-[#e8f5e9] p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-green-100/50">
                  <div className="bg-white rounded-full flex items-center justify-center shrink-0 w-12 h-12 shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                      <line x1="3" y1="21" x2="21" y2="3" stroke="#374151" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 leading-snug">No Internet Required</h3>
                </div>
 
                {/* No Dedicated Manpower Required */}
                <div className="bg-[#fdf0ea] p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-orange-100/50">
                  <div className="bg-white rounded-full flex items-center justify-center shrink-0 w-12 h-12 shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="none" className="text-[#e65100]">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      <line x1="3" y1="21" x2="21" y2="3" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 leading-snug">No Dedicated Manpower Required</h3>
                </div>
 
                {/* No Monthly Subscription Charges */}
                <div className="bg-[#f2e7fc] p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-purple-100/50">
                  <div className="bg-white rounded-full flex items-center justify-center shrink-0 w-12 h-12 shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#7b1fa2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 6h12" />
                      <path d="M6 10h11" />
                      <path d="M9 6v8c5.5 0 5.5-8 0-8" />
                      <path d="M9 14l8 8" />
                      <line x1="3" y1="21" x2="21" y2="3" stroke="#374151" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 leading-snug">No Monthly Subscription Charges</h3>
                </div>
 
                {/* Real-Time Warning Exactly When It Matters */}
                <div className="bg-[#e8f0fe] p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-blue-100/50">
                  <div className="bg-white rounded-full flex items-center justify-center shrink-0 w-12 h-12 shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1976d2" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M12 7v5l4 2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 leading-snug">Real-Time Warning Exactly When It Matters</h3>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant text-center max-w-4xl mx-auto leading-relaxed">
                The system uses LiDAR sensing, wireless unit-to-unit communication, solar-powered operation, and alert verification logic to reduce false triggers and ensure reliable performance.
              </p>
            </div>
          </div>
        </section>

        {/* --- IMAGE BREAK / CASE STUDY (WHY IT MATTERS) --- */}
        <section className="w-full relative md:aspect-[1600/754] flex items-center bg-[#151518] overflow-hidden py-8 md:py-0">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              alt="Industrial site with AMEC early warning system" 
              className="w-full h-full object-cover object-[80%_0%] md:object-cover" 
              src="/ews/cta_bg_clear.jpg" 
            />
            {/* Left-to-right dark gradient overlay for text readability, fading rapidly to keep the center/right clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
          </div>
          
          {/* Content container */}
          <div className="max-w-[1440px] mx-auto w-full relative z-10 px-8 md:pl-32 md:pr-20 lg:pl-48 lg:pr-32 flex items-center">
            <div className="max-w-xl flex flex-col items-start text-left gap-4 md:gap-6">
              
              {/* Header with fading red line */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] md:text-xs font-bold text-[#ff5252] uppercase tracking-widest font-sans">
                  Perimeter Intelligence
                </span>
                <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-white font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Why It Matters
                </h2>
                {/* Fading red horizontal line */}
                <div className="h-[3px] w-full max-w-[200px] md:max-w-[280px] bg-gradient-to-r from-[#dc2626] via-[#dc2626]/40 to-transparent mt-1" />
              </div>

              {/* Highlight Quote */}
              <p className="text-zinc-300 text-xs md:text-sm font-semibold border-l-2 border-error pl-4 py-1 italic leading-relaxed max-w-md font-sans">
                "Designed for environments where traditional CCTV reacts too late, detecting threats before they reach your critical assets."
              </p>
              
              {/* Bullet List */}
              <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 mt-1 md:mt-2">
                
                {/* Item 1 */}
                <div className="flex items-start gap-2 md:gap-3">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1 md:w-5 md:h-5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <p className="text-sm md:text-lg lg:text-xl font-medium text-white/95 leading-snug font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    A single alert can prevent accidents.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-2 md:gap-3">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1 md:w-5 md:h-5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <p className="text-sm md:text-lg lg:text-xl font-medium text-white/95 leading-snug font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    A single alert can stop theft.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-2 md:gap-3">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1 md:w-5 md:h-5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <p className="text-sm md:text-lg lg:text-xl font-medium text-white/95 leading-snug font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    A single alert can save lives.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="flex items-start gap-2 md:gap-3">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1 md:w-5 md:h-5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <p className="text-sm md:text-lg lg:text-xl font-medium text-white/95 leading-snug font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    A single alert can <span className="text-[#ff5252] font-extrabold font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>save lakhs of rupees.</span>
                  </p>
                </div>

              </div>
              
            </div>
          </div>
        </section>

        {/* --- COMPARISON TABLE SECTION --- */}
        <section id="pricing" className="py-8 md:py-20 px-6 md:px-16 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-16">
              <span className="font-bold text-xs text-red-650 uppercase tracking-widest block mb-4">Compare</span>
              <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-zinc-955 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                AMEC vs. Traditional Security
              </h2>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/50">
                    <th className="p-2 md:p-6 font-bold text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider md:tracking-widest w-[32%] md:w-1/3">Feature</th>
                    <th className="p-2 md:p-6 pt-9 md:pt-12 font-bold text-[10px] md:text-sm text-red-600 uppercase tracking-wider md:tracking-widest w-[36%] md:w-1/3 text-center bg-red-50/50 border-x-2 border-t-2 border-red-500 relative">
                      <div className="absolute top-2 md:top-3.5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-[7px] md:text-[9px] font-bold px-1.5 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm shadow-red-600/10">
                        Recommended
                      </div>
                      AMEC Security
                    </th>
                    <th className="p-2 md:p-6 font-bold text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider md:tracking-widest w-[32%] md:w-1/3 text-center">Traditional Systems</th>
                  </tr>
                </thead>
                <tbody className="text-xs md:text-sm text-zinc-800">
                  {[
                    { feature: "False Alarm Rate", amec: "Very Low", traditional: "High", isText: true },
                    { feature: "24/7 Autonomous Operation", amec: true, traditional: false },
                    { feature: "Off-Grid Capability", amec: true, traditional: false },
                    { feature: "Self-Healing Network", amec: true, traditional: false },
                    { feature: "AI-Powered Detection", amec: true, traditional: false },
                    { feature: "Operational Cost", amec: "Low (TCO)", traditional: "High (TCO)", isText: true, isCost: true }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-zinc-150 hover:bg-zinc-50/30 transition-colors">
                      <td className="p-2 md:p-6 font-bold text-zinc-900 break-words">{row.feature}</td>
                      <td className="p-2 md:p-6 text-center bg-red-50/50 border-x-2 border-red-500">
                        {row.isText ? (
                          <span className="font-extrabold text-green-650">
                            {idx === 0 && (
                              <span className="material-symbols-outlined text-sm align-middle mr-1.5 font-bold">check</span>
                            )}
                            {row.amec}
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-green-600 font-bold">check</span>
                        )}
                      </td>
                      <td className="p-2 md:p-6 text-center text-zinc-400">
                        {row.isText ? (
                          <span className={`font-semibold ${row.isCost ? "text-red-500" : ""}`}>{row.traditional}</span>
                        ) : (
                          <span className="material-symbols-outlined text-red-500 font-bold">close</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Action Row containing the Buy Now button under AMEC column */}
                  <tr className="hover:bg-zinc-50/30 transition-colors">
                    <td className="p-2 md:p-6"></td>
                    <td className="p-2 md:p-6 text-center bg-red-50/50 border-x-2 border-b-2 border-red-500 rounded-b-3xl">
                      <button 
                        onClick={() => router.push('/checkout')}
                        className="w-full bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-950/20 transition-all duration-300 cursor-pointer flex items-center justify-center"
                        style={{ height: '50.71px', borderRadius: '12px' }}
                      >
                        Buy Now
                      </button>
                    </td>
                    <td className="p-2 md:p-6"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* --- APPLICATIONS SECTION --- */}
        <section id="applications" className="py-8 md:py-20 px-6 md:px-16 bg-white border-b border-zinc-100">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <span className="font-bold text-xs text-red-600 uppercase tracking-widest block mb-4">Built for Every Environment</span>
              <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-zinc-955 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Applications
              </h2>
            </div>
            
            <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-6 px-6 md:mx-auto md:px-0 md:overflow-visible md:snap-none md:pb-0">
              {[
                {
                  title: "Industrial Sites",
                  desc: "Protect manufacturing units and perimeter walls.",
                  img: "/ews/Applications/industrial-sites.webp",
                  icon: "factory",
                },
                {
                  title: "Solar Power Plants",
                  desc: "Prevent solar panel and critical equipment theft.",
                  img: "/ews/Applications/solar-power-plants.webp",
                  icon: "solar_power",
                },
                {
                  title: "Construction Sites",
                  desc: "Monitor assets and prevent unauthorized access.",
                  img: "/ews/Applications/construction-sites.webp",
                  icon: "construction",
                },
                {
                  title: "Warehouses",
                  desc: "Secure storage units and distribution centers.",
                  img: "/ews/Applications/warehouses.webp",
                  icon: "warehouse",
                },
                {
                  title: "Mining & Metals",
                  desc: "Safeguard remote mining equipment and operations.",
                  img: "/ews/Applications/mining-sites.webp",
                  icon: "landscape",
                },
                {
                  title: "Railways",
                  desc: "Protect tracks, yards, and transit corridors.",
                  img: "/ews/Applications/railways.webp",
                  icon: "train",
                },
                {
                  title: "NGOs & Wildlife Conservation",
                  desc: "Monitor habitats and prevent poaching activity.",
                  img: "/ews/Applications/ngos-wildlife-conservation.webp",
                  icon: "nature_people",
                },
                {
                  title: "Government Facilities",
                  desc: "Secure administrative properties and public hubs.",
                  img: "/ews/Applications/government-facilities.webp",
                  icon: "account_balance",
                }
              ].map((app, idx) => (
                <div key={idx} className="flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 w-[44vw] min-w-[44vw] md:w-auto md:min-w-0 snap-start shrink-0 md:shrink">
                  <div className="aspect-square overflow-hidden bg-zinc-100">
                    <img 
                      alt={app.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                      src={app.img} 
                    />
                  </div>
                  <div className="p-3 md:p-5 flex flex-col gap-1 text-center items-center">
                    <h3 className="font-bold text-xs md:text-sm text-zinc-950 leading-snug">{app.title}</h3>
                    <p className="text-[10px] md:text-[11px] text-zinc-500 leading-snug">{app.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section id="reviews" className="py-8 md:py-20 px-6 md:px-16 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-[1440px] mx-auto text-center">
            <span className="font-bold text-xs text-red-600 uppercase tracking-widest block mb-4">Trust Fed Globally</span>
            <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-zinc-955 mb-4 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Trusted by Security Professionals
            </h2>
            <div className="flex items-center justify-center gap-2 mb-16">
              <div className="flex text-amber-500">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <span className="font-bold text-xs text-zinc-500 tracking-wider">
                4.9/5 from 250+ customers
              </span>
            </div>
            
            <div 
              ref={testimonialsRef}
              onScroll={handleTestimonialsScroll}
              className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10 snap-x snap-mandatory scrollbar-none pb-4 -mx-6 px-6 md:mx-auto md:px-0 md:overflow-visible md:snap-none md:pb-0"
            >
              {[
                {
                  quote: "AMEC's system has transformed our perimeter security. False alarms dropped by 95% and response time improved drastically.",
                  author: "Reliance Industries",
                  role: "Head of Security",
                  logo: "RI"
                },
                {
                  quote: "The mesh network is rock-solid even in remote areas. Setup was quick and the support team is excellent.",
                  author: "Adani Solar",
                  role: "Security Operations Lead",
                  logo: "AS"
                },
                {
                  quote: "Finally, a solution that works in harsh environments without constant maintenance hassles.",
                  author: "ONGC Field Specialist",
                  role: "Security Manager",
                  logo: "ON"
                }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 text-left w-[82vw] min-w-[82vw] md:w-auto md:min-w-0 snap-start shrink-0 md:shrink">
                  <div>
                    <span className="text-4xl font-serif text-red-600/20 leading-none select-none block -mb-2">“</span>
                    <p className="text-zinc-800 font-semibold text-sm leading-relaxed italic mb-6">
                      {card.quote}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-5 border-t border-zinc-100">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 tracking-wider border border-red-100">
                      {card.logo}
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-zinc-955 block">{card.author}</span>
                      <span className="text-xs text-zinc-500 font-medium leading-none">{card.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-6 md:hidden">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToTestimonial(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeTestimonialIndex === idx 
                      ? 'bg-red-600 w-5' 
                      : 'bg-zinc-300 hover:bg-zinc-400 w-1.5'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section id="faq" className="py-8 md:py-20 px-6 md:px-16 bg-white border-b border-zinc-100">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-16">
              <span className="font-bold text-xs text-red-600 uppercase tracking-widest block mb-4">Questions? We've Got Answers</span>
              <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold text-zinc-955 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
              {faqItems.map((item, idx) => {
                const actualIdx = idx;
                const isOpen = openFaq === actualIdx;
                const orderClasses = [
                  'order-1 lg:order-1',
                  'order-2 lg:order-3',
                  'order-3 lg:order-5',
                  'order-4 lg:order-7',
                  'order-5 lg:order-2',
                  'order-6 lg:order-4',
                  'order-7 lg:order-6',
                  'order-8 lg:order-8',
                ];
                const orderClass = orderClasses[idx];

                return (
                  <div 
                    key={actualIdx} 
                    className={`h-full flex flex-col border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${orderClass}`}
                  >
                    <button 
                      className="w-full flex-1 p-6 text-left flex justify-between items-center gap-4 font-extrabold text-base text-zinc-900 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                      onClick={() => setOpenFaq(isOpen ? null : actualIdx)}
                    >
                      <span>{item.q}</span>
                      <span className={`material-symbols-outlined text-red-600 text-xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                        add
                      </span>
                    </button>
                    <div className={`transition-all duration-350 ease-in-out overflow-hidden ${isOpen ? "max-h-[300px] border-t border-zinc-100" : "max-h-0"}`}>
                      <p className="p-6 text-sm text-zinc-500 leading-relaxed bg-zinc-50/20">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- DONT WAIT FOR AN INCIDENT / CTA SECTION --- */}
        <section id="quote" className="relative w-full overflow-hidden bg-zinc-950 py-8 md:py-20 text-white scroll-mt-20 border-b border-zinc-900">
          {/* Edge-to-edge background photography overlay at 15% opacity */}
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
            <img 
              alt="Industrial background deployment" 
              className="w-full h-full object-cover" 
              src="/ews/sunset_mining.jpg" 
            />
          </div>
          {/* Subtle red and blue background glow */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-error/12 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-blue-900/12 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Value Prop & Message */}
              <div className="lg:col-span-7 flex flex-col items-start gap-8">
                
                {/* Shield Icon / Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 border border-error/30 text-error text-[10px] font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-xs leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  Perimeter Command &amp; Control
                </div>

                <div className="flex flex-col gap-4 text-left">
                  <h2 className="text-3xl md:text-[40px] md:leading-[48px] font-bold uppercase tracking-tight font-sans text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Protect your site before <br />the first incident happens
                  </h2>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                    Traditional security systems document crimes. AMEC prevents them. By deploying an autonomous, AI-driven sensor mesh, you secure your perimeter before threats reach your assets.
                  </p>
                </div>

                {/* Technical Value Propositions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left w-full mt-2">
                  
                  {/* Item 1 */}
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#f04424] mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs md:text-sm text-white">Thousands of Meters. Zero Blind Spots.</span>
                      <span className="text-zinc-400 text-[11px] md:text-xs mt-0.5">Complete boundary coverage tailored to complex topography.</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#f04424] mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs md:text-sm text-white">AI-Powered Early Warning</span>
                      <span className="text-zinc-400 text-[11px] md:text-xs mt-0.5">Detect, track, and verify intruders at the boundary in sub-seconds.</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#f04424] mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs md:text-sm text-white">Engineered for Infrastructure</span>
                      <span className="text-zinc-400 text-[11px] md:text-xs mt-0.5">IP67 weatherproofed, military-grade materials, built for extreme climates.</span>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#f04424] mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs md:text-sm text-white">Off-Grid Independence</span>
                      <span className="text-zinc-400 text-[11px] md:text-xs mt-0.5">Operates entirely on solar battery mesh. No cabling or grid required.</span>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">Deployment Footprint</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-zinc-400 text-xs">
                    <span>Installed Boundary: <strong>{boundaryCount.toLocaleString()}+ meters</strong></span>
                    <span>•</span>
                    <span>Active Sites: <strong>{activeHubsCount.toLocaleString()}+ critical hubs</strong></span>
                  </div>
                </div>

              </div>

              {/* Right Column: Pricing & Conversion Card */}
              <div className="lg:col-span-5 w-full">
                <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 md:p-10 rounded-3xl flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all duration-300">
                  
                  {/* Card Header with Shield */}
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-12 h-12 rounded bg-zinc-800/80 flex items-center justify-center border border-zinc-700/50">
                      <svg viewBox="0 0 24 24" width="30" height="30" className="w-[30px] h-[30px]">
                        <path 
                          d="M12 2.5L4 5.2v5.8c0 5 3.5 9.5 8 10.8 4.5-1.3 8-5.8 8-10.8V5.2L12 2.5z" 
                          fill="none" 
                          stroke="#ffffff" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        <circle cx="12" cy="11" r="2.5" fill="#f04424" />
                      </svg>
                    </div>
                    <div className="flex flex-col text-left font-sans">
                      <span className="text-[10px] font-bold text-error uppercase tracking-widest leading-none mb-1">Limited Onboarding</span>
                      <span className="font-extrabold text-sm text-white tracking-tight leading-none">Deployment Availability</span>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-850 w-full" />

                  {/* Pricing Details */}
                  <div className="flex flex-col gap-3 text-left">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initial Investment</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">₹35,992</span>
                      <span className="text-sm font-semibold text-error line-through">₹44,991</span>
                      <span className="text-xs font-bold bg-error/15 text-error px-2 py-0.5 rounded border border-error/25 uppercase tracking-wider">20% Off</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                      One-time unit cost • + 18% GST • 1 Year Warranty • No annual contract fees
                    </div>
                  </div>

                  {/* Alert Tag */}
                  <div className="bg-[#f04424]/10 border border-[#f04424]/20 p-4 rounded-xl text-left flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#f04424] text-lg shrink-0 mt-0.5">info</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-white">Customized Onboarding Queue</span>
                      <span className="text-[11px] text-zinc-400 leading-snug mt-0.5">Only a limited number of corporate sites can be commissioned each month. Slots fill rapidly.</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 mt-2">
                    <button 
                      onClick={() => router.push('/checkout')}
                      className="w-full bg-[#f04424] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#f04424]/90 hover:shadow-xl hover:shadow-error/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer"
                      style={{ height: '50.71px', borderRadius: '12px' }}
                    >
                      SHOP NOW
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- CONTACT & CORPORATE OFFICES SECTION --- */}
        <section id="contact" className="py-8 md:py-20 px-4 md:px-16 bg-white border-t border-zinc-150 scroll-mt-20">
          <div className="max-w-[1440px] mx-auto">
            {/* Desktop View Card (lg:flex, hidden on mobile) */}
            <div className="hidden lg:flex bg-[#f0f4f8] rounded-[32px] p-8 justify-between items-center gap-8 shadow-sm border border-zinc-200/50">
              {/* Left Details block */}
              <div className="flex flex-col gap-5 max-w-4xl">
                
                {/* Brand Line */}
                <div className="flex items-center gap-3">
                  {/* Building Icon */}
                  <span className="text-[#1a365d] shrink-0">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                      <line x1="9" y1="22" x2="9" y2="16" />
                      <line x1="15" y1="22" x2="15" y2="16" />
                      <line x1="9" y1="16" x2="15" y2="16" />
                      <path d="M8 6h.01" />
                      <path d="M16 6h.01" />
                      <path d="M8 10h.01" />
                      <path d="M16 10h.01" />
                      <path d="M12 6h.01" />
                      <path d="M12 10h.01" />
                    </svg>
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-zinc-800 tracking-tight font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    AMEC Technology
                  </span>
                </div>

                {/* Address Line */}
                <div className="flex items-start gap-3">
                  {/* Green Map Pin */}
                  <span className="text-[#4caf50] shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div className="flex flex-col gap-2 text-xs md:text-sm text-zinc-600 font-medium leading-relaxed font-sans">
                    <p><span className="font-bold text-zinc-800">Sales Office:</span> 868, 25th Main Road, HSR Layout, Sector-1, Bengaluru, KA, India - 560102</p>
                    <p><span className="font-bold text-zinc-800">Factory Address:</span> Plot No. 5A, 14A, Hingna MIDC, Digdoh, Nagpur, MH, India - 440016</p>
                  </div>
                </div>

                {/* Phone Line */}
                <div className="text-sm md:text-base font-bold text-zinc-800 tracking-tight font-sans flex flex-col md:flex-row gap-x-6 gap-y-1.5 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <div>
                    <span className="text-zinc-500 font-medium mr-2">Sales:</span>
                    <a href="tel:+917887870040" className="hover:text-error transition-colors">+91 7887870040</a>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium mr-2">Service:</span>
                    <a href="tel:+918087758405" className="hover:text-error transition-colors">+91 8087758405</a>
                  </div>
                </div>

                {/* Web & Email Line */}
                <div className="text-sm md:text-base font-semibold text-zinc-600 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans">
                  <a href="mailto:sales@amectechnology.com" className="hover:text-error transition-colors">sales@amectechnology.com</a>
                  <span className="text-zinc-300">|</span>
                  <a href="https://www.amectechnology.com" target="_blank" rel="noopener noreferrer" className="hover:text-error transition-colors">www.amectechnology.com</a>
                </div>

              </div>

              {/* Right Circular Icon Badges */}
              <div className="flex items-center gap-4 shrink-0">
                <a 
                  href="tel:+917887870040"
                  className="w-16 h-16 rounded-full bg-[#e8f4ec] hover:bg-[#d6ebdcf5] flex items-center justify-center transition-all shadow-sm border border-emerald-100 group shrink-0 cursor-pointer"
                  title="Call Us"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700 group-hover:scale-110 transition-transform">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </a>
                <a 
                  href="mailto:sales@amectechnology.com"
                  className="w-16 h-16 rounded-full bg-[#f6ebf6] hover:bg-[#eedbee] flex items-center justify-center transition-all shadow-sm border border-purple-100 group shrink-0 cursor-pointer"
                  title="Email Us"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700 group-hover:scale-110 transition-transform">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile/Tablet View Card (lg:hidden) */}
            <div className="lg:hidden bg-[#f0f4f8] rounded-[32px] p-6 flex flex-col gap-5 shadow-sm border border-zinc-200/50 max-w-lg mx-auto">
              {/* Brand Line */}
              <div className="flex items-center gap-3">
                {/* Building Icon */}
                <span className="text-[#1a365d] shrink-0">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <line x1="9" y1="22" x2="9" y2="16" />
                    <line x1="15" y1="22" x2="15" y2="16" />
                    <line x1="9" y1="16" x2="15" y2="16" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                    <path d="M8 10h.01" />
                    <path d="M16 10h.01" />
                    <path d="M12 6h.01" />
                    <path d="M12 10h.01" />
                  </svg>
                </span>
                <span className="text-lg md:text-xl font-bold text-zinc-800 tracking-tight font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  AMEC Technology
                </span>
              </div>

              {/* Address Line */}
              <div className="flex items-start gap-3 mt-1">
                {/* Green Map Pin */}
                <span className="text-[#4caf50] shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div className="flex flex-col gap-2 text-xs md:text-sm text-zinc-600 font-medium leading-relaxed font-sans">
                  <p>
                    <span className="font-bold text-zinc-800">Sales Office:</span> 868, 25th Main Road, HSR Layout, Sector-1, Bengaluru - 560102
                  </p>
                  <p>
                    <span className="font-bold text-zinc-800">Factory Address:</span> Plot No. 5A, 14A, Hingna MIDC, Digdoh, Nagpur - 440016
                  </p>
                </div>
              </div>

              {/* Thin Divider Line */}
              <div className="h-px bg-zinc-200/80 w-full my-2" />

              {/* Helpline Row */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-col gap-0.5 text-left font-sans">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sales Helpline</span>
                    <div className="text-xs md:text-sm font-bold text-zinc-800 tracking-tight">
                      <a href="tel:+917887870040" className="hover:text-error transition-colors">+91 7887870040</a>
                    </div>
                  </div>
                  {/* Phone button aligned right */}
                  <a 
                    href="tel:+917887870040"
                    className="w-10 h-10 rounded-full bg-[#e8f4ec] hover:bg-[#d6ebdcf5] flex items-center justify-center transition-all shadow-sm border border-emerald-100 group shrink-0 cursor-pointer"
                    title="Call Sales"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700 group-hover:scale-110 transition-transform">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </a>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-col gap-0.5 text-left font-sans">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Helpline</span>
                    <div className="text-xs md:text-sm font-bold text-zinc-800 tracking-tight">
                      <a href="tel:+918087758405" className="hover:text-error transition-colors">+91 8087758405</a>
                    </div>
                  </div>
                  {/* Phone button aligned right */}
                  <a 
                    href="tel:+918087758405"
                    className="w-10 h-10 rounded-full bg-[#e2f0fd] hover:bg-[#d0e5fb] flex items-center justify-center transition-all shadow-sm border border-blue-100 group shrink-0 cursor-pointer"
                    title="Call Service"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700 group-hover:scale-110 transition-transform">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Email Row */}
              <div className="flex justify-between items-center gap-4 mt-2">
                <div className="flex flex-col gap-0.5 text-left font-sans">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</span>
                  <a href="mailto:sales@amectechnology.com" className="text-xs md:text-sm font-bold text-zinc-800 hover:text-error transition-colors tracking-tight">
                    sales@amectechnology.com
                  </a>
                </div>
                {/* Email button aligned right */}
                <a 
                  href="mailto:sales@amectechnology.com"
                  className="w-10 h-10 rounded-full bg-[#f6ebf6] hover:bg-[#eedbee] flex items-center justify-center transition-all shadow-sm border border-purple-100 group shrink-0 cursor-pointer"
                  title="Email Us"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700 group-hover:scale-110 transition-transform">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#09090b] text-white/60 w-full border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 pt-8 pb-24 md:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 lg:col-span-2 flex flex-col gap-6 text-left">
              <div className="flex items-center gap-2">
                <img alt="AMEC Shield Logo" className="h-10 w-auto object-contain" src="/ews/logo_shield.png" />
                <img alt="AMEC Logo" className="h-5 w-auto object-contain" src="/ews/logo_amec_new.png" />
              </div>
              <p className="text-sm leading-relaxed max-w-sm text-zinc-400">
                AMEC Technology provides the world's most sophisticated perimeter intelligence systems. Protecting strategic infrastructure with autonomous, real-time detection since 2019.
              </p>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <div className="text-[11px] text-white/40 font-medium">
                  1 Year Warranty &amp; 5 Year Mesh Support Guarantee.
                </div>
              </div>
            </div>

            <div className="col-span-1 text-left">
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Technical Downloads</h5>
              <ul className="flex flex-col gap-3 text-xs">
                <li><a href="https://i.ibb.co/ZRNrVGHT/Amec-Early-Warning-System.png" target="_blank" className="hover:text-error transition-colors">Product Brochure (PDF)</a></li>
              </ul>
            </div>

            <div className="col-span-1 text-left">
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Support &amp; Services</h5>
              <ul className="flex flex-col gap-3 text-xs">
                <li><button onClick={() => handleScroll('contact')} className="hover:text-error transition-colors cursor-pointer text-left">Installation Support</button></li>
                <li><button onClick={() => handleScroll('contact')} className="hover:text-error transition-colors cursor-pointer text-left">Commissioning Queue</button></li>
                <li><button onClick={() => handleScroll('contact')} className="hover:text-error transition-colors cursor-pointer text-left">Service Coverage Areas</button></li>
                <li><button onClick={() => handleScroll('faq')} className="hover:text-error transition-colors cursor-pointer text-left">Platform Documentation</button></li>
              </ul>
            </div>
          </div>
          <div className="h-px w-full bg-white/10 mb-8"></div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <span>© 2025 AMEC Technology. All rights reserved.</span>
            <span className="text-white/40">Bengaluru · Pune · Nagpur</span>
          </div>
        </div>
      </footer>

      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-4 pt-3 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] transition-[transform,opacity] duration-300 ease-in-out lg:hidden ${
        showStickyBtn ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center justify-between gap-3">
          {/* Pricing Info */}
          <div className="flex flex-col items-start shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-zinc-900 tracking-tight">₹{(35992 * heroQuantity).toLocaleString('en-IN')}</span>
              <span className="text-xs font-semibold text-zinc-400 line-through">₹{(44991 * heroQuantity).toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">20% Off</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">(+18% GST) · {heroQuantity} {heroQuantity === 1 ? 'Unit' : 'Units'}</span>
          </div>
          {/* Buy Now Button */}
          <button 
            onClick={() => router.push('/checkout')}
            className="bg-zinc-950 text-white px-6 font-bold text-xs uppercase tracking-widest shadow-lg shadow-zinc-950/15 active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            style={{ height: '44px', borderRadius: '10px' }}
          >
            Buy Now
            <span className="material-symbols-outlined text-sm leading-none font-bold">arrow_forward</span>
          </button>
        </div>
      </div>

    </div>
  );
}