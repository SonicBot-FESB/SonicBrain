const serial = require("serialport");
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
module.exports.sendGoForward = function (serialPort) {
    handleExecuteCommand("FWD");
    MovementState.goForward(); 
    serialPort.write("FWD\n");
};

module.exports.sendGoBackward = function (serialPort) {
    handleExecuteCommand("BCK");
    MovementState.goBack();
    serialPort.write("BCK\n");
};

module.exports.sendStop = function (serialPort) {
    handleExecuteCommand("STP");
    MovementState.stop();
    serialPort.write("STP\n");
};

module.exports.sendTurn = function (serialPort, degrees, direction, resetPosition) {
    handleExecuteCommand("TRN");
    MovementState.turn();
    console.log(`TRN ${degrees} ${direction} ${resetPosition}`);
    serialPort.write(`TRN ${degrees} ${direction}\n`);
};

module.exports.sendGetPosition = function (serialPort) {
    handleExecuteCommand("POS");
    serialPort.write("POS\n"); }

module.exports.sendReboot = function (serialPort) {
    handleExecuteCommand("RBT");
    serialPort.write("RBT\n");
}

function handleExecuteCommand(command) {
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
