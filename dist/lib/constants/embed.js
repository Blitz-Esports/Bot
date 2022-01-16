"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadingEmbed = exports.warnEmbed = exports.failEmbed = exports.successEmbed = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../config"));
const { colors, emojis } = config_1.default.default;
const successEmbed = (content) => {
    return new discord_js_1.MessageEmbed().setColor(colors.success).setDescription(`${emojis.success} | ${content}`);
};
exports.successEmbed = successEmbed;
const failEmbed = (content) => {
    return new discord_js_1.MessageEmbed().setColor(colors.fail).setDescription(`${emojis.fail} | ${content}`);
};
exports.failEmbed = failEmbed;
const warnEmbed = (content) => {
    return new discord_js_1.MessageEmbed().setColor(colors.warn).setDescription(`${emojis.warn} | ${content}`);
};
exports.warnEmbed = warnEmbed;
const loadingEmbed = (content) => {
    return new discord_js_1.MessageEmbed().setColor(colors.theme).setDescription(`${emojis.loading} | ${content}`);
};
exports.loadingEmbed = loadingEmbed;
//# sourceMappingURL=embed.js.map