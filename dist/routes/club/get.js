"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const plugin_api_1 = require("@sapphire/plugin-api");
let UserRoute = class UserRoute extends plugin_api_1.Route {
    async [plugin_api_1.methods.GET](request, response) {
        const data = await this.container.database.models.club.findOne({ where: { id: "#" + request.params.id.replace("#", "") } });
        if (!data)
            return response.json({ message: "No club found" });
        return response.json(data.toJSON());
    }
};
UserRoute = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: 'club:get',
        route: 'club/:id'
    })
], UserRoute);
exports.UserRoute = UserRoute;
//# sourceMappingURL=get.js.map