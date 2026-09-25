import React, { useState, useEffect } from "react";

export default function GothicHall({ onScrollToSection }) {
  const [activeNode, setActiveNode] = useState("fool");

  const timelineNodes = [
    { id: "fool", numeral: "0", label: "THE FOOL", target: "top" },
    { id: "discover", numeral: "I", label: "DISCOVER", target: "section-trails" },
    { id: "trails", numeral: "VII", label: "TRAILS", target: "section-trails" },
    { id: "transformation", numeral: "XIV", label: "TRANSFORMATION", target: "section-arena" },
    { id: "awakening", numeral: "XX", label: "AWAKENING", target: "section-celebration" },
    { id: "world", numeral: "XXI", label: "WORLD", target: "section-celebration" },
  ];

  // ScrollSpy to highlight timeline nodes
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const trailsEl = document.getElementById("section-trails");
      const arenaEl = document.getElementById("section-arena");
      const celebEl = document.getElementById("section-celebration");

      const trailsTop = trailsEl ? trailsEl.offsetTop - 300 : 99999;
      const arenaTop = arenaEl ? arenaEl.offsetTop - 300 : 99999;
      const celebTop = celebEl ? celebEl.offsetTop - 300 : 99999;

      if (scrollY >= celebTop) {
        setActiveNode("awakening");
      } else if (scrollY >= arenaTop) {
        setActiveNode("transformation");
      } else if (scrollY >= trailsTop) {
        setActiveNode("trails");
      } else {
        setActiveNode("fool");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNodeClick = (node) => {
    setActiveNode(node.id);
    if (node.target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onScrollToSection(node.target);
    }
  };

  return (
    <div className="gothic-hall-viewport" id="hall-viewport">
      {/* Full-height atmospheric cathedral background for mobile (eliminates black bars) */}
      <div className="gothic-hall-ambient-fill" aria-hidden="true" />

      <div className="gothic-hall-stage">
        <div className="gothic-hall-image-wrapper">
          {/* Sanctuary Artwork */}
          <img
            src="/images/gallery/gothic-hall-doors.jpg"
            alt="Gothic Hall Sanctuary"
            className="gothic-hall-image"
          />

          <div className="gothic-hall-vignette" />
          <div className="gothic-hall-bottom-blend" />

          {/* Center Hero Heading */}
          <div className="gothic-hero-title">
            <span className="gothic-edition-label">UDGHOSH '26</span>
            <h1 className="gothic-gallery-heading">GALLERY</h1>
            <div className="gothic-sub-divider">
              <span>THE ARCANA ASCENSION</span>
            </div>
          </div>

          {/* Door 1: The Trails */}
          <div
            id="door-trails"
            className="gothic-door-zone"
            role="button"
            tabIndex={0}
            aria-label="Enter The Trails Portal"
            onClick={() => onScrollToSection("section-trails")}
            onMouseEnter={() => setActiveNode("trails")}
          >
            <div className="gothic-door-arch-highlight" />
            <div className="gothic-door-light-emitter" />
          </div>

          {/* Door 2: The Arena */}
          <div
            id="door-arena"
            className="gothic-door-zone"
            role="button"
            tabIndex={0}
            aria-label="Enter The Arena Portal"
            onClick={() => onScrollToSection("section-arena")}
            onMouseEnter={() => setActiveNode("transformation")}
          >
            <div className="gothic-door-arch-highlight" />
            <div className="gothic-door-light-emitter" />
          </div>

          {/* Door 3: The Celebration */}
          <div
            id="door-celebration"
            className="gothic-door-zone"
            role="button"
            tabIndex={0}
            aria-label="Enter The Celebration Portal"
            onClick={() => onScrollToSection("section-celebration")}
            onMouseEnter={() => setActiveNode("awakening")}
          >
            <div className="gothic-door-arch-highlight" />
            <div className="gothic-door-light-emitter" />
          </div>
        </div>

        {/* Pinned Bottom Arcana Timeline Bar */}
        <nav className="gothic-bottom-timeline-bar" aria-label="Arcana Journey Timeline">
          <div className="gothic-timeline-track">
            <div className="gothic-timeline-rail" />

            {timelineNodes.map((node) => (
              <button
                key={node.id}
                className={`gothic-timeline-node ${activeNode === node.id ? "active" : ""}`}
                onClick={() => handleNodeClick(node)}
                title={node.label}
              >
                <span className="gothic-node-numeral">{node.numeral}</span>
                <span className="gothic-node-dot" />
                <span className="gothic-node-label">{node.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
