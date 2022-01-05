import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';

@ApplyOptions<RouteOptions>({
    name: 'club:get',
    route: 'club/:id'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {
        const data = await this.container.database.models.club.findOne({ where: { id: "#" + request.params.id.replace("#", "") } });
        if (!data) return response.json({ message: "No club found" });
        return response.json(data.toJSON());
    }
}