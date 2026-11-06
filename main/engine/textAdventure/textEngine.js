class TextEngine extends BaseEngine {
  constructor() {
    super();
    this.input = null;

    // ascii system
    this.textY = 20;
    this.inputQueue = [];
    this.pendingResolvers = [];
    this.gameStart = false;
    this.decorLayer = null;
    this.boxes = {};
    this.textContainer = null;

    // pop ups
    this.popupLayer = null;
    this.popupStack = [];

    // pixel art
    this.pixelLayer = null;
    this.greenPalette = ["#003300", "#006600", "#009900", "#00cc00", "#00ff00"];

    // fonts
    if (/Windows/i.test(navigator.platform)) {
      this.globalFont = "Lucida Console, monospace";
    } else {
      this.globalFont = "RetrocideMono, monospace";
    }
    // misc
    this.inputWrapper = null;
  }

  /*
   * Displays the input box for user text input. Handles user input.
   */
  showInput() {
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
        engine.flushInputQueue();
      }
    };
  }

  /*
   * Displays ASCII art line by line.
   * @param {string} artString - The ASCII art string with lines separated by newlines.
   */
  writeLines(artString, animate = false) {
    if (!artString) return;

    artString.split("\n").forEach((line) => {
      this.writeLine(line, animate);
    });
  }

  /**
   * Writes a line of text to the container.
   * @param {string} line - Text to display.
   * @param {boolean} [animate=false] - If true, shows text character by character.
   */
  writeLine(line, animate = false) {
    const textObj = this.scene.add.text(0, this.textY, animate ? "" : "  " + line, {
      fontFamily: this.globalFont,
      fontSize: "18px",
      color: "#00ff00",
      lineHeight: 18,
    });

    this.textContainer.add(textObj);
    this.textY += 18;
    
    if (animate) {
      this.animateText(textObj, line, 30);
    }
  }

  /**
   * Types text character by character.
   * Stops safely if the text object is destroyed while the timer is pending.
   */
  animateText(textObj, text, speed = 30) {
    let charIndex = 0;

    const addChar = () => {
      if (!textObj.active || !textObj.scene) {
        textObj.animTimer = null;
        return;
      }

      if (charIndex < text.length) {
        textObj.text += text[charIndex];
        charIndex++;
        textObj.animTimer = setTimeout(addChar, speed);
      } else {
        textObj.animTimer = null;
      }
    };

    addChar();
  }

  /**
   * Cancels a pending character-by-character animation for a text object.
   */
  stopTextAnimation(textObj) {
    if (textObj && textObj.animTimer) {
      clearTimeout(textObj.animTimer);
      textObj.animTimer = null;
    }
  }

  /**
   * Reads the next input from the queue.
   * @returns {string} - The next input in lowercase, or an empty string if none.
   */
  readLine() {
    if (this.hasInput()) {
      const value = this.inputQueue.shift();
      return value ? value.trim().toLowerCase() : "";
    }
    return "";
  }

  /**
   * Reads the next input from the queue asynchronously.
   * Resolves as soon as input is submitted (no polling).
   * @returns {Promise<string>} - Resolves with the next input in lowercase.
   */
  readLineAsync() {
    return new Promise((resolve) => {
      this.pendingResolvers.push(resolve);
      this.flushInputQueue();
    });
  }

  /**
   * Resolves waiting readLineAsync() calls with queued input, in order.
   */
  flushInputQueue() {
    while (this.pendingResolvers.length > 0 && this.inputQueue.length > 0) {
      const resolve = this.pendingResolvers.shift();
      resolve(this.readLine());
    }
  }

  /**
   * Checks if there is any input in the queue.
   * @returns {boolean} - True if input is available, false otherwise.
   */
  hasInput() {
    return this.inputQueue.length > 0;
  }

  /**
   * Clears all text from the main text container and resets the vertical position.
   */
  clear() {
    super.clear();

    const children = [...this.textContainer.list];
    children.forEach((child) => {
      this.stopTextAnimation(child);
      child.destroy();
    });

    this.textY = 20;
    this.clearTransientArt();
  }

  /**
   * Removes one-shot layers (animated art, pixel art and open popups).
   * Named UI boxes (HUD) are kept.
   */
  clearTransientArt() {
    if (this.boxes.anim) {
      this.boxes.anim.destroy();
      delete this.boxes.anim;
    }

    if (this.pixelLayer) {
      this.pixelLayer.destroy();
      delete this.boxes.pixelLayer;
      this.pixelLayer = null;
    }

    while (this.popupStack.length > 0) {
      this.hidePopup();
    }
  }

  /**
   * Removes the last line of text from the container and adjusts the vertical position.
   */
  clearLastLine() {
    const children = this.textContainer.list;
    if (children.length > 0) {
      const lastChild = children[children.length - 1];
      this.stopTextAnimation(lastChild);
      lastChild.destroy();
      this.textY -= 18;
    }
  }

  /**
   * Starts the game by setting the start flag, adding initial input, and showing the input field.
   */
  startGame() {
    this.gameStart = true;
    this.inputQueue.push(" ");
    this.showInput();
    this.flushInputQueue();
  }

  /**
   * Phaser's built-in preload function to load assets.
   */
  preload() {
    super.preload();
  }

  /**
   * Phaser's built-in create method.
   * Sets up the game scene, including the main text container, decorations, and input handlers.
   * Handles both mobile (pointer) and desktop (keyboard) start interactions.
   * Also sets up automatic resize handling for the text engine.
   */
  create() {
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

    super.create(); // this calls the appCreate function

    const startGameHandler = () => {
      this.clear();
      this.startGame();
    };

    if (/Mobi|Android/i.test(navigator.userAgent)) {
      const mobileHandler = (e) => {
        this.scene.game.canvas.removeEventListener(
          "pointerdown",
          mobileHandler
        );
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

    this.handleResize();

    this._resizeHandler = () => this.handleResize();
    window.addEventListener("resize", this._resizeHandler);

    this.scene.events.once("shutdown", () => {
      this.pendingResolvers.forEach((resolve) => resolve(""));
      this.pendingResolvers = [];

      window.removeEventListener("resize", this._resizeHandler);

      if (this.inputWrapper) {
        this.inputWrapper.remove();
        this.inputWrapper = null;
      }
    });
  }

  /*
   * Phaser's built-in update method.
   * Only processes updates if the game has started.
   */
  update() {
    if (!this.gameStart) {
      return;
    }

    super.update();
  }

  /*
   * Creates decorative borders around the game canvas.
   */
  createBoundDecoration() {
    const canvas = this.scene.game.canvas;

    if (!this.decorLayer) {
      this.decorLayer = this.scene.add.graphics();
    }

    const graphics = this.decorLayer;
    graphics.clear();

    graphics.lineStyle(4, 0x00ff00);
    graphics.strokeRect(0, 0, canvas.width, canvas.height);

    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(0, 0, 10, 10);
    graphics.fillRect(canvas.width - 10, 0, 10, 10);
    graphics.fillRect(0, canvas.height - 10, 10, 10);
    graphics.fillRect(canvas.width - 10, canvas.height - 10, 10, 10);
  }

  /*
   * Handles resizing of the game canvas and adjusts text engine elements accordingly.
   */
  handleResize() {
    const game = this.scene.game;
    const parent = game.canvas.parentNode;
    const w = Math.max(1, parent.clientWidth);
    const h = Math.max(1, document.documentElement.clientHeight);

    game.scale.resize(w, h);
    game.canvas.style.width = w + "px";
    game.canvas.style.height = h + "px";

    if (this.inputWrapper) {
      this.inputWrapper.style.left = game.canvas.offsetLeft + 20 + "px";
      this.inputWrapper.style.top = game.canvas.offsetTop + h - 50 + "px";
      this.inputWrapper.style.width = w - 40 + "px";
    }

    this.createBoundDecoration();

    // redraw the text container
    const scale = w / game.config.width;
    this.textContainer.setScale(scale);
    this.textContainer.x = 0;
    this.textContainer.y = 0;

    this.resizeBoxes(scale);
  }

  /**
   * Resizes the box containers to match the screen size.
   * @param {number} [scale] - Scale to apply; defaults to the text container scale.
   */
  resizeBoxes(scale = this.textContainer ? this.textContainer.scaleX : 1) {
    for (const name in this.boxes) {
      this.applyBoxScale(this.boxes[name], scale);
    }
  }

  /**
   * Applies the current screen scale to a box container.
   * @param {Phaser.GameObjects.Container} box
   * @param {number} [scale]
   */
  applyBoxScale(box, scale = this.textContainer ? this.textContainer.scaleX : 1) {
    box.setScale(scale);
    box.x = box.origX * scale;
    box.y = box.origY * scale;
  }

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
   * @param {boolean} [register=true] Whether to register the box for automatic resizing.
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
  createBoxContainer(
    name,
    x,
    y,
    width,
    height,
    label,
    hasDeco,
    hasBackground,
    register = true
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
        backgroundColor: "#003300",
      });

      // Position label centered with padding
      const padding = 6;
      labelText.x = padding;
      labelText.y = -labelText.height / 2; // slightly above top border
      container.add(labelText);
    }

    if (register) {
      this.applyBoxScale(container);
      this.boxes[name] = container;
    }

    return container;
  }

  /*
   * Writes a line of text to a specified box container.
   * @param {string} name - The name of the target text box.
   * @param {string} line - The text to display.
   * @param {boolean} [animate=false] - If true, displays the text character by character.
   */
  writeLineToBox(name, line, animate = false) {
    const box = this.boxes[name];
    if (!box) {
      return;
    }

    const yOffset = box.lines.length * 18 + 10;

    const textObj = this.scene.add.text(10, yOffset, animate ? "" : line, {
      fontFamily: this.globalFont,
      fontSize: 16,
      color: "#00ff00",
    });

    box.add(textObj);
    box.lines.push(textObj);

    if (animate) {
      this.animateText(textObj, line, 30);
    }
  }

  /**
   * Clears all text from a named text box.
   * @param {string} name - The name of the box to clear.
   */
  clearBox(name) {
    const box = this.boxes[name];
    if (!box) return;

    box.lines.forEach((line) => {
      this.stopTextAnimation(line);
      line.destroy();
    });
    box.lines = [];
  }

  // POP UP SYSTEM /////////////////////////////////////////////////////////////////////////

  /**
   * Displays a modal pop-up box with text and an OK button.
   * @param {string} title - title for the pop-up box.
   * @param {string} message - The text to display inside the pop-up.
   * @param {number} x - X position of the pop-up; defaults to centered.
   * @param {number} y - Y position of the pop-up; defaults to centered.
   * @param {number} width - Width of the pop-up box; defaults to 80% of game width.
   * @param {number} height - Height of the pop-up box.
   * @param {function} [onClose] - Function to call when the OK button is clicked.
   */
  showPopup(title, message, x, y, width, height, onClose = () => {}) {
    const scale = this.popupLayer.scaleX || 1;
    const gameWidth = this.scene.game.canvas.width / scale;
    const gameHeight = this.scene.game.canvas.height / scale;
    const boxWidth = Math.min(gameWidth * 0.8, width); // width or 80% of game width
    const boxHeight = height;
    const xPos = x ?? (gameWidth - boxWidth) / 2;
    const yPos = y ?? (gameHeight - height) / 2;

    // Create a semi-transparent overlay to block the background
    const overlay = this.scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, gameWidth, gameHeight);
    this.popupLayer.add(overlay);

    // Popups are children of the already-scaled popup layer, so they stay
    // unregistered and unscaled to avoid double scaling on resize.
    const popupBox = this.createBoxContainer(
      `popup_${this.popupStack.length}`,
      xPos,
      yPos,
      boxWidth,
      boxHeight,
      title,
      true,
      true,
      false
    );

    this.popupLayer.add(popupBox);

    const availableWidth = boxWidth - 20;
    const popupText = this.scene.add.text(10, 10, message, {
      fontFamily: this.globalFont,
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
        fontFamily: this.globalFont,
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
      box: popupBox,
      overlay: overlay,
    });
  }

  /**
   * Hides and cleans up the pop-up box and overlay.
   */
  hidePopup() {
    if (this.popupStack.length === 0) {
      return;
    }

    const activePopup = this.popupStack.pop();

    if (activePopup) {
      activePopup.box.destroy();
      activePopup.overlay.destroy();
    }
  }

  showArt(artString) {
    this.writeLines(artString);
  }

  // PIXEL ART SYSTEM /////////////////////////////////////////////////////////////////////////
  drawPixelArt(pixels, startX = 50, startY = 50) {
    pixels.forEach((row, rowIndex) => {
      row.forEach((colorIndex, colIndex) => {
        if (colorIndex !== 0) {
          // 0 = empty
          const color = this.greenPalette[colorIndex] || "#00ff00";
          const pixel = this.scene.add.text(
            startX + colIndex * 10,
            startY + rowIndex * 10,
            "■",
            {
              fontFamily: this.globalFont,
              fontSize: "10px",
              color: color,
            }
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

  /**
   * Animates a sequence of ASCII art frames at specified coordinates.
   *
   * @async
   * @function animateASCII
   * @param {string[]} frames - Array of ASCII art frames to display.
   * @param {number} [startX=50] - X coordinate where animation starts.
   * @param {number} [startY=50] - Y coordinate where animation starts.
   * @param {number} [delay=200] - Delay in milliseconds between frame transitions.
   * @description
   * Clears the previous frame, renders the next ASCII frame line by line
   * at the given position, and repeats until all frames have been displayed.
   */
  async animateASCII(frames, startX = 50, startY = 50, delay = 200) {
    let animContainer = this.boxes.anim;

    if (animContainer) {
      animContainer.origX = startX;
      animContainer.origY = startY;
      this.applyBoxScale(animContainer);
    } else {
      animContainer = this.createBoxContainer(
        "anim",
        startX,
        startY,
        0,
        0,
        "",
        false,
        false
      );
    }

    for (let i = 0; i < frames.length; i++) {
      if (!animContainer.active || !animContainer.scene) {
        break;
      }

      animContainer.list.forEach((obj) => obj.destroy());
      animContainer.lines = [];

      frames[i].split("\n").forEach((line, rowIndex) => {
        const textObj = this.scene.add.text(0, rowIndex * 18, line, {
          fontFamily: this.globalFont,
          fontSize: "18px",
          color: "#00ff00",
        });
        animContainer.add(textObj);
        animContainer.lines.push(textObj);
      });

      await new Promise((r) => setTimeout(r, delay));
    }
  }

  // TODO - scrolling on mobile
  // TODO - play sound system
}

window.TextEngine = TextEngine;
