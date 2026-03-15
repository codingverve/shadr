# 🤖 AI Playbook — Shader Pattern Generator

> **What is this?**
> This is the "employee handbook" for any AI agent working on this project.
> Read this file **first** before writing any code.

---

## 1. Project Mission

Build a **browser-based, GPU-accelerated shader pattern generator** that rivals tools like ShaderToy, Processing, and TouchDesigner — but with a designer-friendly UI inspired by Figma and Framer.

### Core Value Proposition
- **Real-time** pattern generation at 60fps
- **Beautiful by default** — every output should be visually stunning
- **Customizable** — expose deep controls without overwhelming users
- **Exportable** — PNG, SVG, MP4, WebM, GLSL, seamless tiles

---

## 2. Folder Structure

```
shader-pattern-generator/
├── app/              → App entry point, routing, global providers
├── core/             → Shared engine logic (renderer, shader compiler, math utils)
├── features/         → Feature modules (each pattern type, color system, effects)
├── ui/               → Reusable UI components (sliders, panels, color pickers)
├── shaders/          → Raw GLSL/shader files organized by pattern type
├── presets/          → Pattern preset JSON files
├── exports/          → Export logic (image, video, code exporters)
├── utils/            → General utilities (math, color conversion, formatting)
├── config/           → App configuration, constants, feature flags
├── docs/             → Project documentation, API docs
├── public/           → Static assets (fonts, icons, images)
└── antigravity/      → AI workspace
    └── antigravity/
        ├── prompts/      → AI playbooks and prompt templates (THIS FILE)
        ├── checkpoints/  → Summary.md and checkpoint snapshots
        ├── logs/         → Errors.md and debug logs
        └── context/      → Blueprint.md and project context files
```

### Rules for Folder Usage
- **Never put component code in `utils/`** — `utils/` is for pure functions only
- **One feature = one folder inside `features/`** (e.g. `features/noise-engine/`, `features/color-system/`)
- **Shader files go in `shaders/`**, not inline in JS/TS files
- **Presets are JSON**, not hardcoded — store in `presets/`
- **All exports go through `exports/`** — no export logic in UI components

---

## 3. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | React + Vite | Fast HMR, modern bundling |
| **Language** | TypeScript | Strict mode enabled |
| **Rendering** | WebGL2 / WebGPU | WebGL2 first, WebGPU as progressive enhancement |
| **Shaders** | GLSL (ES 3.0) | Fragment shaders for patterns |
| **State** | Zustand | Lightweight, no boilerplate |
| **UI Controls** | Custom components | Built in-house for maximum control |
| **Styling** | Vanilla CSS + CSS Variables | Dark theme, design tokens |
| **Animation** | requestAnimationFrame | Native loop, no libraries |
| **Math** | gl-matrix / custom | For vector/matrix operations |
| **Export** | Canvas API + MediaRecorder | For image/video export |

---

## 4. Coding Rules

### General
1. **Modular architecture** — small, focused files. Max ~200 lines per file.
2. **No `any` types** — use proper TypeScript types everywhere.
3. **Name things clearly** — `createNoisePattern()` not `cnp()`.
4. **Comments explain WHY, not WHAT** — code should be self-documenting.
5. **No magic numbers** — use named constants from `config/`.

### Shader Code
1. **One shader per file** in `shaders/` directory.
2. **Use `uniform` for all parameters** — never hardcode values in GLSL.
3. **Prefix uniforms clearly**: `u_time`, `u_resolution`, `u_mouse`, `u_color`, etc.
4. **Include header comments** in every shader: purpose, author, date.
5. **Performance first** — minimize branching, avoid `discard` when possible.

### Component Rules
1. **UI components are dumb** — no business logic, only presentation.
2. **Feature modules own their logic** — state, effects, and engine code live in `features/`.
3. **Props over global state** for component communication within a feature.
4. **Zustand for cross-feature state** — pattern selection, global settings, etc.

### File Naming
| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `PatternCanvas.tsx` |
| Utility | camelCase | `colorUtils.ts` |
| Shader | kebab-case | `perlin-noise.frag` |
| Config | camelCase | `appConfig.ts` |
| Preset | kebab-case | `neon-spiral.json` |
| Hook | camelCase, `use` prefix | `useShaderEngine.ts` |

---

## 5. Pattern Engine Architecture

Each pattern engine should follow this interface:

```typescript
interface PatternEngine {
  name: string;
  category: 'procedural' | 'mathematical' | 'geometry' | 'shader';
  
  // Shader source
  fragmentShader: string;
  
  // Configurable parameters exposed to UI
  parameters: ParameterDefinition[];
  
  // Initialize the engine
  init(gl: WebGL2RenderingContext): void;
  
  // Update uniforms each frame
  update(time: number, params: Record<string, number>): void;
  
  // Cleanup GPU resources
  dispose(): void;
}
```

### Categories from Blueprint
| Category | Patterns |
|----------|----------|
| **Procedural** | Perlin, Simplex, Worley noise, Fractals, Cellular, Waves, Marble, Voronoi, Reaction-diffusion, Flow fields |
| **Mathematical** | Trig patterns, Polar coords, Lissajous curves, Kaleidoscope, Moiré, Mandelbrot/Julia |
| **Geometry** | Grids, Hex, Triangle tessellation, Islamic patterns, Parametric curves |
| **Shader** | Raw GLSL, Ray marching, SDF |

---

## 6. Development Phases

### Phase 1 — Foundation *(current)*
- [ ] Project initialization (Vite + React + TypeScript)
- [ ] WebGL2 renderer setup in `core/`
- [ ] First pattern engine (Simplex Noise)
- [ ] Basic canvas with live preview
- [ ] Parameter controls (scale, speed, color)

### Phase 2 — Core Engines
- [ ] 5+ procedural pattern engines
- [ ] Color system with gradient editor
- [ ] Preset save/load system
- [ ] Basic export (PNG)

### Phase 3 — Visual Polish
- [ ] Post-processing effects (bloom, grain, chromatic aberration)
- [ ] Animation timeline
- [ ] Full UI layout (left panel, canvas, right panel, bottom timeline)
- [ ] Video export (MP4/WebM)

### Phase 4 — Advanced
- [ ] Interactive modes (mouse, audio reactivity)
- [ ] Geometry & symmetry tools
- [ ] Mathematical pattern engines
- [ ] Seamless tile generation

### Phase 5 — AI & Community
- [ ] Prompt-to-pattern generation
- [ ] Style transfer
- [ ] Inspiration engine / randomize
- [ ] Community presets

---

## 7. Quality Checklist

Before committing any feature, verify:

- [ ] Runs at 60fps on mid-range hardware
- [ ] No `console.error` or WebGL warnings
- [ ] TypeScript compiles with `--strict`
- [ ] GPU resources are properly disposed on unmount
- [ ] Parameters update in real-time without frame drops
- [ ] Works in Chrome and Firefox (minimum)

---

## 8. Key Context Files

| File | Location | Purpose |
|------|----------|---------|
| `Blueprint.md` | `context/` | Full feature specification (18 sections) |
| `Errors.md` | `logs/` | Error log with cause, fix, and notes |
| `Summary.md` | `checkpoints/` | Checkpoint tracker and source of truth |
| `playbook.md` | `prompts/` | **This file** — AI handbook |

---

> **Remember:** Every shader should be **beautiful by default**.
> If it doesn't look stunning with zero customization, it's not ready.
