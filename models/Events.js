const { ObjectId } = require("mongodb");

class Event {
    constructor() {
        this.event = null;
        this.eventId = null;
    }

    executeEvent(func, delay, id) {
        this.event = setInterval(() => func(), delay);
        this.eventId = id;
        return this.event;
    }

    stopEvent() {
        if (this.event != null) {
            console.log(`[EVENT] ${this.id} ELIMINADO!`);
            clearInterval(this.event);
            return true;
        }

        return false;
    }

    updateEvent() {}
}

class Events {
    constructor() {
        this.events = [];
    }

    addAndExecuteEvent(evento, delay, id) {
        const e = new Event();
        e.executeEvent(evento, delay, id);
        console.log("[EVENTO CREADO] id:", e.eventId);
        this.events.push(e);

        const ids = this.events.map((v) => v.eventId);
        console.log("\nEVENTOS DISPONIBLES", ids, "\n");
    }

    deleteEvent(id) {
        this.events = this.events.filter((e, i) => {
            if (e.eventId.toString() != ObjectId(id).toString()) return true;
            else {
                console.log("[EVENTS] Eliminando evento", id);
                e.stopEvent();
                return false;
            }

        });

        const ids = this.events.map((v) => v.id);
        console.log("\nEVENTOS DISPONIBLES DESPUES DE ELIMINAR", ids, "\n");

        return true;
    }

    updateEvent(evento, delay, id) {
        console.log("Actualizando Evento", id);
        if (this.deleteEvent(id)) {
            this.addAndExecuteEvent(evento, delay, id);
        } else {
            console.log("NO SE PUDO ACTUALIZAR EL EVENTO.");
        }
    }
}

exports.Events = new Events();
