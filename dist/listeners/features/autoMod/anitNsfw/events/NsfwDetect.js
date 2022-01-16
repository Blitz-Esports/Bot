"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const nanoid_1 = require("nanoid");
const config_1 = (0, tslib_1.__importDefault)(require("../../../../../config"));
const embed_1 = require("../../../../../lib/constants/embed");
const { antiNsfw } = config_1.default.features.automod;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(message, response) {
        const data = await this.container.database.models.bin.create({
            id: (0, nanoid_1.nanoid)(),
            data: JSON.stringify(response)
        });
        await message.reply({
            embeds: [(0, embed_1.warnEmbed)(`${message.author.toString()} has been warned. **Reason**: Posting NSFW content.`)],
            components: [
                new discord_js_1.MessageActionRow().setComponents(new discord_js_1.MessageButton()
                    .setStyle("LINK")
                    .setURL(`${config_1.default.server.host}/bin/${data.toJSON().id}`)
                    .setLabel("View Raw"))
            ]
        });
        if (antiNsfw.deleteMessageOnDetect && message.deletable)
            message.delete();
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "antiNsfw:nsfwDetect",
        event: antiNsfw.events.nsfwDetect
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=NsfwDetect.js.map