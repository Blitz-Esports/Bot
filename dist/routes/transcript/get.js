"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const plugin_api_1 = require("@sapphire/plugin-api");
let UserRoute = class UserRoute extends plugin_api_1.Route {
    async [plugin_api_1.methods.GET](request, response) {
        try {
            const transcript = await this.container.database.models.transcript.findOne({ where: { id: request.params.id } });
            if (!transcript)
                return response.json({ message: "Transcript does not exist" });
            else
                response.setContentType("text/html").end(transcript.toJSON().html);
        }
        catch (e) {
            response.json({ message: 'An unexpected error has ocurred' });
        }
    }
};
UserRoute = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: 'transcript:get',
        route: 'transcript/:id'
    })
], UserRoute);
exports.UserRoute = UserRoute;
//# sourceMappingURL=get.js.map