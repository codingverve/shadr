/**
 * WebGL2 Renderer
 * Manages the WebGL2 context, shader programs, and the render loop.
 * Renders fullscreen fragment shaders with uniform updates every frame.
 */

import { createShaderProgram, getUniformLocation } from './shaderCompiler';
import { createFullscreenQuad, FULLSCREEN_VERTEX_SHADER, QUAD_VERTEX_COUNT } from './fullscreenQuad';

export class Renderer {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private uniformCache: Map<string, WebGLUniformLocation | null> = new Map();

  // Mouse tracking
  private mouseX: number = 0;
  private mouseY: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      throw new Error('WebGL2 is not supported in this browser');
    }

    this.gl = gl;
    this.vao = createFullscreenQuad(gl);
    this.handleResize();

    // Track mouse for interactive patterns
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Load a new fragment shader and compile it with the fullscreen vertex shader.
   */
  loadShader(fragmentSource: string): void {
    const { gl } = this;

    // Clean up previous program
    if (this.program) {
      gl.deleteProgram(this.program);
      this.uniformCache.clear();
    }

    this.program = createShaderProgram(gl, FULLSCREEN_VERTEX_SHADER, fragmentSource);

    // Bind a_position to location 0
    gl.bindAttribLocation(this.program, 0, 'a_position');
  }

  /**
   * Start the render loop.
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
  }

  /**
   * Stop the render loop.
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Set a float uniform on the current program.
   */
  setUniform1f(name: string, value: number): void {
    const location = this.getCachedUniform(name);
    if (location !== null) {
      this.gl.uniform1f(location, value);
    }
  }

  /**
   * Set a vec2 uniform on the current program.
   */
  setUniform2f(name: string, x: number, y: number): void {
    const location = this.getCachedUniform(name);
    if (location !== null) {
      this.gl.uniform2f(location, x, y);
    }
  }

  /**
   * Set a vec3 uniform (used for colors).
   */
  setUniform3f(name: string, x: number, y: number, z: number): void {
    const location = this.getCachedUniform(name);
    if (location !== null) {
      this.gl.uniform3f(location, x, y, z);
    }
  }

  /**
   * Set an integer uniform.
   */
  setUniform1i(name: string, value: number): void {
    const location = this.getCachedUniform(name);
    if (location !== null) {
      this.gl.uniform1i(location, value);
    }
  }

  /**
   * Render a single frame with the given parameter update callback.
   */
  renderFrame(
    time: number,
    updateUniforms: (renderer: Renderer, time: number) => void
  ): void {
    const { gl, canvas } = this;

    if (!this.program || !this.vao) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    // Set built-in uniforms
    this.setUniform1f('u_time', time);
    this.setUniform2f('u_resolution', canvas.width, canvas.height);
    this.setUniform2f('u_mouse', this.mouseX, this.mouseY);

    // Let the engine set its own uniforms
    updateUniforms(this, time);

    // Draw the fullscreen quad
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, QUAD_VERTEX_COUNT);
    gl.bindVertexArray(null);
  }

  /**
   * Handle canvas resize to match display size.
   */
  handleResize = (): void => {
    const { canvas } = this;
    const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2x for performance
    const displayWidth = Math.floor(canvas.clientWidth * dpr);
    const displayHeight = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  };

  /**
   * Release all GPU resources.
   */
  dispose(): void {
    this.stop();

    const { gl } = this;

    if (this.program) {
      gl.deleteProgram(this.program);
      this.program = null;
    }

    if (this.vao) {
      gl.deleteVertexArray(this.vao);
      this.vao = null;
    }

    this.uniformCache.clear();
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.handleResize);
  }

  /** Get the underlying WebGL2 context */
  getContext(): WebGL2RenderingContext {
    return this.gl;
  }

  /** Get the shared fullscreen quad VAO */
  getVAO(): WebGLVertexArrayObject | null {
    return this.vao;
  }

  /** Get the canvas element */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  // --- Private Methods ---

  private tick = (): void => {
    if (!this.isRunning) return;
    this.handleResize();
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private onMouseMove = (e: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = (e.clientX - rect.left) / rect.width;
    this.mouseY = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y for GL coords
  };

  private getCachedUniform(name: string): WebGLUniformLocation | null {
    if (this.uniformCache.has(name)) {
      return this.uniformCache.get(name)!;
    }
    if (!this.program) return null;
    const location = getUniformLocation(this.gl, this.program, name);
    this.uniformCache.set(name, location);
    return location;
  }
}
