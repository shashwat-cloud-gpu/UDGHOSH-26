import React, { useEffect } from "react";
import { PLACEHOLDER_IMAGE } from "./GalleryData";

export default function LightboxModal({ isOpen, item, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !item) return null;

  return (
    <div
      className={`gothic-lightbox-modal ${isOpen ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="gothic-lightbox-dialog">
        <button
          className="gothic-lightbox-btn-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Preview Image Area */}
        <div className="gothic-lightbox-preview">
          <button
            className="gothic-lightbox-arrow prev"
            onClick={onPrev}
            aria-label="Previous photo"
          >
            ←
          </button>

          <img
            src={item.image}
            alt={item.title}
            className="gothic-lightbox-img"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />

          <button
            className="gothic-lightbox-arrow next"
            onClick={onNext}
            aria-label="Next photo"
          >
            →
          </button>
        </div>

        {/* Metadata Drawer */}
        <div className="gothic-lightbox-drawer">
          <div>
            <h3 className="gothic-lightbox-title">{item.title}</h3>
            <p className="gothic-lightbox-caption">{item.caption}</p>

            <div className="gothic-meta-specs">
              <div className="gothic-spec-row">
                <span className="gothic-spec-label">SPORT:</span>
                <span className="gothic-spec-val">{item.sport} • {item.subCategory}</span>
              </div>
              <div className="gothic-spec-row">
                <span className="gothic-spec-label">VENUE:</span>
                <span className="gothic-spec-val">{item.venue}</span>
              </div>
              <div className="gothic-spec-row">
                <span className="gothic-spec-label">EDITION:</span>
                <span className="gothic-spec-val">Edition {item.year}</span>
              </div>
              <div className="gothic-spec-row">
                <span className="gothic-spec-label">ARCHIVE CREDIT:</span>
                <span className="gothic-spec-val">{item.photographer}</span>
              </div>
            </div>
          </div>

          <div style={{ fontFamily: "var(--gothic-font-mono)", fontSize: "0.75rem", color: "var(--gothic-gold-antique)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
            <span>[← / →] PREV / NEXT &nbsp;•&nbsp; [ESC] RETURN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
