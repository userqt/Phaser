let TextEngine = {
  scene: null,
  input: null,
  textY: 20,
  inputQueue: [],
  appPreload: null,
  appCreate: null,
  appUpdate: null,
  gameStart: false,

  init(scene, app) {
    this.scene = scene;

    this.appPreload = app.preload || (() => {});
    this.appCreate = app.create || (() => {});
    this.appUpdate = app.update || (() => {});

    this.textY = 20;
  },

  showInput() {
    if (this.input) {
      return;
    }

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.style.position = "absolute";
    this.input.style.left =
      this.scene.game.canvas.getBoundingClientRect().left + 20 + "px";
    this.input.style.top =
      this.scene.game.canvas.getBoundingClientRect().top + 550 + "px";
    this.input.style.width = "400px";
    this.input.style.font = "16px Courier";
    this.input.style.backgroundColor = "#003300";
    this.input.style.color = "#00ff00";
    this.input.style.border = "none";
    this.input.style.borderBottom = "2px solid #00ff00";
    this.input.style.outline = "none";
    this.input.style.padding = "2px";
    document.body.appendChild(this.input);
    this.input.focus();

    let engine = this;
    this.input.onkeydown = function (e) {
      if (e.key === "Enter") {
        engine.inputQueue.push(engine.input.value);
        engine.input.value = "";
      }
    };
  },

  preload() {
    if (typeof this.appPreload === "function") {
      this.appPreload();
    }
  },

  create() {
    if (typeof this.appCreate === "function") {
      this.appCreate();
    }

    const startHandler = (e) => {
      if (e.key === "Enter") {
        document.removeEventListener("keydown", startHandler);
        this.clear();
        this.startGame();
      }
    };

    document.addEventListener("keydown", startHandler);

    const tapStartHandler = () => {
      this.scene.game.canvas.removeEventListener(
        "pointerdown",
        tapStartHandler
      );
      this.clear();
      this.startGame();
    };

    this.scene.game.canvas.addEventListener("pointerdown", tapStartHandler);
  },

  startGame() {
    this.gameStart = true;
    this.inputQueue.push(" ");

    this.showInput();
  },

  update() {
    if (!this.gameStart) {
      return;
    }

    if (typeof this.appUpdate === "function") {
      this.appUpdate();
    }
  },

  writeLine(line) {
    this.scene.add.text(20, this.textY, line, {
      font: "16px Courier",
      fill: "#00ff00",
    });
    this.textY += 18;
  },

  readLine() {
    if (this.inputQueue.length > 0) {
      let value = this.inputQueue.shift();
      this.clear();
      return value ? value.toLowerCase() : "";
    }
    return "";
  },

  readLineAsync() {
    return new Promise((resolve) => {
      const checkInput = () => {
        if (this.hasInput()) {
          resolve(this.readLine());
        } else {
          requestAnimationFrame(checkInput);
        }
      };
      checkInput();
    });
  },

  hasInput() {
    return this.inputQueue.length > 0;
  },

  clear() {
    this.scene.children.removeAll();
    this.textY = 20;
  },
};

window.getEngineSceneMethods = function (app) {
  return {
    preload: () => TextEngine.preload(),
    create: function () {
      TextEngine.init(this, app);
      TextEngine.create();
    },
    update: () => TextEngine.update(),
  };
};
