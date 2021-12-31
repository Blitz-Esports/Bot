import { Collection, Message } from 'discord.js';
import { discordMessage } from './modules/discordMessage';
import { $discordMessage } from './modules/$discordMessage';
import { discordMessageScript } from './modules/discordMessageScript';
import { css } from './modules/css';
import { metaTagComponent } from './modules/metaTags';
import { nanoid } from 'nanoid';
import { container } from '@sapphire/framework';

export const generateTranscript = (_messageCollection: Collection<string, Message>, options?: Options) => {
  const messageCollection = new Collection<string, Message>();
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
        ${metaTagComponent(messageCollection, options?.id)}
        <title>Transcript - ${options?.id ?? messageCollection.first()?.channelId}</title>
         ${discordMessageScript()}
         <style> ${css} </style>
         ${$discordMessage(messageCollection)}
      </head>
         <body>
         <discord-messages>
          ${messageCollection.map((message) => discordMessage(message)).join('\n')}
          </discord-messages>
         </body>
         </html>
        `;

  return html;
};

export const saveTranscript = async (transcript: string): Promise<Transcript> => {
  const uniqueId = nanoid();
  await container.database.models.transcript.create({ id: uniqueId, html: transcript });
  return { id: uniqueId, value: transcript };
}

export const createAndSaveTranscript = async (messageCollection: Collection<string, Message>): Promise<Transcript> => {
  const uniqueId = nanoid();
  const transcript = generateTranscript(messageCollection, { id: uniqueId });
  await container.database.models.transcript.create({ id: uniqueId, html: transcript });
  return { id: uniqueId, value: transcript };
}

interface Transcript {
  id: string;
  value: string;
}

interface Options {
  id?: string;
}