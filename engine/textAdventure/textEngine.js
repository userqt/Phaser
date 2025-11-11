window.TextEngine = Object.create(BaseEngine);

// input
TextEngine.input = null;

// ascii system
TextEngine.textY = 20;
TextEngine.inputQueue = [];
TextEngine.gameStart = false;
TextEngine.decorLayer = null;
TextEngine.boxes = {};
TextEngine.textContainer = null;

// pop ups
TextEngine.popupLayer = null;
TextEngine.popupStack = [];

// pixel art
TextEngine.pixelLayer = null;
TextEngine.greenPalette = [
  "#003300",
  "#006600",
  "#009900",
  "#00cc00",
  "#00ff00",
];

// fonts
if (/Windows/i.test(navigator.platform)) {
  TextEngine.globalFont = "Lucida Console, monospace";
} else {
  TextEngine.globalFont = "'Retrocide', monospace";
}

TextEngine.showInput = showInput;
/*
 * Displays the input box for user text input. Handles user input.
 */
function showInput() {
  if (this.inputWrapper) {
    return;
  }

  const game = this.scene.game;
  this.inputWrapper = document.createElement("div");
  this.inputWrapper.style.position = "absolute";
  this.inputWrapper.style.left = game.canvas.offsetLeft + 20 + "px";
  this.inputWrapper.style.top =
    game.canvas.offsetTop + game.canvas.height - 50 + "px";

  this.inputWrapper.style.display = "flex";
  this.inputWrapper.style.alignItems = "center";
  this.inputWrapper.style.backgroundColor = "#003300";
  this.inputWrapper.style.borderBottom = "2px solid #00ff00";
  this.inputWrapper.style.padding = "2px";

  const prompt = document.createElement("span");
  prompt.textContent = "■:>";
  prompt.style.color = "#00ff00";
  prompt.style.fontFamily = TextEngine.globalFont;
  prompt.style.fontSize = "16px";
  prompt.style.marginRight = "4px";

  this.input = document.createElement("input");
  this.input.type = "text";
  this.input.style.fontFamily = TextEngine.globalFont;
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
}

TextEngine.showArt = writeLines;
/*
 * Displays ASCII art line by line.
 * @param {string} artString - The ASCII art string with lines separated by newlines.
 */
function writeLines(artString, animate = false) {
  if (!artString) return;

  artString.split("\n").forEach((line) => {
    const fixedLine = line.replace(/\\/g, "\\ "); // compensate for backslash javascript internal replacement
    this.writeLine(fixedLine, animate);
  });
}

TextEngine.writeLine = writeLine;
/**
 * Writes a line of text to the container.
 * @param {string} line - Text to display.
 * @param {boolean} [animate=false] - If true, shows text character by character.
 */
