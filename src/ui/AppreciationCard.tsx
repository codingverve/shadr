/**
 * Appreciation Card Component
 * 
 * An elegant card that previews the current shader with editable metadata (Name, Role).
 * Designed for downloading/sharing as a card of appreciation.
 */

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../app/store';
import { Download, X } from 'lucide-react';
import { exportFullCardAsPNG } from '../exports/imageExporter';
import { Renderer } from '../core/renderer';
import { PostProcessor } from '../core/postProcessor';
import { Button } from './Button';
import './AppreciationCard.css';

interface AppreciationCardProps {
  onClose: () => void;
}

export function AppreciationCard({ onClose }: AppreciationCardProps) {
  const activeEngine = useAppStore((s) => s.activeEngine);
  const parameters = useAppStore((s) => s.parameters);
  const postFx = useAppStore((s) => s.postFx);

  // Content State
  const [userName, setUserName] = useState('Akashdeep Singh');
  const [userRole, setUserRole] = useState('Product Designer');
  const [userBio, setUserBio] = useState('Designing thoughtful digital experiences and interactive shader patterns.');

  // Style State
  const [cardBg, setCardBg] = useState('#121212');
  const [nameColor, setNameColor] = useState('#FFFFFF');
  const [roleColor, setRoleColor] = useState('#9CA3AF');
  const [bioColor, setBioColor] = useState('#888888');

  // No genie origin state needed, but restoring dynamic tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const postProcessorRef = useRef<PostProcessor | null>(null);

  // Mouse Tilt Logic (using CSS variables for performance)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    const tiltX = -mouseY * 12; // Max 12 deg tilt
    const tiltY = mouseX * 12;
    
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', `0deg`);
    cardRef.current.style.setProperty('--tilt-y', `0deg`);
  };

  useEffect(() => {
    if (miniCanvasRef.current && activeEngine) {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      const renderer = new Renderer(miniCanvasRef.current);
      renderer.loadShader(activeEngine.fragmentShader);
      rendererRef.current = renderer;

      const postProcessor = new PostProcessor(renderer.getContext());
      postProcessorRef.current = postProcessor;

      const render = () => {
        const r = rendererRef.current;
        const pp = postProcessorRef.current;
        if (!r || !pp) return;
        
        const time = performance.now() / 1000;
        const canvas = r.getCanvas();
        const vao = r.getVAO();

        if (pp.isActive(postFx) && vao) {
          pp.resize(canvas.width, canvas.height);
          pp.beginScene();
          r.renderFrame(time, (rend) => {
            activeEngine.updateUniforms(rend, parameters);
          });
          pp.endScene(vao, time, canvas.width, canvas.height, postFx);
        } else {
          r.renderFrame(time, (rend) => {
            activeEngine.updateUniforms(rend, parameters);
          });
        }
        
        requestAnimationFrame(render);
      };
      const animId = requestAnimationFrame(render);
      return () => {
        cancelAnimationFrame(animId);
        postProcessor.dispose();
        renderer.dispose();
        rendererRef.current = null;
        postProcessorRef.current = null;
      };
    }
  }, [activeEngine, parameters]);

  const handleDownload = async () => {
    if (miniCanvasRef.current) {
      exportFullCardAsPNG(
        miniCanvasRef.current,
        userName,
        userRole,
        userBio,
        cardBg,
        nameColor,
        roleColor,
        bioColor,
        `appreciation-card-${Date.now()}.png`
      );
    }
  };

  return (
    <div className="card-overlay" onClick={onClose}>
      <div 
        className="card-editor-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          className="modal-close"
          onClick={onClose}
          icon={<X size={20} />}
        />

        <div className="card-editor-layout">
          {/* Left: Preview Section */}
          <div className="card-preview-section">
            <div 
              className="preview-stage"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="card-mockup"
                ref={cardRef}
                style={{ backgroundColor: cardBg }}
              >
                <div className="card-shader-area">
                  <canvas ref={miniCanvasRef} className="card-mini-canvas" width={440} height={350} />
                </div>
                <div className="card-text-area">
                  <h1 className="preview-name" style={{ color: nameColor }}>{userName}</h1>
                  <h2 className="preview-role" style={{ color: roleColor }}>{userRole}</h2>
                  <p className="preview-bio" style={{ color: bioColor }}>{userBio}</p>
                </div>
              </div>
            </div>
            <p className="preview-hint">Live Preview (Pixel-Perfect Download)</p>
          </div>

          {/* Right: Properties Section */}
          <div className="card-properties-section">
            <div className="panel-header">
              <h2 className="panel-title">Customize Your Card</h2>
              <p className="panel-subtitle">Make it truly yours</p>
            </div>

            <div className="prop-section">
              <div className="prop-section-label">Profile</div>
              <div className="prop-group">
                <div className="prop-field">
                  <span>What should we call you?</span>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Akashdeep Singh" />
                </div>
                <div className="prop-field">
                  <span>What’s your craft?</span>
                  <input type="text" value={userRole} onChange={(e) => setUserRole(e.target.value)} placeholder="Product Designer" />
                </div>
                <div className="prop-field">
                  <span>Tell us a little about your craft</span>
                  <textarea value={userBio} onChange={(e) => setUserBio(e.target.value)} placeholder="Designing thoughtful digital experiences..." rows={3} />
                </div>
              </div>
            </div>

            <div className="prop-section">
              <div className="prop-section-label">Appearance</div>
              <div className="prop-group">
                <div className="prop-sub-group">
                  <span className="sub-group-label">Background</span>
                  <div className="color-grid">
                    <div className="color-field">
                      <input type="color" id="cardBg" value={cardBg} onChange={(e) => setCardBg(e.target.value)} />
                      <label htmlFor="cardBg">Card BG</label>
                    </div>
                  </div>
                </div>

                <div className="prop-sub-group">
                  <span className="sub-group-label">Typography</span>
                  <div className="color-grid">
                    <div className="color-field">
                      <input type="color" id="nameColor" value={nameColor} onChange={(e) => setNameColor(e.target.value)} />
                      <label htmlFor="nameColor">Title</label>
                    </div>
                    <div className="color-field">
                      <input type="color" id="roleColor" value={roleColor} onChange={(e) => setRoleColor(e.target.value)} />
                      <label htmlFor="roleColor">Subtitle</label>
                    </div>
                    <div className="color-field">
                      <input type="color" id="bioColor" value={bioColor} onChange={(e) => setBioColor(e.target.value)} />
                      <label htmlFor="bioColor">Bio Text</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="prop-actions">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleDownload}
                icon={<Download size={18} />}
              >
                Download your card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
