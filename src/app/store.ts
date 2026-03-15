/**
 * Application State Store
 * 
 * Zustand store managing the active pattern engine,
 * parameter values, playback state, post-processing, and timeline.
 */

import { create } from 'zustand';
import type { ParameterDefinition, PatternEngine } from '../core/types';
import type { PostFXParams } from '../core/postProcessor';
import { DEFAULT_POSTFX } from '../core/postProcessor';

interface AppState {
  /** Currently active pattern engine */
  activeEngine: PatternEngine | null;
  /** Current parameter values keyed by uniform name */
  parameters: Record<string, number | string | boolean>;
  /** Whether the animation is playing */
  isPlaying: boolean;
  /** Available engines registry */
  engines: PatternEngine[];

  // - [/] Precision Refinement (Split-view editor, Granular colors, 1:1 Rounded Export parity)

  /** Post-processing effect params */
  postFx: PostFXParams;

  /** Timeline state */
  timelineSpeed: number;
  timelineDuration: number;
  isLooping: boolean;

  // Actions
  setEngine: (engine: PatternEngine) => void;
  setParameter: (key: string, value: number | string | boolean) => void;
  togglePlay: () => void;
  registerEngine: (engine: PatternEngine) => void;
  resetParameters: () => void;
  setPostFx: (key: keyof PostFXParams, value: number) => void;
  setPostFxBool: (key: keyof PostFXParams, value: boolean) => void;
  resetPostFx: () => void;
  setTimelineSpeed: (speed: number) => void;
  setTimelineDuration: (duration: number) => void;
  toggleLooping: () => void;
  
  /** Recording countdown timer (0 if not active) */
  recordingCountdown: number;
  setRecordingCountdown: (val: number) => void;

  /** Card visibility */
  showCard: boolean;
  setShowCard: (val: boolean) => void;
}

/**
 * Initialize parameter values from an engine's parameter definitions.
 */
function initParams(params: ParameterDefinition[]): Record<string, number | string | boolean> {
  const values: Record<string, number | string | boolean> = {};
  for (const param of params) {
    values[param.key] = param.defaultValue;
  }
  return values;
}

export const useAppStore = create<AppState>((set) => ({
  activeEngine: null,
  parameters: {},
  isPlaying: true,
  engines: [],
  postFx: { ...DEFAULT_POSTFX },
  timelineSpeed: 1.0,
  timelineDuration: 30,
  isLooping: true,
  recordingCountdown: 0,
  showCard: false,

  setEngine: (engine) =>
    set({
      activeEngine: engine,
      parameters: initParams(engine.parameters),
    }),

  setParameter: (key, value) =>
    set((state) => ({
      parameters: { ...state.parameters, [key]: value },
    })),

  togglePlay: () =>
    set((state) => ({ isPlaying: !state.isPlaying })),

  registerEngine: (engine) =>
    set((state) => {
      if (state.engines.some((e) => e.id === engine.id)) return state;
      return { engines: [...state.engines, engine] };
    }),

  resetParameters: () =>
    set((state) => {
      if (!state.activeEngine) return state;
      return { parameters: initParams(state.activeEngine.parameters) };
    }),

  setPostFx: (key, value) =>
    set((state) => ({
      postFx: { ...state.postFx, [key]: value },
    })),

  setPostFxBool: (key, value) =>
    set((state) => ({
      postFx: { ...state.postFx, [key]: value },
    })),

  resetPostFx: () =>
    set({ postFx: { ...DEFAULT_POSTFX } }),

  setTimelineSpeed: (speed) => set({ timelineSpeed: speed }),
  setTimelineDuration: (duration) => set({ timelineDuration: duration }),
  toggleLooping: () => set((state) => ({ isLooping: !state.isLooping })),
  setRecordingCountdown: (val) => set({ recordingCountdown: val }),
  setShowCard: (val) => set({ showCard: val }),
}));
