import Renderer from "./Renderer/Renderer";

window.onload = async () => {
  // Create canvas and add event handler
  const main = document.querySelector('#main');
  const glCanvas: HTMLCanvasElement = main.querySelector('#glCanvas');
  glCanvas.width = 640;
  glCanvas.height = 640;
  const aspect_ratio = glCanvas.width / glCanvas.height;

  // Request WebGL context
  const gl = glCanvas.getContext("webgl2", {
    preserveDrawingBuffer: true,
    alpha: true,
    antialias: true,
    depth: true,
    powerPreference: "high-performance",
    premultipliedAlpha: false,
    stencil: true
  });
  if (!gl) return null;

  const renderer = new Renderer(gl, aspect_ratio);
  await renderer.init();
}