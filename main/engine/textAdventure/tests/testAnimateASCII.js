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
      console.log("animateASCII test completed.");
      resolve();
    });
  });
}
