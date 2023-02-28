const net = require("net");
const { commandSent } = require("../../metrics");
const { OcrCommandExecutionState } = require("../../state/characterRecognitionState");

/**
 * Send STT command to image recognition server.
 *
 * @param {net.Socket} client - 
 */
module.exports.startOcr = async function(client) {
    client.write("ONN");
    await commandSent({service: "ocr", value: "ONN"})
}

module.exports.stopOcr = async function(client) {
    client.write("OFF");
    await commandSent({service: "ocr", value: "OFF"})
}

module.exports.getStatus = async function(client) {
    client.write("STT");
    await commandSent({service: "ocr", value: "STT"})
}

module.exports.getPrediction = async function(client) {
    client.write("PRD");
    await commandSent({service: "ocr", value: "PRD"})
    OcrCommandExecutionState.setCommandInExecution("PRD")
}
