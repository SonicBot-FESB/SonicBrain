const DistanceSeries = require("../utils/distanceSeries.js");
const { delay } = require("../utils/sleep.js");

const MAX_QUEUE_LENGTH_SIDE = 500;
const MAX_QUEUE_LENGTH_FRONT = 100;

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
        "frontLeft": new DistanceSeries(MAX_QUEUE_LENGTH_FRONT),
        "frontRight": new DistanceSeries(MAX_QUEUE_LENGTH_FRONT),
        "leftFront": new DistanceSeries(MAX_QUEUE_LENGTH_SIDE),
        "leftBack": new DistanceSeries(MAX_QUEUE_LENGTH_SIDE),
        "rightFront": new DistanceSeries(MAX_QUEUE_LENGTH_SIDE),
        "rightBack": new DistanceSeries(MAX_QUEUE_LENGTH_SIDE),
    };
    static SENSOR_POSITIONS = SENSOR_POSITIONS;
    static DIRECTIONS = DIRECTIONS;

    static setDistanceMeasurements([fl, fr, lf, lb, rf, rb]) {
        fl && fl < 1023 && this.#distanceValues.frontLeft.enqueue(fl);
        fr && fr < 1023 && this.#distanceValues.frontRight.enqueue(fr);

        lf && lf < 1023 && this.#distanceValues.leftFront.enqueue(lf);
        lb && lb < 1023 && this.#distanceValues.leftBack.enqueue(lb);

        rf && rf < 1023 && this.#distanceValues.rightFront.enqueue(rf);
        rb && rb < 1023 && this.#distanceValues.rightBack.enqueue(rb);
    }

    static getDistanceMean(sensorPosition) {
        const distances = this.#distanceValues[sensorPosition];
        return distances.mean();
    }

    static getAllDistanceMeans() {
        return {
            "frontLeft": this.getDistanceMean("frontLeft"),
            "frontRight": this.getDistanceMean("frontRight"),
            "leftFront": this.getDistanceMean("leftFront"),
            "leftBack": this.getDistanceMean("leftBack"),
            "rightFront": this.getDistanceMean("rightFront"),
            "rightBack": this.getDistanceMean("rightBack"),
        }
    }

    static getDistanceRange(sensorPosition) {
        const distances = this.#distanceValues[sensorPosition]; 
        return distances.range();
    }

    static getDistances(sensorPosition) {
        return this.#distanceValues[sensorPosition];
    }
}


class RobotCommandExecutionState {
    static #commandInExecution = null;     
    static #error = false;
    static #commandStartedAt = null;
    static isConnected = false;

    static setCommandInExecution(command) {
        this.#commandInExecution = command;
        this.#commandStartedAt = Date.now();
    }

    static isCommandBeingExecuted(command) {
        return command === this.#commandInExecution;
    }

    static async waitForCommandToFinish() {
        while (this.#commandInExecution !== null) {
            await delay(100);
        }  
    }

    static commandExecuted(command) {
        if (!this.isCommandBeingExecuted(command)) {
            console.error(`Command ${command} is not currently being executed`);
        }
        const duration = Date.now() - this.#commandStartedAt;
        this.#commandInExecution = null;
        this.#commandStartedAt = null;
        return duration;
    }

    static isExecutionBlocked() {
        return this.#commandInExecution !== null || this.#error;
    }

    static getCommandInExecution() {
        return this.#commandInExecution;
    }

    static erroredOut() {
        this.#error = true;
    }

    static clearError() {
        this.#error = false;
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
