window.TextEngine = Object.create(BaseEngine);

TextEngine.input = null;
TextEngine.textY = 20;
TextEngine.inputQueue = [];
TextEngine.gameStart = false;
TextEngine.decorLayer = null;
TextEngine.boxes = {};
TextEngine.textContainer = null;
TextEngine.globalFont = "Lucida Console";

TextEngine.showInput = function () {
  if (this.inputWrapper) {
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
  prompt.style.fontFamily = this.globalFont;
  prompt.style.fontSize = "16px";
  prompt.style.marginRight = "4px";

  this.input = document.createElement("input");
  this.input.type = "text";
  this.input.style.fontFamily = this.globalFont;
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
  this.input.onkeydown = function (e) {
    if (e.key === "Enter") {
      engine.inputQueue.push(engine.input.value);
      engine.input.value = "";
    }
  };
};

TextEngine.writeLine = function (line, animate = false) {
  if (!animate) {
    const textObj = this.scene.add.text(0, this.textY, line, {
      fontFamily: this.globalFont,
      fontSize: "18px",
      color: "#00ff00",
      lineHeight: 18,
    });

    textObj.origY = this.textY;
    this.textContainer.add(textObj);
    this.textY += 18;
    return;
  }

  let charIndex = 0;
  const textObj = this.scene.add.text(0, this.textY, "", {
    fontFamily: this.globalFont,
    fontSize: "18px",
    color: "#00ff00",
    lineHeight: 18,
  });
  textObj.origY = this.textY;
  this.textContainer.add(textObj);

  const speed = 30;
  const addChar = () => {
    if (charIndex < line.length) {
      textObj.text += line[charIndex];
      charIndex++;
      setTimeout(addChar, speed);
    } else {
      this.textY += 18;
    }
  };
  addChar();
};

TextEngine.readLine = function () {
  if (this.hasInput()) {
    const value = this.inputQueue.shift();
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

  const children = [...this.textContainer.list];
  children.forEach((child) => {
    child.destroy();
  });

  this.textY = 20;
};

TextEngine.clearLastLine = function () {
  const children = this.textContainer.list;
  if (children.length > 0) {
    const lastChild = children[children.length - 1];
    lastChild.destroy();
    this.textY -= 18;
  }
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
  // this.textContainer = this.scene.add.container(0, 0);

  this.textContainer = this.createBoxContainer(
    "main",
    0,
    0,
    this.scene.game.config.width,
    this.scene.game.config.height,
    "",
    false,
    false
  );

  BaseEngine.create.call(this); // this calls the appCreate function

  this.createBoundDecoration();

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

  TextEngine.handleResize();

  window.addEventListener("resize", () => {
    TextEngine.handleResize();
  });
};

TextEngine.update = function () {
  if (!this.gameStart) {
    return;
  }

  BaseEngine.update.call(this);
};

TextEngine.createBoundDecoration = function () {
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

TextEngine.handleResize = function () {
  const game = this.scene.game;
  const parent = game.canvas.parentNode;
  const w = parent.clientWidth;
  const h = parent.clientHeight;

  game.scale.resize(w, h);
  game.canvas.style.width = w + "px";
  game.canvas.style.height = h + "px";

  if (this.inputWrapper) {
    this.inputWrapper.style.left = game.canvas.offsetLeft + 20 + "px";
    this.inputWrapper.style.top = game.canvas.offsetTop + h - 50 + "px";
    this.inputWrapper.style.width = w - 40 + "px";
  }

  if (this.decorLayer) {
    const children = this.scene.children.list.filter(
      (c) => c !== this.decorLayer
    );
    this.decorLayer.clear();
    this.createBoundDecoration();

    children.forEach((child) => {
      if (child.type === "Text") {
        child.x *= scaleX;
        child.y *= scaleY;
      }
    });
  }

  // redraw the text container
  const scale = w / game.config.width;
  this.textContainer.setScale(scale);
  this.textContainer.x = 0;
  this.textContainer.y = 0;

  this.resizeBoxes();
};

TextEngine.resizeBoxes = function () {
  const scale = this.textContainer.scaleX; // relative scale: match textContainer scale
  for (const name in this.boxes) {
    const box = this.boxes[name];
    box.setScale(scale);
    box.x = box.origX * scale;
    box.y = box.origY * scale;
  }
};

TextEngine.createBoxContainer = function (
  name,
  x,
  y,
  width,
  height,
  label,
  hasDeco,
  hasBackground
) {
  if (!this.boxes) {
    this.boxes = {};
  }

  const container = this.scene.add.container(x, y);
  container.origX = x;
  container.origY = y;
  container.origWidth = width;
  container.origHeight = height;
  container.boxWidth = width;
  container.boxHeight = height;
  container.lines = [];

  if (hasBackground) {
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x003300, 0.8);
    bg.fillRect(0, 0, width, height);
    container.add(bg);
  }

  if (hasDeco) {
    const border = this.scene.add.graphics();
    border.lineStyle(2, 0x00ff00);
    border.strokeRect(0, 0, width, height);
    container.add(border);
  }

  if (label) {
    // Label
    const labelText = this.scene.add.text(0, 0, label, {
      fontFamily: this.globalFont,
      fontSize: 16,
      color: "#00ff00",
      backgroundColor: "0x003300",
    });

    // Position label centered with padding
    const padding = 6;
    labelText.x = padding;
    labelText.y = -labelText.height / 2; // slightly above top border
    container.add(labelText);
  }

  this.boxes[name] = container;
  return container;
};

TextEngine.writeLineToBox = function (name, line, animate = false) {
  const box = this.boxes[name];
  if (!box) {
    return;
  }

  const yOffset = box.lines.length * 18 + 10;

  const textObj = this.scene.add.text(10, yOffset, line, {
    fontFamily: this.globalFont,
    fontSize: 16,
    color: "#00ff00",
  });

  box.add(textObj);
  box.lines.push(textObj);

  if (animate) {
    textObj.text = "";
    let charIndex = 0;
    const addChar = () => {
      if (charIndex < line.length) {
        textObj.text += line[charIndex];
        charIndex++;
        setTimeout(addChar, 30);
      }
    };
    addChar();
  }
};

TextEngine.clearBox = function (name) {
  const box = this.boxes[name];
  if (!box) return;

  box.lines.forEach((line) => line.destroy());
  box.lines = [];
};

// TODO - save system
// TODO - pop up system (nested popups)
// TODO - play sound system
// TODO - simple retro graphics system to display pixel art with limited palette
// TODO - scene switching system
// TODO - simple animation of sprites
