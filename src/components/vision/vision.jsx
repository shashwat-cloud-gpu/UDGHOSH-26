import React from "react";
import "./vision.css";
import Footer2 from "../Footer2/Footer2.jsx";
import Navbar2 from "../navbar/Navbar2.jsx";

const Vision = () => {
  const bannerStyle = {
    backgroundImage: 'url(https://www.capacitywebsolutions.com/wp-content/uploads/2017/12/Our_Mission_and_Vision_banner.jpg)',
    backgroundSize: 'cover',
  };

  return (
    <>
              <Navbar2/>
    <div className="scene">
      <div className="pageBanner clearfix" style={bannerStyle}>
        <h1 className="pageTitle">Our Mission and Vision</h1>
      </div>
      
      <div className="vision-wrapper">
      <hr/>
        <div className="mission">
        <div className="wrapp">
            <div className="bullseye">
           <svg xmlns="http://www.w3.org/2000/svg" height="3em" fill='#2473b9' viewBox="0 0 800 580"><path d="M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
           </div>
            <div className="mis">Our Mission</div> </div>
         <p className="tex"> At Udghosh, our mission is clear - to ignite the flames of dedication and inspire greatness. We believe in the transformative power of sports and its ability to shape character, instill discipline, and foster unwavering commitment. We are dedicated to nurturing the talent of today to become the sports icons of tomorrow.</p>   
       
        </div>
        <div className="vision">
        <div className="wrapp">
            <div className="bullseye">
            <svg className='bullseye'xmlns="http://www.w3.org/2000/svg" height="3em" fill='#2473b9' viewBox="0 0 800 580"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
           </div>
            <div className="mis">Our Vision</div> </div>
        <p className="tex">We vision to evolve the sports and athletics in a way to enhance the lives of individuals and society and to inspire the newer generation to actively participate in sporting events. Our aim would be to enhance the lifestyle and personality of everyone for the sake of longevity and acting in a more sustainable manner.</p>
        </div>
      </div>
    </div>
    <Footer2/></>
  );
};

export default Vision;

