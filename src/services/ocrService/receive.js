const CharacterRecognitionState = require("../../state/characterRecognitionState");
const FunctionMap = require("../../utils/functionMap");

const handlersByCommandName = new FunctionMap();

function receiveStartOcrResponse(cmd, data) {
  CharacterRecognitionState.isOcrRunning = true;
}
handlersByCommandName.map("ONN", receiveStartOcrResponse);

function receiveStopOcrResponse(cmd, data) {
  CharacterRecognitionState.isOcrRunning = false;
}
handlersByCommandName.map("OFF", receiveStopOcrResponse);

function receiveGetStatusResponse(_, data) {
  const isRunning = data[0] === "1";
  CharacterRecognitionState.isOcrRunning = isRunning;
}
handlersByCommandName.map("STT", receiveGetStatusResponse);

function receiveError(cmd, [error]) {
  console.error(`Received: ${error}`);
}
handlersByCommandName.map("ERR", receiveError);

function receivePredictions(cmd, [character, prediction]) {
  console.log(character, Number(prediction));
  CharacterRecognitionState.setPredictions(character, Number(prediction));
}
handlersByCommandName.map("PRD", receivePredictions);

module.exports = handlersByCommandName;
