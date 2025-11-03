window.TextEngine = Object.create(BaseEngine);

TextEngine.input = null;
TextEngine.textY = 20;
TextEngine.inputQueue = [];
TextEngine.gameStart = false;

TextEngine.showInput = function () {
  if (this.input) return;

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

  const engine = this;
  this.input.onkeydown = function (e) {
    if (e.key === "Enter") {
      engine.inputQueue.push(engine.input.value);
      engine.input.value = "";
    }
  };
};

TextEngine.startGame = function () {
  this.gameStart = true;
  this.inputQueue.push(" ");
  this.showInput();
};

TextEngine.writeLine = function (line) {
  this.scene.add.text(20, this.textY, line, {
    font: "16px Courier",
    fill: "#00ff00",
  });
  this.textY += 18;
};

TextEngine.readLine = function () {
  if (this.hasInput()) {
    const value = this.inputQueue.shift();
    this.clear();
    return value ? value.toLowerCase() : "";
  }
  return "";
};

TextEngine.readLineAsync = function () {
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
};

TextEngine.hasInput = function () {
  return this.inputQueue.length > 0;
};

TextEngine.clear = function () {
  BaseEngine.clear.call(this);
  this.textY = 20;
};

TextEngine.create = function () {
  BaseEngine.create.call(this);

  const startGameHandler = () => {
    this.clear();
    this.startGame();
  };

  if (/Mobi|Android/i.test(navigator.userAgent)) {
    const mobileHandler = (e) => {
      this.scene.game.canvas.removeEventListener("pointerdown", mobileHandler);
      startGameHandler();
    };
    this.scene.game.canvas.addEventListener("pointerdown", mobileHandler);
  } else {
    const desktopHandler = (e) => {
      if (e.key === "Enter") {
        document.removeEventListener("keydown", desktopHandler);
        startGameHandler();
      }
    };
    document.addEventListener("keydown", desktopHandler);
  }
};

TextEngine.update = function () {
  if (!this.gameStart) {
    return;
  }

  BaseEngine.update.call(this);
};
