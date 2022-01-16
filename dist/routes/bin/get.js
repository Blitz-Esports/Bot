"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const plugin_api_1 = require("@sapphire/plugin-api");
let UserRoute = class UserRoute extends plugin_api_1.Route {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "generateResponse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                try {
                    return {
                        id: data.id,
                        data: JSON.parse(data.data)
                    };
                }
                catch (e) {
                    return {
                        id: data.id,
                        data: data.data
                    };
                }
            }
        });
    }
    async [plugin_api_1.methods.GET](request, response) {
        const data = await this.container.database.models.bin.findOne({ where: { id: request.params.id } });
        if (!data)
            return response.json({ message: "No bin found" });
        return response.json(this.generateResponse(data));
    }
};
UserRoute = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: 'bin:get',
        route: 'bin/:id'
    })
], UserRoute);
exports.UserRoute = UserRoute;
//# sourceMappingURL=get.js.map