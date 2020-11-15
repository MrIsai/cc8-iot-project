const moment = require("moment-timezone");
const { ObjectId } = require("mongodb");
const { getCollection, generateObjectId } = require("./collections");

const saveNewEvent = async (event, requestid, idEvent) => {
    const data = {};
    data["_id"] = generateObjectId();
    data["event"] = event;
    data["date"] = moment().tz("America/Guatemala").format();
    data["requestid"] = requestid;
    data["idEvent"] = idEvent;

    const eventsCollection = await getCollection("events");
    const result = await eventsCollection.insertOne(data);
    return result;
};

const updateEvent = async (eventId, event) => {
    const eventsCollection = await getCollection("events");
    const result = await eventsCollection.updateOne(
        { _id: ObjectId(eventId) },
        { $set: { event: event } }
    );
};

const deleteEvent = async (eventId) => {
    try {
        const eventsCollection = await getCollection("events");
        const result = await eventsCollection.deleteOne({
            idEvent: ObjectId(eventId),
        });
        return result.deletedCount === 1;
    } catch (error) {
        console.log("[ERROR] No se pudo eliminar el evento.");
        return null;
    }
};

module.exports = { saveNewEvent, deleteEvent, updateEvent };
