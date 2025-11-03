window.GameEngine = window.Engines.TextEngine;
const GameEngine = window.GameEngine;

const app = {
  preload: appPreload,
  create: appCreate,
  update: appUpdate,
};

new Phaser.Game({
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  scene: window.GameEngine.getEngineSceneMethods(app),
});
