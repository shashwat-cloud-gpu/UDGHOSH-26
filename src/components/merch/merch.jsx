import React from 'react';
import Navbar from '../navbar/Navbar2.jsx';
import Footer2 from '../Footer2/Footer2.jsx';
// Main App Component
function Merchandise() {
  // A reliable URL for the black t-shirt image
  // The original URL was from ibb.co which can be unreliable. 
  // Using a placeholder service for stability.
  const blackTshirtUrl = "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/merch?_a=BAMAPqcg0";

  return (
    <>
      {/* Styles are included directly here for a single-file component 
        to perfectly match the original HTML file's appearance as requested.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #0d1b2a; /* Darker blue background */
          color: #e0e1dd;
          overflow-x: hidden;
        }

        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column; /* Stack cards vertically */
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          margin-top: 5rem;
          gap: 3rem; /* Space between the two cards */
          position: relative;
          overflow: hidden; /* Hide overflowing waves */
        }
        
        /* Main Background Wavy Effect */
        .page-container::before,
        .page-container::after {
            content: '';
            position: absolute;
            left: 50%;
            min-width: 300vw;
            min-height: 300vw;
            background-color: #1b263b;
            animation: rotate 20s linear infinite;
            z-index: 0;
        }

        .page-container::before { bottom: 15vh; border-radius: 45%; }
        .page-container::after { bottom: 12vh; opacity: 0.5; background-color: #415a77; border-radius: 47%; animation-duration: 22s; }
        
        @keyframes rotate {
            0% { transform: translate(-50%, 0) rotateZ(0deg); }
            100% { transform: translate(-50%, 0) rotateZ(360deg); }
        }


        .shop-card {
          background: linear-gradient(to bottom, 
    #0a0f16 0%,    /* very dark navy at top */
    #0d1e2e 40%,   /* deep midnight blue */
    #0a1830 70%,   /* slightly brighter navy blue */
    #000000 100%   /* fade to black at bottom */
);
          backdrop-filter: blur(10px);
          border: 1px solid #778da950;
          border-radius: 24px;
          padding: 3rem;
          display: flex;
          gap: 3rem;
          max-width: 1000px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          position: relative; 
          z-index: 1;
        }

        /* --- T-Shirt Display --- */
        .product-display {
        border
          border-radius:15px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
        }
        
        .tshirt-mockup {
          max-width: 100%;
          min-width: 250px;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
        }

        .btn-order {
          padding: 0.9rem 2.5rem;
          border-radius: 12px;
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          background: linear-gradient(90deg, #00c7ff, #0077ff);
          color: #fff;
          box-shadow: 0 4px 15px rgba(0, 150, 255, 0.4);
        }

        .btn-order:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 150, 255, 0.6);
        }

        /* --- Product Details --- */
        .product-details { flex: 1.2; display: flex; flex-direction: column; }
        
        .details-header h1 { font-size: 2.8rem; font-weight: 700; color: #fff; margin: 0; line-height: 1.2; }
        .details-header h2 { font-size: 1.8rem; font-weight: 600; color: #a9d6e5; margin: 0 0 2rem 0; }
        
        .details-list { list-style: none; padding: 0; margin: 0; }
        .details-list li { display: flex; align-items: center; margin-bottom: 1rem; font-size: 1rem; color: #d3d3d3; }
        .details-list li::before { content: '•'; color: #00c7ff; font-size: 1.5rem; margin-right: 0.75rem; line-height: 1; }
        .details-list .highlight { color: #e0e1dd; font-weight: 600; }
        
        .details-divider {
          border: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, #00c7ff, transparent);
          margin: 1.5rem 0;
          opacity: 0.5;
        }

        .contact-info {
          margin-top: auto; /* Pushes to bottom */
        }

        .contact-info p {
          margin: 0.25rem 0;
          font-size: 0.95rem;
        }

        .contact-info .contact-name a {
          font-weight: 700;
          color: #00c7ff;
          text-decoration: none;
          font-size: 1.1rem;
          transition: color 0.3s ease;
        }

        .contact-info .contact-name a:hover {
          color: #fff;
        }


        /* --- Payment Info Card --- */
        .payment-info-card {
        background: linear-gradient(to bottom, 
    #0a0f16 0%,    /* very dark navy at top */
    #0d1e2e 40%,   /* deep midnight blue */
    #0a1830 70%,   /* slightly brighter navy blue */
    #000000 100%   /* fade to black at bottom */
);
          background-color: #1b263b;
          border-radius: 24px;
          padding: 2.5rem;
          max-width: 1000px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          position: relative;
          z-index: 1;
          overflow: hidden; /* Keep internal waves contained */
          border: 1px solid #778da950;
        }
        
        .payment-info-card h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 1.5rem 0;
          text-align: center;
          z-index: 2;
          position: relative;
        }

        .payment-steps {
          list-style: none;
          padding: 0;
          margin: 0;
          z-index: 2;
          position: relative;
        }

        .payment-steps li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: #d3d3d3;
          background: rgba(13, 27, 42, 0.6);
          padding: 1rem;
          border-radius: 12px;
        }

        .payment-steps li .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #0d1b2a;
          background-color: #00c7ff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          min-width: 30px;
          margin-right: 1rem;
          font-size: 1.1rem;
        }
        
        /* Payment Card Wavy Effect */
        .payment-info-card .wave {
            background: #0077f40;
            border-radius: 1000% 1000% 0 0;
            position: absolute;
            width: 200%;
            height: 12em;
            animation: wave-animation 10s -3s linear infinite;
            transform: translate3d(0, 0, 0);
            opacity: 0.8;
            bottom: 0;
            left: 0;
            z-index: 0;
        }
        .payment-info-card .wave:nth-of-type(2) {
            bottom: -1.25em;
            animation: wave-animation 18s linear reverse infinite;
            opacity: 0.8;
        }
        .payment-info-card .wave:nth-of-type(3) {
            bottom: -2.5em;
            animation: wave-animation 20s -1s reverse infinite;
            opacity: 0.9;
        }
        @keyframes wave-animation {
            2% { transform: translateX(1); }
            25% { transform: translateX(-25%); }
            50% { transform: translateX(-50%); }
            75% { transform: translateX(-25%); }
            100% { transform: translateX(1); }
        }

        
        /* Responsive Design */
        @media (max-width: 900px) {
          .page-container { padding: 2rem 1rem; }
          .shop-card { flex-direction: column; align-items: center; padding: 2rem; text-align: center; }
          .details-list li { justify-content: center; }
          .details-header h1 { font-size: 2.2rem; }
          .details-header h2 { font-size: 1.5rem; }
        }
      `}</style>
      <div>
      <Navbar />
      </div>
      <div className="page-container">
        
        {/* --- TOP CARD: PRODUCT INFO --- */}
        <div className="shop-card" >
          <div className="product-display">
            <img src={blackTshirtUrl} alt="Black T-shirt" className="tshirt-mockup" />
            <a href="https://www.onlinesbi.sbi/sbicollect/icollecthome.htm" target="_blank" rel="noopener noreferrer" className="btn-order">Order Now</a>
          </div>

          <div className="product-details">
            <div className="details-header">
              <h1>UDGHOSH '26</h1>
              <h2>Official Merchandise</h2>
            </div>
            
            <ul className="details-list">
              <li><span className="highlight">Price: </span>   ₹399. All shirts are oversized.</li>
              <li><span className="highlight">Available Sizes: </span>   S, M, L, XL, XXL.</li>
              <li><span className="highlight">Collection Point: </span>B 114, Hall 1, IIT Kanpur.</li>
            </ul>
            
            <hr className="details-divider" />
            
            <div className="contact-info">
                <p>For any queries, contact:</p>
                <p className="contact-name">
                  Rahul : <a href="tel:+918824979590">88249 79590</a>
                </p>
                <p className="contact-name">
                  Om Singh : <a href="tel:+919412391151">94123 91151</a>
                </p>
            </div>
          </div>
        </div>

        {/* --- BOTTOM CARD: PAYMENT PROCESS --- */}
        <div className="payment-info-card">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <h3>Payment Process</h3>
            <ol className="payment-steps">
              <li><span className="step-number">1</span><div>Click the "Order Now" button to be redirected to <strong>SBI i-Collect</strong>.</div></li>
              <li><span className="step-number">2</span><div>In the 'Select Payment Category' dropdown, choose <strong>'UDGHOSH'</strong>.</div></li>
              <li><span className="step-number">3</span><div>Enter your T-shirt size (e.g., S, M, L) in the <strong>Remarks field</strong>.</div></li>
              <li><span className="step-number">4</span><div>Complete the payment and <strong>take a screenshot</strong> of the receipt for your records.</div></li>
            </ol>
        </div>
      </div>
      <Footer2 />
    </>
  );
}

export default Merchandise;
