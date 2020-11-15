const header = {
    id: "MWIsai",
    url: "https://3be140048bc9.ngrok.io",
};
const database_url = "mongodb://localhost:27017";
const hardware = {
    lights: {
        tag: "Luces Interiores",
        type: "input",
    },

    locks: {
        tag: "Cerraduras",
        type: "input",
    },

    heater: {
        tag: "Calentador/Calefactor",
        type: "input",
    },

    air: {
        tag: "Aire Acondicionado",
        type: "input",
    },
};

const headersvd = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain",
};

module.exports = {
    databaseUrl: database_url,
    hardware,
    headersvd,
    header,
};
