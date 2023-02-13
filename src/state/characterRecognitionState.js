class OcrCommandExecutionState {
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

class CharacterRecognitionState {  
    static #predictedCharacter = null;
    static #predictionProbability = null;
    static #predictionsUpdatedAt = null;

    static #lastCharacterDetected = Infinity;

    static #isPredictionRecognized = null;

    static isOcrRunning = null;
    static isOcrConnected = false;
    static isConnectedToOcr = false;
    
    static setPredictions(character, value) {
        this.#predictedCharacter = character;
        this.#predictionProbability = value;
        this.#predictionsUpdatedAt = Date.now();
    }

    static getPredictions() {
        this.#isPredictionRecognized = true;
        return {
            "character": this.#predictedCharacter,
            "probability": this.#predictionProbability,
        };
    }

    static getPredictionsFreshness() {
        return Date.now() - this.#predictionsUpdatedAt;
    }

    static characterDetected() {
        this.#lastCharacterDetected = Date.now();
        this.#isPredictionRecognized = false;
    }

    static getCharacterDetectionFreshness() {
        if (! isFinite(this.#lastCharacterDetected)) {
            return Infinity;
        }
        return Date.now() - this.#lastCharacterDetected;
    }

    static checkForNewPrediction() {
        return (this.#isPredictionRecognized === false);
    }
}

module.exports = CharacterRecognitionState;
module.exports = OcrCommandExecutionState;
