'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ConfettiCanvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#f04424', '#ba1a1a', '#34a853', '#4285f4', '#f8a5c2', '#f9ca24', '#5f27cd', '#22a6b3'];
    const particles: any[] = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 3 + 2,
        d: Math.random() * count,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 6 - 3,
        tiltAngleIncremental: Math.random() * 0.05 + 0.02,
        tiltAngle: 0,
        speed: Math.random() * 1.5 + 0.8
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speed;
        p.x += Math.sin(p.tiltAngle) * 0.5;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > height) {
          particles[idx] = {
            ...p,
            x: Math.random() * width,
            y: -20,
            tilt: Math.random() * 6 - 3,
            tiltAngle: 0
          };
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 w-full h-full" />;
};

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleScroll = (id: string) => {
    window.location.href = `/#${id}`;
  };
  
  // State for booking details
  const [bookingDetails, setBookingDetails] = useState({
    paymentId: 'pay_TEST_12345',
    name: '',
    email: '',
    companyName: '',
    address: '',
    city: '',
    stateName: '',
    zip: '',
    date: '',
    timeSlot: ''
  });

  useEffect(() => {
    // 1. Try reading from URL parameters first
    const paramPaymentId = searchParams.get('paymentId') || searchParams.get('payment_id');

    // 2. Try reading from LocalStorage
    const nameVal = localStorage.getItem('checkout_name') || '';
    const emailVal = localStorage.getItem('checkout_email') || '';
    const companyVal = localStorage.getItem('checkout_companyName') || '';
    const addressVal = localStorage.getItem('checkout_address') || '';
    const cityVal = localStorage.getItem('checkout_city') || '';
    const stateVal = localStorage.getItem('checkout_stateName') || '';
    const zipVal = localStorage.getItem('checkout_zip') || '';
    const dateVal = localStorage.getItem('checkout_date') || '';
    const timeSlotVal = localStorage.getItem('checkout_timeSlot') || '';
    const storedPaymentId = localStorage.getItem('checkout_paymentId') || '';

    setBookingDetails({
      paymentId: paramPaymentId || storedPaymentId || 'pay_TEST_12345',
      name: nameVal,
      email: emailVal,
      companyName: companyVal,
      address: addressVal,
      city: cityVal,
      stateName: stateVal,
      zip: zipVal,
      date: dateVal,
      timeSlot: timeSlotVal
    });

    // Trigger Meta Pixel Purchase Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', { value: 499, currency: 'INR' });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative bg-[#f4f6f8] text-[#09090b] font-sans antialiased flex flex-col justify-between">
      
      {/* Sunburst background rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#eef2f5_100%)] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle, #09090b 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />

      {/* --- TOP NAVBAR (Same as homepage) --- */}
      <nav className="w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/40 shadow-lg shrink-0 relative">
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
              { label: 'Booking', id: 'pricing' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                className="font-semibold text-xs text-zinc-400 hover:text-white transition-colors duration-300 uppercase tracking-widest font-sans px-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/checkout"
              className="hidden lg:flex bg-zinc-950 text-white font-bold text-xs px-6 uppercase tracking-widest hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-950/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-md shadow-zinc-950/10 font-sans items-center justify-center"
              style={{ height: '50.71px', borderRadius: '12px' }}
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </nav>

      {/* Confetti Animation */}
      <ConfettiCanvas />

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-grow flex items-center justify-center p-3 relative z-20 my-4">
        
        {/* Central Card (Ultra-compact mini card) */}
        <div className="w-full max-w-[370px] bg-white rounded-[16px] shadow-[0_12px_32px_rgba(9,9,11,0.03)] border-t-[4px] border-[#f04424] p-4.5 flex flex-col items-center text-center gap-3.5 relative overflow-hidden">
          
          {/* Confetti graphics overlay on the card background */}
          <div className="absolute inset-0 pointer-events-none opacity-60 select-none">
            <svg className="absolute left-6 top-8 w-5 h-5 text-[#f04424]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 3c3 3-3 6 0 9s3 6 0 9" />
            </svg>
            <svg className="absolute right-6 top-12 w-5 h-5 text-[#ba1a1a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 3c-3 3 3 6 0 9s-3 6 0 9" />
            </svg>
            <span className="absolute left-12 top-16 w-1 h-1 rounded-full bg-[#f9ca24] block" />
            <span className="absolute right-14 top-8 w-1 h-1 rounded-full bg-[#4285f4] block" />
          </div>

          {/* Success Ring Badge (Mini size) */}
          <div className="relative flex items-center justify-center z-20">
            <div className="w-[60px] h-[60px] rounded-full bg-[#e6f4ea] flex items-center justify-center border border-[#c2e7cc]">
              <div className="w-[40px] h-[40px] rounded-full bg-[#34a853] flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Headings (Mini typography) */}
          <div className="flex flex-col gap-0.5 z-20 w-full">
            <h1 className="text-base md:text-lg font-extrabold text-[#09090b] tracking-tight font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Consultation Booked Successfully!
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold tracking-wider font-sans uppercase text-[#34a853]">
              Your consultation request has been successfully received.
            </p>
            <p className="text-[#52525b] text-[10px] md:text-[11px] max-w-[320px] mx-auto leading-relaxed mt-0.5">
              Thank you for booking a consultation with us. Our team will review your request and one of our executives will contact you shortly to confirm the details and schedule your consultation.
            </p>
          </div>

          {/* Schedule Block (Mini capsule) */}
          <div className="w-full bg-[#f8f9fa] border border-zinc-200/50 rounded-[10px] py-2.5 px-3 relative z-20">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-[#e8f4fd]">
                <span className="material-symbols-outlined text-[13px] text-[#1a73e8]" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Consultation Schedule</span>
                <span className="font-extrabold text-[10px] text-[#09090b] font-sans leading-tight">To Be Coordinated (TBD)</span>
              </div>
            </div>
          </div>

          {/* Payment ID - Rendered as a separate wide row */}
          {bookingDetails.paymentId && (
            <div className="w-full bg-[#f8f9fa] border border-zinc-200/50 rounded-[10px] py-2 px-3 flex items-center justify-between gap-2 relative z-20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#e6f4ea] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#34a853] text-[13px]" style={{ fontVariationSettings: "'FILL' 0" }}>credit_card</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Payment Reference ID</span>
                  <span className="font-mono text-[9px] text-[#09090b] tracking-tight leading-tight select-all break-all">{bookingDetails.paymentId}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(bookingDetails.paymentId);
                  alert("Copied Payment ID!");
                }}
                className="text-[9px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase font-sans cursor-pointer flex items-center gap-1 shrink-0 ml-1"
                title="Copy ID"
              >
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy</span>
              </button>
            </div>
          )}

          {/* Guarantee / Refundability Note */}
          <div className="w-full bg-emerald-50/80 border border-emerald-200/60 rounded-[10px] py-2 px-3 flex items-center justify-center gap-1.5 relative z-20">
            <span className="material-symbols-outlined text-emerald-600 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-[10px] font-bold text-emerald-800 tracking-wide font-sans">Amount Fully Refundable Guarantee</span>
          </div>

          {/* Client Details Summary */}
          {(bookingDetails.name || bookingDetails.email) && (
            <div className="w-full bg-[#f8f9fa] border border-zinc-200/50 rounded-[10px] p-3 text-left flex flex-col gap-1.5 relative z-20">
              <span className="text-[7.5px] font-bold text-zinc-400 uppercase tracking-widest leading-none border-b border-zinc-200/40 pb-1">Confirmed Details</span>
              <div className="text-[9.5px] text-[#3f3f46] flex flex-col gap-1 leading-normal font-sans">
                {bookingDetails.name && <div><span className="font-semibold text-zinc-800">Client:</span> {bookingDetails.name}{bookingDetails.companyName && ` (${bookingDetails.companyName})`}</div>}
                {bookingDetails.email && <div><span className="font-semibold text-zinc-800">Email:</span> {bookingDetails.email}</div>}
                {bookingDetails.address && (
                  <div>
                    <span className="font-semibold text-zinc-800">Site Address:</span> {bookingDetails.address}, {bookingDetails.city}, {bookingDetails.stateName} - {bookingDetails.zip}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mini Next Steps Box */}
          <div className="w-full bg-[#f8fafc] border border-zinc-200/60 rounded-xl p-3 text-left relative z-20 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#e2e8f0] flex items-center justify-center shrink-0 mt-0.5 text-zinc-700">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 0" }}>info</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-[10.5px] font-extrabold text-[#09090b] font-sans">
                What happens next?
              </h4>
              <p className="text-[#334155] text-[9.5px] leading-tight mt-0.5">
                Our senior perimeter design engineer will contact you shortly to schedule your consultation session and send the Google Meet invitation link.
              </p>
            </div>
          </div>

          {/* Back to Home Button (Compact) */}
          <button 
            onClick={() => router.push('/')}
            className="text-white font-bold text-xs py-2.5 px-6 uppercase tracking-widest bg-[#09090b] hover:bg-zinc-800 shadow-zinc-950/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full cursor-pointer shadow-sm font-sans rounded-lg mt-0.5 flex items-center justify-center gap-1.5 relative z-20"
          >
            <span>Back to Home</span>
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#09090b] text-white/60 w-full border-t border-white/10 relative z-30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-8 md:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-6 md:mb-10">
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

    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6f8] relative z-30">
        <div className="text-zinc-500 font-medium text-[9px]">Loading confirmation details...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
