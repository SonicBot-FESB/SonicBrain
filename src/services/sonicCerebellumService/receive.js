const RobotMotoricsState = require("../../state/robotMotoricsState");
const FunctionMap = require("../../utils/functionMap");

const handlersByCommandName = new FunctionMap();
const { Movement: MovementState, Distances: DistancesState } = RobotMotoricsState;

function receiveDistanceSensorsValues(command, values) {
  values = values.map(Number);
  DistancesState.setDistanceMeasurements(values);
}
handlersByCommandName.map("DST", receiveDistanceSensorsValues);

function receiveGoBackResponse() {
  handleCommandFinished("BCK");
}
handlersByCommandName.map("BCK", receiveGoBackResponse);

function receiveGoForwardResponse() {
  handleCommandFinished("FWD");
}
handlersByCommandName.map("FWD", receiveGoForwardResponse);

function receiveTurnResponse(command, [absoluteRotation, relativeRotation]) {
  MovementState.stop();
  handleCommandFinished("TRN");
  absoluteRotation = Number(absoluteRotation);
  relativeRotation = Number(relativeRotation);
  console.log(`Turned to ${absoluteRotation} ${relativeRotation}`);
}
handlersByCommandName.map("TRN", receiveTurnResponse);

function receiveGetPositionResponse(
  command,
  [absoluteRotation, relativeRotation]
) {
  handleCommandFinished("POS");
  absoluteRotation = Number(absoluteRotation);
  relativeRotation = Number(relativeRotation);
  console.log(`Current position: ${absoluteRotation} ${relativeRotation}`);
}
handlersByCommandName.map("POS", receiveGetPositionResponse);

function receiveRebootResponse() {
  handleCommandFinished("RBT");
}
handlersByCommandName.map("RBT", receiveRebootResponse);

function handleCommandFinished(command) {
  let duration = null;
  try {
    duration = RobotMotoricsState.CommandExecution.commandExecuted(command);
  } catch (err) {
    console.log(`Command ${command} was not being executed`);
    return;
  }

  console.log(`Command ${command} executed in ${duration}ms`);
}

module.exports = handlersByCommandName;
