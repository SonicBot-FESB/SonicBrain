const RobotMotoricsState = require("../state/robotMotoricsState");

module.exports.isReady = function() {
  return RobotMotoricsState.CommandExecution.isConnected;
}
