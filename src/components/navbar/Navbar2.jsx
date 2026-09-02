import React, { useRef, useState } from 'react'

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
  const sideMenuRef = useRef()

  const openMenu = () => {
    sideMenuRef.current.style.transform = 'translateX(-16rem)'
  }

  const closeMenu = () => {
    sideMenuRef.current.style.transform = 'translateX(16rem)'
  }

  return (
    <nav
      className="w-full fixed top-0 left-0 z-50 px-6 lg:px-12 xl:px-[7%] py-4 flex items-center justify-between transition-opacity duration-300 bg-transparent"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Left: Brand Logo */}
      <a href="/home" className="flex items-center gap-2 z-20">
        <img
          src="/images/logo.png"
          alt="Udghosh logo"
          className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
        />
        <span className="block sm:hidden font-bold font-poppins text-xl text-white">
          UDGHOSH<span className="text-cyan-400">.</span>
        </span>
      </a>

      {/* Center: Navigation Links */}
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

      {/* Right: Register Button */}
      <div className="flex items-center gap-2 lg:gap-4 z-20">
        <a
          href="https://e-sports-26.web.app/register"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 uppercase bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 rounded-lg transition-all"
        >
          Register for E-Sports
        </a>

        <button className="block md:hidden ml-1 text-white" onClick={openMenu}>
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <ul
        ref={sideMenuRef}
        className="flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen transition-transform duration-300 text-white bg-[#0b1120] border-l border-white/10 shadow-2xl"
      >
        <button
          type="button"
          className="absolute right-6 top-6 text-xl text-slate-300 hover:text-white"
          onClick={closeMenu}
        >
          ✕
        </button>

        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="https://events.udghosh.org.in/">Competitions</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="/teams">Team</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="/gallery">Gallery</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="http://esports.udghosh.org.in">Esports</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="https://unosq.udghosh.org.in/">UNOSQ</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="https://ca.udghosh.org.in/">CA</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="/antique">Antique</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="/social">Social Initiatives</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="/vision">Vision</a></li>
        <li><a className="font-medium text-slate-200 hover:text-cyan-400" onClick={closeMenu} href="/past-events">Proshows</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
