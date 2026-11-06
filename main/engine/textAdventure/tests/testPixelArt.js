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

    const expectedPixels = smiley.flat().filter((colorIndex) => colorIndex !== 0)
      .length;
    window.check(
      "drawPixelArt renders one glyph per filled pixel",
      !!engine.pixelLayer && engine.pixelLayer.list.length === expectedPixels
    );

    setTimeout(() => {
      if (engine.pixelLayer) {
        engine.pixelLayer.list.forEach((obj) => obj.destroy());
        engine.pixelLayer.destroy();
        engine.pixelLayer = null;
        delete engine.boxes.pixelLayer;
      }
      resolve();
    }, 500);
  });
}
