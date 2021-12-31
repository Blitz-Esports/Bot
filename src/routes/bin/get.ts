import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';

@ApplyOptions<RouteOptions>({
    name: 'bin:get',
    route: 'bin/:id'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {
        const data = await this.container.database.models.bin.findOne({ where: { id: request.params.id } });
        if (!data) return response.json({ message: "No bin found" });
        return response.json({
            id: data.toJSON().id,
            data: JSON.parse(data.toJSON().data)
        });
    }
}