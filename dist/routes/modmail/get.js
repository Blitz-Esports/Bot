"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const plugin_api_1 = require("@sapphire/plugin-api");
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../config"));
const transcript_1 = require("../../lib/transcript");
let UserRoute = class UserRoute extends plugin_api_1.Route {
    async [plugin_api_1.methods.GET](request, response) {
        try {
            const modmailChannel = (await this.container.client.channels.fetch(config_1.default.features.modmail.channelId));
            if (!modmailChannel)
                return response.json({ message: 'Modmail channel not found' });
            const { threads } = await modmailChannel.threads.fetch().catch(() => ({ threads: new discord_js_1.Collection() }));
            const targetThread = threads.get(request.params.id);
            if (!targetThread)
                return response.json({ message: 'Requested thread channel not found' });
            const messageCollection = await targetThread.messages.fetch({ limit: 100 });
            const transcript = (0, transcript_1.generateTranscript)(messageCollection);
            response.setContentType('text/html').end(transcript);
        }
        catch (e) {
            response.json({ message: 'An unexpected error has ocurred' });
            this.container.logger.warn('Modmail transcript error:\n' + e);
        }
    }
};
UserRoute = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: 'modmail:get',
        route: 'modmail/:id'
    })
], UserRoute);
exports.UserRoute = UserRoute;
//# sourceMappingURL=get.js.map