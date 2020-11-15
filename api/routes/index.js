const info = require("./info");
const search = require("./search");
const change = require("./change");
const create = require("./create");
const update = require("./update");
const delete_r = require("./delete");

module.exports = (app) => {
    app.use("/info", info);
    app.use("/search", search);
    app.use("/change", change);
    app.use("/create", create);
    app.use("/update", update);
    app.use("/delete", delete_r);
};
