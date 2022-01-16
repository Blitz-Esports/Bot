"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const config_1 = (0, tslib_1.__importDefault)(require("../../../config"));
const { verification } = config_1.default.features;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(member) {
        if (member.guild.id !== verification.guildId)
            return;
        const user = await this.container.database.models.player.findOne({ where: { id: member.id } });
        if (!user)
            return;
        else {
            this.container.client.emit(verification.events.memberJoin, member, user);
        }
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "autoVerify:guildMemberAddManager",
        event: framework_1.Events.GuildMemberAdd
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=guildMemberAddManager.js.map