const { buildHeader } = require("../../utils/header");
const { executeEvent } = require("../../utils/events.functions");
const { saveRequest } = require("../../db/requests");
const { saveResponse } = require("../../db/responses");
const { saveNewEvent } = require("../../db/events");
const { ObjectId } = require("mongodb");
const { Events } = require("../../models/Events");

const router = require("express").Router();
module.exports = router;

router.post("/", async (req, res) => {
    console.log("create =>", req.body.create);
    const { insertedId } = await saveRequest(req.body, "create");
    const { create } = req.body;
    if (!create) {
        const response = buildHeader({ status: "ERROR" });
        await saveResponse(response, "create", insertedId);
        res.send(response);
        return;
    }

    const eState = await executeEvent(create);
    if (eState) {
        const response = buildHeader({ status: "OK" });
        response["idEvent"] = ObjectId();
        await saveNewEvent(create, insertedId, response["idEvent"]);
        Events.addAndExecuteEvent(
            async () => {
                await executeEvent(create, response["idEvent"]);
            },
            parseInt(create.if.left.freq),
            response["idEvent"]
        );

        console.log("id del intervalor", insertedId);
        console.log("response =>", response);
        await saveResponse(response, "create", insertedId);

        res.send(response);
    } else {
        const response = buildHeader({ status: "ERROR" });
        console.log("response =>", response);
        await saveResponse(response, "create", insertedId);
        res.send(response);
    }
});
