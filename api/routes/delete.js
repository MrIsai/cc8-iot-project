const { saveRequest } = require("../../db/requests");
const { deleteEvent } = require("../../db/events");
const { buildHeader } = require("../../utils/header");
const { saveResponse } = require("../../db/responses");
const { Events } = require("../../models/Events");

const router = require("express").Router();
module.exports = router;

router.post("/", async (req, res) => {
    console.log("delete =>", req.body);
    const { insertedId } = await saveRequest(req.body, "delete");
    Events.deleteEvent(req.body.delete.id);
    const isDeleted = await deleteEvent(req.body.delete.id);
    
    const response = buildHeader({ status: isDeleted ? "OK" : "ERROR" });
    await saveResponse(response, "delete", insertedId);
    console.log("response to delete", response);
    res.send(response);
});
