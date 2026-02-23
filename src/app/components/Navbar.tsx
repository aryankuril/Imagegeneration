"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-semibold">
              Pix
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            {/* <Link
              href="/features"
              className="text-gray-700 hover:text-gray-900"
            >
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link> */}
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block text-gray-700 hover:text-gray-900">
              Home
            </Link>
            {/* <Link
              href="/features"
              className="block text-gray-700 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-700 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link> */}
            <Link
              href="/login"
              className="block text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
