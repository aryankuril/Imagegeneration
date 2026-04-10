"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DesktopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full container flex justify-center py-5 px-4 relative z-50">
      
      {/* NAV CONTAINER */}
      {/* <div className="w-full flex items-center justify-between h-[80px] bg-[rgba(142,142,142,0.20)] rounded-2xl backdrop-blur-md shadow px-4 md:px-6"> */}
        
        <div className="w-full flex items-center justify-between h-[80px] bg-[rgba(142,142,142,0.20)] rounded-[20px] backdrop-blur-md shadow  px-4 md:px-6">
        {/* LEFT — LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/bblogo.webp"
            alt="Logo"
            width={180}
            height={60}
            className="object-contain"
            priority
          />
        </Link>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center">
          <Button
            href="https://bombayblokes.com/contactus"
            text="Start Growing"
            className="text-black"
          />
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="w-7 h-7 text-black" />
            ) : (
              <Menu className="w-7 h-7 text-black" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-6 text-lg font-medium">
          
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-2xl"
          >
            ✕
          </button>

          <Button
            href="https://bombayblokes.com/contactus"
            text="Start Growing"
            className="text-black"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
}