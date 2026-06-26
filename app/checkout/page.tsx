"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [qty, setQty] = useState(1);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qtyVal = params.get('qty');
      if (qtyVal) {
        setQty(Math.max(1, Math.min(10, parseInt(qtyVal) || 1)));
      }
    }
  }, []);

  const [name, setName] = useState('Commander Shepard');
  const [email, setEmail] = useState('shepard@n7.alliance');
  const [address, setAddress] = useState('Sector 7G, Industrial District');
  const [city, setCity] = useState('Bangalore');
  const [stateName, setStateName] = useState('Karnataka');
  const [zip, setZip] = useState('56001');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'wire'>('razorpay');
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    paymentId?: string;
    isWire: boolean;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    });
  };

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (paymentMethod === 'wire') {
      setSuccessModal({ isOpen: true, isWire: true });
      return;
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_Sdh2WaT4aYxo9E",
      amount: 44991 * qty * 100, // ₹44,991.00 * qty in paisa
      currency: "INR",
      name: "AMEC Technology",
      description: "Secure Node Acquisition",
      image: "/logo_shield.png",
      handler: function (response: any) {
        setSuccessModal({ isOpen: true, paymentId: response.razorpay_payment_id, isWire: false });
      },
      prefill: {
        name: name,
        email: email,
      },
      notes: {
        address: `${address}, ${city}, ${stateName} - ${zip}`
      },
      theme: {
        color: "#000000"
      }
    };

    try {
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      alert("Failed to initialize payment gateway. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased">
      <style>{`
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
      `}</style>
      
      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/40 shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-6 md:px-16 py-5 max-w-[1440px] mx-auto">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <img alt="AMEC Shield Logo" className="h-10 w-auto object-contain" src="/logo_shield.png" />
            <img alt="AMEC Logo" className="h-6 w-auto object-contain brightness-0 invert" src="/logo_amec_new.png" />
          </Link>
          <div className="hidden lg:flex gap-8 items-center">
            {[
              { label: 'Product', id: 'systems' },
              { label: 'Technology', id: 'safety' },
              { label: 'Applications', id: 'applications' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <Link 
                key={item.id}
                href={`/#${item.id}`}
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
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
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
          <div className="lg:hidden absolute inset-x-0 top-[80px] bg-white border-b border-zinc-200 shadow-xl flex flex-col p-6 gap-4 z-40 animate-in slide-in-from-top duration-200">
            {[
              { label: 'Product', id: 'systems' },
              { label: 'Technology', id: 'safety' },
              { label: 'Applications', id: 'applications' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-left font-bold text-sm text-zinc-800 uppercase tracking-widest py-2 border-b border-zinc-100 last:border-0 hover:text-error transition-colors cursor-pointer font-sans"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* --- CHECKOUT CONTENT --- */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 md:py-20 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Page Title */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-error uppercase tracking-widest">
                ● Secure Node Acquisition
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Checkout.
              </h1>
            </div>

            {/* Section 1: Client Identification */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 font-bold text-lg">01</span>
                <h3 className="text-lg font-bold text-zinc-900">Client Identification</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#f4f4f5] border-0 outline-none rounded-lg px-4 py-3.5 text-sm font-medium text-zinc-800 focus:bg-zinc-200/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Email (Encrypted)</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f4f4f5] border-0 outline-none rounded-lg px-4 py-3.5 text-sm font-medium text-zinc-800 focus:bg-zinc-200/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Deployment Location */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 font-bold text-lg">02</span>
                <h3 className="text-lg font-bold text-zinc-900">Deployment Location</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Installation Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#f4f4f5] border-0 outline-none rounded-lg px-4 py-3.5 text-sm font-medium text-zinc-800 focus:bg-zinc-200/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">City</label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#f4f4f5] border-0 outline-none rounded-lg px-4 py-3.5 text-sm font-medium text-zinc-800 focus:bg-zinc-200/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">State</label>
                    <input 
                      type="text" 
                      value={stateName} 
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full bg-[#f4f4f5] border-0 outline-none rounded-lg px-4 py-3.5 text-sm font-medium text-zinc-800 focus:bg-zinc-200/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Zip Code</label>
                    <input 
                      type="text" 
                      value={zip} 
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-[#f4f4f5] border-0 outline-none rounded-lg px-4 py-3.5 text-sm font-medium text-zinc-800 focus:bg-zinc-200/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Configuration */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 font-bold text-lg">03</span>
                <h3 className="text-lg font-bold text-zinc-900">Payment Configuration</h3>
              </div>
              <div className="flex flex-col gap-4">
                
                {/* Razorpay Option */}
                <div 
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`border rounded-xl p-5 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'razorpay' ? 'border-zinc-950 bg-zinc-50/50' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Razorpay Icon */}
                    <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] border border-zinc-200/60 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src="/images.png" alt="Razorpay Secure" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                        Razorpay Secure
                        <span className="text-[10px] text-zinc-400 font-normal">✔</span>
                      </span>
                      <span className="text-xs text-zinc-500">UPI, Cards, Netbanking & Wallet</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'razorpay' ? 'border-zinc-900' : 'border-zinc-300'
                  }`}>
                    {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />}
                  </div>
                </div>

                {/* Corporate Wire Option */}
                <div 
                  onClick={() => setPaymentMethod('wire')}
                  className={`border rounded-xl p-5 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'wire' ? 'border-zinc-950 bg-zinc-50/50' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Bank Icon placeholder */}
                    <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] border border-zinc-200/60 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M21 9H3" />
                        <path d="M21 15H3" />
                        <path d="M12 3v18" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-zinc-900">Corporate Wire</span>
                      <span className="text-xs text-zinc-500">Manual verification (2-3 days)</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'wire' ? 'border-zinc-900' : 'border-zinc-300'
                  }`}>
                    {paymentMethod === 'wire' && <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT: Sidebar Billing Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Mission Inventory Card */}
            <div className="border border-zinc-200 rounded-3xl p-6 md:p-8 bg-white shadow-sm flex flex-col gap-6">
              <h3 className="font-bold text-lg text-zinc-950 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Mission Inventory
              </h3>
              
              {/* Product row */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl border border-zinc-100 overflow-hidden bg-zinc-50 shrink-0">
                  <img 
                    alt="AMEC Sensor Node" 
                    className="w-full h-full object-cover" 
                    src="/sensor_node_new.jpg"
                  />
                </div>
                <div className="flex-grow flex flex-col">
                  <span className="font-bold text-sm text-zinc-900">AMEC Sensor Node</span>
                  <span className="text-[11px] text-zinc-400 font-medium">Precision Calibration V4.2</span>
                  <span className="text-xs text-zinc-500 mt-1">Qty: {qty.toString().padStart(2, '0')}</span>
                </div>
                <div className="font-bold text-sm text-zinc-900">
                  ₹{(44991 * qty).toLocaleString('en-IN')}.00
                </div>
              </div>

              {/* Cost break line */}
              <div className="h-px bg-zinc-100 w-full" />
              
              {/* Cost table */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-bold text-zinc-900">₹{(44991 * qty).toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Tactical Deployment (Shipping)</span>
                  <span className="font-bold text-zinc-900">₹0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">GST (18%)</span>
                  <span className="font-bold text-zinc-900 text-xs bg-zinc-100 px-2 py-0.5 rounded">Included</span>
                </div>
              </div>

              {/* Total line */}
              <div className="h-px bg-zinc-100 w-full" />
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Commitment</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-zinc-950 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ₹{(44991 * qty).toLocaleString('en-IN')}.00
                  </span>
                  <span className="text-xs font-bold text-error uppercase tracking-wider">INR</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handlePayment}
                className="bg-zinc-950 text-white font-bold text-xs px-6 uppercase tracking-widest hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-950/20 hover:-translate-y-0.5 transition-all duration-300 w-full cursor-pointer shadow-md shadow-zinc-950/10 font-sans flex items-center justify-center gap-2"
                style={{ height: '50.71px', borderRadius: '12px' }}
              >
                <span>Proceed to Payment</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              
              {/* Encryption Notice */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>AES-256 Bit Encrypted Connection</span>
              </div>

            </div>

            {/* Logistics Alert */}
            <div className="bg-[#f9fafb] border border-zinc-200 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-error mt-0.5 shrink-0">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19 13.75L9 21v-6H5c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8c0 1.1-.9 1.75-2 1.75z"/>
                </svg>
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-zinc-900 tracking-wider uppercase">Priority Logistics</span>
                <p className="text-xs text-zinc-500 leading-normal">
                  Shipping scheduled within 12 hours of payment confirmation.
                </p>
              </div>
            </div>

            {/* Corporate Office Contact Widget */}
            <div className="bg-[#f0f4f8] border border-zinc-200/60 rounded-2xl p-5 flex flex-col gap-4">
              
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                  <line x1="9" y1="22" x2="9" y2="16" />
                  <line x1="15" y1="22" x2="15" y2="16" />
                </svg>
                <span className="font-bold text-xs text-zinc-900 tracking-wider uppercase">Corporate Office</span>
              </div>
              
              <div className="flex flex-col gap-3 text-xs">
                
                {/* Addresses */}
                <div className="flex gap-2">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600 shrink-0 mt-0.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div className="flex flex-col gap-1.5 text-zinc-600 font-medium font-sans">
                    <p>Nagpur: Plot No. 5A, 14A, Hingna MIDC, Digdoh, Nagpur - 440016</p>
                    <p>Bengaluru: 868, 25th Main, HSR Layout, Sector-1, Bengaluru - 560102</p>
                  </div>
                </div>

                {/* Divider line */}
                <div className="h-px bg-zinc-200 w-full" />

                {/* Helpline Numbers */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider font-sans">Helpline</span>
                    <span className="font-bold text-zinc-800">+91 7887870040 / +91 8087752141</span>
                  </div>
                  <a href="tel:+917887870040" className="w-8 h-8 rounded-full bg-[#e8f4ec] flex items-center justify-center text-emerald-700 border border-emerald-100 hover:bg-[#d6ebdcf5] transition-colors shrink-0">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </a>
                </div>

                {/* Email Support */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider font-sans">Email</span>
                    <span className="font-bold text-zinc-800">sales@amectechnology.com</span>
                  </div>
                  <a href="mailto:sales@amectechnology.com" className="w-8 h-8 rounded-full bg-[#f6ebf6] flex items-center justify-center text-purple-700 border border-purple-100 hover:bg-[#eedbee] transition-colors shrink-0">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-zinc-50 border-t border-zinc-200/80 text-zinc-500 py-12 px-6 md:px-16 text-xs">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-extrabold text-sm text-zinc-950 uppercase tracking-widest font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>AMEC</span>
            <span>© 2025 AMEC Technology. Mission-Critical Precision.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-zinc-400 font-medium">
            <Link href="/#faq" className="hover:text-zinc-800 transition-colors">Privacy Policy</Link>
            <Link href="/#faq" className="hover:text-zinc-800 transition-colors">Terms of Service</Link>
            <Link href="/#faq" className="hover:text-zinc-800 transition-colors">Global Offices</Link>
            <Link href="/#faq" className="hover:text-zinc-800 transition-colors">Support</Link>
          </div>
        </div>
      </footer>

      {/* --- CUSTOM SUCCESS / INFORMATION MODAL --- */}
      {successModal && successModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] border border-zinc-200/60 p-8 md:p-10 max-w-md w-full shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            
            {/* Top red-orange accent brand bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#f04424] via-[#ba1a1a] to-[#f04424]" />

            {/* Success Icon with glowing concentric rings */}
            {successModal.isWire ? (
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping opacity-60 w-16 h-16 m-auto" />
                <div className="absolute inset-0 rounded-full bg-blue-500/5 w-24 h-24 m-auto" />
                <div className="relative w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner shrink-0 border border-blue-100">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-60 w-16 h-16 m-auto" />
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 w-24 h-24 m-auto" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner shrink-0 border border-emerald-100">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            )}

            {/* Modal Heading */}
            <div className="flex flex-col gap-1.5 mt-2">
              <h3 className="text-2xl font-black text-zinc-950 tracking-tight font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {successModal.isWire ? "Order Initiated!" : "Payment Successful!"}
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {successModal.isWire ? "Secure Wire Transfer" : "Transaction Complete"}
              </p>
            </div>

            {/* Modal Details Body */}
            {successModal.isWire ? (
              <div className="w-full flex flex-col gap-4 text-left">
                
                {/* Bank Card / Passbook Redesign */}
                <div className="bg-[#f0f5fa] border border-[#dce6f0] rounded-2xl p-5 flex flex-col gap-3.5 relative overflow-hidden shadow-inner">
                  {/* Subtle watermarked grid design inside the bank details box */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                  
                  {/* Bank Name */}
                  <div className="flex justify-between items-center py-1 border-b border-zinc-200/50 relative z-10">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Bank</span>
                    <span className="font-extrabold text-xs text-zinc-900 font-sans">HDFC Bank</span>
                  </div>

                  {/* Account Name */}
                  <div className="flex justify-between items-center py-1 border-b border-zinc-200/50 relative z-10">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Account Name</span>
                    <span className="font-bold text-xs text-zinc-900 font-sans">AMEC Technology Pvt Ltd</span>
                  </div>

                  {/* Account Number */}
                  <div className="flex justify-between items-center py-1 border-b border-zinc-200/50 relative z-10">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Account Number</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-zinc-900 select-all">50200012345678</span>
                      <button
                        onClick={() => copyToClipboard('50200012345678', 'accountNumber')}
                        className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer shrink-0"
                        title="Copy Account Number"
                      >
                        {copiedField === 'accountNumber' ? (
                          <span className="text-[9px] font-bold uppercase text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">Copied!</span>
                        ) : (
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* IFSC */}
                  <div className="flex justify-between items-center py-1 border-b border-zinc-200/50 relative z-10">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">IFSC Code</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-zinc-900 select-all">HDFC0000123</span>
                      <button
                        onClick={() => copyToClipboard('HDFC0000123', 'ifsc')}
                        className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer shrink-0"
                        title="Copy IFSC Code"
                      >
                        {copiedField === 'ifsc' ? (
                          <span className="text-[9px] font-bold uppercase text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">Copied!</span>
                        ) : (
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Amount to Wire */}
                  <div className="flex justify-between items-center py-1 relative z-10">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Amount to Wire</span>
                    <span className="font-extrabold text-sm text-zinc-900 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>₹{(44991 * qty).toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                {/* Bulk copy details button */}
                <button
                  onClick={() => {
                    const textToCopy = `Bank Name: HDFC Bank\nAccount Name: AMEC Technology Pvt Ltd\nAccount Number: 50200012345678\nIFSC Code: HDFC0000123\nAmount: ₹${(44991 * qty).toLocaleString('en-IN')}.00`;
                    copyToClipboard(textToCopy, 'allWireDetails');
                  }}
                  className="w-full px-4 border border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:text-zinc-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-zinc-50/50 hover:bg-zinc-50"
                  style={{ height: '50.71px', borderRadius: '12px' }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                  <span>{copiedField === 'allWireDetails' ? "Copied All Details!" : "Copy All Details"}</span>
                </button>

                {/* Logistics Info Banner */}
                <div className="bg-[#f0f9ff] border border-[#e0f2fe] rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
                  <span className="text-blue-500 mt-0.5 shrink-0">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </span>
                  <p className="text-[11px] text-blue-800 leading-normal font-medium">
                    Please initiate the wire transfer and email the receipt to <span className="font-semibold text-blue-900">billing@amectechnology.com</span>. Deployment scheduling will begin immediately upon validation.
                  </p>
                </div>

              </div>
            ) : (
              <div className="w-full flex flex-col gap-5">
                
                {/* Modern Dashed Receipt Box */}
                <div className="bg-zinc-50 border-2 border-dashed border-zinc-200/80 rounded-2xl p-5 flex flex-col gap-4 text-left relative overflow-hidden shadow-inner">
                  {/* Watermarked check pattern */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                  
                  {/* Amount Row */}
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Amount Paid</span>
                    <span className="font-extrabold text-sm text-zinc-900 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>₹{(44991 * qty).toLocaleString('en-IN')}.00</span>
                  </div>

                  {/* Divider line */}
                  <div className="h-px bg-zinc-200/70 w-full relative z-10" />

                  {/* Payment ID copyable element */}
                  <div className="flex flex-col gap-1.5 relative z-10">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Payment ID</span>
                    <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 font-mono text-zinc-800 text-xs shadow-sm select-all">
                      <span className="font-extrabold tracking-tight">{successModal.paymentId}</span>
                      <button
                        onClick={() => {
                          if (successModal.paymentId) {
                            copyToClipboard(successModal.paymentId, 'paymentId');
                          }
                        }}
                        className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider font-sans cursor-pointer shrink-0 ml-2"
                        title="Copy Payment ID"
                      >
                        {copiedField === 'paymentId' ? (
                          <span className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-100/60 px-1.5 py-0.5 rounded">Copied!</span>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Logistics Info Banner */}
                <div className="bg-[#f0f9ff] border border-[#e0f2fe] rounded-2xl p-4 flex items-start gap-3.5 text-left w-full shadow-sm">
                  <span className="text-blue-500 mt-0.5 shrink-0">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-xs text-blue-900 tracking-wide uppercase">Priority Logistics</span>
                    <p className="text-[11px] text-blue-700/90 leading-normal font-medium">
                      Order dispatch scheduled within 12 hours. Delivery tracking link will be sent to <span className="font-semibold text-blue-950">{email}</span>.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3.5 w-full mt-2">
              <Link 
                href="/"
                className="bg-zinc-950 text-white font-bold text-xs px-6 uppercase tracking-widest hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-950/20 hover:-translate-y-0.5 transition-all duration-300 w-full cursor-pointer shadow-md shadow-zinc-950/10 font-sans flex items-center justify-center gap-2"
                style={{ height: '50.71px', borderRadius: '12px' }}
              >
                <span>Return to Homepage</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <button 
                onClick={() => setSuccessModal(null)}
                className="bg-transparent text-zinc-400 hover:text-zinc-700 font-bold text-xs py-2 tracking-widest uppercase cursor-pointer transition-colors"
              >
                Close Dialog
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
