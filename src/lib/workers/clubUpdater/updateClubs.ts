import { container } from "@sapphire/framework";
import { getClub, AClub } from "../../api/brawlstars";
import { clubLogHandler } from "./handlers/clubLogHandler";

export const updateClub = async () => {

    let allClubs = (await container.database.models.club.findAll({})).map((club) => club.toJSON());
    if (allClubs.length === 0) return;

    let count = 0;
    setInterval(async () => {

        const clubData: AClub | null = await getClub(allClubs[count].id);
        if (clubData) {
            const clubLogs = await clubLogHandler(allClubs[count], clubData);
            const dataToUpdate = await container.database.models.club.findOne({ where: { id: clubData.tag } });

            if (dataToUpdate) {
                await dataToUpdate.update({ rawData: clubData, clubLogs });
            }
        }

        count++;
        if (count === allClubs.length) {
            count = 0;
            allClubs = (await container.database.models.club.findAll({})).map((club) => club.toJSON());
        }
    }, 1000 * 10);
} 