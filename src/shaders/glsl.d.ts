/**
 * TypeScript declaration for GLSL shader file imports.
 * Allows importing .frag and .vert files as raw strings via ?raw.
 */

declare module '*.frag?raw' {
  const shader: string;
  export default shader;
}

declare module '*.vert?raw' {
  const shader: string;
  export default shader;
}

declare module '*.glsl?raw' {
  const shader: string;
  export default shader;
}
