import React, { useEffect, useRef, useState } from "react";
import Navbar2 from "../navbar/Navbar2.jsx";
import "./index.css";

// Reusable EventCard with Scroll Animation
function EventCard({ title, mainDesc, subDesc, image, link, reverse }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Animate only once
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the card is visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Dynamically build class names
  const wrapperClasses = `
    past-events-card-wrapper
    ${reverse ? "card-pos-right" : "card-pos-left"}
    ${isVisible ? "is-visible" : ""}
  `;

  return (
    <div className={wrapperClasses.trim()} ref={cardRef}>
      <div className="past-events-card">
        {reverse ? (
          <>
            <div className="event-text-content">
              <div className="card-content-unskew">
                <div className="event-details">
                  <div className="event-title-box">
                    <h2 className="event-title">{title}</h2>
                  </div>
                  <p className="event-description-main">{mainDesc}</p>
                  <p className="event-description-sub">{subDesc}</p>
                </div>
              </div>
            </div>
            <a href={link} target="_blank" rel="noopener noreferrer" className="event-image-container">
              <div className="card-content-unskew">
                <img src={image} alt={title} />
              </div>
            </a>
          </>
        ) : (
          <>
            <a href={link} target="_blank" rel="noopener noreferrer" className="event-image-container">
              <div className="card-content-unskew">
                <img src={image} alt={title} />
              </div>
            </a>
            <div className="event-text-content">
              <div className="card-content-unskew">
                <div className="event-details">
                  <div className="event-title-box">
                    <h2 className="event-title">{title}</h2>
                  </div>
                  <p className="event-description-main">{mainDesc}</p>
                  <p className="event-description-sub">{subDesc}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PastEvents() {
  const events = [
    {
      title: "Pronite with Ash King",
      mainDesc: "An enchanting evening as Ash King graced the stage with his soulful voice and chart-topping hits. The audience was swept away by his mesmerizing performance, making Pro Nite a truly magical experience.",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Ashking?_a=BAMAPqcg0",
      
      
    },
    {
      title: "Pronite with Karan Kanchan",
      mainDesc: "A magical Pro Nite as Karan Kanchra set the stage alive with his soulful voice and heartfelt songs. The crowd swayed, sang along, and cherished every note in a night full of unforgettable melodies",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/karan?_a=BAMAPqcg0",
      reverse: true
      
      
    },
    {
      title: "Band Performance with Yash raj",
      mainDesc: "Band Performance by Yash Raj brought a perfect blend of talent, rhythm, and stage presence. Their captivating music and seamless teamwork turned the evening into a mesmerizing experience for everyone present.",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Yash?_a=BAMAPqcg0",
      
      
    },
    {
      title: "EDM Night with Sartek",
      mainDesc: "EDM Night with Sartek was a high-voltage celebration of music, energy, and togetherness. The pulsating beats, stunning visuals, and electrifying atmosphere created memories that still resonate with every attendee.",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/EDM?_a=BAMAPqcg0",
      
      reverse: true
    },

    {
      title: "Bollywood night with Gajender verma",
      mainDesc: "Bollywood Night with Gajendra Verma was a celebration of music and emotions. His soulful performances, combined with the audience’s enthusiasm, turned the evening into an unforgettable experience that resonated long after the final note",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Bollywood?_a=BAMAPqcg0",
      
      
    },
     {
      title: "DJ Night with Ravator",
      mainDesc: "Nonstop energy, thumping bass, and an electrifying crowd — that’s what DJ Night with Ravator was all about. Truly a night to remember!”",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Ravator?_a=BAMAPqcg0",
      reverse: true
    },
    {
      title: "Rap show with Thugs",
      mainDesc: "A power-packed night as Thugs from Overseas took the stage with hard-hitting rap, raw energy, and unstoppable flow. The beats dropped heavy, the crowd vibed harder — a true celebration of hip-hop culture.",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/thugs?_a=BAMAPqcg0",
     
      
    }
  ];

  const [firecrackers, setFirecrackers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fc = {
        left: Math.random() * 100 + "%",
        size: 5 + Math.random() * 5 + "px",
        duration: 0.5 + Math.random() * 0.8 + "s",
      };
      setFirecrackers(prev => [...prev.slice(-30), fc]);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar2 />

      {/* Firecrackers background */}
      <div className="firecrackers-bg">
        {firecrackers.map((f, i) => (
          <div
            key={i}
            className="firecracker"
            style={{
              left: f.left,
              width: f.size,
              height: f.size,
              animationDuration: f.duration
            }}
          ></div>
          
        ))}
      </div>

      <div className="past-events-page">
        <div className="past-events-container">
          <h1 className="past-events-main-title">Our Past Events</h1>
          <div className="past-events-cards">
            {events.map((event, i) => (
              <EventCard key={i} {...event} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}