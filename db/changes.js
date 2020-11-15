const moment = require("moment-timezone");
const { getCollection } = require("./collections");

const saveChange = async (device, status, text, sensor) => {
    try {
        const changescollection = await getCollection("changes");
        const result = await changescollection.insertOne({
            deviceid: device,
            status,
            text,
            sensor,
            date: moment().tz("America/Guatemala").format(),
        });

        return result;
    } catch (error) {
        console.log("[ERROR] Ocurrio un error al insertar el cambio", error);
        return null;
    }
};

const getChanges = async (deviceid, startdate, finishdate) => {
    try {
        const changescollection = await getCollection("changes");
        const result = await changescollection.find({ deviceid });

        const startd = (new Date(startdate)).getTime();
        const finishd = (new Date(finishdate)).getTime();

        // filtrar los resultados entre el rango de las fechas dadas
        const devices = await result.toArray();
        const searcheddevices = devices.filter((device) => {
            const deviced = (new Date(device.date)).getTime();
            return startd < deviced && deviced < finishd;
        });
        return searcheddevices;
    } catch (error) {
        console.log("[ERROR] Error al recuperar los cambios", error);
        return null;
    }
};

module.exports = { saveChange, getChanges };
