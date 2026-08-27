import React, { useState } from 'react';

// Scoped CSS for the component
const componentStyles = `
/* --- Font Import --- */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Lato:wght@400&display=swap');

/* --- Basic Setup --- */
.interactive-cards-container {
    // background-color: #0f172a; /* Global background color */
    display: flex;
    justify-content: center; /* Center the main content horizontally */
    align-items: center;
    min-height: 100vh;
    margin: 0;
    padding: 2rem;
    padding-top: 0;
    box-sizing: border-box;
    font-family: 'Lato', system-ui, sans-serif; /* Set default font */
    overflow: hidden;
}

/* --- New Content Wrapper --- */
.content-wrapper {
    display: flex;
    align-items: center;
    gap: 5rem; /* Adjust this gap to bring text closer or further */
}

/* --- The Container for the cards --- */
.card-stack-container {
    position: relative;
    width: 90vw;
    max-width: 900px;
    height: 60vh;
    max-height: 450px;
}

/* --- General Card Styling --- */
.card-item {
    position: absolute;
    width: 280px;
    height: 420px;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.1);
    background-size: cover;
    background-position: center;
    cursor: pointer;
    transition: transform 0.4s ease, z-index 0s 0.2s, box-shadow 0.3s ease, border-color 0.3s ease;
    transform: rotate(var(--rotation));
}

/* --- Specific position and rotation for each card --- */
.card-item:nth-child(1) {
    --rotation: -10deg; left: 5%; top: 5%; z-index: 1;
}
.card-item:nth-child(2) {
    --rotation: -5deg; left: 25%; top: 10%; z-index: 2;
}
.card-item:nth-child(3) {
    --rotation: 5deg; left: 45%; top: 5%; z-index: 3;
}
.card-item:nth-child(4) {
    --rotation: 10deg; left: 65%; top: 10%; z-index: 4;
}

/* --- Effects on Hover and Click --- */
.card-item:hover {
    z-index: 10;
    transform: translateY(-20px) scale(1.08) rotate(var(--rotation));
    transition: transform 0.4s ease, z-index 0s;
}

/* --- Details Panel Styling --- */
.details-panel {
    width: 320px;
    padding: 1.5rem;
    color: #e2e8f0;
    background-color: rgba(0,0,0, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(20px);
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.5s ease;
}

.details-panel.visible {
    opacity: 1;
    transform: translateX(0);
}

.details-panel-title {
    margin: 0 0 0.75rem 0;
    font-family: 'Poppins', sans-serif;
    font-size: 1.75rem;
    color: #ffffff;
    font-weight: 700;
}

.details-panel-description {
    margin: 0 0 1.5rem 0;
    font-family: 'Lato', sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: #cbd5e1;
}

.watch-button {
    display: inline-block;
    background-color: red;
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    text-align: center;
    transition: background-color 0.3s ease-out, transform 0.2s ease;
}

.watch-button:hover {
    background-color: red;
    transform: scale(1.05);
}

/* --- Mobile Responsiveness --- */
@media (max-width: 768px) {
    .content-wrapper {
        flex-direction: column;
        width: 100vw;
        align-items: up; /* Horizontally center the stacked items */
        gap: 5rem; /* Increase gap between cards and text panel */
    }

    .card-stack-container {
        height: 95vw;
        max-height: 280px;
        width: 100vw;
    }

    .card-item {
        width: 180px;
        height: 250px;
    }

    .card-item:nth-child(1) {
    --rotation: -10deg; left: 5%; top: 5%; z-index: 1;
    }
    .card-item:nth-child(2) {
        --rotation: -5deg; left: 30%; top: 10%; z-index: 2;
    }
    .card-item:nth-child(3) {
        --rotation: 5deg; left: 50%; top: 5%; z-index: 3;
    }
    .card-item:nth-child(4) {
      width:0;
      height:0;
    }
    .details-panel {
        width: 90%;
        max-width: 400px;
        text-align: center;
        transform: translateY(20px);
    }

    .details-panel.visible {
        transform: translateY(0);
    }
}
`;

const cardData = [
  {
    image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/u24?_a=BAMAPqcg0",
    link: "https://www.youtube.com/watch?v=JrUZKtvXjnA",
    title: "Udghosh'24",
    description:
      "Relive Udghosh’24 at IIT Kanpur – Asia’s largest college sports festival! Thrilling matches, spectacular pronites, and moments full of courage, resilience, and unity.",
  },
  {
    image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Aftermovies_2023?_a=BAMAPqcg0",
    link: "https://youtu.be/XZevkj2qpf0?si=MQeHYb8rawxkFa2D",
    title: "Udghosh'23",
    description:
      "Experience the excitement of Udghosh’23! From nail-biting finishes to awe-inspiring performances, the festival was an unforgettable celebration of sports and energy.",
  },
  {
    image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto,w_900,c_scale/v1/udghosh-23/public/WhatsApp_Image_2024-09-25_at_22.07.53_77040e06?_a=BAMAPqcg0",
    link: "https://www.youtube.com/watch?v=GP2WpyK5Fng",
    title: "Udghosh'22",
    description:
      "Catch the official aftermovie of Udghosh’22 – a festival of competition, camaraderie, and celebration, bringing together students for moments of pure excitement and joy.",
  },
  {
    image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Untitled_design_(1)?_a=BAMAPqcg0",
    link: "https://www.youtube.com/watch?v=Rm8lM1WskBc",
    title: "Udghosh'21",
    description:
      "Watch Udghosh’21 unfold with thrilling sports, inspiring performances, and memories that celebrate teamwork, courage, and the spirit of competition.",
  },
];


export default function InteractiveInfoCards() {
  const [activeCardData, setActiveCardData] = useState(cardData[0]);

  const handleCardClick = (card) => {
    setActiveCardData(card);
  };

  return (
    <div className='relative'>
      <h1 id="textblock-title" className='relative bg-transparent z-10 pt-24' style={{ fontFamily: "'Cinzel', serif" }}>AFTERMOVIES</h1>
      
      <div className="interactive-cards-container">
        <style>{componentStyles}</style>
        <div className="content-wrapper">
          <div className="card-stack-container flex flex-wrap">
            {cardData.map((card, index) => (
              <div
                key={index}
                className={`card-item ${activeCardData === card ? 'active' : ''}`}
                style={{ backgroundImage: `url('${card.image}')` }}
                onClick={() => handleCardClick(card)}
              ></div>
            ))}
          </div>

          <div className={`details-panel ${activeCardData ? 'visible' : ''}`}>
            {activeCardData && (
              <>
                <h2 className="details-panel-title" style={{ fontFamily: "'Cinzel', serif" }}>
                  {activeCardData.title.split("'")[0]}
                  <span style={{ color: '#3b82f6' }}>'{activeCardData.title.split("'")[1]}</span>
                </h2>

                <p className="details-panel-description">
                  ✨ <span style={{ fontWeight: '700', color: '#facc15' }}>Epic Moments:</span> {activeCardData.description.split('. ')[0]}.
                </p>
                <a
                  href={activeCardData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-button"
                >
                  ▶&nbsp;&nbsp;&nbsp; Watch the Aftermovie
                </a>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
