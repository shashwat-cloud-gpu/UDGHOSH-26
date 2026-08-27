import "./App.css";
import { useRef } from "react";
import Navbar2 from "./components/navbar/Navbar2.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Sponsors from "./components/Sponsors/Sponsors";
import Teams from "./Pages/teams/Teams.jsx";
import C_Antique from "./components/Commitments/antique";
import C_Impact from "./components/Commitments/impacts";
import C_Initiatives from "./components/Commitments/initiatives";
import C_Vision from "./components/Commitments/vision";
import Gallery from "./components/Gallery/Gallery.jsx";
import LoadingVideo from "./components/LoadingVideo/LoadingVideo.jsx";
import Social from "./components/social/social";
import Vision from "./components/vision/vision";
import Antique from "./components/antique/antique";
import Gallery2 from "./components/Gallery2/Gallery2.jsx";
import MapG from "./components/Map/MapG.jsx";
import Carousel from "./components/Carousel/Carousel.jsx";
import PastEvent from "./components/PastEvent/PastEvent.jsx";
import Carousel2 from "./components/Carousel2/Carousel2.jsx";
import LiveUpdates from "./components/LiveUpdates/MatchDashboard.jsx";
import Merchandise from "./components/merch/merch.jsx";
function App() {

  const navbarRef = useRef();
 
  return (
    <>
      <AuthContextProvider>
        <div className="App">
          {/* <Navbar2/> */}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/social" element={<Social />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/commitments/antique" element={<C_Antique />} />
            <Route path="/commitments/impacts" element={<C_Impact />} />
            <Route path="/commitments/initiatives" element={<C_Initiatives />}/>
            <Route path="/commitments/vision" element={<C_Vision />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/antique" element={<Antique />} />
            <Route path="/map" element={<MapG/>}></Route>
            <Route path="/carousel" element={<Carousel />} />
            <Route path="/past-events" element={<PastEvent />} />
            <Route path="/Carousel2" element={<Carousel2 />} />
            <Route path="/LiveUpdates" element={<LiveUpdates />} />
            <Route path="/merch" element={<Merchandise/>} />
          </Routes>
        </div>
      </AuthContextProvider>
    </>
  );
}

export default App;

