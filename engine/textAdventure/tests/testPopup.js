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

    window.check(
      "showPopup registers the popup",
      engine.popupStack.length === 1
    );

    setTimeout(() => {
      engine.hidePopup();
      window.check(
        "hidePopup removes the popup",
        engine.popupStack.length === 0
      );
      resolve();
    }, 1000);
  });
}
