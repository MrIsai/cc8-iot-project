const { hardware } = require("../constants");
const VirtualDevice = require("../models/VirtualDevice");

const existDevice = (deviceid) => {
    for (const id in hardware) if (id === deviceid) return true;
    return false;
};

const getInfoDevice = (deviceid) => {
    if (!existDevice(deviceid)) return null;
    const data = {};
    data["status"] = VirtualDevice.getInfo(deviceid);
    data["sensor"] = data["status"] ? 1 : 0;
    data["text"] = "default text";
    data["type"] = hardware[deviceid].type;
    return data;
};

module.exports = { existDevice, getInfoDevice };
