const dotenv = require("dotenv");
dotenv.config();

exports.CHARACTER_RECOGNITION_SERVER_HOST =
  process.env["CHARACTER_RECOGNITION_SERVER_HOST"];
exports.CHARACTER_RECOGNITION_SERVER_PORT =
  process.env["CHARACTER_RECOGNITION_SERVER_PORT"];

exports.API_SERVER_HOST = process.env["API_SERVER_HOST"];
exports.API_SERVER_PORT = process["API_SERVER_HOST"];

exports.MICROCONTROLLER_SERIAL_NUMBER =
  process.env["MICROCONTROLLER_SERIAL_NUMBER"];
exports.BAUD_RATE = process.env["BAUD_RATE"];
