import Renderer from "./Renderer/Renderer";

var renderer: Renderer;

window.onload = async () => {
  // Create canvas and add event handler
  const main = document.querySelector('#main');
  const glCanvas: HTMLCanvasElement = main.querySelector('#glCanvas');

  renderer = new Renderer(glCanvas);
  await renderer.init();
  renderer.startRendering();
}

window.onresize = async () => {
  renderer.resize();
}