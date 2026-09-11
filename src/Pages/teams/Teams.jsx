import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import teamData from "./teams.json";
import Navbar2 from "../../components/navbar/Navbar2";
import "./teams.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ─── Final approved Tarot archetype for each department ─────────────────────
const TAROT_MAP = {
  'teams-about-hospi':  { numeral: 'XVII',         name: 'The Star',          symbol: '✦', accent: '#7dd3fc', glow: 'rgba(125,211,252,0.18)' },
  'teams-about-enc':    { numeral: 'XXI',           name: 'The World',         symbol: '◎', accent: '#c4b5fd', glow: 'rgba(196,181,253,0.20)' },
  'teams-about-mark':   { numeral: 'I',             name: 'The Magician',      symbol: '∞',  accent: '#a78bfa', glow: 'rgba(167,139,250,0.18)' },
  'teams-about-pr':     { numeral: 'II of Cups',    name: 'Two of Cups',       symbol: '⚭',  accent: '#fda4af', glow: 'rgba(253,164,175,0.18)' },
  'teams-about-wna':    { numeral: 'XIV',           name: 'Temperance',        symbol: '⚗',  accent: '#6ee7b7', glow: 'rgba(110,231,183,0.15)' },
  'teams-about-design': { numeral: 'Ace of Wands',  name: 'Ace of Wands',      symbol: '✵',  accent: '#fdba74', glow: 'rgba(253,186,116,0.18)' },
  'teams-about-mnp':    { numeral: 'XVIII',         name: 'The Moon',          symbol: '☽',  accent: '#bae6fd', glow: 'rgba(186,230,253,0.15)' },
  'teams-about-sm':     { numeral: 'V',             name: 'The Hierophant',    symbol: '♦',  accent: '#d8b4fe', glow: 'rgba(216,180,254,0.18)' },
  'teams-about-fin':    { numeral: 'X',             name: 'Wheel of Fortune',  symbol: '◉',  accent: '#fcd34d', glow: 'rgba(252,211,77,0.18)'  },
  'teams-about-sec':    { numeral: 'VIII',          name: 'Strength',          symbol: '⚔',  accent: '#fca5a5', glow: 'rgba(252,165,165,0.15)' },
  'teams-about-fc':     { numeral: 'IV',            name: 'The Emperor',       symbol: '⚜',  accent: '#e5c07b', glow: 'rgba(229,192,123,0.18)' },
};

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
          duration: 1.2,
          ease: "power3.inOut",
        });
      }
    },
  }));

  useEffect(() => {
    let lastIndex = -1;

    // GSAP horizontal scroll on desktop screens
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
    <div className="scroll-container" ref={triggerRef}>
      <div
        ref={sectionRef}
        className="scroll-section-inner"
        style={{ width: `${teams.length * 100}vw` }}
      >
        {teams.map((team) => {
          const tarot = TAROT_MAP[team.id] || { numeral: '·', name: '', symbol: '✦', accent: '#e5c07b', glow: 'rgba(229,192,123,0.18)' };
          return (
            <section
              className="scroll-section"
              key={team.id}
              style={{ '--tarot-accent': tarot.accent, '--tarot-glow': tarot.glow }}
            >
              {/* Tarot card label — top-left of each slide */}
              <div className="tarot-badge">
                <span className="tarot-badge-numeral">{tarot.numeral}</span>
                <span className="tarot-badge-symbol">{tarot.symbol}</span>
                <span className="tarot-badge-name">{tarot.name}</span>
              </div>

              <h2 className="team-title">{team.title}</h2>

              <div className="members-container">
                {team.members.map((member) => (
                  <div className="member-card" key={member.id || member.name}>
                    <img
                      src={
                        member.photo ||
                        "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/udghoshlogo?_a=BAMAPqcg0"
                      }
                      alt={member.name}
                      className="member-photo"
                      style={member.imageStyle || {}}
                      loading="lazy"
                    />
                    {/* Tarot accent top line on each card */}
                    <div className="card-tarot-line" />
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <div className="member-contact">
                        <a href={member.linkedin || "#"} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                        <a href={member.instagram || "#"} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                          <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
                          </svg>
                        </a>
                        <a href={member.email ? `mailto:${member.email}` : "#"} aria-label="Email">
                          <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
                          </svg>
                        </a>
                        <a href={member.phone ? `tel:${member.phone}` : "#"} aria-label="Phone">
                          <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
});

const Footer = ({ teams, onLinkClick, activeIndex }) => {
  return (
    <footer className="team-footer">
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

const HIERARCHY = [
  { rank: "Head",             roman: "I"   },
  { rank: "Organizer",        roman: "II"  },
  { rank: "Senior Executive", roman: "III" },
  { rank: "Junior Executive", roman: "IV"  },
];

function HierarchyLegend() {
  return (
    <aside className="hierarchy-legend" aria-label="Team Hierarchy">
      <p className="hierarchy-label">HIERARCHY</p>
      <ol className="hierarchy-chain">
        {HIERARCHY.map((item, i) => (
          <li key={item.rank} className="hierarchy-item">
            <span className="hierarchy-roman">{item.roman}</span>
            <span className="hierarchy-rank">{item.rank}</span>
            {i < HIERARCHY.length - 1 && (
              <span className="hierarchy-arrow" aria-hidden="true">↓</span>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}

function App() {
  const teamScrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleTeams = teamData.teams
    .map((team) => ({
      ...team,
      members: team.members.filter((member) => !member.hidden),
    }))
    .filter((team) => team.members.length > 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFooterLinkClick = (index) => {
    if (teamScrollRef.current) {
      teamScrollRef.current.scrollToSection(index);
    }
  };

  return (
    <div className="teams-page-wrapper">
      <Navbar2 />
      <div
        className="teams-page-bg"
        style={{ backgroundImage: "url(/images/teams_bg.jpg)" }}
      />
      <div className="teams-ambient" />

      <h1 className="site-header">
        <span className="site-header-latin">COHORS · UDGHOSH · MMXXIII</span>
        <span className="site-header-main">THE TEAM</span>
        <span className="site-header-rule" />
      </h1>

      <HierarchyLegend />
      <TeamScroll ref={teamScrollRef} teams={visibleTeams} onSectionChange={setActiveIndex} />
      <Footer teams={visibleTeams} onLinkClick={handleFooterLinkClick} activeIndex={activeIndex} />
    </div>
  );
}

export default App;
