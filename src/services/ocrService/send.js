const net = require("net");
const { commandSent } = require("../../metrics");
const { OcrCommandExecutionState } = require("../../state/characterRecognitionState");

/**
 * Send STT command to image recognition server.
 *
 * @param {net.Socket} client - 
 */
module.exports.startOcr = function(client) {
    client.write("ONN");
    commandSent({service: "ocr", value: "ONN"})
}

module.exports.stopOcr = function(client) {
    client.write("OFF");
    commandSent({service: "ocr", value: "OFF"})
}

module.exports.getStatus = function(client) {
    client.write("STT");
    commandSent({service: "ocr", value: "STT"})
}

module.exports.getPrediction = function(client) {
    client.write("PRD");
    commandSent({service: "ocr", value: "PRD"})
    OcrCommandExecutionState.setCommandInExecution("PRD")
}
