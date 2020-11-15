const { getCollection } = require("./collections");

const saveResponse = async (res, type, requestid) => {
    try {
        const responsesCollection = await getCollection("responses");
        const result = await responsesCollection.insertOne({
            ...res,
            type,
            _id: requestid,
        });

        return result;
    } catch (error) {
        console.log("error al insertar la respuesta", error);
        return null;
    }
};

module.exports = { saveResponse };
