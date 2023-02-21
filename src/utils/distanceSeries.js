const nj = require("numjs");

class DistanceSeries {
    #maxLength = null;
    #data = null;
    #index = null;

    constructor(maxLength) {
        this.#maxLength = maxLength;
        this.#data = nj.zeros(maxLength);
        this.#index = 0;
    }

    enqueue(value) {
        this.#data.set(this.#index, value);
        this.#index += 1;

        if (this.#index === this.#maxLength) {
            this.#index = 0;
        }
    }

    mean() {
        return this.#data.mean();
    }
    
    range() {
        return this.#data.max() - this.#data.min();
    }
}

module.exports = DistanceSeries;
