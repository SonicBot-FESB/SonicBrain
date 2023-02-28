const { commandResponseReceived, writePointsAsync, sendPredictionData } = require("../../metrics");
const { CharacterRecognitionState, OcrCommandExecutionState } = require("../../state/characterRecognitionState");


async function receiveStartOcrResponse(cmd, data) {
  CharacterRecognitionState.isOcrRunning = true;
  await commandResponseReceived({ service: "ocr", value: cmd})
}

async function receiveStopOcrResponse(cmd, data) {
  CharacterRecognitionState.isOcrRunning = false;
  await commandResponseReceived({ service: "ocr", value: cmd})
}

async function receiveGetStatusResponse(cmd, data) {
  const isRunning = data[0] === "1";
  CharacterRecognitionState.isOcrRunning = isRunning;
  await commandResponseReceived({ service: "ocr", value: `${cmd} ${data.join(" ")}`})
}

async function receiveError(cmd, [error]) {
  console.error(`Received: ${error}`);
  CharacterRecognitionState.isOcrRunning = isRunning;
  await commandResponseReceived({ service: "ocr", value: `${cmd} ${error}`})
}

async function receiveCharacterDetected(cmd, _) {
  CharacterRecognitionState.characterDetected();
  await commandResponseReceived({ service: "ocr", value: `${cmd}`})
}

async function receivePredictions(cmd, [character, prediction]) {
  OcrCommandExecutionState.commandExecuted(cmd);
  CharacterRecognitionState.setPredictions(character, Number(prediction));

  await writePointsAsync([
    commandResponseReceived({ service: "ocr", value: `${cmd} ${character} ${prediction}`}, new Date(), true),
    sendPredictionData({ chance: Number(prediction), character: character }, new Date(), true),
  ])
}

async function receiveImg(cmd, _) {
  OcrCommandExecutionState.commandExecuted(cmd);  
  await commandResponseReceived({ service: "ocr", value: `${cmd}`});
}

const handlersByCommandName = {
  "ONN": receiveStartOcrResponse,
  "OFF": receiveStopOcrResponse,
  "STT": receiveGetStatusResponse,
  "ERR": receiveError,
  "PRD": receivePredictions,
  "CHR": receiveCharacterDetected,
  "IMG": receiveImg,
};

module.exports = handlersByCommandName;
