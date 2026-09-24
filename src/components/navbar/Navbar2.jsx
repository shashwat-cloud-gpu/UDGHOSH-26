import React, { useRef, useState, useEffect } from 'react'

// --- Basic Clean Dropdown Component ---
const DropdownMenu = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="text-sm font-medium text-slate-200 hover:text-cyan-400 flex items-center gap-1 transition-colors py-1"
      >
        <span>{label}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Simple, Clean Dropdown */}
      <div
        className={`absolute top-full left-0 pt-2 min-w-[170px] z-50 transition-all duration-150 ${
          isOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="bg-[#0b1120]/95 backdrop-blur-md border border-white/10 rounded-xl py-1.5 shadow-xl">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-2 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ isDarkMode, isVisible = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <nav
        className="w-full fixed top-0 left-0 z-50 px-4 sm:px-6 lg:px-12 xl:px-[7%] py-2.5 sm:py-4 flex items-center justify-between transition-all duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        {/* ── 1. Frosted Header Backdrop & Glowing Header Line ──
            Covers everything above the header line so the header is always clean and crisp */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            isScrolled
              ? "bg-[#080706]/95 backdrop-blur-xl border-b border-amber-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.9),0_1px_15px_rgba(245,158,11,0.12)]"
              : "bg-gradient-to-b from-[#080706]/85 via-[#080706]/40 to-transparent border-b border-white/[0.06]"
          }`}
        >
          {/* Delicate Illuminated Hairline Accent right along the header line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-300 ${
              isScrolled
                ? "bg-gradient-to-r from-transparent via-amber-400/60 to-transparent opacity-100"
                : "bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30"
            }`}
          />
        </div>

        {/* ── 2. Top Scroll Fade Veil ──
            Extends downward from the header line, softly fading out any content that scrolls upwards towards and above the header */}
        <div
          className="absolute left-0 right-0 top-full pointer-events-none transition-all duration-300 overflow-hidden"
          style={{
            height: isScrolled ? "4.5rem" : "3.5rem",
            background:
              "linear-gradient(to bottom, rgba(8, 7, 6, 0.95) 0%, rgba(8, 7, 6, 0.72) 35%, rgba(8, 7, 6, 0.25) 75%, transparent 100%)",
            backdropFilter: isScrolled ? "blur(8px)" : "blur(4px)",
            WebkitBackdropFilter: isScrolled ? "blur(8px)" : "blur(4px)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 25%, rgba(0,0,0,0.6) 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 25%, rgba(0,0,0,0.6) 60%, transparent 100%)",
          }}
        />

        {/* Left: Brand Logo */}
        <a href="/home" className="flex items-center gap-2 z-20">
          <img
            src="https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_limit,q_auto:best,f_auto/v1790203296/udghosh-23/images/logo.png"
            alt="Udghosh logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
          />
          <span className="font-bold font-poppins text-lg sm:text-xl text-white tracking-wide">
            UDGHOSH<span className="text-cyan-400">.</span>
          </span>
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-8 z-20">
          <li>
            <a
              href="https://events.udghosh.org.in/"
              className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors"
            >
              Competitions
            </a>
          </li>
          <li>
            <DropdownMenu
              label="Websites"
              items={[
                { label: "UNOSQ", href: "https://unosq.udghosh.org.in/" },
                { label: "Esports", href: "http://esports.udghosh.org.in" },
                { label: "CA", href: "https://ca.udghosh.org.in/" },
                { label: "Sponsors", href: "/sponsors" },
                { label: "Antique", href: "/antique" },
                { label: "Social Initiatives", href: "/social" },
                { label: "Vision", href: "/vision" },
              ]}
            />
          </li>
          <li>
            <a
              href="/gallery"
              className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors"
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              href="/teams"
              className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors"
            >
              Team
            </a>
          </li>
          <li>
            <a
              href="/past-events"
              className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors"
            >
              Proshows
            </a>
          </li>
          <li>
            <a
              href="/merch"
              className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors"
            >
              Merchandise
            </a>
          </li>
        </ul>

        {/* Right: Register Button & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 z-20">
          <a
            href="https://e-sports-26.web.app/register"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider text-cyan-300 uppercase bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 rounded-lg transition-all whitespace-nowrap"
          >
            <span className="inline sm:hidden">Register</span>
            <span className="hidden sm:inline">Register for E-Sports</span>
          </a>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="block md:hidden p-1.5 text-slate-200 hover:text-white rounded-lg active:bg-white/10 transition-colors focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`flex md:hidden flex-col fixed right-0 top-0 bottom-0 w-72 max-w-[80vw] z-50 h-screen transition-transform duration-300 ease-in-out text-white bg-[#0b1120]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_limit,q_auto:best,f_auto/v1790203296/udghosh-23/images/logo.png" alt="Udghosh" className="w-7 h-7 object-contain" />
            <span className="font-bold font-poppins text-base text-white tracking-wide">
              UDGHOSH<span className="text-cyan-400">.</span>
            </span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            onClick={closeMenu}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
          <li>
            <a
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="https://events.udghosh.org.in/"
            >
              Competitions
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="/teams"
            >
              Team
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="/gallery"
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="/past-events"
            >
              Proshows
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="/merch"
            >
              Merchandise
            </a>
          </li>
          <li className="pt-2 pb-1">
            <div className="h-px bg-white/10 mx-3" />
          </li>
          <li>
            <a
              className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="http://esports.udghosh.org.in"
            >
              Esports Arena
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="https://unosq.udghosh.org.in/"
            >
              UNOSQ Quest
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="https://ca.udghosh.org.in/"
            >
              Campus Ambassador
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="/antique"
            >
              Antique & Legacy
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="/social"
            >
              Social Initiatives
            </a>
          </li>
          <li>
            <a
              className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              onClick={closeMenu}
              href="/vision"
            >
              Vision & Impact
            </a>
          </li>
        </ul>

        <div className="p-5 border-t border-white/10">
          <a
            href="https://e-sports-26.web.app/register"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="block w-full py-2.5 text-center text-xs font-semibold tracking-wider text-cyan-300 uppercase bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 rounded-xl transition-all shadow-lg"
          >
            Register for E-Sports
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar
