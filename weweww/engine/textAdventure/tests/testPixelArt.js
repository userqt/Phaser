function testPixelArt(engine) {
  return new Promise((resolve) => {
    const smiley = [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 1, 3, 3, 1, 1, 1],
      [1, 4, 1, 1, 1, 1, 4, 1],
      [0, 1, 4, 4, 4, 4, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
    ];

    engine.drawPixelArt(smiley, 50, 50);
    console.log("Pixel art drawn at 50,50.");

    setTimeout(() => {
      if (engine.pixelLayer) {
        engine.pixelLayer.list.forEach((obj) => obj.destroy());
        engine.pixelLayer.destroy();
        engine.pixelLayer = null;
      }
      resolve();
    }, 500);
  });
}
