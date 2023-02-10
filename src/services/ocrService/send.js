const net = require("net");

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
