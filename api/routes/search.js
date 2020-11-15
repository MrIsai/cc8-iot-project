const { Router } = require("express");
const { saveRequest } = require("../../db/requests");
const { getChanges } = require("../../db/changes");
const { buildHeader } = require("../../utils/header");
const { hardware } = require("../../constants");
const { existDevice } = require("../../utils/hardware.functions");
const { saveResponse } = require("../../db/responses");

const router = require("express").Router();

module.exports = router;
router.post("/", async (req, res) => {
    console.log("[SEARCH REQUEST]",req.body);
    const { insertedId } = await saveRequest(req.body, "search");
    const { id_hardware, start_date, finish_date } = req.body.search;
    if (id_hardware === null || start_date === null || finish_date === null) {
        const response = buildHeader();
        response["status"] = "ERROR";
        await saveResponse(response, "search", insertedId);
        res.send(response);
        return;
    } else if (!existDevice(id_hardware)) {
        const response = buildHeader();
        response["status"] = "ERROR";
        await saveResponse(response, "search", insertedId);
        res.send(response);
        return;
    }

    const devices = await getChanges(id_hardware, start_date, finish_date);
    if (!devices) {
        const response = buildHeader();
        response["status"] = "ERROR";
        res.send(response);
        return;
    }

    const response = buildHeader();
    response["search"] = {
        id_hardware,
        type: hardware[id_hardware].type,
    };

    const data = {};
    devices.forEach((d) => {
        data[d.date] = {
            sensor: d.sensor,
            status: d.status,
            text: d.text,
        };
    });

    response["data"] = data;
    console.log("[SEARCH RESPONSE]",response);
    await saveResponse(response, "search", insertedId);
    res.send(response);
});
