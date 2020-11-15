const { saveRequest } = require("../../db/requests");
const { saveResponse } = require("../../db/responses");
const { buildHeader } = require("../../utils/header");
const router = require("express").Router();
const VirtualDevice = require("../../models/VirtualDevice");
const { saveChange } = require("../../db/changes");
module.exports = router;

router.post("/", async (req, res) => {
    console.log("[CHANGE Request]", req.body);
    const { insertedId } = await saveRequest(req.body, "change");
    const { id, url, date, change } = req.body;
    let newsettings;

    // si no esta conectado el virtual device retornar error
    if (!VirtualDevice.connected) {
        const response = buildHeader();
        response["status"] = "ERROR";
        res.send(response);
        return;
    }

    // si los parametros no vienen completos retornar error
    if (!id || !change) {
        const response = buildHeader();
        response["status"] = "ERROR";
        res.send(response);
        await saveResponse(response, "change", insertedId);
        return;
    }
    
    for (const deviceid in change) {
        //const status = change[deviceid].status == "true";
        const { status, text } = change[deviceid];
        newsettings = VirtualDevice.setDeviceSetting(deviceid, status, text);
    }

    const response = buildHeader();
    response["status"] = "OK";
    const { insertedCount } = await saveResponse(
        response,
        "change",
        insertedId
    );
    console.log("[CHANGE Response]", response);
    res.send(response);
});
