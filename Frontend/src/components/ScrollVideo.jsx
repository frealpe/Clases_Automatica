import React, { useEffect, useRef } from 'react';

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";

export default function ScrollVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch((err) => {
      console.log("Autoplay prevented:", err);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-50 transition-opacity duration-500"
      />
      {/* Gradientes cinematográficos de profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/40 to-[#0a0a0a]" />
    </div>
  );
}
