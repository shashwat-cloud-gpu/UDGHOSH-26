import React, { useState, useEffect, useRef } from 'react';
import Navbar2 from '../navbar/Navbar2';
import Footer2 from '../Footer2/Footer2';
// This is a self-contained component. It assumes TailwindCSS is available globally.

// --- Glowing Background Component ---
const GlowingBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 1.0 + 0.8;
                const speedFactor = Math.random() * 1.2 + 0.3;
                this.speedX = (Math.random() - 0.5) * speedFactor;
                this.speedY = (Math.random() - 0.5) * speedFactor;
                this.alpha = Math.random() * 0.5 + 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 255, ${this.alpha})`;
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 25;
                ctx.fill();
            }
        }

        const particles = Array.from({ length: 100 }, () => new Particle());

        const animate = () => {
            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, '#000050');
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles.forEach(p => p.reset());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="glowing-canvas" />;
};


// --- Placeholder Components for Navbar and Footer ---

// --- End Placeholder Components ---

const App = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('marketing'); // 'mnp' or 'marketing'
    
    // --- SPONSOR DATA ---
    const sponsorsDataMNP = {
        "IN ASSOCIATION WITH": { "links": [{ "name": "Dainik Jagran", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/Jagran_logo_new_page-0001?_a=BAMAPqcg0", "status": "active", "website": "https://www.jagran.com/" }]},
        "Official Digital MEDIA PARTNER": { "links": [{ "name": "Dainik Bhaskar", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/DB_APP_NEW_LOGO_page-0001?_a=BAMAPqcg0", "status": "active", "website": "https://www.bhaskar.com/" }]},
        "Official Entertainment Partner": { "links": [{ "name": "Radio Mirchi", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/mirchi1?_a=BAMAPqcg0", "status": "active", "website": "https://mirchi.in/" },{ "name": "Radio Mirchi", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/mirchi2?_a=BAMAPqcg0", "status": "active", "website": "https://mirchi.in/" }]},
        "Official News Channel Partner": { "links": [{ "name": "HNN 24X7", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/HNN?_a=BAMAPqcg0", "status": "active", "website": "https://hnn24x7.com/" }]},
        "Official Radio Partner": { "links": [{ "name": "92.7 Big FM", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/Big_Fm_92_7_Logo_Artwork_15_1_19_(1)?_a=BAMAPqcg0", "status": "active", "website": "https://www.bigfmindia.com/" }]},
        "MEDIA PARTNER": { "links": [
            { "name": "Navbharat Times", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/NBT-Logo_-_PDF_page-0001?_a=BAMAPqcg0", "status": "active", "website": "https://navbharattimes.indiatimes.com/" },
            { "name": "The Global Hues", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/THE_GLOBAL_HUES?_a=BAMAPqcg0", "status": "active", "website": "https://theglobalhues.com/" },
            { "name": "Adhunik Samachar", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/Adhunik_Samachar?_a=BAMAPqcg0", "status": "active", "website": "https://aadhuniksamachar.com/" },
            { "name": "Jhansi Times", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/JHANSI_TIMES?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/jhansitimes1/?hl=en" }
        ]},
        // "Artistry & Media Partner": { "links": [{ "name": "Feevin Media", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/feevin_media?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/feevin.in/" }]},
        "Magazine Partner": { "links": [
            { "name": "Physiotimes", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/Physiotimes-logo_(1)?_a=BAMAPqcg0", "status": "active", "website": "https://physiotimes.com/" },
            { "name": "Knowafest", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/knowafest?_a=BAMAPqcg0", "status": "active", "website": "https://www.knowafest.com/" },
            
        ]},
        "BRANDING PARTNER": { "links": [
            { "name": "K.P. Infomedia", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/K.P._Infomedia?_a=BAMAPqcg0", "status": "active", "website": "https://kpinfomedia.org/" }
        ]},
        "Digital Spotlight Partner": { "links": [{ "name": "mr.foodiiie", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/mr.foodiiie?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/mr.foodiiie/" }]},
        "Social Media Partner": { "links": [
            { "name": "unseen_kanpur", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/UNSEEN_KANPUR?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/the.unseen.kanpur/" },
            { "name": "DU INDIA", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/DU_INDIA?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/du__india/" }
        ]},
        "Instagram Outreach Partner": { "links": [
            { "name": "hikanpur", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/hi_kanpur?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/hikanpur/" },
            { "name": "kanpur_ka_vloger", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/kanpur_ka_vlogger?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/kanpur_ka_vlogger/" }
        ]},
        "Official Coverage Partner": { "links": [{ "name": "Seemax Studio", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/Seemax_Studio?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/seemax_studio/" }]},
        "Instagram Hype Partner": { "links": [
            { "name": "Kanpur vogue", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/Kanpur_Vogue?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/kanpur.vogue/" },
            { "name": "Kanpur lens", "logo": "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/MNP/Kanpur_Lens?_a=BAMAPqcg0", "status": "active", "website": "https://www.instagram.com/kanpurlens/" },
            { "name": "@ishita.__x", "logo": "/ishita.__x.png", "status": "active", "website": "https://www.instagram.com/ishita.__x/" }
        ]},
    };

    const sponsorsDataMarketing = {
        "Title Sponsor": { links: [{ name: "PERF", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/Perf_Logo_with__Tagline_10x3_Ft_page-0001?_a=BAMAPqcg0", status: "active", priority: 1, website: "https://www.perfitalia.com/" }] },
        "Powered By": { links: [{ name: "SBI", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/sbi?_a=BAMAPqcg0", status: "active", priority: 2, website: "https://sbi.co.in/" }] },
        "Banking Partner": { links: [{ name: "PNB", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/logo__page-0001?_a=BAMAPqcg0", status: "active", priority: 3, website: "https://pnb.bank.in/" }] },
        "Infratech Partner": { links: [{ name: "ULTRATECH", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/ultractech?_a=BAMAPqcg0", status: "active", priority: 4, website: "https://www.ultratechcement.com/" }] },
        "Real Estate Partner": { links: [{ name: "VARTIKSHA", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/Vartiksha_logo?_a=BAMAPqcg0", status: "active", priority: 5, website: "https://www.vartiksharealestate.in/" }] },
        "CAT Education Partner": { links: [{ name: "IMS", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/ims_png?_a=BAMAPqcg0", status: "active", priority: 6, website: "https://www.imsindia.com/" }] },
        "Music Partner": { links: [{ name: "HOOPR", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/hoopr-black_(Very_High_Res_)_(6)?_a=BAMAPqcg0", status: "active", priority: 7, website: "https://hoopr.ai/" }] },
        "Nutrition Partner": { links: [{ name: "AVVATAR", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/avataar?_a=BAMAPqcg0", status: "active", priority: 8, website: "https://www.avvatarindia.com/" }] },
        "Technology Partner": { links: [{ name: "EZ EXAM", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/ez_exam_%5D?_a=BAMAPqcg0", status: "active", priority: 9, website: "https://ezexam.in/login" }] },
        "Sporting Partner": { links: [{ name: "COSCO", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/cosco_23?_a=BAMAPqcg0", status: "active", priority: 10, website: "https://www.cosco.in/" }] },
        "Fragrance Partner": { links: [{ name: "MYOP", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/myop_logo?_a=BAMAPqcg0", status: "active", priority: 11, website: "https://myop.in/" }] },
        "Skin Care Partner": { links: [{ name: "4 Mation", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/Skins_Logo_with_CSC?_a=BAMAPqcg0", status: "active", priority: 12, website: "https://www.4mationskins.com/" }] },
        "Beverage Partner": { links: [{ name: "VBL", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/vbl?_a=BAMAPqcg0", status: "active", priority: 13, website: "https://www.varunbeverages.com/" }] },
        "Hospital Partner": { links: [{ name: "SushRut", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/sushrut?_a=BAMAPqcg0", status: "active", priority: 14, website: "https://sushruthospital.org/" }] },
        "Housing Partner": { links: [{ name: "THE PRISTINE", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/pristine?_a=BAMAPqcg0", status: "active", priority: 15, website: "https://thepristinehotel.com/" }] },
        "UPSC Education Partner": { links: [{ name: "NEXT IAS", logo: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/sponsors/Marketing/next_ias?_a=BAMAPqcg0", status: "active", priority: 16, website: "https://www.nextias.com/" }] },
    };
    
    const dataToRender = activeTab === 'mnp' ? sponsorsDataMNP : sponsorsDataMarketing;

    const getSortedCategories = (data) => {
        return Object.entries(data)
            .map(([categoryName, { links }]) => {
                const minPriority = Math.min(...links.map(link => link.priority || Infinity));
                return { categoryName, links, minPriority };
            })
            .sort((a, b) => a.minPriority - b.minPriority);
    };

    const sortedCategories = activeTab === 'marketing' ? getSortedCategories(dataToRender) : Object.entries(dataToRender).map(([categoryName, { links }]) => ({ categoryName, links }));

    // --- 3D TILT EFFECT LOGIC ---
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = -1 * (y - height / 2) / (height / 25);
        const rotateY = (x - width / 2) / (width / 25);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = (e) => {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    // --- DYNAMIC SIZING LOGIC ---
    const getSizeClasses = (sponsor) => {
        if (activeTab !== 'marketing' || !sponsor.priority) {
            return {
                container: 'w-full sm:w-1/2 lg:w-[31%]',
                text: 'text-xl'
            };
        }
        
        const priority = sponsor.priority;
        if (priority === 1) return { container: 'w-full lg:w-3/5', text: 'text-3xl' }; 
        if (priority <= 3) return { container: 'w-full sm:w-1/2 lg:w-[45%]', text: 'text-2xl' };
         return { container: 'w-full sm:w-1/2 lg:w-[31%]', text: 'text-xl' };
        
    };

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');
                    html {
                        scroll-behavior: smooth;
                    }
                    body {
                        font-family: 'Rajdhani', sans-serif;
                        color: #e0e0e0;
                        background:transparent;
                    }
                    .glowing-canvas {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: block;
                        z-index: -1;
                    }
                    .tab-btn {
                        font-family: 'Rajdhani', sans-serif;
                        background-color: transparent;
                        border: 2px solid #4A5568;
                        color: #E2E8F0;
                        transition: all 0.3s ease;
                    }
                    .tab-btn.active {
                        background-color: #00bfff;
                        border-color: #00bfff;
                        color: #0a0a1a;
                        box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
                    }
                    .main-header {
                        background: linear-gradient(to bottom, #ffffff, #e0e0e0);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                        text-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
                        font-size: 3.5rem;
                    }
                    .category-header {
                        color: #00bfff;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        font-size: 1.75rem;
                        font-weight: 700;
                    }
                    
                    /* --- MINIMALIST CARD STYLES --- */
                    .sponsor-grid-container {
                        perspective: 1500px;
                    }
                    .logo-image-container {
                        background-color: white;
                        padding: 1rem;
                        border-radius: 0.75rem;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.4);
                        width: 100%;
                        aspect-ratio: 4 / 3;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: transform 0.2s ease-out;
                        transform-style: preserve-3d;
                    }
                     .logo-image-container img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                        transform: translateZ(30px); /* Lifts the image forward */
                    }
                    .sponsor-name-text {
                        margin-top: 1.25rem;
                        color: #ffffff;
                        font-weight: 600;
                        transition: color 0.3s ease;
                    }
                    .sponsor-card-minimal:hover .sponsor-name-text {
                        color: #00bfff;
                    }
                    
                `}
            </style>
            <GlowingBackground />
            <Navbar2 />
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-48 relative z-10">
                <main className="w-full max-w-7xl mx-auto text-center mt-0 sm:mt-12 lg:mt-20">
                    <div className="mb-10">
                        <h1 className="main-header font-bold tracking-wider mb-2">OUR PARTNERS</h1>
                        <p className="text-sm md:text-base text-gray-400">The driving force behind our fest.</p>
                    </div>

                    {/* --- TABS UI --- */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button 
                            onClick={() => setActiveTab('marketing')}
                            className={`tab-btn font-bold py-2 px-6 rounded-lg ${activeTab === 'marketing' ? 'active' : ''}`}
                        >
                            Marketing
                        </button>
                        <button 
                            onClick={() => setActiveTab('mnp')}
                            className={`tab-btn font-bold py-2 px-6 rounded-lg ${activeTab === 'mnp' ? 'active' : ''}`}
                        >
                            MNP
                        </button>
                    </div>
                    
                    {sortedCategories.map(({ categoryName, links }) => {
                        return (
                            <div key={categoryName} className="my-16">
                                <h2 className="category-header mb-8">{categoryName}</h2>
                                <div className="sponsor-grid-container flex flex-wrap justify-center items-end gap-x-8 gap-y-12">
                                    {links.map((sponsor, index) => {
                                        const sizeClasses = getSizeClasses(sponsor);
                                        return (
                                            <a 
                                                href={sponsor.website || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                key={`${activeTab}-${categoryName}-${index}`} 
                                                className={`sponsor-card-minimal text-center ${sizeClasses.container}`}
                                            >
                                                <div 
                                                    className="logo-image-container"
                                                    onMouseMove={handleMouseMove}
                                                    onMouseLeave={handleMouseLeave}
                                                >
                                                    <img src={sponsor.logo} onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/250x188/ffffff/000000?text=${encodeURIComponent(sponsor.name)}&textsize=50` }} alt={`${sponsor.name} Logo`} />
                                                </div>
                                                <p className={`sponsor-name-text ${sizeClasses.text}`}>{sponsor.name}</p>
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </main>
            </div>
            <Footer2 />
        </>
    );
};

export default App;

