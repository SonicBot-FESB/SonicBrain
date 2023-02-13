const net = require("net");
const OcrCommandExecutionState = require("../../state/characterRecognitionState");

/**
 * Send STT command to image recognition server.
 *
 * @param {net.Socket} client - 
 */
module.exports.startOcr = function(client) {
    client.write("ONN");
}

module.exports.stopOcr = function(client) {
    client.write("OFF");
}

module.exports.getStatus = function(client) {
    client.write("STT");
}

module.exports.getPrediction = function(client) {
    client.write("PRD");
    OcrCommandExecutionState.setCommandInExecution("PRD");
}
