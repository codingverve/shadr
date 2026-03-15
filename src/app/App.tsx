/**
 * App — Root Component
 * 
 * Assembles layout: Header, EngineSelector, ShaderCanvas, ControlPanel, Timeline.
 * Registers all 29 pattern engines on mount.
 */

import { useEffect } from 'react';
import { useAppStore } from './store';
import { createSimplexNoiseEngine } from '../features/noise-engine/simplexNoiseEngine';
import { createPerlinEngine } from '../features/perlin-engine/perlinEngine';
import { createFBMEngine } from '../features/fbm-engine/fbmEngine';
import { createRidgedEngine } from '../features/ridged-engine/ridgedEngine';
import { createDomainWarpEngine } from '../features/domain-warp-engine/domainWarpEngine';
import { createCurlNoiseEngine } from '../features/curl-noise-engine/curlNoiseEngine';
import { createVoronoiEngine } from '../features/voronoi-engine/voronoiEngine';
import { createCrackleEngine } from '../features/crackle-engine/crackleEngine';
import { createOrganicCellsEngine } from '../features/organic-cells-engine/organicCellsEngine';
import { createFlowEngine } from '../features/flow-engine/flowFieldEngine';
import { createMarbleEngine } from '../features/marble-engine/marbleEngine';
import { createFractalEngine } from '../features/fractal-engine/fractalEngine';
import { createJuliaEngine } from '../features/julia-engine/juliaEngine';
import { createFractalFlameEngine } from '../features/fractal-flame-engine/fractalFlameEngine';
import { createWavesEngine } from '../features/waves-engine/wavesEngine';
import { createMoireEngine } from '../features/moire-engine/moireEngine';
import { createSpiralWavesEngine } from '../features/spiral-waves-engine/spiralWavesEngine';
import { createHarmonicWavesEngine } from '../features/harmonic-waves-engine/harmonicWavesEngine';
import { createLissajousEngine } from '../features/lissajous-engine/lissajousEngine';
import { createKaleidoscopeEngine } from '../features/kaleidoscope-engine/kaleidoscopeEngine';
import { createPlasmaEngine } from '../features/plasma-engine/plasmaEngine';
import { createParticleFlowEngine } from '../features/particle-flow-engine/particleFlowEngine';
import { createReactionDiffusionEngine } from '../features/reaction-diffusion-engine/reactionDiffusionEngine';
import { createCurlFlowEngine } from '../features/curl-flow-engine/curlFlowEngine';
import { createHexGridEngine } from '../features/hex-grid-engine/hexGridEngine';
import { createIslamicTilesEngine } from '../features/islamic-tiles-engine/islamicTilesEngine';
import { createTruchetTilesEngine } from '../features/truchet-tiles-engine/truchetTilesEngine';
import { createPolarSpiralEngine } from '../features/polar-spiral-engine/polarSpiralEngine';
import { createSDFShapesEngine } from '../features/sdf-shapes-engine/sdfShapesEngine';
import { ShaderCanvas } from './ShaderCanvas';
import { Header } from '../ui/Header';
import { EngineSelector } from '../ui/EngineSelector';
import { ControlPanel } from '../ui/ControlPanel';
import { Timeline } from '../ui/Timeline';
import { AppreciationCard } from '../ui/AppreciationCard';
import './App.css';

export function App() {
  const setEngine = useAppStore((s) => s.setEngine);
  const registerEngine = useAppStore((s) => s.registerEngine);
  const showCard = useAppStore((s) => s.showCard);
  const setShowCard = useAppStore((s) => s.setShowCard);

  useEffect(() => {
    const engines = [
      // Noise
      createSimplexNoiseEngine(),
      createPerlinEngine(),
      createFBMEngine(),
      createRidgedEngine(),
      createDomainWarpEngine(),
      createCurlNoiseEngine(),
      
      // Cellular
      createVoronoiEngine(),
      createCrackleEngine(),
      createOrganicCellsEngine(),
      
      // Flow
      createFlowEngine(),
      createCurlFlowEngine(),
      createParticleFlowEngine(),
      
      // Surface
      createMarbleEngine(),
      
      // Waves / Interference
      createWavesEngine(),
      createMoireEngine(),
      createSpiralWavesEngine(),
      createHarmonicWavesEngine(),
      
      // Mathematical / Fractals / Curves / SDF
      createFractalEngine(),
      createJuliaEngine(),
      createFractalFlameEngine(),
      createLissajousEngine(),
      createPolarSpiralEngine(),
      createSDFShapesEngine(),
      
      // Geometry / Tiling
      createKaleidoscopeEngine(),
      createHexGridEngine(),
      createIslamicTilesEngine(),
      createTruchetTilesEngine(),
      
      // Textures / Plasma
      createPlasmaEngine(),
      
      // Simulations
      createReactionDiffusionEngine(),
    ];
    engines.forEach((engine) => registerEngine(engine));
    setEngine(engines[0]);
  }, [setEngine, registerEngine]);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <EngineSelector />
        <ShaderCanvas />
        <ControlPanel />
      </main>
      <Timeline />
      {showCard && <AppreciationCard onClose={() => setShowCard(false)} />}
    </div>
  );
}
