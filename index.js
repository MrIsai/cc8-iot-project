const express = require("express");
const app = express();
const routeIndex = require("./api/routes");
const { headersvd } = require("./constants");
const VirtualDevice = require("./models/VirtualDevice");
const PORT = 4000;
//require("dotenv/config");

app.use(express.text());
app.post("/", (req, res, next) => {
    VirtualDevice.connected = true;

    VirtualDevice.saveChanges(req.body);

    const response = VirtualDevice.getSettings();
    //console.log("response >", response);
    res.set({ ...headersvd, "Content-Length": response.length });
    res.send(response);
});

app.use(express.json());

/* Routes */
routeIndex(app);

app.listen(PORT, () => {
    console.log(`The server is listening in port ${PORT}...`);
});
