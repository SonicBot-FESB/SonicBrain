const { commandResponseReceived, sendPositionData, writePointsAsync } = require("../../metrics");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const FunctionMap = require("../../utils/functionMap");

const { Movement: MovementState, Distances: DistancesState } = RobotMotoricsState;

function receiveDistanceSensorsValues(command, values) {
  values = values.map(Number);
  DistancesState.setDistanceMeasurements(values);
}

function receiveGoBackResponse() {
  handleCommandFinished("BCK");
  commandResponseReceived({ service: "cerebellum", value: "BCK"})
}

function receiveGoForwardResponse() {
  handleCommandFinished("FWD");
  commandResponseReceived({ service: "cerebellum", value: "FWD"})
}

function receiveTurnResponse(command, [absoluteRotation, relativeRotation]) {
  handleCommandFinished("TRN");
  MovementState.stop(); // After turning the robot stops
  absoluteRotation = Number(absoluteRotation);
  relativeRotation = Number(relativeRotation);
  console.log(`Turned to ${absoluteRotation} ${relativeRotation}`);

  const currentDate = new Date();
  writePointsAsync([
    commandResponseReceived({ service: "cerebellum", value: `RTT ${absoluteRotation} ${relativeRotation}`}, currentDate, true),
    sendPositionData({ position: absoluteRotation }, currentDate, true)
  ])
}

function receiveGetPositionResponse(
  command,
  [absoluteRotation, relativeRotation]
) {
  handleCommandFinished("POS");
  absoluteRotation = Number(absoluteRotation);
  relativeRotation = Number(relativeRotation);
  console.log(`Current position: ${absoluteRotation} ${relativeRotation}`);

  const currentDate = new Date();

  writePointsAsync([
    commandResponseReceived({ service: "cerebellum", value: `POS ${absoluteRotation} ${relativeRotation}`}, currentDate, true),
    sendPositionData({ position: absoluteRotation }, currentDate, true)
  ])
}

function receiveRebootResponse() {
  handleCommandFinished("RBT");
  commandResponseReceived({ service: "cerebellum", value: "RBT"})
}

function receiveError(cmd, args) {
  RobotMotoricsState.CommandExecution.erroredOut();
  console.log("ERROR");
  console.log(args.join(" "));

  commandResponseReceived({ service: "cerebellum", value: `ERR ${args.join(" ")}`})
}

function receiveStopResponse(cmd, args) {
  handleCommandFinished("STP");
  commandResponseReceived({ service: "cerebellum", value: "STP"})
}


function receiveResetPositionResponse(cmd, args) {
  handleCommandFinished("RPS");
  commandResponseReceived({ service: "cerebellum", value: `RPS ${args.join(" ")}`})
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
  "RPS": receiveResetPositionResponse,
};

module.exports = handlersByCommandName;
