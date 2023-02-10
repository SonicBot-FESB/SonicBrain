// const net = require("net");
// const { 
//     CHARACTER_RECOGNITION_SERVER_HOST,
//     CHARACTER_RECOGNITION_SERVER_PORT,
// } = require("../../config");
// const CharacterRecognitionState = require("../../state/characterRecognitionState");
// const handlersByCommandName = require("./receive");
// const { receiveCharacterPredictions } = require("./receive");
// 
// 
// function listen() {
//     const server = net.createServer(onClientConnect);
//     server.listen(
//         CHARACTER_RECOGNITION_SERVER_PORT,
//         CHARACTER_RECOGNITION_SERVER_HOST,
//     );
//     return server;
// }
// 
// /**
//  * Set event handlers for a new client socket.
//  *
//  * @param {net.Socket} socket - Client socket
//  */
// function onClientConnect(socket) {
//     const { address, port } = socket.address;
//     console.log(`Connected character recognition client: ${address}:${port}`);
//     CharacterRecognitionState.isOcrConnected = true;
// 
//     socket.on("close", () => {
//         console.log(`Disconnected character recognition client: ${address}:${port}`);
//         CharacterRecognitionState.isOcrConnected = false;
//     });
//     socket.on("error", () => {
//         console.error(`${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`);
//         CharacterRecognitionState.isOcrConnected = false;
//     });
// 
//     socket.on("data", onData);
// }
// 
// function onData(data) {
//     data = data.toString();
//     const [command, ...values] = data.split(" ");
// 
//     const cmdHandler = handlersByCommandName.get(command);
// 
//     if (!cmdHandler) {
//         console.error(`Command not implemented: ${command}`);
//         return;
//     }
//     cmdHandler(command, values);
//     
// }
// 
// module.exports = listen;
