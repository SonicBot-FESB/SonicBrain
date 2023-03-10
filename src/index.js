const OcrService = require("./services/ocrService");
const CerebellumService = require("./services/sonicCerebellumService");
const { OcrCommandExecutionState } = require("./state/characterRecognitionState.js");
const RobotMotoricsState = require("./state/robotMotoricsState.js");
const Brain = require("./brain");
const { sendResetPosition } = require("./services/sonicCerebellumService/send.js");
const { delay } = require("./utils/sleep.js");


/* 
* TODO: if wall to close front, check if there are doors on left and right
* If last turn was LEFT and the robot goes to turn RIGHT check how long was he going forward inbetween
*
*/

async function main(){
    let ocrClient = null;
    console.log("Connecting to OCR service");
    const intervalId1 = setInterval(() => {
        ocrClient = OcrService.client.connect()
        if (OcrCommandExecutionState.isConnected) {
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
            await sendResetPosition(cerebellumClient);
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
