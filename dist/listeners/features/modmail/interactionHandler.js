"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const config_1 = (0, tslib_1.__importDefault)(require("../../../config"));
const { modmail } = config_1.default.features;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(interaction) {
        if (!interaction.isButton() || !interaction.channel?.isThread())
            return;
        if (interaction.customId.endsWith('modmail-close')) {
            this.container.client.emit(modmail.events.SessionEnd, interaction);
        }
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "modmail:interactionHandler",
        event: framework_1.Events.InteractionCreate
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=interactionHandler.js.map