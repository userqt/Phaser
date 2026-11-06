declare class TextEngine extends BaseEngine {
    input: HTMLInputElement;
    textY: number;
    inputQueue: any[];
    pendingResolvers: any[];
    gameStart: boolean;
    decorLayer: any;
    boxes: {};
    textContainer: any;
    popupLayer: any;
    popupStack: any[];
    pixelLayer: any;
    greenPalette: string[];
    globalFont: string;
    inputWrapper: HTMLDivElement;
    showInput(): void;
    writeLines(artString: any, animate?: boolean): void;
    /**
     * Writes a line of text to the container.
     * @param {string} line - Text to display.
     * @param {boolean} [animate=false] - If true, shows text character by character.
     */
    writeLine(line: string, animate?: boolean): void;
    /**
     * Types text character by character.
     * Stops safely if the text object is destroyed while the timer is pending.
     */
    animateText(textObj: any, text: any, speed?: number): void;
    /**
     * Cancels a pending character-by-character animation for a text object.
     */
    stopTextAnimation(textObj: any): void;
    /**
     * Reads the next input from the queue.
     * @returns {string} - The next input in lowercase, or an empty string if none.
     */
    readLine(): string;
    /**
     * Reads the next input from the queue asynchronously.
     * Resolves as soon as input is submitted (no polling).
     * @returns {Promise<string>} - Resolves with the next input in lowercase.
     */
    readLineAsync(): Promise<string>;
    /**
     * Resolves waiting readLineAsync() calls with queued input, in order.
     */
    flushInputQueue(): void;
    /**
     * Checks if there is any input in the queue.
     * @returns {boolean} - True if input is available, false otherwise.
     */
    hasInput(): boolean;
    /**
     * Removes one-shot layers (animated art, pixel art and open popups).
     * Named UI boxes (HUD) are kept.
     */
    clearTransientArt(): void;
    /**
     * Removes the last line of text from the container and adjusts the vertical position.
     */
    clearLastLine(): void;
    /**
     * Starts the game by setting the start flag, adding initial input, and showing the input field.
     */
    startGame(): void;
    _resizeHandler: () => void;
    createBoundDecoration(): void;
    handleResize(): void;
    /**
     * Resizes the box containers to match the screen size.
     * @param {number} [scale] - Scale to apply; defaults to the text container scale.
     */
    resizeBoxes(scale?: number): void;
    /**
     * Applies the current screen scale to a box container.
     * @param {Phaser.GameObjects.Container} box
     * @param {number} [scale]
     */
    applyBoxScale(box: Phaser.GameObjects.Container, scale?: number): void;
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
    createBoxContainer(name: string, x: number, y: number, width: number, height: number, label: string, hasDeco: boolean, hasBackground: boolean, register?: boolean): Phaser.GameObjects.Container & {
        origX: number;
        origY: number;
        origWidth: number;
        origHeight: number;
        boxWidth: number;
        boxHeight: number;
        lines: Phaser.GameObjects.Text[];
    };
    writeLineToBox(name: any, line: any, animate?: boolean): void;
    /**
     * Clears all text from a named text box.
     * @param {string} name - The name of the box to clear.
     */
    clearBox(name: string): void;
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
    showPopup(title: string, message: string, x: number, y: number, width: number, height: number, onClose?: Function): void;
    /**
     * Hides and cleans up the pop-up box and overlay.
     */
    hidePopup(): void;
    showArt(artString: any): void;
    drawPixelArt(pixels: any, startX?: number, startY?: number): void;
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
    animateASCII(frames: string[], startX?: number, startY?: number, delay?: number): Promise<void>;
}
