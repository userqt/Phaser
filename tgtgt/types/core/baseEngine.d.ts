declare class BaseEngine {
    scene: any;
    appPreload: any;
    appCreate: any;
    appUpdate: any;
    saveData: {};
    saveKey: string;
    autoKeyCounter: number;
    init(scene: any, app: any): void;
    preload(): void;
    create(): void;
    update(): void;
    clear(): void;
    getEngineSceneMethods(app: any): {
        preload: () => void;
        create: () => void;
        update: () => void;
    };
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
    save(keyOrObjOrValue: string | object | any, value?: any): string | undefined;
    /**
     * Retrieves a saved value from the engine.
     * Can get by string key, object key, auto-key, or full save object.
     * @param {string|object} [keyOrObj] - The key or object to retrieve. Omit to get full save object.
     * @returns {any} - Returns the saved value, or the full save object if no key is provided.
     */
    getSave(keyOrObj?: string | object): any;
    /**
     * Clears all saved data from memory and localStorage.
     * Resets auto-key counter and removes the save file.
     */
    clearSave(): void;
}
