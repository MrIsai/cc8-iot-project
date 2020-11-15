const { MongoClient, ObjectId } = require("mongodb");
const { databaseUrl } = require("../constants");

const getCollection = async (collection) => {
    try {
        const client = await MongoClient.connect(databaseUrl, {
            useUnifiedTopology: true,
        });
        const db = client.db("middlewareDB");
        return db.collection(collection);
    } catch (error) {
        return null;
    }
};

const generateObjectId = () => ObjectId();
module.exports = { getCollection, generateObjectId };
