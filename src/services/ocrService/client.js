const net = require("net");
const { CHARACTER_RECOGNITION_SERVER_HOST, CHARACTER_RECOGNITION_SERVER_PORT } = require("../../config");
const CharacterRecognitionState = require("../../state/characterRecognitionState");
const handlersByCommandName = require("./receive");

const connect = (function() {
    let client = null;
    return function() {
        if (client) {
            return client;
        }

        client = net.connect({
            host: CHARACTER_RECOGNITION_SERVER_HOST,
            port: CHARACTER_RECOGNITION_SERVER_PORT,
        });

        client.on("error", (error) => {
            client = null;
            if (!error.toString().includes("ECONNREFUSED")) {
                console.log(`Connection Error ${error}`);
            }
            CharacterRecognitionState.isConnectedToOcr = false; 
        });
        client.on("connect", onConnect);
        client.on("data", onData);

        return client;
    }
})()


function onData(data) {
    data = data.toString();
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
    CharacterRecognitionState.isConnectedToOcr = true; 
}

module.exports = connect;
