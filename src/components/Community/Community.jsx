import React from 'react';

const JoinCommunity = () => {
    return (
        <section className="text-white py-16 px-4 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 animate-fadeIn">
                {/* Text Section */}
                <div className="md:w-1/2 bg-black/30 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/10">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider uppercase mb-10 text-white"
                        style={{ fontFamily: "'Cinzel', serif" }}>
                        Join The Community
                    </h2>
                    <p className="text-xl font-semibold mb-4 text-white">
                        Welcome to Udghosh - IIT Kanpur's Sports Fest!
                    </p>
                    <p className="text-md italic text-white/90 mb-6 leading-relaxed">
                        Be part of India's largest collegiate sports festival. Stay updated
                        with event schedules, match highlights, live updates, and exclusive
                        behind-the-scenes content. This is where champions rise and legends
                        are made.
                    </p>
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="https://github.com/Udghosh-25/udghosh.org/releases/latest/download/udghosh.apk"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg font-semibold"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L20 12L12 22L4 12L12 2Z" />
                            </svg>
                            Download App
                        </a>

                        <a
                            href="https://chat.whatsapp.com/BDCIfPdcxVS7Ai9njjn8Z7"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all rounded-lg font-semibold"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 4H20V20H4V4ZM6 6V18H18V6H6ZM9.75 9.17L12 11.42L14.25 9.17L15.66 10.59L12 14.25L8.34 10.59L9.75 9.17Z" />
                            </svg>
                            Join WhatsApp Channel
                        </a>
                    </div>
                </div>

                {/* Logo */}
                <div className="hidden md:block md:w-1/4">
                    <img
                        src="/images/logo.png"
                        alt="Udghosh logo"
                        className="w-full rounded-lg shadow-2xl object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default JoinCommunity;
