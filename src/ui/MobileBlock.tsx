import { useEffect, useRef } from 'react';
import './MobileBlock.css';

export function MobileBlock() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Video autostart failed:", err);
      });
    }
  }, []);

  // Use the base URL for public assets if defined
  const videoSrc = `${import.meta.env.BASE_URL}Arnab_Goswami_Kuch_Bhi_Meme_Template.mp4`.replace('//', '/');

  return (
    <div className="mobile-block">
      <div className="mobile-block-content">
        <div className="video-container">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            src={videoSrc}
            className="mobile-meme"
          />
        </div>
        <h1 className="mobile-caption">kuch bhi ab shader bhi mobile mein chaloge</h1>
        <p className="mobile-subtext">Open on Desktop or Tablet for the full GPU-accelerated experience.</p>
      </div>
    </div>
  );
}
