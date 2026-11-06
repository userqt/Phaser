function testBoxContainer(engine) {
  return new Promise((resolve) => {
    engine.createBoxContainer(
      "stats",
      850,
      50,
      200,
      60,
      "Player Stats",
      true,
      true
    );
    engine.writeLineToBox("stats", "Health: 100");
    engine.writeLineToBox("stats", "Mana: 50");

    const box = engine.boxes["stats"];
    window.check(
      "writeLineToBox adds one text object per line",
      box.lines.length === 2
    );
    window.check(
      "writeLineToBox keeps the box label and background",
      box.list.some((child) => child.type === "Text") &&
        box.list.some((child) => child.type === "Graphics")
    );

    setTimeout(() => {
      engine.clearBox("stats");
      resolve();
    }, 200);
  });
}
