import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.amectechnology.com"),
  title: "AMEC Technology - Multipurpose Early Warning System",
  description: "Intelligent perimeter protection for sites that can't afford a missed second. One Alert Can Save Lakhs. Solar-powered, LiDAR-based early warning system.",
  keywords: [
    "Early Warning System",
    "Perimeter Protection",
    "LiDAR Detection",
    "Solar Powered Security",
    "Wireless LoRa Mesh Network",
    "Industrial Site Security",
    "Intrusion Prevention System",
    "AMEC Technology"
  ],
  authors: [{ name: "AMEC Technology" }],
  openGraph: {
    title: "AMEC Technology - Multipurpose Early Warning System",
    description: "Intelligent perimeter protection for sites that can't afford a missed second. One Alert Can Save Lakhs.",
    url: "https://www.amectechnology.com",
    siteName: "AMEC Technology",
    images: [
      {
        url: "/ews/first_page_image.jpg",
        width: 1200,
        height: 630,
        alt: "AMEC Multipurpose Early Warning System Cover",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMEC Technology - Multipurpose Early Warning System",
    description: "Intelligent perimeter protection for sites that can't afford a missed second. One Alert Can Save Lakhs.",
    images: ["/ews/first_page_image.jpg"],
  },
  alternates: {
    canonical: "https://www.amectechnology.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/ews/AMEC_SHIELD.png",
    apple: "/ews/AMEC_SHIELD.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
        {/* Meta Pixel Code */}
        <script dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1350936867182583');
          fbq('track', 'PageView');
        ` }} />
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1350936867182583&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
