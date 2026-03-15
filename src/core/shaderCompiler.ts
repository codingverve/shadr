/**
 * Shader Compiler
 * Compiles GLSL vertex + fragment shaders into a WebGLProgram.
 * Provides detailed error logging with line numbers for debugging.
 */

/**
 * Compile a single shader (vertex or fragment) from source.
 */
function compileShader(
  gl: WebGL2RenderingContext,
  source: string,
  type: GLenum
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error(`Failed to create shader of type ${type}`);
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || 'Unknown error';
    const typeName = type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT';

    // Format error with line numbers for easier debugging
    const lines = source.split('\n');
    const numberedSource = lines
      .map((line, i) => `${(i + 1).toString().padStart(4)}: ${line}`)
      .join('\n');

    console.error(`[ShaderCompiler] ${typeName} shader compilation failed:\n${info}\n\nSource:\n${numberedSource}`);

    gl.deleteShader(shader);
    throw new Error(`${typeName} shader compilation failed: ${info}`);
  }

  return shader;
}

/**
 * Create a WebGL program from vertex and fragment shader sources.
 * Returns the linked program ready for use.
 */
export function createShaderProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram {
  const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error('Failed to create WebGL program');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) || 'Unknown error';
    console.error(`[ShaderCompiler] Program linking failed: ${info}`);

    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(`Program linking failed: ${info}`);
  }

  // Shaders can be detached and deleted after linking
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

/**
 * Get the location of a uniform, with caching support.
 */
export function getUniformLocation(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string
): WebGLUniformLocation | null {
  return gl.getUniformLocation(program, name);
}
