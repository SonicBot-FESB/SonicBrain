const { execSync } = require("child_process");
const { ReadlineParser } = require("serialport");
const serial = require("serialport");
const { getDeviceSerialPort } = require("./helpers/serialHelpers.js");
const OcrService = require("./services/ocrService");
const CerebellumService = require("./services/sonicCerebellumService");
const CharacterRecognitionState = require("./state/characterRecognitionState.js");
const RobotMotoricsState = require("./state/robotMotoricsState.js");
const Brain = require("./brain");
const { sendResetPosition, sendStop } = require("./services/sonicCerebellumService/send.js");
const { delay } = require("./utils/sleep.js");

const buffer = [];
function onSerialReadLine(line) {
    buffer.push(line);
}

async function test_serial() {
    const buffer = [];
    const serialPort = await getDeviceSerialPort();

    const parser = new serial.ReadlineParser();
    serialPort.pipe(parser);
    parser.on("data", console.log);
}

async function main(){
    let ocrClient = null;
    console.log("Connecting to OCR server...")
    const intervalId1 = setInterval(() => {
        ocrClient = OcrService.client.connect()
        if (CharacterRecognitionState.isConnectedToOcr) {
            clearInterval(intervalId1);
            console.log("Connected to OCR server!")
        }
    }, 1000);

    let cerebellumClient = null;
    console.log("Connecting to microcontroller");
    const intervalId2 = setInterval(async () => {
        cerebellumClient = await CerebellumService.connect();
        if (RobotMotoricsState.CommandExecution.isConnected) {
            clearInterval(intervalId2);
            console.log("Connected to teensy");
            sendResetPosition(cerebellumClient);
            // sendStop(cerebellumClient);
        }
    }, 1000);


    while (1) {
        if (Brain.isReady()) {
            await Brain.think(cerebellumClient);
        }
        await delay(10);
    }
}

main();
