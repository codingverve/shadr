/**
 * Core Type Definitions for Shadr
 * All shared interfaces and types used across the application.
 */

/** Supported parameter types for pattern engine controls */
export type ParameterType = 'range' | 'color' | 'select' | 'toggle';

/** Defines a single adjustable parameter exposed by a pattern engine */
export interface ParameterDefinition {
  /** Unique key used for uniform mapping */
  key: string;
  /** Human-readable label */
  label: string;
  /** Parameter input type */
  type: ParameterType;
  /** Default value */
  defaultValue: number | string | boolean;
  /** Min value (for range type) */
  min?: number;
  /** Max value (for range type) */
  max?: number;
  /** Step increment (for range type) */
  step?: number;
  /** Options (for select type) */
  options?: string[];
}

/** Pattern category from the Blueprint */
export type PatternCategory = 'procedural' | 'mathematical' | 'geometry' | 'waves' | 'simulation' | 'textures' | 'experimental' | 'shader';

/** Sub-category for sidebar grouping */
export type PatternSubcategory = 'noise' | 'cellular' | 'flow' | 'surface' | 'fractals' | 'curves' | 'interference' | 'symmetry' | 'grids' | 'tiles' | 'polar' | 'sdf' | 'natural' | 'plasma' | 'optical' | 'reaction' | 'artistic';

/** Interface every pattern engine must implement */
export interface PatternEngine {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Category classification */
  category: PatternCategory;
  /** Sub-category for sidebar grouping (optional for backward compat) */
  subcategory?: PatternSubcategory;
  /** GLSL fragment shader source */
  fragmentShader: string;
  /** Parameters exposed to the UI */
  parameters: ParameterDefinition[];
  /** Initialize engine with a GL context */
  init(gl: WebGL2RenderingContext): void;
  /** Update uniforms each frame */
  update(time: number, params: Record<string, number | string | boolean>): void;
  /**
   * Set uniforms on the renderer for the current frame.
   * Each engine implements this to map its parameters to shader uniforms.
   */
  updateUniforms(renderer: import('../core/renderer').Renderer, params: Record<string, number | string | boolean>): void;
  /** Release GPU resources */
  dispose(): void;
}

/** Compiled shader program info */
export interface ShaderProgramInfo {
  program: WebGLProgram;
  uniformLocations: Map<string, WebGLUniformLocation>;
  attributeLocations: Map<string, number>;
}

/** Renderer state tracked internally */
export interface RendererState {
  isRunning: boolean;
  time: number;
  resolution: [number, number];
  mousePosition: [number, number];
}
