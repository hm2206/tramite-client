import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { FileText, Search, Menu, X } from "lucide-react";
import { assetPath } from "@/utils/assetPath";

interface AppInfo {
  icon?: string;
  name?: string;
}

interface NavbarProps {
  app: AppInfo;
  isLoggin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ app }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = isScrolled
    ? "bg-white/95 backdrop-blur-lg shadow-lg"
    : "bg-transparent";
  const textColor = isScrolled ? "text-gray-800" : "text-white";
  const subtextColor = isScrolled ? "text-gray-500" : "text-white/70";
  const iconColor = isScrolled ? "text-[#00a28a]" : "text-white";
  const logoBg = isScrolled ? "bg-[#00a28a]/10" : "bg-white/20";
  const linkClass = isScrolled
    ? "text-gray-600 hover:text-[#00a28a] hover:bg-[#00a28a]/10"
    : "text-white/90 hover:text-white hover:bg-white/10";
  const btnClass = isScrolled
    ? "bg-gradient-to-r from-[#00a28a] to-[#00c9a7] text-white shadow-lg shadow-[#00a28a]/30"
    : "bg-white text-[#00a28a] shadow-lg";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href={assetPath("")}
            className="flex items-center space-x-3 group"
          >
            <div
              className={`w-10 h-10 rounded-xl ${logoBg} flex items-center justify-center transition-all duration-300 group-hover:scale-105`}
            >
              {app.icon ? (
                <img
                  src={app.icon}
                  alt="Logo"
                  className="h-6 w-6 object-contain"
                />
              ) : (
                <FileText className={`h-5 w-5 ${iconColor}`} />
              )}
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold text-lg ${textColor} transition-colors duration-300`}
              >
                {app.name || "Mesa de Partes"}
              </span>
              <span
                className={`text-xs ${subtextColor} transition-colors duration-300 hidden sm:block`}
              >
                Sistema de Tramite Documentario
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href={assetPath("")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${linkClass}`}
            >
              <Search className="h-4 w-4" />
              <span>Consultar</span>
            </Link>
            <button
              onClick={() => Router.push(assetPath("/register"))}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 ${btnClass}`}
            >
              <FileText className="h-4 w-4" />
              <span>Nuevo Trámite</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-xl ${
              isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
            } transition-colors`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`h-6 w-6 ${iconColor}`} />
            ) : (
              <Menu className={`h-6 w-6 ${iconColor}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-2 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5 text-[#00a28a]" />
                <span className="font-medium">Consultar Trámite</span>
              </Link>
              <button
                onClick={() => {
                  Router.push(assetPath("/register"));
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#00a28a] to-[#00c9a7] text-white font-semibold shadow-lg shadow-[#00a28a]/30"
              >
                <FileText className="h-5 w-5" />
                <span>Nuevo Trámite</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
