import React, { useRef } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoadingVideo.css';
const LoadingVideo = () => {
    const [videoEnded, setVideoEnded] = useState(false); // Track video state
    const [fadeOut, setFadeOut] = useState(false); // Control fade effect
    const [isMuted, setIsMuted] = useState(true);
    
    const navigate = useNavigate();

    const videoRef = useRef(null)
     // Function to handle audio
    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted; // Toggle mute on the video element
        }
    };
    // Function to handle video end
    const handleVideoEnd = () => {
        setFadeOut(true); // Trigger the fade-out effect
        setTimeout(() => {
            setVideoEnded(true); // Mark video as ended
            navigate("/home"); // Navigate to the home page
        }, 1000); // Wait for 1 second for smooth transition
    };

    // Skip button functionality
    const handleSkip = () => {
        handleVideoEnd(); // Skip the video and transition
    };

    return (
        <div className={`main relative h-screen z-[101] w-screen ${videoEnded ? 'bg-black' : ''}`}>
            {!videoEnded && (
                <div className={`video-container h-full w-full ${fadeOut ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}>
                    <video
                        className="video"
                        autoPlay
                        muted={isMuted}
                        onEnded={handleVideoEnd} // When video ends
                    >
                        <source src="video.mp4" type="video/mp4" />
                    </video>
                    <button
                        onClick={handleSkip}
                        className="videoButton absolute bottom-5 xl:bottom-10 right-5 bg-black text-white py-1 px-2 rounded-lg"
                    >
                        <i className="ri-skip-forward-fill"></i>
                    </button>
                    <button
                        onClick={toggleMute}
                        className="videoButton absolute top-5 xl:top-10 left-5 bg-black text-white py-1 px-2 rounded-lg"
                    >
                        <i className={isMuted ? "ri-volume-mute-fill" : "ri-volume-up-fill"}></i>
                    </button>
                </div>
            )}
        </div>
    );
    
};

export default LoadingVideo;
