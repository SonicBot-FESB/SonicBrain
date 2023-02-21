const { OcrCommandExecutionState } = require("../state/characterRecognitionState");
const RobotMotoricsState = require("../state/robotMotoricsState");

module.exports.isReady = function() {
  return (
    RobotMotoricsState.CommandExecution.isConnected &&
    OcrCommandExecutionState.isConnected
  );
}
