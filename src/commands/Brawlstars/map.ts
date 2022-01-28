import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { generateMapCard, getMap, searchMap } from "../../lib/api/brawlstars";
import { failEmbed } from "../../lib/constants/embed";

@ApplyOptions<CommandOptions>({
    name: "map",
    description: "Get info about any map in Brawl Stars!",
})
export class MapCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();

        const mapId = interaction.options.getString("name");
        if (!mapId) return interaction.editReply({ embeds: [failEmbed("Unable to fetch the stats of the map.")] });

        const mapData = await getMap(mapId);
        if (!mapData) return interaction.editReply({ embeds: [failEmbed("Unable to fetch the stats of the map.")] });

        const mapCard = await generateMapCard(mapData);
        if (!mapCard) return interaction.editReply({ embeds: [failEmbed("An error occurred while generating the map card.")] });

        return interaction.editReply({ files: [mapCard] });
    }

    public override async autocompleteRun(interaction: AutocompleteInteraction) {
        const option = interaction.options.getFocused(true);
        if (option.name === "name")

            searchMap(option.value.toString()).then((res) => {
                if (res) {
                    interaction.respond(res.map((data) => {
                        return {
                            name: data.name,
                            value: data.id.toString()
                        }
                    }).slice(0, 10));
                }
            });
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option
                        .setName('name')
                        .setDescription('The name of the map about which you want to get information.')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        },
            {
                guildIds: [this.container.config.bot.guilds.dev, this.container.config.bot.guilds.main],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            })
    }

}