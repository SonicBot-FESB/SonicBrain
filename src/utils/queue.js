class Queue extends Array {
    #maxLength = null;

    constructor(maxLength, ...args) {
        super(args);
        this.#maxLength = maxLength;
    }

    enqueue(value) {
        this.push(value)
        if (this.length > this.#maxLength) {
            this.dequeue();
        }
    }

    dequeue() {
        return this.shift();
    }
}

module.exports = Queue;
