class CharacterRecognitionState {  
    static #predictedCharacter = null;
    static #predictionProbability = null;
    static #predictionsUpdatedAt = null;

    static isOcrRunning = null;
    static isOcrConnected = false;
    static isConnectedToOcr = false;
    
    static setPredictions(character, value) {
        this.#predictedCharacter = character;
        this.#predictionProbability = value;
        this.#predictionsUpdatedAt = Date.now();
    }

    static getPredictions() {
        return {
            "character": this.#predictedCharacter,
            "probability": this.#predictionProbability,
        };
    }

    static getPredictionsFreshness() {
        return Date.now() - this.#predictionsUpdatedAt;
    }
}

module.exports = CharacterRecognitionState
