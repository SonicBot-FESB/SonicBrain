const { sendStop } = require("../../services/sonicCerebellumService/send");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const { CharacterRecognitionState, OcrCommandExecutionState } = require("../../state/characterRecognitionState");
const { getPrediction } = require("../../services/ocrService/send");
const { delay } = require("../../utils/sleep");


module.exports.handleCharacterPrediction = async function({ cerebellumClient, ocrClient}) {
  const { CommandExecution } = RobotMotoricsState;
  if (
    CharacterRecognitionState.getPredictionsFreshness() < 5000 ||
    CharacterRecognitionState.getCharacterDetectionFreshness() > 400
  ) {
    return;
  }
  
  sendStop(cerebellumClient);
  CommandExecution.waitForCommandToFinish();
  await getPrediction(ocrClient);
  OcrCommandExecutionState.waitForCommandToFinish();
  console.log("HURAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  console.log("DOBILI SMO SLOVOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
  console.log(CharacterRecognitionState.getPredictions());
  await delay(1000);
  return true;
}
