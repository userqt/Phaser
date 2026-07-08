# HauntedHouseWeb (Phaser Engines Runtime)

This folder contains the browser runtime that executes student code against a selected beginner engine.
In the classroom workflow:

1. Students choose a project (text / runner / quest / basics programming) on a start page.
2. The runtime loads the chosen engine and wires it to `app.js`.
3. Students only change `app.js` (practice) while the engine stays fixed by the tutor's prepared template.

## How the runtime boots

`index.html` is the entrypoint that wires everything together:

- Loads Phaser from CDN
- Loads engine core + the selected engine scripts
- Loads `app.js` (student code)
- Loads `engine/main.js` which creates the Phaser game and calls the engine with the `app` hooks

Key files:

- `engine/core/baseEngine.js`: provides `BaseEngine` and the hook contract (`appPreload/appCreate/appUpdate`)
- `engine/core/index.js`: registers which engines exist and selects `window.GameEngine`
- `engine/textAdventure/textEngine.js`: the current implemented engine
- `engine/main.js`: creates the Phaser `Game` and connects `window.GameEngine` to the `app` hooks
- `app.js`: student-editable code (must define `appPreload`, `appCreate`, `appUpdate`)

## Engine contract (what engines must expose)

An engine is a class that extends `BaseEngine` and is made available globally (example: `window.TextEngine`).
The core then selects the active engine by setting:

- `window.Engines.<EngineName> = new window.<EngineName>()`
- `window.GameEngine = window.Engines.<EngineName>`

The engine core calls into the student app through:

- `engine.init(scene, app)` sets `this.appPreload/appCreate/appUpdate`
- Phaser lifecycle calls `engine.preload()/create()/update()`

## `app.js` contract (what students write)

`HauntedHouseWeb/app.js` is expected to define these functions:

- `function appPreload() { ... }`
- `async function appCreate() { ... }`
- `function appUpdate() { ... }`

Inside those functions, students should use the global `GameEngine` instance:

- Example engine API (text engine): `GameEngine.writeLine(...)`, `GameEngine.readLineAsync()`, `GameEngine.showPopup(...)`, etc.

### Important: `app.js` is engine-specific by curriculum
When you add runner/quest/basics engines, you will typically:

- Provide an `app.js` starter template that matches that engine's capabilities.
- In the tutor-prepared branch, ensure the `index.html` loads the matching engine + matching starter `app.js`.

## Project selection / start page (planned)

Right now, the runtime selection is effectively hard-coded:

- `engine/core/index.js` sets `window.GameEngine = window.Engines.TextEngine`
- `index.html` includes the text engine scripts

Your intended design is:

- Start page: choose `text`, `runner`, `quest`, `basics programming`
- Runtime: load the chosen engine and set `window.GameEngine`
- Runtime: load the correct starter `app.js` for that engine

When you implement this, the most direct approach is:

1. Create a start page like `start.html` (or update `index.html` to support query params)
2. Use a query parameter like `?game=textAdventure` (or `runner/quest/basics`)
3. Load only the engine scripts needed for that selection
4. Ensure `app.js` is loaded after the selected engine has registered `window.GameEngine`

## Run as dev (tutor / local testing)

This project has no node runtime; it is plain HTML + JS.

Dev steps:

1. (Optional but recommended for editor IntelliSense) Generate the `.d.ts` files:
   - `npm install -g typescript`
   - `tsc -p tsconfig.json`
2. Serve the folder with any static server (avoid `file://` issues):
   - Example: `npx http-server -p 8080`
   - Example: `python -m http.server 8080`
3. Open:
   - `http://localhost:8080/index.html`

Note: With the current codebase, `index.html` runs the Text Adventure engine by default.
After you add the start page, open the start page and pick the engine.

### Running `text`, `runner`, `quest`, `basics` (once the start page exists)
Once you implement the start page/engine picker, the workflow should look like:

1. Start the static server (as in steps above)
2. Open the start page, for example:
   - `http://localhost:8080/start.html?game=textAdventure`
   - `http://localhost:8080/start.html?game=runner`
   - `http://localhost:8080/start.html?game=quest`
   - `http://localhost:8080/start.html?game=basics`
3. The runtime will:
   - load the selected engine scripts
   - set `window.GameEngine`
   - load the matching starter `app.js` scaffold

Then students practice by editing `app.js` (typically through PhaserEditor).

## Run as user (students / classroom)

Students typically do not need to run this page directly.
Instead, they use `PhaserEditor`, which:

- Loads the student's GitHub repo files
- Builds and runs the selected student's `index.html` inside an iframe
- Lets students edit `app.js` in Monaco
- Provides `Save to GitHub` for commits

If a student *does* run the runtime directly (for debugging):

- Open the prepared `index.html` from the student's deployed/template branch (for example via GitHub Pages).
- Edit `app.js` using PhaserEditor or by editing files directly in their branch.
