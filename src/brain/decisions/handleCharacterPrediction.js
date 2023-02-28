const { sendStop } = require("../../services/sonicCerebellumService/send");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const { CharacterRecognitionState, OcrCommandExecutionState } = require("../../state/characterRecognitionState");
const { getPrediction, getImage } = require("../../services/ocrService/send");
const { delay } = require("../../utils/sleep");


module.exports.handleCharacterPrediction = async function({ cerebellumClient, ocrClient}) {
  const { CommandExecution, Distances } = RobotMotoricsState;
  if (
    CharacterRecognitionState.getPredictionsFreshness() < 1200 ||
    CharacterRecognitionState.getCharacterDetectionFreshness() > 400 ||
    Distances.getDistanceMean(Distances.SENSOR_POSITIONS.leftFront) <= 220 ||
    Distances.getDistanceMean(Distances.SENSOR_POSITIONS.leftBack) <= 220
  ) {
    return;
  }
  
  await sendStop(cerebellumClient);
  CommandExecution.waitForCommandToFinish();
  await getPrediction(ocrClient);
  OcrCommandExecutionState.waitForCommandToFinish();
  await getImage(ocrClient);
  OcrCommandExecutionState.waitForCommandToFinish();

  await delay(1000);
  return true;
}
