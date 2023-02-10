const connect = require("./connection.js");

module.exports = {
    connect: connect,
    commands: require("./send.js"),
}
