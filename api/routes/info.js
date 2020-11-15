const router = require("express").Router();
const { hardware } = require("../../constants");
const { saveRequest } = require("../../db/requests");
const { saveResponse } = require("../../db/responses");
const { buildHeader } = require("../../utils/header");

router.post("/", async (req, res) => {
    const { insertedId } = await saveRequest(req.body, "info");
    const response = buildHeader();
    response["hardware"] = hardware;
    console.log("respondiendo", response);
    const { insertedCount } = await saveResponse(response, "info", insertedId);
    res.send(response);
});

module.exports = router;
