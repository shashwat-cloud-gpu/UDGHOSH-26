import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { PLACEHOLDER_IMAGE } from "./GalleryData";

export default function SectionGallery({
  sectionId,
  sectionTitle,
  photos = [],
  onOpenLightbox,
}) {
  const [activePhoto, setActivePhoto] = useState(photos[0] || null);
  const [sidePhotos, setSidePhotos] = useState(photos.slice(1));
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const stageFrameRef = useRef(null);
  const featuredImgRef = useRef(null);
  const featuredOverlayRef = useRef(null);

  const handleThumbnailClick = (sideIndex, cardElement) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const newCenterItem = sidePhotos[sideIndex];
    const oldCenterItem = activePhoto;

    if (!newCenterItem || !oldCenterItem || !stageFrameRef.current) {
      setIsAnimating(false);
      return;
    }

    const cardRect = cardElement.getBoundingClientRect();
    const stageRect = stageFrameRef.current.getBoundingClientRect();

    // USER REQUIREMENT: Remove white border at the start of flight
    setIsExpanded(false);

    // 1. Expanding Proxy: Side Thumbnail -> Center Stage
    const expandProxy = document.createElement("div");
    Object.assign(expandProxy.style, {
      position: "fixed",
      left: `${cardRect.left}px`,
      top: `${cardRect.top}px`,
      width: `${cardRect.width}px`,
      height: `${cardRect.height}px`,
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: "950",
      boxShadow: "0 15px 45px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 242, 254, 0.12)",
      pointerEvents: "none",
      border: "none",
    });

    const expandImg = document.createElement("img");
    expandImg.src = newCenterItem.image;
    expandImg.onerror = () => {
      expandImg.src = PLACEHOLDER_IMAGE;
    };
    Object.assign(expandImg.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    });
    expandProxy.appendChild(expandImg);
    document.body.appendChild(expandProxy);

    // 2. Shrinking Proxy: Center Photo -> Side Slot
    const shrinkProxy = document.createElement("div");
    Object.assign(shrinkProxy.style, {
      position: "fixed",
      left: `${stageRect.left}px`,
      top: `${stageRect.top}px`,
      width: `${stageRect.width}px`,
      height: `${stageRect.height}px`,
      borderRadius: "18px",
      overflow: "hidden",
      zIndex: "940",
      pointerEvents: "none",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.85)",
      border: "none",
    });

    const shrinkImg = document.createElement("img");
    shrinkImg.src = oldCenterItem.image;
    shrinkImg.onerror = () => {
      shrinkImg.src = PLACEHOLDER_IMAGE;
    };
    Object.assign(shrinkImg.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    });
    shrinkProxy.appendChild(shrinkImg);
    document.body.appendChild(shrinkProxy);

    // Hide resting elements during transit so they do not show before flight completes
    cardElement.style.opacity = "0";
    if (featuredImgRef.current) featuredImgRef.current.style.opacity = "0";
    if (featuredOverlayRef.current) featuredOverlayRef.current.style.opacity = "0";

    // 3. GSAP Cross-Expansion Animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Swap state: old center moves to clicked thumbnail slot
        setActivePhoto(newCenterItem);
        setSidePhotos((prev) => {
          const updated = [...prev];
          updated[sideIndex] = oldCenterItem;
          return updated;
        });

        // Set new image and reveal resting elements now that flight has landed
        if (featuredImgRef.current) {
          featuredImgRef.current.src = newCenterItem.image;
          featuredImgRef.current.style.opacity = "1";
        }
        if (featuredOverlayRef.current) featuredOverlayRef.current.style.opacity = "1";
        cardElement.style.opacity = "1";

        // Re-apply white border to big image ONLY when fully expanded!
        setIsExpanded(true);

        expandProxy.remove();
        shrinkProxy.remove();
        setIsAnimating(false);
      },
    });

    tl.to(
      expandProxy,
      {
        left: stageRect.left,
        top: stageRect.top,
        width: stageRect.width,
        height: stageRect.height,
        borderRadius: "18px",
        duration: 0.56,
        ease: "power2.inOut",
      },
      0
    );

    tl.to(
      shrinkProxy,
      {
        left: cardRect.left,
        top: cardRect.top,
        width: cardRect.width,
        height: cardRect.height,
        borderRadius: "12px",
        duration: 0.52,
        ease: "power2.inOut",
      },
      0.03
    );
  };

  return (
    <section id={sectionId} className="gothic-section">
      <div className="gothic-container">
        {/* Section Header */}
        <header className="gothic-section-header">
          <h2 className="gothic-main-title">{sectionTitle}</h2>
          <div className="gothic-logo-wrap">
            <img
              src="/images/gallery/udghosh-logo.png"
              alt="Udghosh Logo"
              className="gothic-header-logo"
            />
          </div>
        </header>

        {/* Squarish Interactive Gallery Stage */}
        <div className="gothic-stage-layout">
          {/* Large Center Featured Image */}
          <div
            className="gothic-featured-stage"
            onClick={() => onOpenLightbox && onOpenLightbox(activePhoto, photos)}
            title="Click to view fullscreen archive"
          >
            <div
              ref={stageFrameRef}
              className={`gothic-featured-frame ${isExpanded ? "is-expanded" : ""}`}
            >
              {activePhoto && (
                <img
                  ref={featuredImgRef}
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="gothic-featured-img"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
              )}

              <div ref={featuredOverlayRef} className="gothic-featured-overlay">
                <span className="gothic-single-title">
                  {activePhoto?.title || "Udghosh Archive"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Thumbnails Strip */}
          <aside className="gothic-thumbnails-strip" aria-label="More captures">
            {sidePhotos.map((item, sideIndex) => (
              <div
                key={item.id}
                className="gothic-thumb-card"
                role="button"
                tabIndex={0}
                title={item.title}
                onClick={(e) => handleThumbnailClick(sideIndex, e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleThumbnailClick(sideIndex, e.currentTarget);
                  }
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
