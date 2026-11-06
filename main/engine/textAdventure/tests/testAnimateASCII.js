function testAnimateASCII(engine) {
  return new Promise((resolve) => {
    const doorFrames = [
      `
+---+
|   |
|   |
|   |
+---+
`,
      `
+---+
|   |
| / |
|   |
+---+
`,
      `
+---+
|   |
| / |
|/  |
+---+
`,
      `
+---+
|   |
|   |
|   |
+---+
`,
    ];

    engine.animateASCII(doorFrames, 300, 50, 100).then(() => {
      window.check(
        "animateASCII draws every frame",
        !!engine.boxes.anim && engine.boxes.anim.lines.length > 0
      );
      resolve();
    });
  });
}
