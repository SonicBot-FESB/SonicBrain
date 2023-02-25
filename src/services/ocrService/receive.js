const { commandResponseReceived } = require("../../metrics");
const { CharacterRecognitionState, OcrCommandExecutionState } = require("../../state/characterRecognitionState");


function receiveStartOcrResponse(cmd, data) {
  CharacterRecognitionState.isOcrRunning = true;
  commandResponseReceived({ service: "ocr", value: cmd})
}

function receiveStopOcrResponse(cmd, data) {
  CharacterRecognitionState.isOcrRunning = false;
  commandResponseReceived({ service: "ocr", value: cmd})
}

function receiveGetStatusResponse(cmd, data) {
  const isRunning = data[0] === "1";
  CharacterRecognitionState.isOcrRunning = isRunning;
  commandResponseReceived({ service: "ocr", value: `${cmd} ${data.join(" ")}`})
}

function receiveError(cmd, [error]) {
  console.error(`Received: ${error}`);
  CharacterRecognitionState.isOcrRunning = isRunning;
  commandResponseReceived({ service: "ocr", value: `${cmd} ${error}`})
}

function receiveCharacterDetected(cmd, _) {
  CharacterRecognitionState.characterDetected();
  commandResponseReceived({ service: "ocr", value: `${cmd}`})
}

function receivePredictions(cmd, [character, prediction]) {
  OcrCommandExecutionState.commandExecuted(cmd);
  console.log(character, Number(prediction));
  CharacterRecognitionState.setPredictions(character, Number(prediction));
  commandResponseReceived({ service: "ocr", value: `${cmd} ${character} ${prediction}`})
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
