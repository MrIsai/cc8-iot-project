const moment = require("moment-timezone");
const { header } = require("../constants");

const buildHeader = (options) => {
    const headertoreturn = { ...header };
    headertoreturn["date"] = moment().tz("America/Guatemala").format();

    if (options) {
        if (options.status !== null && typeof options.status !== "undefined") {
            return { ...headertoreturn, status: options.status };
        }
    }
    return headertoreturn;
};

const getHeader = () => header;

exports.buildHeader = buildHeader;
exports.getHeader = getHeader;
