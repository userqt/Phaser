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
    console.assert(box.lines.length === 2, "Stats box should have 2 lines");
    console.log("writeLineToBox test passed.");

    setTimeout(() => {
      engine.clearBox("stats");
      resolve();
    }, 200);
  });
}
