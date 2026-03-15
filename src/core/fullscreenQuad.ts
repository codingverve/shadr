/**
 * Fullscreen Quad
 * Creates a simple 2-triangle quad that covers the entire viewport.
 * Used as the geometry for all 2D fragment shader rendering.
 */

/** Shared vertex shader for all fullscreen quad rendering */
export const FULLSCREEN_VERTEX_SHADER = `#version 300 es
precision highp float;

// Fullscreen quad positions (2 triangles covering clip space)
in vec2 a_position;
out vec2 v_uv;

void main() {
  // Map position from [-1,1] to UV [0,1]
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/** Vertex data for the fullscreen quad: 2 triangles, 6 vertices */
const QUAD_VERTICES = new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1,
]);

/**
 * Create and bind the fullscreen quad vertex buffer.
 * Returns the VAO to be bound before drawing.
 */
export function createFullscreenQuad(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();
  if (!vao) throw new Error('Failed to create VAO');

  const vbo = gl.createBuffer();
  if (!vbo) throw new Error('Failed to create VBO');

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

  // a_position at location 0
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vao;
}

/** Number of vertices in the fullscreen quad */
export const QUAD_VERTEX_COUNT = 6;
