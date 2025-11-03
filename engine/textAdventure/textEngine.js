window.TextEngine = Object.create(BaseEngine);

TextEngine.input = null;
TextEngine.textY = 20;
TextEngine.inputQueue = [];
TextEngine.gameStart = false;
TextEngine.decorLayer = null;

TextEngine.showInput = function () 
{
    if (this.inputWrapper) 
    {
        return;
    }

    const rect = this.scene.game.canvas.getBoundingClientRect();

    this.inputWrapper = document.createElement("div");
    this.inputWrapper.style.position = "absolute";
    this.inputWrapper.style.left = rect.left + 20 + "px";
    this.inputWrapper.style.top = rect.top + 550 + "px";
    this.inputWrapper.style.display = "flex";
    this.inputWrapper.style.alignItems = "center";
    this.inputWrapper.style.backgroundColor = "#003300";
    this.inputWrapper.style.borderBottom = "2px solid #00ff00";
    this.inputWrapper.style.padding = "2px";

    const prompt = document.createElement("span");
    prompt.textContent = "■:>";
    prompt.style.color = "#00ff00";
    prompt.style.fontFamily = "Courier, monospace";
    prompt.style.fontSize = "16px";
    prompt.style.marginRight = "4px";

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.style.fontFamily = "Courier, monospace";
    this.input.style.fontSize = "16px";
    this.input.style.background = "none";
    this.input.style.color = "#00ff00";
    this.input.style.border = "none";
    this.input.style.outline = "none";
    this.input.style.flex = "1";

    this.inputWrapper.appendChild(prompt);
    this.inputWrapper.appendChild(this.input);
    document.body.appendChild(this.inputWrapper);

    this.input.focus();

    const engine = this;
    this.input.onkeydown = function (e) 
    {
        if (e.key === "Enter") 
        {
            engine.inputQueue.push(engine.input.value);
            engine.input.value = "";
        }
    };
};

TextEngine.writeLine = function (line) {
  this.scene.add.text(20, this.textY, line, {
    fontFamily: "Courier, monospace",
    fontSize: "18px",
    color: "#00ff00",
    lineHeight: 18,
  });

  //this.scene.add.bitmapText(20, this.textY, "pixelfont", line, 16);

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

  const children = [...this.scene.children.list]; // snapshot
  children.forEach((child) => {
    if (child !== this.decorLayer) {
      child.destroy();
    }
  });

  this.textY = 20;
};

TextEngine.startGame = function () {
  this.gameStart = true;
  this.inputQueue.push(" ");
  this.showInput();
};

TextEngine.preload = function () {
  BaseEngine.preload.call(this);

  let xmlBlob = new Blob([window.retroFont_XML], { type: "text/xml" });
  let xmlUrl = URL.createObjectURL(xmlBlob);

  this.scene.load.bitmapFont("pixelfont", window.retroFontBase64_PNG, xmlUrl);
  this.scene.load.on("complete", () => {});
};

TextEngine.create = function () {
  BaseEngine.create.call(this);

  this.createDecor();

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

TextEngine.createDecor = function () {
  if (this.decorLayer) {
    return;
  }

  const graphics = this.scene.add.graphics();
  const canvas = this.scene.game.canvas;

  graphics.lineStyle(4, 0x00ff00);
  graphics.strokeRect(0, 0, canvas.width, canvas.height);

  graphics.fillStyle(0x00ff00, 1);
  graphics.fillRect(0, 0, 10, 10);
  graphics.fillRect(canvas.width - 10, 0, 10, 10);
  graphics.fillRect(0, canvas.height - 10, 10, 10);
  graphics.fillRect(canvas.width - 10, canvas.height - 10, 10, 10);

  this.decorLayer = graphics;
};
