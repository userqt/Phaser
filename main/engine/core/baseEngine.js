window.BaseEngine = {
  scene: null,
  appPreload: null,
  appCreate: null,
  appUpdate: null,

  init(scene, app) {
    this.scene = scene;
    this.appPreload = app.preload || function () {};
    this.appCreate = app.create || function () {};
    this.appUpdate = app.update || function () {};
  },
  preload() {
    this.appPreload();
  },
  create() {
    this.appCreate();
  },
  update() {
    this.appUpdate();
  },
  clear() {
    
  },
  getEngineSceneMethods(app) {
    const engine = this;
    return {
      preload: function () {
        engine.init(this, app);
        engine.preload();
      },
      create: function () {
        engine.create();
      },
      update: function () {
        engine.update();
      },
    };
  },
};
