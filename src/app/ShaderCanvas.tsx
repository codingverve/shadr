/**
 * Shader Canvas Component
 * 
 * The main canvas that hosts the WebGL2 renderer.
 * Supports two-pass rendering with post-processing.
 */

import { useEffect, useRef, useCallback } from 'react';
import { Renderer } from '../core/renderer';
import { PostProcessor } from '../core/postProcessor';
import { useAppStore } from './store';
import './ShaderCanvas.css';

export function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const postProcessorRef = useRef<PostProcessor | null>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());

  const activeEngine = useAppStore((s) => s.activeEngine);
  const parameters = useAppStore((s) => s.parameters);
  const isPlaying = useAppStore((s) => s.isPlaying);
  const postFx = useAppStore((s) => s.postFx);
  const timelineSpeed = useAppStore((s) => s.timelineSpeed);
  const timelineDuration = useAppStore((s) => s.timelineDuration);
  const isLooping = useAppStore((s) => s.isLooping);
  const recordingCountdown = useAppStore((s) => s.recordingCountdown);

  // Store latest values in refs
  const parametersRef = useRef(parameters);
  parametersRef.current = parameters;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const activeEngineRef = useRef(activeEngine);
  activeEngineRef.current = activeEngine;
  const postFxRef = useRef(postFx);
  postFxRef.current = postFx;
  const timelineSpeedRef = useRef(timelineSpeed);
  timelineSpeedRef.current = timelineSpeed;
  const timelineDurationRef = useRef(timelineDuration);
  timelineDurationRef.current = timelineDuration;
  const isLoopingRef = useRef(isLooping);
  isLoopingRef.current = isLooping;

  // Render loop with post-processing support
  const renderLoop = useCallback(() => {
    const renderer = rendererRef.current;
    const postProcessor = postProcessorRef.current;
    const engine = activeEngineRef.current;
    if (!renderer || !engine) return;

    if (isPlayingRef.current) {
      let elapsed = (performance.now() - startTimeRef.current) / 1000;
      elapsed *= timelineSpeedRef.current;

      // Handle looping
      const dur = timelineDurationRef.current;
      if (isLoopingRef.current && dur > 0) {
        elapsed = elapsed % dur;
      }

      const canvas = renderer.getCanvas();
      const fx = postFxRef.current;
      const vao = renderer.getVAO();

      if (postProcessor && vao && postProcessor.isActive(fx)) {
        // Two-pass: render to FBO, then post-process to screen
        postProcessor.resize(canvas.width, canvas.height);
        postProcessor.beginScene();

        renderer.renderFrame(elapsed, (r) => {
          engine.updateUniforms(r, parametersRef.current);
        });

        postProcessor.endScene(vao, elapsed, canvas.width, canvas.height, fx);
      } else {
        // Direct render (no post-processing)
        renderer.renderFrame(elapsed, (r) => {
          engine.updateUniforms(r, parametersRef.current);
        });
      }
    }

    animFrameRef.current = requestAnimationFrame(renderLoop);
  }, []);

  // Initialize renderer and post-processor when engine changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeEngine) return;

    try {
      if (rendererRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        rendererRef.current.dispose();
        postProcessorRef.current?.dispose();
      }

      const renderer = new Renderer(canvas);
      renderer.loadShader(activeEngine.fragmentShader);
      rendererRef.current = renderer;

      const postProcessor = new PostProcessor(renderer.getContext());
      postProcessorRef.current = postProcessor;

      startTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(renderLoop);
    } catch (err) {
      console.error('[ShaderCanvas] Failed to initialize:', err);
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      postProcessorRef.current?.dispose();
      postProcessorRef.current = null;
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, [activeEngine, renderLoop]);

  return (
    <div className="shader-canvas-container">
      <canvas ref={canvasRef} className="shader-canvas" />
      
      {recordingCountdown > 0 && (
        <div className="recording-countdown-overlay">
          <div className="countdown-number">{recordingCountdown}</div>
        </div>
      )}

      {!activeEngine && (
        <div className="shader-canvas-placeholder">
          <p>Loading engine...</p>
        </div>
      )}
    </div>
  );
}
