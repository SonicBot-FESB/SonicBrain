class FunctionMap {
    #map = {};

    constructor() {}

    map(key, fn) {
        this.#map[key] = fn;
    }

    get(key) {
        return this.#map[key];
    }
}

module.exports = FunctionMap;
