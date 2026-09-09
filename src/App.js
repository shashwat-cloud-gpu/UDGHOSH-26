import React, { Suspense, lazy } from "react";
import "./App.css";
import { AuthContextProvider } from "./context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll.jsx";

// Code-split subpages to minimize initial JavaScript bundle and accelerate initial load
const Sponsors = lazy(() => import("./components/Sponsors/Sponsors"));
const Teams = lazy(() => import("./Pages/teams/Teams.jsx"));
const CAntique = lazy(() => import("./components/Commitments/antique"));
const CImpact = lazy(() => import("./components/Commitments/impacts"));
const CInitiatives = lazy(() => import("./components/Commitments/initiatives"));
const CVision = lazy(() => import("./components/Commitments/vision"));
const Gallery = lazy(() => import("./components/Gallery/Gallery.jsx"));
const Social = lazy(() => import("./components/social/social"));
const Vision = lazy(() => import("./components/vision/vision"));
const Antique = lazy(() => import("./components/antique/antique"));
const MapG = lazy(() => import("./components/Map/MapG.jsx"));
const Carousel = lazy(() => import("./components/Carousel/Carousel.jsx"));
const PastEvent = lazy(() => import("./components/PastEvent/PastEvent.jsx"));
const Carousel2 = lazy(() => import("./components/Carousel2/Carousel2.jsx"));
const LiveUpdates = lazy(() => import("./components/LiveUpdates/MatchDashboard.jsx"));
const Merchandise = lazy(() => import("./components/merch/merch.jsx"));

function App() {
  return (
    <AuthContextProvider>
      <SmoothScroll>
        <div className="App">
          <Suspense fallback={<div className="min-h-screen w-full bg-black" />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/social" element={<Social />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/commitments/antique" element={<CAntique />} />
              <Route path="/commitments/impacts" element={<CImpact />} />
              <Route path="/commitments/initiatives" element={<CInitiatives />} />
              <Route path="/commitments/vision" element={<CVision />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/antique" element={<Antique />} />
              <Route path="/map" element={<MapG />} />
              <Route path="/carousel" element={<Carousel />} />
              <Route path="/past-events" element={<PastEvent />} />
              <Route path="/Carousel2" element={<Carousel2 />} />
              <Route path="/LiveUpdates" element={<LiveUpdates />} />
              <Route path="/merch" element={<Merchandise />} />
            </Routes>
          </Suspense>
        </div>
      </SmoothScroll>
    </AuthContextProvider>
  );
}

export default App;
