import React from 'react';

// --- SVG Icon Components ---
// Updated with outline-style icons that more closely match the reference design.

const InstagramIcon = () => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.75em" width="1.75em" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const YoutubeIcon = () => (
    <svg fill="currentColor" stroke="none" viewBox="0 0 24 24" height="1.75em" width="1.75em" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.411 0 5.822 0 12c0 6.178.488 8.589 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.589 24 18.178 24 12c0-6.178-.488-8.589-4.385-8.816zM9.75 16.5V7.5l6.5 4.5-6.5 4.5z"></path>
    </svg>
);

const WhatsappIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1.75em"
    height="1.75em"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21l1.65-5A9 9 0 1 1 21 12a9 9 0 0 1-9 9c-1.7 0-3.29-.47-4.65-1.29L3 21z" />
    <path d="M16.5 13.5c-.5-.25-1-.5-1.5-.75-.4-.2-.8 0-1 .25l-.5.75c-.2.3-.6.4-.9.25-1.2-.6-2.1-1.5-2.7-2.7-.1-.3 0-.7.3-.9l.75-.5c.25-.2.45-.6.25-1-.25-.5-.5-1-.75-1.5-.2-.4-.7-.5-1.1-.3l-.6.35c-.6.35-1 .95-1 1.65 0 3.1 2.5 5.5 5.5 5.5.7 0 1.3-.4 1.65-1l.35-.6c.2-.4.1-.9-.3-1.1z" />
  </svg>
);

const LinkedinIcon = () => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.75em" width="1.75em" xmlns="http://www.w3.org/2000/svg"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const FacebookIcon = () => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.75em" width="1.75em" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const SocialLink = ({ href, icon: Icon, label }) => (
    <a href={href} className="text-gray-400 hover:text-white transform hover:-translate-y-1 transition-all duration-300" aria-label={label}>
        <Icon />
    </a>
);

const FooterNavLink = ({ href, children }) => (
     <li>
        <a href={href} className="inline-block text-lg transform hover:scale-105 hover:text-white transition-all duration-300">
            {children}
        </a>
    </li>
);

const App = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
      `}</style>
      <div className="bg-black text-white font-['Inter',_sans-serif]">
        {/* Footer Section */}
        <footer className="bg-black text-gray-300 p-4 sm:p-6 lg:p-8 border-t border-gray-800">
            <div className="mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Left Column */}
                <div className="md:col-span-4 text-center">
                    <h2 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Udghosh'26</h2>
                    <p className="text-lg leading-relaxed max-w-md mx-auto">
                        Udghosh aims to maintain high commitment levels and inspire talent with sports icons. Keeping our goal and pledge, we invite you to Udghosh 2026.
                    </p>
                    <div className="flex justify-center space-x-6 mt-6">
                        <SocialLink href="https://www.instagram.com/udghosh_iitk/" icon={InstagramIcon} label="Instagram" />
                        <SocialLink href="https://www.youtube.com/@Udghoshiitk/featured" icon={YoutubeIcon} label="YouTube" />
                       <SocialLink href="https://chat.whatsapp.com/BDCIfPdcxVS7Ai9njjn8Z7" icon={WhatsappIcon} label="WhatsApp" />
                        <SocialLink href="https://in.linkedin.com/company/udghosh-iit-kanpur-fest" icon={LinkedinIcon} label="LinkedIn" />
                        <SocialLink href="https://www.facebook.com/udghosh.iitk/" icon={FacebookIcon} label="Facebook" />
                    </div>
                </div>

                {/* Middle Column (Image) */}
                <div className="md:col-span-4 flex justify-center order-first md:order-none">
                     <a href="/">
                        <img src="https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_limit,q_auto:best,f_auto/v1790203296/udghosh-23/images/logo.png" alt="Udghosh Logo" className="mx-auto h-auto w-full max-w-[10rem] sm:max-w-[12rem] object-contain" />
                     </a>
                </div>

                {/* Right Column */}
                <div className="md:col-span-4 flex justify-center md:justify-start">
                    <div className="grid grid-cols-2 gap-x-16">
                        <div>
                            <ul className="space-y-4 text-left">
                                <FooterNavLink href="/">Home</FooterNavLink>
                                <FooterNavLink href="/teams">Our Team</FooterNavLink>
                                <FooterNavLink href="/gallery">Gallery</FooterNavLink>
                            </ul>
                        </div>
                        <div>
                            <ul className="space-y-4 text-left">
                                <FooterNavLink href="https://events.udghosh.org.in/">Competitions</FooterNavLink>
                                <FooterNavLink href="/sponsors">Sponsors</FooterNavLink>
                                <FooterNavLink href="/commitments/initiatives">Social Initiatives</FooterNavLink>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright notice at the very end */}
                <div className="md:col-span-12 text-center text-base text-gray-500 pt-8 mt-8 border-t border-gray-800">
                    <p>&copy; 2026 Udghosh. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    </div>
    </>
  );
}

export default App;

