import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import teamData from "./teams.json";
import Navbar2 from "../../components/navbar/Navbar2";
import Navbar from "../../components/navbar/Navbar2";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const TeamScroll = forwardRef(({ teams, onSectionChange }, ref) => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToSection(index) {
      if (scrollTriggerRef.current) {
        const { start, end } = scrollTriggerRef.current;
        const totalScroll = end - start;
        const targetScrollY = start + (totalScroll * index) / (teams.length - 1);

        gsap.to(window, {
          scrollTo: { y: targetScrollY, autoKill: false },
          duration: 1.5,
          ease: "power3.inOut",
        });
      }
    },
  }));
 const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
 
 useEffect(() => {
  let lastIndex = -1;

  // ✅ Only enable GSAP horizontal scroll on desktop
  if (window.innerWidth > 768) {
    let ctx = gsap.context(() => {
      const totalWidth = sectionRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;

      const pin = gsap.fromTo(
        sectionRef.current,
        { translateX: 0 },
        {
          translateX: `-${totalWidth - viewportWidth}px`,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${totalWidth - viewportWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const newIndex = Math.round(self.progress * (teams.length - 1));
              if (newIndex !== lastIndex) {
                lastIndex = newIndex;
                onSectionChange(newIndex);
              }
            },
          },
        }
      );
      scrollTriggerRef.current = pin.scrollTrigger;
    }, triggerRef);

    return () => ctx.revert();
  }
}, [teams, onSectionChange]);

  return (
    
    <div className="teams-page scroll-container" ref={triggerRef}>
      
      <div
        ref={sectionRef}
        className="scroll-section-inner"
        style={{ width: `${teams.length * 100}vw` }}
      >
        {teams.map((team) => (
          <section className="scroll-section" key={team.id}>
            <h2 className="team-title">{team.title}</h2>
            <div className="members-container">
              {team.members.map((member) => (
                <div className="member-card" key={member.id || member.name}>
                  <img src={member.photo || 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/udghoshlogo?_a=BAMAPqcg0'} alt={member.name} className="member-photo" style={member.imageStyle || {}} />
                  <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-contact">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                      <a href={member.instagram || '#'} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
                      </a>
                      <a href={`mailto:${member.email}`} aria-label="Email">
                        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
                        </svg>
                      </a>
                      <a href={`tel:${member.phone}`} aria-label="Phone">
                        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
});

const Footer = ({ teams, onLinkClick, activeIndex }) => {
  return (
    <footer className="teams-page team-footer">
      <div className="footer-links">
        {teams.map((team, index) => (
          <button
            key={team.id}
            onClick={() => onLinkClick(index)}
            className={`footer-link ${index === activeIndex ? "active" : ""}`}
            type="button"
          >
            {team.title.replace("Head, ", "")}
          </button>
        ))}
      </div>
    </footer>
  );
};

function App() {
  const teamScrollRef = useRef(null);
  const { teams } = teamData;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFooterLinkClick = (index) => {
    if (teamScrollRef.current) {
      teamScrollRef.current.scrollToSection(index);
    }
  };

  return (
    <div className="my-component">
       {/* <Navbar2 /> */}
      {/* Inline CSS */}
      <style>{`
  /* === Your original desktop CSS (unchanged) === */
  .my-component * {
    margin: 0; padding: 0; box-sizing: border-box;
  }
  .my-component {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    // background-image: url('https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/background?_a=BAMAPqcg0');
    background: radial-gradient(
      circle at top left,
      #0d1b2a,
      #1b263b 30%,
      #274472 60%,
      #1e3d59 85%,
      #0a192f
    ),
    linear-gradient(
      135deg,
      rgba(0, 191, 255, 0.3) 0%,
      rgba(138, 43, 226, 0.2) 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
    background-blend-mode: overlay;
    background-color: #0a192f;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    color: #e2e8f0;
    overflow-x: hidden;
  }
  .my-component::before {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: url('https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/background?_a=BAMAPqcg0');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    opacity: 0.4;
    z-index: -1;
  }
  .my-component ::-webkit-scrollbar { display: none; }
  .site-header {
  font-family:Poppins;
    position: fixed; top: 5%; left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-weight: 700;
    font-size: clamp(2.5rem, 6vw, 4rem);
    letter-spacing: 0.2rem;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
  .scroll-container { overflow: hidden; height: 100vh; }
  .scroll-section-inner { display: flex; height: 100vh; }
  .scroll-section {
    flex: 0 0 100vw; height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    padding: 25vh 2rem 2rem 2rem; overflow-y: auto;
  }
  .team-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600; text-transform: uppercase;
    letter-spacing: 2px; color: #fff;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5);
    margin-bottom: 2rem; flex-shrink: 0;
    top:40%;
  }
  .members-container {
    display: flex; justify-content: center; align-items: stretch;
    gap: 3rem; flex-wrap: wrap;
  }
  .member-card {
    position: relative;
    width: 250px; height: 350px;
    border-radius: 16px; overflow: hidden;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.18);
    box-shadow: 0 8px 32px rgba(0,0,0,0.37);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .member-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  }
  .member-photo { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .member-info {
    position: absolute; bottom: 0; left: 0; width: 100%;
    padding: 1.5rem; color: white;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  }
  .member-name {
    font-size: 1.5rem; font-weight: 600;
    text-shadow: 0 2px 4px rgba(0,0,0,0.7);
    margin: 0 0 0.5rem 0;
    font-family:Lobster;
  }
  .member-contact { display: flex; gap: 1.5rem; align-items: center; justify-content: center; }
  .member-contact a {
    color: #cbd5e0; text-decoration: none;
    transition: color 0.2s ease, transform 0.2s ease;
  }
  .member-contact a:hover { color: #fff; transform: scale(1.1); }
  .member-contact svg { width: 24px; height: 24px; }
  .team-footer {
    position: fixed; bottom: 0; left: 0;
    width: 100%; padding: 1rem 0; z-index: 1000;
  }
  .footer-links {
    display: flex; align-items: center; flex-wrap: wrap;
    justify-content: center; gap: 10px 15px;
    max-width: 1400px; margin: 0 auto;
    padding: 0.5rem 1.5rem; border-radius: 12px;
    // background: rgb(27, 38, 59);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .footer-link {
    background: none; border: none;
    border-bottom: 2px solid transparent;
    color: #a0aec0;
    padding: 8px 4px; cursor: pointer;
    font-size: 0.75rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.5px;
    transition: all 0.3s ease; white-space: nowrap;
  }
  .footer-link:hover {
    color: #fff; border-bottom-color: white;
  }
  .footer-link.active {
    color: #fff; border-bottom-color: white;
  }

  @media (max-width: 768px) {
  .site-header{

  display:none;
      }

    .scroll-section{
    overflow:hidden !important;
    height:fit-content;
    }
    

    .scroll-container {
      overflow-y: hidden !important;
      overflow-x: hidden !important;
      height: auto !important;
    }

    .scroll-section-inner {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      transform: none !important;
    }

    .scroll-section {
      width: 100% !important;
      min-height: 100vh;
      padding: 12vh 1rem 2rem;
      justify-content: flex-start !important;
    }

    .members-container {
      flex-direction: row !important;
      align-items: center !important;
      gap: 2rem !important;
    }

    .member-card {
      width: 90% !important;
      max-width: 320px !important;
      height: 30% !important;
      aspect-ratio: 3 / 4 !important;
    }

    .member-photo {
      height: 100% !important;
      object-fit: cover !important;
    }

    .team-title {
      font-size: 1.5rem !important;
      margin-bottom: 1.25rem !important;
      font-family:Poppins;
    }

    footer {
      display: none !important;
    }
  }

  @media (max-width: 480px) {
    .site-header {
      top: 3rem !important;
      font-size: 1.75rem !important;
      letter-spacing: 1px !important;
    }
    .scroll-section {
      padding: 10vh 0.5rem 1rem 0.5rem !important;
    }
    .member-card {
      width: 95% !important;
      max-width: 280px !important;
    }
    .member-name {
      font-size: 1rem !important;
    }
    .member-contact {
      gap: 1rem !important;
    }
    .member-contact svg {
      width: 20px !important;
      height: 20px !important;
    }
    .footer-link {
      font-size: 0.65rem !important;
    }
  }
`}</style>

      <div className="teams-page">
       {/* <Navbar/> */}
        <h1 className="site-header">TEAM</h1>
        <TeamScroll ref={teamScrollRef} teams={teams} onSectionChange={setActiveIndex} />
        {/* // <<< CHANGE: The 100vh blank space at the end has been removed. */}
        <Footer teams={teams} onLinkClick={handleFooterLinkClick} activeIndex={activeIndex} />
      </div>
    </div>
  );
}

export default App;
