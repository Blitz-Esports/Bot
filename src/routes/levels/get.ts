import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';
import { fetchLevels } from '../../lib/modules/levelling/levelling';

@ApplyOptions<RouteOptions>({
    name: "levels:get",
    route: 'levels'
})
export class UserRoute extends Route {
    public async[methods.GET](_request: ApiRequest, response: ApiResponse) {
        const allLevels = await fetchLevels();
        response.json(allLevels);
    }
}