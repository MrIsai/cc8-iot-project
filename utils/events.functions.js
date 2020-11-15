const { buildHeader, getHeader } = require("./header");
const moment = require("moment-timezone");
const { existDevice, getInfoDevice } = require("./hardware.functions");
const VirtualDevice = require("../models/VirtualDevice");
const fetch = require("node-fetch");
const axios = require("axios");

const compareSensor = (sensorl, sensord, condition) => {
    if (condition == "=") return sensorl == sensord;
    else if (condition == ">") return sensorl > sensord;
    else if (condition == "<") return sensorl < sensord;
    else if (condition == ">=") return sensorl >= sensord;
    else if (condition == "<=") return sensorl <= sensord;
    else if (condition == "!=") return sensorl != sensord;
    return false;
};

const executeEvent = async (event, eventid) => {
    if (eventid) console.log(`\n---\nExecuting event with id: ${eventid}`);
    let deviceinfo;
    const ifcondition = event.if;
    const ifthen = event.then;
    const ifelse = event.else;

    if (ifcondition.left.url === getHeader().url) {
        // buscar en mis dispositivos
        deviceinfo = getInfoDevice(ifcondition.left.id);
    } else {
        // buscar en otro middleware
        const { id, url } = ifcondition.left;
        try {
            deviceinfo = await searchDevice(id, url);
        } catch (error) {
            console.log("[ERROR]: Ocurrio un error al buscar.");
            return null;
        }
    }

    if (deviceinfo.type === "input") {
        const { sensor } = ifcondition.right;

        const { condition } = ifcondition;
        const sensorl = deviceinfo.sensor;
        console.log("comparando", compareSensor(sensorl, sensor, condition));
        const comparingdevices = compareSensor(sensorl, sensor, condition);
        console.log("ejecutando consecuencia");

        let eventState = null;
        if(ifthen && ifelse){
            eventState = await executeConsequence(
                comparingdevices ? ifthen : ifelse
            );
            console.log("retornando", eventState);
            return eventState;
        }else if(ifthen && !ifelse){
            if(comparingdevices) eventState = await executeConsequence(ifthen);
        }
    } else {
    }

    console.log("---");
};

const executeConsequence = async (e) => {
    const { url, id, status, text } = e;
    if (!url || !id) return false;

    if (url === getHeader().url) {
        if (existDevice(id)) {
            VirtualDevice.setDeviceSetting(id, status, text);
            return true;
        }
    }

    const changerequest = buildHeader();
    const changebody = {};
    changebody[id] = {
        status,
        text,
    };
    changerequest["change"] = changebody;
    const requestr = await axios({method: 'POST', url: `${url}/change`, data: changerequest});
    const resp = requestr.data;
    return resp.status === "OK";
};

const searchDevice = async (deviceid, url) => {
    const myinformation = buildHeader();
    myinformation["search"] = {
        id_hardware: deviceid,
        start_date: moment().subtract(3, "seconds").format(),
        finish_date: moment().add(3, "seconds").format(),
    };
    const searchdata = { ...myinformation };
    const deviceinforesponse = await axios({
        method: "post",
        url: `${url}/search`,
        data: searchdata,
    });
    const { search, data } = deviceinforesponse.data;
    const deviceinfo = {
        type: search.type,
        ...data[Object.keys(data)[Object.keys(data).length - 1]],
        id_hardware: search.id_hardware,
    };

    console.log("device searched", deviceinfo);
    return deviceinfo;
};

module.exports = {
    compareSensor,
    executeEvent,
    searchDevice,
    executeConsequence,
};
