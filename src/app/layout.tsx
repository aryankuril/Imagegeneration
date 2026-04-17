import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";
import localFont from "next/font/local";
const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8b416", // Yellow theme color
};

export const metadata: Metadata = {
  title: "AI Image Generator from Google Sheets | Bombay Blokes",
  description:
    "Generate high-quality AI images in bulk using Google Sheets. Automate your image creation workflow in minutes. Perfect for marketers, creators, and agencies.",
    
  keywords: [
    "AI image generator",
    "bulk image generator",
    "generate images from Google Sheets",
    "image automation tool",
    "AI tools for marketing",
    "bulk content creation",
    "Bombay Blokes"
  ],

  authors: [{ name: "Bombay Blokes" }],


  openGraph: {
    title: "AI Image Generator from Google Sheets",
    description:
      "Create bulk AI images instantly using Google Sheets. Fast, automated, and powerful.",
    type: "website",
    locale: "en_US",
    siteName: "Bombay Blokes",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Image Generator | Bombay Blokes",
    description:
      "Turn Google Sheets into AI-generated images in minutes. Built for speed and scale.",
  },
};


const miso = localFont({
  src: [{ path: "../fonts/VAG-Regular2.otf", weight: "400" }],
  variable: "--font-miso",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${miso.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="images/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <SmoothScroll>
        {children}
        </SmoothScroll>
        
        </body>
    </html>
  );
}
