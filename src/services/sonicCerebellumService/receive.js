const RobotMotoricsState = require("../../state/robotMotoricsState");
const FunctionMap = require("../../utils/functionMap");

const { Movement: MovementState, Distances: DistancesState } = RobotMotoricsState;

function receiveDistanceSensorsValues(command, values) {
  values = values.map(Number);
  DistancesState.setDistanceMeasurements(values);
}

function receiveGoBackResponse() {
  handleCommandFinished("BCK");
}

function receiveGoForwardResponse() {
  console.log("GOT FWD BACK");
  handleCommandFinished("FWD");
}

function receiveTurnResponse(command, [absoluteRotation, relativeRotation]) {
  MovementState.stop();
  handleCommandFinished("TRN");
  absoluteRotation = Number(absoluteRotation);
  relativeRotation = Number(relativeRotation);
  console.log(`Turned to ${absoluteRotation} ${relativeRotation}`);
}

function receiveGetPositionResponse(
  command,
  [absoluteRotation, relativeRotation]
) {
  handleCommandFinished("POS");
  absoluteRotation = Number(absoluteRotation);
  relativeRotation = Number(relativeRotation);
  console.log(`Current position: ${absoluteRotation} ${relativeRotation}`);
}

function receiveRebootResponse() {
  handleCommandFinished("RBT");
}

function receiveError(cmd, args) {
  console.log("ERROR");
  console.log(args.join(" "));
}

function receiveStopResponse(cmd, args) {
  handleCommandFinished("STP");
}


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


const handlersByCommandName = {
  "DST": receiveDistanceSensorsValues,
  "BCK": receiveGoBackResponse,
  "FWD": receiveGoForwardResponse,
  "TRN": receiveTurnResponse,
  "POS": receiveGetPositionResponse,
  "RBT": receiveRebootResponse,
  "STP": receiveStopResponse,
  "ERR": receiveError,
};

module.exports = handlersByCommandName;
