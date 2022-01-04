import { ColorResolvable, MessageEmbed } from 'discord.js';
import config from '../../config';

const { colors, emojis } = config.default;

export const successEmbed = (content: string) => {
    return new MessageEmbed().setColor(colors.success as ColorResolvable).setDescription(`${emojis.success} | ${content}`);
};

export const failEmbed = (content: string) => {
    return new MessageEmbed().setColor(colors.fail as ColorResolvable).setDescription(`${emojis.fail} | ${content}`);
};

export const warnEmbed = (content: string) => {
    return new MessageEmbed().setColor(colors.warn as ColorResolvable).setDescription(`${emojis.warn} | ${content}`);
};

export const loadingEmbed = (content: string) => {
    return new MessageEmbed().setColor(colors.theme as ColorResolvable).setDescription(`${emojis.loading} | ${content}`);
}; 