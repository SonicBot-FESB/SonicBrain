const { OcrCommandExecutionState } = require("../state/characterRecognitionState");
const RobotMotoricsState = require("../state/robotMotoricsState");

module.exports.isReady = function() {
  return (
    OcrCommandExecutionState.isConnected &&
    RobotMotoricsState.CommandExecution.isConnected
  );
}
