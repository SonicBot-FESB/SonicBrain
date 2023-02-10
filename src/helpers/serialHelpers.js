const serial = require("serialport");

async function getDeviceSerialPort() {
    const {
        MICROCONTROLLER_SERIAL_PORT,
        BAUD_RATE,
    } = process.env;

    const ports = await serial.SerialPort.list();
    const devicePortInfo = ports.filter(port =>
        port.path === MICROCONTROLLER_SERIAL_PORT
    )[0];
    
    if (!devicePortInfo) {
        throw new Error("Teensy not connected");
    }

    const serialPort = new serial.SerialPort({
        path: devicePortInfo.path,
        baudRate: Number(BAUD_RATE),
    });

    return serialPort
}

module.exports = {
    getDeviceSerialPort
}
