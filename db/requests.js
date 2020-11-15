const { getCollection } = require("./collections");

const saveRequest = async (req, type) => {
    try {
        const requestsCollection = await getCollection("requests");
        const result = await requestsCollection.insertOne({ ...req, type });
        return result;
    } catch (error) {
        console.log("Error al insertar el request", error);
        return null;
    }
};

const getRequests = async () => {
    try {
    } catch (error) {}
};

module.exports = {
    saveRequest,
};
