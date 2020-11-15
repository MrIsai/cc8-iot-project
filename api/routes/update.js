const { saveRequest } = require("../../db/requests");
const { saveResponse } = require("../../db/responses");
const { Events } = require("../../models/Events");
const { executeEvent } = require("../../utils/events.functions");
const { buildHeader } = require("../../utils/header");

const router = require("express").Router();
module.exports = router;

router.post("/", async (req, res) => {
    const { insertedId } = await saveRequest(req.body, "update");
    const { update } = req.body;
    const idevent = update.id;

    if (!update) {
        const response = buildHeader({ status: "ERROR" });
        await saveResponse(response, "update", insertedId);
        res.send(response);
        return;
    }

    Events.updateEvent(
        async () => {
            await executeEvent(update, idevent);
        },
        parseInt(update.if.left.freq),
        idevent
    );

    const response = buildHeader({status: "OK"});
    await saveResponse(response, "update", insertedId);
    res.send(response);
});
