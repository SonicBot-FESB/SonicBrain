const connect = require("./client.js");

module.exports = {
    client: {
        connect: connect,
        send: require("./send.js"),
    },
};
