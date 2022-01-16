"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const config_1 = (0, tslib_1.__importDefault)(require("../../../../config"));
const brawlstars_1 = require("../../../../lib/api/brawlstars");
const { verification } = config_1.default.features;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(member, user) {
        const player = await (0, brawlstars_1.getPlayer)(user.tag);
        if (!player)
            return;
        const clubData = await this.container.database.models.club.findOne({ where: { id: player.club.tag } });
        const allClubRoles = (await this.container.database.models.club.findAll({})).map((club) => club.toJSON().roleId).filter((roleId) => roleId !== null);
        await member.setNickname(player.name).catch(() => null);
        const rolesToSet = member.roles.cache.filter((role) => ![...Object.values(verification.roles), ...allClubRoles].includes(role.id)).map((role) => role.id);
        if (clubData) {
            const resolvedClubData = clubData.toJSON().rawData;
            const clubMember = resolvedClubData.members.find((member) => member.tag === player.tag);
            const roles = [
                verification.roles.default,
                verification.roles.member,
                verification.roles[clubMember?.role ?? "member"],
                clubData.toJSON().roleId ?? verification.roles.default
            ];
            rolesToSet.push(...roles);
            await member.roles.set(rolesToSet);
        }
        else {
            const roles = [
                verification.roles.default
            ];
            rolesToSet.push(...roles);
            await member.roles.set(rolesToSet);
        }
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "autoVerify:memberJoin",
        event: verification.events.memberJoin
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=MemberJoin.js.map