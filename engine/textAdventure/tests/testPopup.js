function testPopup(engine) {
  return new Promise((resolve) => {
    engine.showPopup(
      "Alert!",
      "Game Over! Press OK to restart!",
      100,
      100,
      400,
      200,
      () => {
        console.log("Popup callback executed.");
      }
    );

    setTimeout(() => {
      engine.hidePopup();
      console.log("Popup hide test completed.");
      resolve();
    }, 1000);
  });
}
