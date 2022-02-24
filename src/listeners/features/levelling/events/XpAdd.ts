import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import config from '../../../../config';
import { calculateLevel, Levelling, randomXp } from '../../../../lib/modules/levelling/levelling';
const { levelling } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "levelling:xpAdd",
    event: levelling.events.XpAdd
})
export class UserEvent extends Listener {
    public async run(userId: string, messageCount: number, lastMessage: Message) {

        await this.handleXp(userId, messageCount, lastMessage);

    }

    private async handleXp(userId: string, messageCount: number, lastMessage: Message) {
        const defaultUpdate = {
            avatar: lastMessage.author.displayAvatarURL({ format: "png" }),
            username: lastMessage.author.username,
            discriminator: lastMessage.author.discriminator
        };
        let userData = await this.container.database.models.level.findOne({ where: { id: userId } });
        if (!userData) userData = await this.container.database.models.level.create({ id: userId, xp: randomXp(), ...defaultUpdate });
        const { xp, level, message_count } = userData.toJSON() as Levelling;
        const xpEarn = randomXp();
        const output = await userData.update({ xp: xpEarn + xp, message_count: messageCount + message_count, level: calculateLevel(xpEarn + xp), ...defaultUpdate });
        if (calculateLevel(xpEarn + xp) > level) this.container.client.emit(levelling.events.LevelUp, userId, calculateLevel(xpEarn + xp), lastMessage);
        return output.toJSON();
    }

}