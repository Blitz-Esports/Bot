"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorEvent = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const nanoid_1 = require("nanoid");
const embed_1 = require("../../lib/constants/embed");
let ErrorEvent = class ErrorEvent extends framework_1.Listener {
    async run(error, context) {
        const uId = (0, nanoid_1.nanoid)();
        await this.container.database.models.bin.create({
            id: uId,
            data: error.stack
        });
        context.interaction[(context.interaction.replied ? true : context.interaction.deferred) ? "editReply" : "reply"]({
            embeds: [
                (0, embed_1.failEmbed)(`Something went wrong during the execution of this command.\n**Code**: \`${uId}\``)
            ]
        });
    }
};
ErrorEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "error:commandError",
        event: framework_1.Events.ChatInputCommandError
    })
], ErrorEvent);
exports.ErrorEvent = ErrorEvent;
//# sourceMappingURL=commandError.js.map