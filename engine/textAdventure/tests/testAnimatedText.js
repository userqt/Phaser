async function testAnimatedText(engine) {
  const errorsBefore = window.__errorCount;
  const startY = engine.textY;

  engine.writeLine("This line is removed while it is still typing.", true);
  window.check(
    "animated writeLine reserves its line immediately",
    engine.textY === startY + 18
  );

  engine.clearLastLine();
  window.check(
    "clearLastLine restores the text position",
    engine.textY === startY
  );

  await new Promise((resolve) => setTimeout(resolve, 400));

  window.check(
    "destroying an animating line does not throw",
    window.__errorCount === errorsBefore
  );
}
