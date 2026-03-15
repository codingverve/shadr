/**
 * Post-Processing Pipeline
 * 
 * Manages FBO (framebuffer object) for off-screen rendering
 * and applies post-processing effects via a second pass.
 */

import { createShaderProgram, getUniformLocation } from './shaderCompiler';
import { FULLSCREEN_VERTEX_SHADER, QUAD_VERTEX_COUNT } from './fullscreenQuad';
import postProcessShader from '../shaders/post-process.frag?raw';

/** Post-processing effect parameters */
export interface PostFXParams {
  bloom: number;
  grain: number;
  chromaticAberration: number;
  vignette: number;
  kaleidoscope: boolean;
  kaleidoscopeSegments: number;
}

export const DEFAULT_POSTFX: PostFXParams = {
  bloom: 0,
  grain: 0,
  chromaticAberration: 0,
  vignette: 0.3,
  kaleidoscope: false,
  kaleidoscopeSegments: 6,
};

export class PostProcessor {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private fbo: WebGLFramebuffer;
  private sceneTexture: WebGLTexture;
  private width: number = 0;
  private height: number = 0;
  private uniformLocations: Map<string, WebGLUniformLocation | null> = new Map();

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    // Compile post-process program
    this.program = createShaderProgram(gl, FULLSCREEN_VERTEX_SHADER, postProcessShader);

    // Create FBO
    const fbo = gl.createFramebuffer();
    if (!fbo) throw new Error('Failed to create framebuffer');
    this.fbo = fbo;

    // Create scene texture
    const texture = gl.createTexture();
    if (!texture) throw new Error('Failed to create texture');
    this.sceneTexture = texture;

    // Initialize texture
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /** Ensure FBO matches current canvas size */
  resize(width: number, height: number): void {
    if (this.width === width && this.height === height) return;
    this.width = width;
    this.height = height;

    const { gl } = this;

    // Resize texture
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Attach texture to FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.sceneTexture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('[PostProcessor] Framebuffer incomplete:', status);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /** Bind FBO so engines render to texture */
  beginScene(): void {
    const { gl } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  }

  /** Unbind FBO and render post-processed result to screen */
  endScene(
    vao: WebGLVertexArrayObject,
    time: number,
    width: number,
    height: number,
    params: PostFXParams
  ): void {
    const { gl } = this;

    // Render to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    // Bind scene texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    this.setUniform1i('u_scene', 0);

    // Set uniforms
    this.setUniform2f('u_resolution', width, height);
    this.setUniform1f('u_time', time);
    this.setUniform1f('u_bloom', params.bloom);
    this.setUniform1f('u_grain', params.grain);
    this.setUniform1f('u_chromaticAberration', params.chromaticAberration);
    this.setUniform1f('u_vignette', params.vignette);
    this.setUniform1f('u_kaleidoscope', params.kaleidoscope ? 1.0 : 0.0);
    this.setUniform1f('u_kaleidoscopeSegments', params.kaleidoscopeSegments);

    // Draw
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, QUAD_VERTEX_COUNT);
    gl.bindVertexArray(null);
  }

  /** Check if any effects are active */
  isActive(params: PostFXParams): boolean {
    return params.bloom > 0.001 ||
           params.grain > 0.001 ||
           params.chromaticAberration > 0.001 ||
           params.vignette > 0.001 ||
           params.kaleidoscope;
  }

  /** Release GPU resources */
  dispose(): void {
    const { gl } = this;
    gl.deleteFramebuffer(this.fbo);
    gl.deleteTexture(this.sceneTexture);
    gl.deleteProgram(this.program);
    this.uniformLocations.clear();
  }

  // --- Private ---

  private setUniform1f(name: string, value: number): void {
    const loc = this.getUniform(name);
    if (loc !== null) this.gl.uniform1f(loc, value);
  }

  private setUniform2f(name: string, x: number, y: number): void {
    const loc = this.getUniform(name);
    if (loc !== null) this.gl.uniform2f(loc, x, y);
  }

  private setUniform1i(name: string, value: number): void {
    const loc = this.getUniform(name);
    if (loc !== null) this.gl.uniform1i(loc, value);
  }

  private getUniform(name: string): WebGLUniformLocation | null {
    if (this.uniformLocations.has(name)) {
      return this.uniformLocations.get(name)!;
    }
    const loc = getUniformLocation(this.gl, this.program, name);
    this.uniformLocations.set(name, loc);
    return loc;
  }
}
