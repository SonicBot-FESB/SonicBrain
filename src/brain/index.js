const RobotMotoricsState = require("../state/robotMotoricsState");
const { commands } = require("../services/sonicCerebellumService");
const { OcrCommandExecutionState } = require("../state/characterRecognitionState");
const { isReady } = require("./isReady");
const { handleWallTooClose } = require("./decisions/handleWallTooClose");
const { handleDoors } = require("./decisions/handleDoors");
const { handleCharacterPrediction } = require("./decisions/handleCharacterPrediction");


async function think(cerebellumClient, ocrClient) {
  const { CommandExecution, Movement: MovementState } = RobotMotoricsState;

  if (
    CommandExecution.isExecutionBlocked() ||
    OcrCommandExecutionState.isExecutionBlocked()
  ) {
    return;
  }

  const decisionsPipeline = [
    // async () => await handleWallTooClose({ cerebellumClient }),
    // async () => await handleDoors({ cerebellumClient }),
    async () => await handleCharacterPrediction({ cerebellumClient, ocrClient }),
  ];

  for (let decision of decisionsPipeline) {
    if (await decision()) {
      return;
    }
  } 


  if (!MovementState.isMoving()) {
    commands.sendGoForward(cerebellumClient); 
  }
}

module.exports = {
  think,
  isReady,
};
