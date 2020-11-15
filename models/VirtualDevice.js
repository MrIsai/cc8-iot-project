const { saveChange } = require("../db/changes");

class VirtualDevice {
    message = "";
    constructor() {
        this.LIGHTS = 0x4;
        this.LOCKS = 0x2;
        this.FAN = 0x1;

        this.HEATER = 0x1;

        this.setting = "000000000000000000000000".split(""); //Todo inicia apagado
        this.text = "<--- CCVIII --->";

        this.isConfigured = false;
        this.connected = false;
        for (let i = 0; i < this.text.length; i++) {
            this.message += this.text.charCodeAt(i).toString(16);
        }
    }

    setDeviceSetting(device, state, text) {
        console.log(typeof device, device);
        if (device === "lights") {
            const lightsvalue = parseInt(this.setting[0]);
            if (state) this.setting[0] = (lightsvalue | 0b0100).toString(16);
            else this.setting[0] = (lightsvalue & ~0b0100).toString(16);
            return { device: device, state, text, sensor: state ? 1 : 0 };
        } else if (device === "air") {
            const airvalue = parseInt(this.setting[0]);
            if (state) this.setting[0] = (airvalue | 0b0001).toString(16);
            else this.setting[0] = (airvalue & ~0b0001).toString(16);
            return { device: device, state, text, sensor: state ? 1 : 0 };
        } else if (device === "locks") {
            const locksvalue = parseInt(this.setting[0]);
            if (state) this.setting[0] = (locksvalue | 0b0010).toString(16);
            else this.setting[0] = (locksvalue & ~0b0010).toString(16);
            return { device: device, state, text, sensor: state ? 1 : 0 };
        } else if (device === "heater") {
            const heatervalue = parseInt(this.setting[1]);
            if (state) this.setting[1] = (heatervalue | 0b0001).toString(16);
            else this.setting[1] = (heatervalue & ~0b0001).toString(16);
            return { device: device, state, text, sensor: state ? 1 : 0 };
        }
    }

    getSettings() {
        return this.setting.join("") + this.message;
    }

    setSettings(data) {
        this.setting = data.split("");
        return this.setting;
    }

    getInfo(id) {
        if (id === "lights") {
            const cvalue = parseInt(this.setting[0]);
            return (cvalue >> 2) % 2 != 0;
        } else if (id === "locks") {
            const cvalue = parseInt(this.setting[0]);
            return (cvalue >> 1) % 2 != 0;
        } else if (id === "air") {
            const cvalue = parseInt(this.setting[0]);
            return (cvalue >> 0) % 2 != 0;
        } else if (id === "heater") {
            const cvalue = parseInt(this.setting[1]);
            return (cvalue >> 0) % 2 != 0;
        }
    }

    async setText(texto) {
        this.message = "";
        for (let i = 0; i < texto.length; i++) {
            this.message += this.texto.charCodeAt(i).toString(16);
        }
    }

    async saveChanges(data) {
        const virtualdata = data.split("");
        const firstdata = parseInt(virtualdata[0]);
        const seconddata = parseInt(virtualdata[1]);
        const info = [];
        const dinfo = {};

        try {
            for (let i = 0; i < 3; i++) {
                switch (i) {
                    case 0:
                        dinfo["id"] = "air";
                        break;

                    case 1:
                        dinfo["id"] = "locks";
                        break;

                    case 2:
                        dinfo["id"] = "lights";
                        break;
                }

                dinfo["status"] = (firstdata >> i) % 2 != 0;
                dinfo["sensor"] = dinfo["status"] ? 1 : 0;
                dinfo["text"] = "Estable";
                await saveChange(
                    dinfo["id"],
                    dinfo["status"],
                    dinfo["text"],
                    dinfo["sensor"]
                );
            }

            dinfo["id"] = "heater";
            dinfo["status"] = (seconddata >> 0) % 2 != 0;
            dinfo["sensor"] = dinfo["status"] ? 1 : 0;
            dinfo["text"] = "Esta caliente";
            await saveChange(
                dinfo["id"],
                dinfo["status"],
                dinfo["text"],
                dinfo["sensor"]
            );
            return true;
        } catch (error) {
            console.log("[ERROR] Ocurrio un error al guardar cambios.");
            return false;
        }
    }
}

module.exports = new VirtualDevice();
