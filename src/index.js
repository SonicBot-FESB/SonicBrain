const OcrService = require("./services/ocrService");
const CerebellumService = require("./services/sonicCerebellumService");
const { CharacterRecognitionState } = require("./state/characterRecognitionState.js");
const RobotMotoricsState = require("./state/robotMotoricsState.js");
const Brain = require("./brain");
const { sendResetPosition } = require("./services/sonicCerebellumService/send.js");
const { delay } = require("./utils/sleep.js");

async function main(){
    let ocrClient = null;
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
        }
    }, 1000);


    while (1) {
        if (Brain.isReady()) {
            await Brain.think(cerebellumClient, ocrClient);
        }
        await delay(10);
    }
}

main();
