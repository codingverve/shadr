/**
 * MobileBlock Component
 * 
 * Displays a fullscreen overlay on mobile devices to prevent access.
 * Shows a funny meme video and a specific caption.
 */

import './MobileBlock.css';

export function MobileBlock() {
  return (
    <div className="mobile-block">
      <div className="mobile-block-content">
        <div className="video-container">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            src="/Arnab_Goswami_Kuch_Bhi_Meme_Template.mp4"
            className="mobile-meme"
          />
        </div>
        <h1 className="mobile-caption">kuch bhi ab shader bhi mobile mein chaloge</h1>
        <p className="mobile-subtext">Open on Desktop or Tablet for the full GPU-accelerated experience.</p>
      </div>
    </div>
  );
}
