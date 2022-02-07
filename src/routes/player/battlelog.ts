import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, MimeTypes, Route, RouteOptions } from '@sapphire/plugin-api';
import { getBattlelog, ABattlelog, generateBattlelogCard } from '../../lib/api/brawlstars/brawlstars';
import NodeCache from "node-cache";

const battleLogCache = new NodeCache({ stdTTL: 60 * 60 * 1 });
@ApplyOptions<RouteOptions>({
    name: 'player/:id/battlelog',
    route: 'player/:id/battlelog'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {

        if (request.query.battleTime) {
            let cachedData: ABattlelog[] | undefined = battleLogCache.get(request.params.id);
            if (!cachedData) {
                const newData = await getBattlelog(request.params.id);
                if (!newData) return response.json({ status: false, message: "Unable to fetch battlelog" });
                battleLogCache.set(request.params.id, newData);
                cachedData = newData;
            }

            const data = cachedData.find(data => data.battleTime === request.query.battleTime);
            if (!data) {
                const newData = await getBattlelog(request.params.id);
                if (!newData) return response.json({ status: false, message: "Unable to fetch battlelog" });
                battleLogCache.set(request.params.id, newData);
                cachedData = newData;
                const getBattleData = cachedData.find(data => data.battleTime === request.query.battleTime);
                if (!getBattleData) return response.json({ status: false, message: "Unable to fetch battlelog" });
                const card = await generateBattlelogCard(getBattleData);
                return response.setContentType(MimeTypes.ImageJpg).end(card);
            }
            else {
                const card = await generateBattlelogCard(data);
                return response.setContentType(MimeTypes.ImageJpg).end(card);
            }
        }
        else {
            let cachedData: ABattlelog[] | undefined = battleLogCache.get(request.params.id);
            if (!cachedData) {
                const newData = await getBattlelog(request.params.id);
                if (!newData) return response.json({ status: false, message: "Unable to fetch battlelog" });
                battleLogCache.set(request.params.id, newData);
                cachedData = newData;
            }
            const card = await generateBattlelogCard(cachedData[0]);
            return response.setContentType(MimeTypes.ImageJpg).end(card);
        }
    }
}