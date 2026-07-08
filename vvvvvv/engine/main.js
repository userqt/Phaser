const GameEngine = window.GameEngine;

const app = {
  preload: appPreload,
  create: appCreate,
  update: appUpdate,
};

new Phaser.Game({
  width: 1080,
  height: 640,
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  scene: window.GameEngine.getEngineSceneMethods(app),
});
