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
  await CommandExecution.waitForCommandToFinish();
  await delay(500);
  await getPrediction(ocrClient);
  await OcrCommandExecutionState.waitForCommandToFinish();
  await getImage(ocrClient);
  await OcrCommandExecutionState.waitForCommandToFinish();
  await delay(500);
  return true;
}
