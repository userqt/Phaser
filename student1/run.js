const app = {
  preload: appPreload,
  create: appCreate,
  update: appUpdate,
};

let game = new Phaser.Game({
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  scene: window.getEngineSceneMethods(app),
});
