const serial = require("serialport");
const { commandSent } = require("../../metrics");
const RobotMotoricsState = require("../../state/robotMotoricsState");

module.exports.TURN_DIRECTIONS = {
    turnRight: "R",
    turnLeft: "L",
};

module.exports.RESET_POSITION = {
    yes: 1,
    no: 0,
}

const { Movement: MovementState } = RobotMotoricsState;

/**
* Send FWD command to microcontroller.
*
* @param {serial.SerialPort} serialPort - Serial port socket.
*/
module.exports.sendGoForward = async function (serialPort) {
    await handleExecuteCommand("FWD");
    MovementState.goForward(); 
    serialPort.write("FWD\n");
};

module.exports.sendGoBackward = async function (serialPort) {
    await handleExecuteCommand("BCK");
    MovementState.goBack();
    serialPort.write("BCK\n");
};

module.exports.sendStop = async function (serialPort) {
    await handleExecuteCommand("STP");
    MovementState.stop();
    serialPort.write("STP\n");
};

module.exports.sendTurn = async function (serialPort, degrees, direction, resetPosition) {
    await handleExecuteCommand("TRN");
    MovementState.turn();
    serialPort.write(`TRN ${degrees} ${direction} ${resetPosition}\n`);
};

module.exports.sendGetPosition = async function (serialPort) {
    await handleExecuteCommand("POS");
    serialPort.write("POS\n"); }

module.exports.sendReboot = async function (serialPort) {
    await handleExecuteCommand("RBT");
    serialPort.write("RBT\n");
}

module.exports.sendResetPosition = async function (serialPort) {
    await handleExecuteCommand("RPS");
    serialPort.write("RPS\n");
}

async function handleExecuteCommand(command) {
    await commandSent({ service: "cerebellum", value: command })

    const isBlocked = RobotMotoricsState.CommandExecution.isExecutionBlocked();
    if (isBlocked) {
        console.log("Robot is blocked, can't accept new commands");
        return;
    }
    RobotMotoricsState.CommandExecution.setCommandInExecution(command);
}

// module.exports.sendGetEncoderCounts = function (serialPort) {
//     serialPort.write("ENC");
// }
