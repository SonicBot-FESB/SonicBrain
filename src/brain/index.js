const RobotMotoricsState = require("../state/robotMotoricsState");
const { commands } = require("../services/sonicCerebellumService");
const OcrCommandExecutionState = require("../state/characterRecognitionState");
const { isReady } = require("./isReady");
const { handleWallTooClose } = require("./decisions/handleWallTooClose");
const { handleDoors } = require("./decisions/handleDoors");


function think(cerebellumClient) {
  const { CommandExecution, Movement: MovementState } = RobotMotoricsState;

  if (
    CommandExecution.isExecutionBlocked() ||
    OcrCommandExecutionState.isExecutionBlocked()
  ) {
    return;
  }

  const decisionsPipeline = [
    // () => handleWallTooClose(cerebellumClient),
    () => handleDoors(cerebellumClient),
  ];

  for (let decision of decisionsPipeline) {
    if (decision()) {
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
