const net = require("net");
const { CHARACTER_RECOGNITION_SERVER_HOST, CHARACTER_RECOGNITION_SERVER_PORT } = require("../../config");
const { OcrCommandExecutionState } = require("../../state/characterRecognitionState");
const handlersByCommandName = require("./receive");

const connect = (function() {
    let client = null;
    return function() {
        if (client) {
            return client;
        }

        client = net.connect({
            host: CHARACTER_RECOGNITION_SERVER_HOST,
            port: CHARACTER_RECOGNITION_SERVER_PORT, });


        OcrCommandExecutionState.isConnected = true; 
        client.on("error", (error) => {
            client = null;
            if (!error.toString().includes("ECONNREFUSED")) {
                console.log(`Connection Error ${error}`);
            }
            OcrCommandExecutionState.isConnected = false; 
        });
        client.on("close", () => {
            console.log("Disconnected from OCR client");
            client = null;
            OcrCommandExecutionState.isConnected = false; 
        });
        client.on("connect", onConnect);
        client.on("data", onData);

        return client;
    }
})()


function onData(data) {
    data = data.toString().trim();
    const [command, ...values] = data.split(" ");

    const cmdHandler = handlersByCommandName[command];
    if (! cmdHandler) {
        console.error(`Command not implemented: ${command}`);
        return;
    }
    cmdHandler(command, values);
}


/**
 * Called when the client socket successfuly connects to the server.
 *
 * @param {net.Socket} socket - Server socket
 */
function onConnect() {
    OcrCommandExecutionState.isConnected = true; 
}

module.exports = connect;
