"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [qty, setQty] = useState(1);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('amec_qty');
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          setQty(parsed);
          return;
        }
      }
      setQty(1);
    }
  }, []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zip, setZip] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [areaToCover, setAreaToCover] = useState('');
  const [application, setApplication] = useState('Wildlife');
  const [customApplication, setCustomApplication] = useState('');
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    paymentId?: string;
    isWire: boolean;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    companyName?: string;
    address?: string;
    city?: string;
    stateName?: string;
    zip?: string;
  }>({});

  const UNIT_PRICE = 35992; // 20% discount on ₹44,991 (Original price: 44991)
  const subtotal = UNIT_PRICE * qty;
  const taxAmount = Math.floor(subtotal * 0.18);
  const totalCommitment = subtotal + taxAmount;

  const handleScroll = (id: string) => {
    window.location.href = `/ews/#${id}`;
  };

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

  const saveCheckoutToGoogleSheets = async (paymentId: string) => {
    try {
      const payload = {
        name,
        phone,
        email,
        companyName,
        gstNo,
        address,
        city,
        stateName,
        zip,
        siteLocation,
        areaToCover,
        application: application === 'Other' ? customApplication : application,
        paymentId
      };
      
      await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Error calling save checkout API:", err);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Full Legal Name is required';
    }

    // Company Name validation
    if (!companyName.trim()) {
      newErrors.companyName = 'Company Name is required';
    }

    // Phone validation
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^(?:\+91|91)?[6789]\d{9}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (!address.trim()) {
      newErrors.address = 'Complete Address is required';
    }

    // City validation
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    // State validation
    if (!stateName.trim()) {
      newErrors.stateName = 'State is required';
    }

    // Zip code validation
    const zipRegex = /^\d{6}$/;
    if (!zip.trim()) {
      newErrors.zip = 'Zip Code is required';
    } else if (!zipRegex.test(zip)) {
      newErrors.zip = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      alert("Please fill all the required details before proceeding.");
      return;
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_T8B1ZfO0qV6cTa",
      amount: totalCommitment * 100, // Total Commitment including 18% GST in paisa
      currency: "INR",
      name: "AMEC Technology",
      description: "Secure Node Acquisition",
      image: "/ews/logo_shield.png",
      handler: function (response: any) {
        const paymentId = response.razorpay_payment_id;
        setSuccessModal({ isOpen: true, paymentId, isWire: false });
        saveCheckoutToGoogleSheets(paymentId);
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      notes: {
        address: `${address}, ${city}, ${stateName} - ${zip}`,
        phone: phone,
        company_name: companyName,
        gst_no: gstNo,
        site_location: siteLocation,
        area_to_cover: areaToCover,
        application: application === 'Other' ? customApplication : application,
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
    <div className="min-h-screen w-full overflow-x-hidden relative bg-zinc-50/60 text-zinc-900 font-sans antialiased">
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
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/40 shadow-lg">
        <div className="flex justify-between items-center px-6 md:px-16 pt-7 pb-4 md:py-5 max-w-[1440px] mx-auto">
          <a href="https://amectechnology.com/" className="flex items-center gap-3 cursor-pointer">
            <img alt="AMEC Shield Logo" className="h-10 w-auto object-contain" src="/ews/logo_shield.png" />
            <img alt="AMEC Logo" className="h-6 w-auto object-contain brightness-0 invert" src="/ews/logo_amec_new.png" />
          </a>
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
          <div className="lg:hidden absolute inset-x-0 top-full bg-white border-b border-zinc-200 shadow-xl flex flex-col p-6 gap-4 z-40 animate-in slide-in-from-top duration-200">
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
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-20 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* LEFT: Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Page Title */}
            <div className="flex flex-col gap-1 mb-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-bold text-zinc-950 tracking-tight font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Checkout.
              </h1>
            </div>

            {/* How To Buy Section */}
            <div className="border border-zinc-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 bg-white shadow-sm flex flex-col gap-6">
              <div>
                <span className="text-[10px] font-bold text-error uppercase tracking-widest block mb-1">● What Happens Next</span>
                <h2 className="text-xl font-bold text-zinc-950 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  How To Buy
                </h2>
              </div>
              
              <div className="flex flex-col gap-5 relative">
                {/* Visual vertical connector line */}
                <div className="absolute left-[17px] top-6 bottom-6 w-px bg-zinc-200" />
                
                {[
                  {
                    num: 1,
                    title: "Complete Your Payment",
                    desc: "Secure your order by completing the payment."
                  },
                  {
                    num: 2,
                    title: "Quantity Consultation Call",
                    desc: "Our team will contact you to verify your required quantities and confirm your installation location details."
                  },
                  {
                    num: 3,
                    title: "Order Processing & Dispatch",
                    desc: "Once the consultation is complete, we'll process and dispatch your order."
                  },
                  {
                    num: 4,
                    title: "Delivery to Your Location",
                    desc: "Your Early Warning System will be delivered to your specified address."
                  }
                ].map((step) => (
                  <div key={step.num} className="flex gap-4 items-start relative z-10">
                    <div className="w-9 h-9 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-zinc-900">
                      {step.num}
                    </div>
                    <div className="flex flex-col gap-0.5 pt-1.5">
                      <span className="font-bold text-sm text-zinc-900 leading-none">{step.title}</span>
                      <span className="text-xs text-zinc-500 mt-1.5 leading-relaxed font-medium">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 1: Client Identification */}
            <div className="border border-zinc-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-white shadow-sm flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 font-extrabold text-lg">01</span>
                <h3 className="text-lg font-bold text-zinc-950 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Client Identification
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    className={`w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner ${
                      errors.name ? 'border-red-500 focus:border-red-500 shadow-sm shadow-red-500/5' : 'border-transparent focus:border-zinc-300'
                    }`}
                  />
                  {errors.name && <span className="text-[10px] text-red-600 font-semibold tracking-wide mt-0.5">{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+91 99000 12345"
                    className={`w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner ${
                      errors.phone ? 'border-red-500 focus:border-red-500 shadow-sm shadow-red-500/5' : 'border-transparent focus:border-zinc-300'
                    }`}
                  />
                  {errors.phone && <span className="text-[10px] text-red-600 font-semibold tracking-wide mt-0.5">{errors.phone}</span>}
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Email (Encrypted)</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner ${
                      errors.email ? 'border-red-500 focus:border-red-500 shadow-sm shadow-red-500/5' : 'border-transparent focus:border-zinc-300'
                    }`}
                  />
                  {errors.email && <span className="text-[10px] text-red-600 font-semibold tracking-wide mt-0.5">{errors.email}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Company Name</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (errors.companyName) setErrors(prev => ({ ...prev, companyName: undefined }));
                    }}
                    placeholder="e.g. Acme Corp"
                    className={`w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner ${
                      errors.companyName ? 'border-red-500 focus:border-red-500 shadow-sm shadow-red-500/5' : 'border-transparent focus:border-zinc-300'
                    }`}
                  />
                  {errors.companyName && <span className="text-[10px] text-red-600 font-semibold tracking-wide mt-0.5">{errors.companyName}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">GST No. (Optional)</label>
                  <input 
                    type="text" 
                    value={gstNo} 
                    onChange={(e) => setGstNo(e.target.value)}
                    placeholder="e.g. 29GGGGG1314R1Z0"
                    className="w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border border-transparent focus:border-zinc-300 outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Deployment Location */}
            <div className="border border-zinc-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-white shadow-sm flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 font-extrabold text-lg">02</span>
                <h3 className="text-lg font-bold text-zinc-950 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Deployment Location
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Complete Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
                    }}
                    className={`w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner ${
                      errors.address ? 'border-red-500 focus:border-red-500 shadow-sm shadow-red-500/5' : 'border-transparent focus:border-zinc-300'
                    }`}
                  />
                  {errors.address && <span className="text-[10px] text-red-600 font-semibold tracking-wide mt-0.5">{errors.address}</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">City</label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors(prev => ({ ...prev, city: undefined }));
                      }}
                      className={`w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner ${
                        errors.city ? 'border-red-500 focus:border-red-500 shadow-sm shadow-red-500/5' : 'border-transparent focus:border-zinc-300'
                      }`}
                    />
                    {errors.city && <span className="text-[10px] text-red-600 font-semibold tracking-wide mt-0.5">{errors.city}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">State</label>
                    <input 
                      type="text" 
                      value={stateName} 
                      onChange={(e) => {
                        setStateName(e.target.value);
                        if (errors.stateName) setErrors(prev => ({ ...prev, stateName: undefined }));
                      }}
                      className={`w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner ${
                        errors.stateName ? 'border-red-500 focus:border-red-500 shadow-sm shadow-red-500/5' : 'border-transparent focus:border-zinc-300'
                      }`}
                    />
                    {errors.stateName && <span className="text-[10px] text-red-600 font-semibold tracking-wide mt-0.5">{errors.stateName}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Zip Code</label>
                    <input 
                      type="text" 
                      value={zip} 
                      onChange={(e) => {
                        setZip(e.target.value);
                        if (errors.zip) setErrors(prev => ({ ...prev, zip: undefined }));
                      }}
                      className={`w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner ${
                        errors.zip ? 'border-red-500 focus:border-red-500 shadow-sm shadow-red-500/5' : 'border-transparent focus:border-zinc-300'
                      }`}
                    />
                    {errors.zip && <span className="text-[10px] text-red-600 font-semibold tracking-wide mt-0.5">{errors.zip}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Site & Project Specifications */}
            <div className="border border-zinc-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-white shadow-sm flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 font-extrabold text-lg">03</span>
                <h3 className="text-lg font-bold text-zinc-950 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Site &amp; Project Specifications
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Site Location</label>
                    <input 
                      type="text" 
                      value={siteLocation} 
                      onChange={(e) => setSiteLocation(e.target.value)}
                      placeholder="e.g. Western Ghats Forest Reserve, Elysium Sector 1"
                      className="w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border border-transparent focus:border-zinc-300 outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Area to be covered</label>
                    <input 
                      type="text" 
                      value={areaToCover} 
                      onChange={(e) => setAreaToCover(e.target.value)}
                      placeholder="e.g. 5 km Perimeter / 50 Acres"
                      className="w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border border-transparent focus:border-zinc-300 outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Application Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'Wildlife', label: 'Wildlife Monitoring' },
                      { id: 'Human Intrusion', label: 'Human Intrusion' },
                      { id: 'Industrial Security', label: 'Industrial Security' },
                      { id: 'Other', label: 'Other Application' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setApplication(opt.id)}
                        className={`flex items-center justify-center py-3 sm:py-3.5 px-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                          application === opt.id 
                            ? 'border-zinc-950 bg-zinc-950 text-white shadow-md' 
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-800'
                        }`}
                      >
                        <span className="text-[11px] font-bold tracking-tight leading-tight">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {application === 'Other' && (
                  <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Specify Other Application</label>
                    <input 
                      type="text" 
                      value={customApplication} 
                      onChange={(e) => setCustomApplication(e.target.value)}
                      placeholder="Specify your application (e.g., Agricultural Protection, Border Patrol)"
                      className="w-full bg-[#f4f4f5]/60 hover:bg-[#f4f4f5]/90 focus:bg-white border border-transparent focus:border-zinc-300 outline-none rounded-xl px-4 py-2.5 sm:py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 focus:shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: Sidebar Billing Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col gap-6">
            
            {/* Mission Inventory Card */}
            <div className="border border-zinc-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-white shadow-sm flex flex-col gap-5 sm:gap-6">
              <h3 className="font-bold text-lg text-zinc-950 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Mission Inventory
              </h3>
              
              {/* Product row */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl border border-zinc-100 overflow-hidden bg-zinc-50 shrink-0">
                  <img 
                    alt="AMEC Multipurpose Early Warning System" 
                    className="w-full h-full object-cover" 
                    src="/ews/solar_pole_forest.png"
                  />
                </div>
                <div className="flex-grow flex flex-col">
                  <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 leading-tight">AMEC Multipurpose Early Warning System</span>
                  <span className="text-[10px] text-zinc-500 font-medium mt-1 leading-normal">A smart, reliable & self-sufficient solution designed to provide real-time alerts & early warnings across critical infrastructure & remote locations.</span>
                  <span className="text-xs text-zinc-500 mt-1">Qty: {qty.toString().padStart(2, '0')}</span>
                </div>
                <div className="font-bold text-sm text-zinc-900">
                  ₹{(UNIT_PRICE * qty).toLocaleString('en-IN')}.00
                </div>
              </div>

              {/* Cost break line */}
              <div className="h-px bg-zinc-100 w-full" />
              
              {/* Cost table */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-bold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Delivery Fee</span>
                  <span className="font-bold text-zinc-900">
                    <span className="line-through text-zinc-400 mr-1.5">₹2,000.00</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Tax (18% GST)</span>
                  <span className="font-bold text-zinc-900">₹{taxAmount.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Total line */}
              <div className="h-px bg-zinc-100 w-full" />
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Total Commitment
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-zinc-950 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ₹{totalCommitment.toLocaleString('en-IN')}.00
                  </span>
                  <span className="text-xs font-bold text-error uppercase tracking-wider">INR</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium leading-snug">
                  ₹{subtotal.toLocaleString('en-IN')}.00 + ₹{taxAmount.toLocaleString('en-IN')}.00 (18% GST) = ₹{totalCommitment.toLocaleString('en-IN')}.00
                </span>
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
                    <p><span className="font-bold text-zinc-800">Sales Office:</span> 868, 25th Main Road, HSR Layout, Sector-1, Bengaluru - 560102</p>
                    <p><span className="font-bold text-zinc-800">Factory Address:</span> Plot No. 5A, 14A, Hingna MIDC, Digdoh, Nagpur - 440016</p>
                  </div>
                </div>

                {/* Divider line */}
                <div className="h-px bg-zinc-200 w-full" />

                {/* Helpline Numbers */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider font-sans">Sales Helpline</span>
                      <span className="font-bold text-zinc-800">+91 7887870040</span>
                    </div>
                    <a href="tel:+917887870040" className="w-8 h-8 rounded-full bg-[#e8f4ec] flex items-center justify-center text-emerald-700 border border-emerald-100 hover:bg-[#d6ebdcf5] transition-colors shrink-0" title="Call Sales">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider font-sans">Service Helpline</span>
                      <span className="font-bold text-zinc-800">+91 8087758405</span>
                    </div>
                    <a href="tel:+918087758405" className="w-8 h-8 rounded-full bg-[#e2f0fd] flex items-center justify-center text-blue-700 border border-blue-100 hover:bg-[#d0e5fb] transition-colors shrink-0" title="Call Service">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                    </a>
                  </div>
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
      <footer className="bg-[#09090b] text-white/60 w-full border-t border-white/10 text-xs">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 pt-8 pb-24 md:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 lg:col-span-2 flex flex-col gap-6 text-left">
              <div className="flex items-center gap-2">
                <img alt="AMEC Shield Logo" className="h-10 w-auto object-contain" src="/ews/logo_shield.png" />
                <img alt="AMEC Logo" className="h-5 w-auto object-contain brightness-0 invert" src="/ews/logo_amec_new.png" />
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
                <li><a href="/ews/brochure_page1.jpg" target="_blank" className="hover:text-error transition-colors">Product Brochure (PDF)</a></li>
                <li><a href="/ews/diagram_v5.jpg" target="_blank" className="hover:text-error transition-colors">Technical Datasheet</a></li>
                <li><button onClick={() => handleScroll('systems')} className="hover:text-error transition-colors cursor-pointer text-left">LIDAR Node Specs</button></li>
                <li><button onClick={() => handleScroll('safety')} className="hover:text-error transition-colors cursor-pointer text-left">Gateway Hub Manual</button></li>
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
            <span className="text-white/40">Bengaluru · Johannesburg · MDG · HDFC · New Delhi</span>
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
              <h3 className="text-2xl font-bold text-zinc-950 tracking-tight font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                    <span className="font-extrabold text-sm text-zinc-900 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>₹{totalCommitment.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                {/* Bulk copy details button */}
                <button
                  onClick={() => {
                    const textToCopy = `Bank Name: HDFC Bank\nAccount Name: AMEC Technology Pvt Ltd\nAccount Number: 50200012345678\nIFSC Code: HDFC0000123\nAmount: ₹${totalCommitment.toLocaleString('en-IN')}.00`;
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

                {/* Order Details Summary */}
                <div className="flex flex-col gap-2 border-t border-zinc-100 pt-4 mt-2">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Order Specifications</span>
                  <div className="text-[11px] text-zinc-600 flex flex-col gap-1.5 bg-zinc-50 rounded-2xl p-4 border border-zinc-200/60 leading-relaxed">
                    <div><strong className="text-zinc-800">Client:</strong> {name} ({phone}){companyName && ` - ${companyName}`}</div>
                    {gstNo && <div><strong className="text-zinc-800">GST No:</strong> {gstNo}</div>}
                    <div><strong className="text-zinc-800">Email:</strong> {email}</div>
                    <div><strong className="text-zinc-800">Address:</strong> {address}, {city}, {stateName} - {zip}</div>
                    <div><strong className="text-zinc-800">Site Location:</strong> {siteLocation}</div>
                    <div><strong className="text-zinc-800">Area to Cover:</strong> {areaToCover}</div>
                    <div><strong className="text-zinc-800">Application:</strong> {application === 'Other' ? customApplication : application}</div>
                  </div>
                </div>

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
                    <span className="font-extrabold text-sm text-zinc-900 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>₹{totalCommitment.toLocaleString('en-IN')}.00</span>
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

                {/* Order Details Summary */}
                <div className="flex flex-col gap-2 text-left border-t border-zinc-100 pt-4 mt-2">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Order Specifications</span>
                  <div className="text-[11px] text-zinc-600 flex flex-col gap-1.5 bg-zinc-50 rounded-2xl p-4 border border-zinc-200/60 leading-relaxed">
                    <div><strong className="text-zinc-800">Client:</strong> {name} ({phone}){companyName && ` - ${companyName}`}</div>
                    {gstNo && <div><strong className="text-zinc-800">GST No:</strong> {gstNo}</div>}
                    <div><strong className="text-zinc-800">Email:</strong> {email}</div>
                    <div><strong className="text-zinc-800">Address:</strong> {address}, {city}, {stateName} - {zip}</div>
                    <div><strong className="text-zinc-800">Site Location:</strong> {siteLocation}</div>
                    <div><strong className="text-zinc-800">Area to Cover:</strong> {areaToCover}</div>
                    <div><strong className="text-zinc-800">Application:</strong> {application === 'Other' ? customApplication : application}</div>
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
