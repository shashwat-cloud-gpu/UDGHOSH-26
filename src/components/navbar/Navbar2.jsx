import React, { useEffect, useRef, useState } from 'react'

// --- Dropdown Component ---
const DropdownMenu = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="font-medium text-sm text-slate-100 hover:text-cyan-300 flex items-center gap-1.5 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
        {label}
        <svg
          className={`w-3.5 h-3.5 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-300'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Glossy Dropdown Card */}
      <div
        className={`absolute mt-3 py-2 min-w-[185px] rounded-2xl z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
        style={{
          background: "linear-gradient(145deg, rgba(255, 255, 255, 0.10) 0%, rgba(15, 23, 42, 0.65) 50%, rgba(3, 7, 18, 0.85) 100%)",
          backdropFilter: "blur(28px) saturate(190%)",
          WebkitBackdropFilter: "blur(28px) saturate(190%)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.4), 0 0 20px rgba(56,189,248,0.12)",
        }}
      >
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block px-4 py-2 text-xs font-medium text-slate-200 hover:text-cyan-300 hover:bg-white/10 transition-all duration-150 rounded-lg mx-1"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

const Navbar = ({ isDarkMode, isVisible = true }) => {
  const [isScroll, setIsScroll] = useState(false)
  const sideMenuRef = useRef()

  const openMenu = () => {
    sideMenuRef.current.style.transform = 'translateX(-16rem)'
  }

  const closeMenu = () => {
    sideMenuRef.current.style.transform = 'translateX(16rem)'
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScroll(true)
      } else {
        setIsScroll(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 z-50 px-5 lg:px-8 xl:px-[8%] py-3.5 flex items-center justify-between transition-all duration-500 ${
          isScroll
            ? "backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
        style={{
          background: isScroll
            ? "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(15,23,42,0.30) 100%)"
            : "transparent",
          backdropFilter: isScroll ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: isScroll ? "blur(20px) saturate(180%)" : "none",
          boxShadow: isScroll ? "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)" : "none",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transition: "opacity 0.7s ease, background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        }}
      >
        <a href="/home" className='relative flex justify-center items-center mr-2 group'>
          <img
            src="/images/logo.png"
            alt="Udghosh logo"
            className="ml-2 w-11 h-11 z-10 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.9)] transition-all duration-300"
          />

          <h1 className='block sm:hidden font-extrabold font-poppins text-2xl w-auto text-white ml-2'>UDGHOSH</h1>
          <p className='block sm:hidden text-cyan-400 font-bold text-3xl pb-2 pl-[2px]'>.</p>
        </a>

        {/* --- Glossy Desktop Menu Capsule --- */}
        <ul
          className="hidden md:flex items-center gap-6 lg:gap-8 rounded-full px-8 py-2.5 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(15, 23, 42, 0.25) 100%)",
            backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.2)",
          }}
        >
          <li>
            <a
              className='font-medium text-sm text-slate-100 hover:text-cyan-300 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
              href="https://events.udghosh.org.in/"
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
              className='font-medium text-sm text-slate-100 hover:text-cyan-300 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
              href="/gallery"
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              className='font-medium text-sm text-slate-100 hover:text-cyan-300 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
              href="/teams"
            >
              Team
            </a>
          </li>
          <li>
            <a
              className='font-medium text-sm text-slate-100 hover:text-cyan-300 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
              href="/past-events"
            >
              Proshows
            </a>
          </li>
          <li>
            <a
              className='font-medium text-sm text-slate-100 hover:text-cyan-300 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
              href="/merch"
            >
              Merchandise
            </a>
          </li>
        </ul>

        {/* --- Right Side Glossy Button --- */}
        <div className='flex items-center gap-2 lg:gap-4'>
          <a
            href="https://e-sports-26.web.app/register"
            target="_blank"
            rel="noopener noreferrer"
            className='relative group flex items-center justify-center px-3 py-1.5 lg:px-5 lg:py-2 ml-2 lg:ml-4 font-bold text-white transition-all duration-300'
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <span
              className="absolute inset-0 skew-x-[-15deg] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(56,189,248,0.25) 50%, rgba(2,132,199,0.15) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.6), 0 0 15px rgba(56,189,248,0.35)",
              }}
            ></span>
            <span className="relative flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-xs tracking-wider uppercase whitespace-nowrap drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
              <span className="leading-none"><span className="hidden sm:inline">Register for </span>E-Sports</span>
            </span>
          </a>

          <button className='block md:hidden ml-1 lg:ml-3 text-white' onClick={openMenu}>
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* --- Glossy Mobile Menu Drawer --- */}
        <ul
          ref={sideMenuRef}
          className='flex z-100 md:hidden flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen transition duration-500 text-white'
          style={{
            background: "linear-gradient(160deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 23, 42, 0.75) 50%, rgba(3, 7, 18, 0.92) 100%)",
            backdropFilter: "blur(32px) saturate(190%)",
            WebkitBackdropFilter: "blur(32px) saturate(190%)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "-12px 0 40px rgba(0,0,0,0.85), inset 1px 0 0 rgba(255,255,255,0.25)",
          }}
        >
          <div className='absolute right-6 top-6 cursor-pointer text-xl text-slate-300 hover:text-white' onClick={closeMenu}>
            ✖
          </div>

          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="https://events.udghosh.org.in/">Competitions</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="/teams">Team</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="/gallery">Gallery</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="http://esports.udghosh.org.in">Esports</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="https://unosq.udghosh.org.in/">UNOSQ</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="https://ca.udghosh.org.in/">CA</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="/antique">Antique</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="/social">Social Initiatives</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="/vision">Vision</a></li>
          <li><a className='font-medium text-slate-100 hover:text-cyan-300' onClick={closeMenu} href="/past-events">Proshows</a></li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar
