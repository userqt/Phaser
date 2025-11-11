window.BaseEngine = {
  scene: null,
  appPreload: null,
  appCreate: null,
  appUpdate: null,
  saveData: {},
  saveKey: "SaveUserData",
  autoKeyCounter: 0,

  init(scene, app) {
    this.scene = scene;
    this.appPreload = app.preload || function () {};
    this.appCreate = app.create || function () {};
    this.appUpdate = app.update || function () {};
  },
  preload() {
    this.appPreload();
  },
  create() {
    this.appCreate();
  },
  update() {
    this.appUpdate();
  },
  clear() {},
  getEngineSceneMethods(app) {
    const engine = this;
    return {
      preload: function () {
        engine.init(this, app);
        engine.preload();
      },
      create: function () {
        engine.create();
      },
      update: function () {
        engine.update();
      },
    };
  },

  //////////////////////////////////// SAVE SYSTEM ///////////////////////////////////////
  /**
   * Saves a value or object into the engine’s persistent save system.
   * Can be used in three modes:
   * 1. Key-value: save("player.health", 100) – supports nested keys with dot notation.
   * 2. Object: save({ gold, items }) – saves multiple keys at once.
   * 3. Auto-key: save(value) – generates an automatic key like "_auto_0".
   * @param {string|object|any} keyOrObjOrValue - The key, object, or value to save.
   * @param {any} [value] - The value to save if using key-value mode.
   * @returns {string|undefined} - Returns auto-generated key in auto-key mode.
   */
  save(keyOrObjOrValue, value) {
    if (value !== undefined) {
      const keys = keyOrObjOrValue.split(".");
      let obj = this.saveData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof obj[keys[i]] !== "object" || obj[keys[i]] === null) {
          obj[keys[i]] = {};
        }

        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
    } else if (typeof keyOrObjOrValue === "object") {
      for (const key in keyOrObjOrValue) {
        this.saveData[key] = keyOrObjOrValue[key];
      }
    } else {
      const key = "_auto_" + this.autoKeyCounter++;
      this.saveData[key] = keyOrObjOrValue;
      return key;
    }

    localStorage.setItem(this.saveKey, JSON.stringify(this.saveData));
  },

  /**
   * Retrieves a saved value from the engine.
   * Can get by string key, object key, auto-key, or full save object.
   * @param {string|object} [keyOrObj] - The key or object to retrieve. Omit to get full save object.
   * @returns {any} - Returns the saved value, or the full save object if no key is provided.
   */
  getSave(keyOrObj) {
    if (Object.keys(this.saveData).length === 0) {
      const saved = localStorage.getItem(this.saveKey);
      if (saved) {
        this.saveData = JSON.parse(saved);
      }
    }

    if (keyOrObj === undefined) {
      return this.saveData;
    }

    if (typeof keyOrObj === "object") {
      return this.saveData[Object.keys(keyOrObj)[0]];
    }
    if (typeof keyOrObj === "string") {
      const keys = keyOrObj.split(".");
      let obj = this.saveData;
      for (let i = 0; i < keys.length; i++) {
        if (obj[keys[i]] === undefined) {
          return undefined;
        }

        obj = obj[keys[i]];
      }

      return obj;
    }
  },

  /**
   * Clears all saved data from memory and localStorage.
   * Resets auto-key counter and removes the save file.
   */
  clearSave() {
    this.saveData = {};
    this.autoKeyCounter = 0;
    localStorage.removeItem(this.saveKey);
  },
};
