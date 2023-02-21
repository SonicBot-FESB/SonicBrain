const { CharacterRecognitionState, OcrCommandExecutionState } = require("../../state/characterRecognitionState");


function receiveStartOcrResponse(cmd, data) {
  CharacterRecognitionState.isOcrRunning = true;
}

function receiveStopOcrResponse(cmd, data) {
  CharacterRecognitionState.isOcrRunning = false;
}

function receiveGetStatusResponse(_, data) {
  const isRunning = data[0] === "1";
  CharacterRecognitionState.isOcrRunning = isRunning;
}

function receiveError(cmd, [error]) {
  console.error(`Received: ${error}`);
}

function receiveCharacterDetected() {
  CharacterRecognitionState.characterDetected();
}

function receivePredictions(cmd, [character, prediction]) {
  OcrCommandExecutionState.commandExecuted(cmd);
  console.log(character, Number(prediction));
  CharacterRecognitionState.setPredictions(character, Number(prediction));
}

const handlersByCommandName = {
  "ONN": receiveStartOcrResponse,
  "OFF": receiveStopOcrResponse,
  "STT": receiveGetStatusResponse,
  "ERR": receiveError,
  "PRD": receivePredictions,
  "CHR": receiveCharacterDetected,
};

module.exports = handlersByCommandName;
