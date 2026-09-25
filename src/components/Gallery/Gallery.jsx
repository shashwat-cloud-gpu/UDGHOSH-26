import React, { useState } from "react";
import Navbar2 from "../navbar/Navbar2";
import AmbientEmbers from "./AmbientEmbers";
import GothicHall from "./GothicHall";
import SectionGallery from "./SectionGallery";
import LightboxModal from "./LightboxModal";
import { GALLERY_DATA } from "./GalleryData";
import "./GothicGallery.css";

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const [activeList, setActiveList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToSection = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, {
          offset: -20,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleOpenLightbox = (photo, list) => {
    setActivePhoto(photo);
    setActiveList(list || []);
    const idx = list ? list.findIndex((p) => p.id === photo.id) : 0;
    setCurrentIndex(idx !== -1 ? idx : 0);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handlePrevLightbox = () => {
    if (!activeList.length) return;
    const nextIdx = (currentIndex - 1 + activeList.length) % activeList.length;
    setCurrentIndex(nextIdx);
    setActivePhoto(activeList[nextIdx]);
  };

  const handleNextLightbox = () => {
    if (!activeList.length) return;
    const nextIdx = (currentIndex + 1) % activeList.length;
    setCurrentIndex(nextIdx);
    setActivePhoto(activeList[nextIdx]);
  };

  return (
    <div className="gothic-gallery-root">
      {/* Top Navbar */}
      <Navbar2 />

      {/* Floating Cyan/Gold Embers Canvas */}
      <AmbientEmbers />

      {/* 1. Main Gothic Sanctuary Viewport with 3 Doors and Arcana Timeline */}
      <GothicHall onScrollToSection={scrollToSection} />

      {/* Atmospheric Transition Seam Bar (below Sanctuary artwork) */}
      <div className="gothic-transition-seam-bar" aria-hidden="true">
        <div className="gothic-seam-energy-line">
          <div className="gothic-seam-energy-pulse" />
        </div>
        <div className="gothic-seam-center-rune">
          <img
            src="/images/gallery/udghosh-logo.png"
            alt="Udghosh Logo"
            className="gothic-seam-logo"
          />
        </div>
      </div>

      {/* 2. Section 1: The Trails */}
      <SectionGallery
        sectionId="section-trails"
        sectionTitle="THE TRAILS"
        photos={GALLERY_DATA.trails}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* 3. Section 2: The Arena */}
      <SectionGallery
        sectionId="section-arena"
        sectionTitle="THE ARENA"
        photos={GALLERY_DATA.arena}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* 4. Section 3: The Celebration */}
      <SectionGallery
        sectionId="section-celebration"
        sectionTitle="THE CELEBRATION"
        photos={GALLERY_DATA.celebration}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* Fullscreen Cinematic Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        item={activePhoto}
        onClose={handleCloseLightbox}
        onPrev={handlePrevLightbox}
        onNext={handleNextLightbox}
      />
    </div>
  );
}