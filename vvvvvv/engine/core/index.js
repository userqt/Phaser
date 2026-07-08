/**
 * @typedef {Object} EnginesType
 * @property {TextEngine} TextEngine
 */

/**
 * @type {EnginesType}
 */
window.Engines = {
  TextEngine: new window.TextEngine(),
  // add more engines here
  //e.g. Basics programming: window.BasicsEngine - engine to teach basics of programming
  //e.g. Quest: window.QuestEngine - point and click adventure engine
  //e.g. Runner: window.RunnerEngine - vertical platform runner engine with coins and obstacles
};

window.GameEngine = window.Engines.TextEngine; // <----- change your engine here
