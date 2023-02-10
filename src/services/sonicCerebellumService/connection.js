const { getDeviceSerialPort } = require("../../helpers/serialHelpers");
const serial = require("serialport");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const handlersByCommandName = require("./receive");

async function connect() {
    let serialPort;
    try {
        serialPort = await getDeviceSerialPort();
    } catch {
        return null;
    }
    RobotMotoricsState.CommandExecution.isConnected = true;

    const readParser = new serial.ReadlineParser();
    serialPort.pipe(readParser);

    readParser.on("data", onData);
    readParser.on("close", () => {
        console.log("Connection to microcontroller ended!");
        RobotMotoricsState.CommandExecution.isConnected = false; 
    });
    readParser.on("error", (error) => {
        console.log(`Connection to microcontroller errored: ${error}`);
        RobotMotoricsState.CommandExecution.isConnected = false;
    });

    return serialPort;
}

function onData(data) {
    data = data.slice(0, -1);
    const [command, ...values] = data.split(" ")

    const cmdHandler = handlersByCommandName[command];
    if (!cmdHandler) {
        console.log(`Command not implemented: ${command}`);
        return;
    }

    cmdHandler(command, values);
}

module.exports = connect;
