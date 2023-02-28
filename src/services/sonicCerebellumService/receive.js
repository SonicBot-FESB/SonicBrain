const { commandResponseReceived, sendPositionData, writePointsAsync } = require("../../metrics");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const FunctionMap = require("../../utils/functionMap");

const { Movement: MovementState, Distances: DistancesState } = RobotMotoricsState;

async function receiveDistanceSensorsValues(command, values) {
  values = values.map(Number);
  DistancesState.setDistanceMeasurements(values);
}

async function receiveGoBackResponse() {
  handleCommandFinished("BCK");
  await commandResponseReceived({ service: "cerebellum", value: "BCK"})
}

async function receiveGoForwardResponse() {
  handleCommandFinished("FWD");
  await commandResponseReceived({ service: "cerebellum", value: "FWD"})
}

async function receiveTurnResponse(command, [absoluteRotation, relativeRotation]) {
  handleCommandFinished("TRN");
  MovementState.stop(); // After turning the robot stops
  absoluteRotation = Number(absoluteRotation);
  relativeRotation = Number(relativeRotation);
  console.log(`Turned to ${absoluteRotation} ${relativeRotation}`);

  const currentDate = new Date();
  await writePointsAsync([
    commandResponseReceived({ service: "cerebellum", value: `RTT ${absoluteRotation} ${relativeRotation}`}, currentDate, true),
    sendPositionData({ position: absoluteRotation }, currentDate, true)
  ])
}

async function receiveGetPositionResponse(
  command,
  [absoluteRotation, relativeRotation]
) {
  handleCommandFinished("POS");
  absoluteRotation = Number(absoluteRotation);
  relativeRotation = Number(relativeRotation);
  console.log(`Current position: ${absoluteRotation} ${relativeRotation}`);

  const currentDate = new Date();

  await writePointsAsync([
    commandResponseReceived({ service: "cerebellum", value: `POS ${absoluteRotation} ${relativeRotation}`}, currentDate, true),
    sendPositionData({ position: absoluteRotation }, currentDate, true)
  ])
}

async function receiveRebootResponse() {
  handleCommandFinished("RBT");
  await commandResponseReceived({ service: "cerebellum", value: "RBT"})
}

async function receiveError(cmd, args) {
  RobotMotoricsState.CommandExecution.erroredOut();
  console.log("ERROR");
  console.log(args.join(" "));

  await commandResponseReceived({ service: "cerebellum", value: `ERR ${args.join(" ")}`})
}

async function receiveStopResponse(cmd, args) {
  handleCommandFinished("STP");
  await commandResponseReceived({ service: "cerebellum", value: "STP"})
}


async function receiveResetPositionResponse(cmd, args) {
  handleCommandFinished("RPS");
  await commandResponseReceived({ service: "cerebellum", value: `RPS ${args.join(" ")}`})
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
