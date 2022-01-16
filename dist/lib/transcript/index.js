"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndSaveTranscript = exports.saveTranscript = exports.generateTranscript = void 0;
const discord_js_1 = require("discord.js");
const discordMessage_1 = require("./modules/discordMessage");
const _discordMessage_1 = require("./modules/$discordMessage");
const discordMessageScript_1 = require("./modules/discordMessageScript");
const css_1 = require("./modules/css");
const metaTags_1 = require("./modules/metaTags");
const nanoid_1 = require("nanoid");
const framework_1 = require("@sapphire/framework");
const generateTranscript = (_messageCollection, options) => {
    const messageCollection = new discord_js_1.Collection();
    _messageCollection
        .map((value) => value)
        .reverse()
        .forEach((value) => messageCollection.set(value.id, value));
    const html = `<!DOCTYPE html>
    <html dir="ltr" lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0"
        />
        ${(0, metaTags_1.metaTagComponent)(messageCollection, options?.id)}
        <title>Transcript - ${options?.id ?? messageCollection.first()?.channelId}</title>
         ${(0, discordMessageScript_1.discordMessageScript)()}
         <style> ${css_1.css} </style>
         ${(0, _discordMessage_1.$discordMessage)(messageCollection)}
      </head>
         <body>
         <discord-messages>
          ${messageCollection.map((message) => (0, discordMessage_1.discordMessage)(message)).join('\n')}
          </discord-messages>
         </body>
         </html>
        `;
    return html;
};
exports.generateTranscript = generateTranscript;
const saveTranscript = async (transcript) => {
    const uniqueId = (0, nanoid_1.nanoid)();
    await framework_1.container.database.models.transcript.create({ id: uniqueId, html: transcript });
    return { id: uniqueId, value: transcript };
};
exports.saveTranscript = saveTranscript;
const createAndSaveTranscript = async (messageCollection) => {
    const uniqueId = (0, nanoid_1.nanoid)();
    const transcript = (0, exports.generateTranscript)(messageCollection, { id: uniqueId });
    await framework_1.container.database.models.transcript.create({ id: uniqueId, html: transcript });
    return { id: uniqueId, value: transcript };
};
exports.createAndSaveTranscript = createAndSaveTranscript;
//# sourceMappingURL=index.js.map