const Queue = require("../utils/queue.js");

const MAX_QUEUE_LENGTH = 30;

const SENSOR_POSITIONS = {
    frontLeft: "frontLeft", 
    frontRight: "frontRight", 
    leftFront: "leftFront", 
    leftBack: "leftBack", 
    rightFront: "rightFront", 
    rightBack: "rightBack",
}

const DIRECTIONS = {
  left: "left",
  right: "right",
  front: "front",
};

class RobotDistancesStorage {
    static #distanceValues = {
        "frontLeft": new Queue(MAX_QUEUE_LENGTH),
        "frontRight": new Queue(MAX_QUEUE_LENGTH),
        "leftFront": new Queue(MAX_QUEUE_LENGTH),
        "leftBack": new Queue(MAX_QUEUE_LENGTH),
        "rightFront": new Queue(MAX_QUEUE_LENGTH),
        "rightBack": new Queue(MAX_QUEUE_LENGTH),
    };
    static SENSOR_POSITIONS = SENSOR_POSITIONS;
    static DIRECTIONS = DIRECTIONS;

    static setDistanceMeasurements([fl, fr, lf, lb, rf, rb]) {
        this.#distanceValues.frontLeft.enqueue(fl);
        this.#distanceValues.frontRight.enqueue(fr);

        this.#distanceValues.leftFront.enqueue(lf);
        this.#distanceValues.leftBack.enqueue(lb);

        this.#distanceValues.rightFront.enqueue(rf);
        this.#distanceValues.rightBack.enqueue(rb);
    }

    static getDistanceMean(sensorPosition) {
        const distances = this.#distanceValues[sensorPosition];
        const distancesSum = distances.reduce(
            (sum, val) => sum + val,
            0,
        );
        return distancesSum / distances.length;
    }

    static getDistanceRange(sensorPosition) {
        const distances = this.#distanceValues[sensorPosition]; 
        const min = Math.min(...distances);
        const max = Math.max(...distances);

        return max - min;
    }

    static getDistances(sensorPosition) {
        return this.#distanceValues[sensorPosition];
    }
}


class RobotCommandExecutionState {
    static #commandInExecution = null;     
    static #commandStartedAt = null;
    static isConnected = false;

    static setCommandInExecution(command) {
        this.#commandInExecution = command;
        this.#commandStartedAt = Date.now();
    }

    static isCommandBeingExecuted(command) {
        return command === this.#commandInExecution;
    }

    static commandExecuted(command) {
        if (!this.isCommandBeingExecuted(command)) {
            throw `Command ${command} is not currently being executed`;
        }
        const duration = Date.now() - this.#commandStartedAt;
        this.#commandInExecution = null;
        this.#commandStartedAt = null;
        return duration;
    }

    static isExecutionBlocked() {
        return this.#commandInExecution !== null;
    }

    static getCommandInExecution() {
        return this.#commandInExecution;
    }
}


const MOVEMENT_DIRECTIONS = {
    forward: "fwd",
    backward: "bck",
    turning: "trn",
}


class RobotMovementState {
    static #movementDirection = null;
    static #updatedAt = Date.now();

    static MOVEMENT_DIRECTIONS = MOVEMENT_DIRECTIONS;
    
    static goForward() {
        this.#movementDirection = this.MOVEMENT_DIRECTIONS.forward;
        this.#updatedAt = Date.now();
    }

    static goBack() {
        this.#movementDirection = this.MOVEMENT_DIRECTIONS.backward;
        this.#updatedAt = Date.now();
    }

    static turn() {
        this.#movementDirection = this.MOVEMENT_DIRECTIONS.turning;
        this.#updatedAt = Date.now();
    }

    static stop() {
        this.#movementDirection = null;
        this.#updatedAt = Date.now();
    }

    static isMoving() {
        return this.#movementDirection !== null;
    }
}


class RobotMotoricsState {
    static Distances = RobotDistancesStorage
    static CommandExecution = RobotCommandExecutionState;
    static Movement = RobotMovementState;
}

module.exports = RobotMotoricsState;
