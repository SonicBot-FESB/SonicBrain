const serial = require("serialport");

async function getDeviceSerialPort() {
    const {
        MICROCONTROLLER_SERIAL_NUMBER,
        BAUD_RATE,
    } = process.env;

    const ports = await serial.SerialPort.list();
    const devicePortInfo = ports.filter(port =>
        port.serialNumber === MICROCONTROLLER_SERIAL_NUMBER
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
