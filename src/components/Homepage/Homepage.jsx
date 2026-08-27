import React from "react";
import "./Homepage.css";
import CinematicHero from "../CinematicHero/CinematicHero";
import AfterMovies from "../Aftermovies/Aftermovies";
import JoinCommunity from "../Community/Community";
import Footer2 from "../Footer2/Footer2.jsx";

export default function Homepage() {
  return (
    <>
      <CinematicHero />

      <div style={{ position: "relative" }}>
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url(/images/next_hall.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          zIndex: -1,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: -1,
          pointerEvents: "none",
        }} />

        <AfterMovies />
        <JoinCommunity />
      </div>

      <Footer2 />
    </>
  );
}
