import { updateOverviewEmbed } from "./clubOverview/updateOverviewEmbed";
import { updateClub } from "./clubUpdater/updateClubs"

export const loadWorkers = async () => {

    updateClub();
    updateOverviewEmbed();

}