function writeLine(line, animate = false) {
  if (!animate) {
    const textObj = this.scene.add.text(0, this.textY, "  " + line, {
      fontFamily: TextEngine.globalFont,
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
    fontFamily: TextEngine.globalFont,
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
}

TextEngine.readLine = readLine;
/**
 * Reads the next input from the queue.
 * @returns {string} - The next input in lowercase, or an empty string if none.
 */
function readLine() {
  if (this.hasInput()) {
    const value = this.inputQueue.shift();
    return value ? value.toLowerCase() : "";
  }
  return "";
}

TextEngine.readLineAsync = readLineAsync;
/**
 * Reads the next input from the queue asynchronously.
 * Waits until input is available.
 * @returns {Promise<string>} - Resolves with the next input in lowercase, or an empty string if none.
 */
function readLineAsync() {
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
}

TextEngine.hasInput = hasInput;
/**
 * Checks if there is any input in the queue.
 * @returns {boolean} - True if input is available, false otherwise.
 */
function hasInput() {
  return this.inputQueue.length > 0;
}

TextEngine.clear = clear;
/**
 * Clears all text from the main text container and resets the vertical position.
 */
function clear() {
  BaseEngine.clear.call(this);

  const children = [...this.textContainer.list];
  children.forEach((child) => {
    child.destroy();
  });

  this.textY = 20;
}

TextEngine.clearLastLine = clearLastLine;
/**
 * Removes the last line of text from the container and adjusts the vertical position.
 */
function clearLastLine() {
  const children = this.textContainer.list;
  if (children.length > 0) {
    const lastChild = children[children.length - 1];
    lastChild.destroy();
    this.textY -= 18;
  }
}

TextEngine.startGame = startGame;
/**
 * Starts the game by setting the start flag, adding initial input, and showing the input field.
 */
function startGame() {
  this.gameStart = true;
  this.inputQueue.push(" ");
  this.showInput();
}

TextEngine.preload = preload;
/**
 * Phaser's built-in preload function to load assets.
 */
function preload() {
  BaseEngine.preload.call(this);

  let xmlBlob = new Blob([window.retroFont_XML], { type: "text/xml" });
  let xmlUrl = URL.createObjectURL(xmlBlob);

  this.scene.load.bitmapFont("pixelfont", window.retroFontBase64_PNG, xmlUrl);
  this.scene.load.on("complete", () => {});
}

TextEngine.create = create;
/**
 * Phaser's built-in create method.
 * Sets up the game scene, including the main text container, decorations, and input handlers.
 * Handles both mobile (pointer) and desktop (keyboard) start interactions.
 * Also sets up automatic resize handling for the text engine.
 */
function create() {
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

  this.popupLayer = this.createBoxContainer(
    "popupLayer",
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
  }

  const desktopHandler = (e) => {
    if (e.key === "Enter") {
      document.removeEventListener("keydown", desktopHandler);
      startGameHandler();
    }
  };
  document.addEventListener("keydown", desktopHandler);

  TextEngine.handleResize();

  window.addEventListener("resize", () => {
    TextEngine.handleResize();
  });
}

TextEngine.update = update;
/*
 * Phaser's built-in update method.
 * Only processes updates if the game has started.
 */
function update() {
  if (!this.gameStart) {
    return;
  }

  BaseEngine.update.call(this);
}

TextEngine.createBoundDecoration = createBoundDecoration;

/*
 * Creates decorative borders around the game canvas.
 */
function createBoundDecoration() {
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
}

TextEngine.handleResize = handleResize;
/*
 * Handles resizing of the game canvas and adjusts text engine elements accordingly.
 */
function handleResize() {
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
}

TextEngine.resizeBoxes = resizeBoxes;
/**
 * Resizes the box containers to match the screen size.
 */
function resizeBoxes() {
  const scale = this.textContainer.scaleX; // relative scale: match textContainer scale
  for (const name in this.boxes) {
    const box = this.boxes[name];
    box.setScale(scale);
    box.x = box.origX * scale;
    box.y = box.origY * scale;
  }
}

TextEngine.createBoxContainer = createBoxContainer;
/**
 * Creates a text box container.
 * @param {string} name Unique box name.
 * @param {number} x X position.
 * @param {number} y Y position.
 * @param {number} width Box width.
 * @param {number} height Box height.
 * @param {string} label Optional label text.
 * @param {boolean} hasDeco Whether to show a border.
 * @param {boolean} hasBackground Whether to show background fill.
 * @returns {Phaser.GameObjects.Container & {
 *   origX: number,
 *   origY: number,
 *   origWidth: number,
 *   origHeight: number,
 *   boxWidth: number,
 *   boxHeight: number,
 *   lines: Phaser.GameObjects.Text[]
 * }}
 */
function createBoxContainer(
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
      fontFamily: TextEngine.globalFont,
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
}

TextEngine.writeLineToBox = writeLineToBox;
/*
 * Writes a line of text to a specified box container.
 * @param {string} name - The name of the target text box.
 * @param {string} line - The text to display.
 * @param {boolean} [animate=false] - If true, displays the text character by character.
 */
function writeLineToBox(name, line, animate = false) {
  const box = this.boxes[name];
  if (!box) {
    return;
  }

  const yOffset = box.lines.length * 18 + 10;

  const textObj = this.scene.add.text(10, yOffset, line, {
    fontFamily: TextEngine.globalFont,
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
}

TextEngine.clearBox = clearBox;
/**
 * Clears all text from a named text box.
 * @param {string} name - The name of the box to clear.
 */
function clearBox(name) {
  const box = this.boxes[name];
  if (!box) return;

  box.lines.forEach((line) => line.destroy());
  box.lines = [];
}

// POP UP SYSTEM /////////////////////////////////////////////////////////////////////////
TextEngine.showPopup = showPopup;
TextEngine.hidePopup = hidePopup;

/**
 * Displays a modal pop-up box with text and an OK button.
 * @param {string} [title='Alert'] - Optional title for the pop-up box.
 * @param {string} message - The text to display inside the pop-up.
 * @param {number} [x] - X position of the pop-up; defaults to centered.
 * @param {number} [y] - Y position of the pop-up; defaults to centered.
 * @param {number} [width] - Width of the pop-up box; defaults to 80% of game width.
 * @param {number} [height] - Height of the pop-up box.
 * @param {function} [onClose] - Function to call when the OK button is clicked.
 */
function showPopup(
  title = "Alert",
  message,
  x,
  y,
  width,
  height,
  onClose = () => {}
) {
  const gameWidth = this.scene.game.config.width;
  const gameHeight = this.scene.game.config.height;
  const boxWidth = Math.min(gameWidth * 0.8, width); // width or 80% of game width
  const boxHeight = height;
  const xPos = x ?? (gameWidth - boxWidth) / 2;
  const yPos = y ?? (gameHeight - height) / 2;

  // Create a semi-transparent overlay to block the background
  const overlay = this.scene.add.graphics({ depth: 99 }); // Use 'const'
  overlay.fillStyle(0x000000, 0.7);
  overlay.fillRect(0, 0, gameWidth, gameHeight);
  this.popupLayer.add(overlay);

  // Create the pop-up box container
  const boxName = `popup_${this.popupStack.length}`;
  const popupBox = this.createBoxContainer(
    boxName,
    xPos,
    yPos,
    boxWidth,
    boxHeight,
    title,
    true,
    true
  );

  this.popupLayer.add(popupBox);

  const availableWidth = boxWidth - 20;
  const popupText = this.scene.add.text(10, 10, message, {
    fontFamily: TextEngine.globalFont,
    fontSize: 16,
    color: "#00ff00",
    wordWrap: {
      width: availableWidth,
      useAdvancedWrap: true,
    },
  });
  popupBox.add(popupText);

  const buttonText = this.scene.add
    .text(boxWidth / 2, boxHeight - 30, " [ OK ] ", {
      fontFamily: TextEngine.globalFont,
      fontSize: 16,
      color: "#00ff00",
      backgroundColor: "#003300",
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      this.hidePopup();
      onClose();
    })
    .on("pointerover", () => buttonText.setColor("#ffffff"))
    .on("pointerout", () => buttonText.setColor("#00ff00"));

  popupBox.add(buttonText);

  this.popupStack.push({
    name: boxName,
    box: popupBox,
    overlay: overlay,
    onClose: onClose,
  });
}

/**
 * Hides and cleans up the pop-up box and overlay.
 */
function hidePopup() {
  if (this.popupStack.length === 0) {
    return;
  }

  const activePopup = this.popupStack.pop();

  if (activePopup) {
    if (this.boxes[activePopup.name]) {
      this.clearBox(activePopup.name);
      this.boxes[activePopup.name].destroy();
      delete this.boxes[activePopup.name];
    }

    activePopup.overlay.destroy();
  }
}

// PIXEL ART SYSTEM /////////////////////////////////////////////////////////////////////////
TextEngine.drawPixelArt = drawPixelArt;

function drawPixelArt(pixels, startX = 50, startY = 50) {
  pixels.forEach((row, rowIndex) => {
    row.forEach((colorIndex, colIndex) => {
      if (colorIndex !== 0) {
        // 0 = empty
        const color = this.greenPalette[colorIndex] || "#00ff00";
        const pixel = TextEngine.scene.add.text(
          startX + colIndex * 10,
          startY + rowIndex * 10,
          "■",
          { fontFamily: TextEngine.globalFont, fontSize: "10px", color: color }
        );

        if (!this.pixelLayer) {
          this.pixelLayer = this.createBoxContainer(
            "pixelLayer",
            0,
            0,
            this.scene.game.config.width,
            this.scene.game.config.height,
            "",
            false,
            false
          );
        }
        this.pixelLayer.add(pixel);
      }
    });
  });
}

// TODO - scrolling on mobile
// TODO - play sound system
// TODO - scene switching system
// TODO - simple animation of sprites
// TODO - combat system
