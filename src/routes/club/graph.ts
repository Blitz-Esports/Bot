import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, MimeTypes, Route, RouteOptions } from '@sapphire/plugin-api';
import { generateGraph } from '../../lib/api/brawlstars/brawlstars';

@ApplyOptions<RouteOptions>({
    name: 'club:graph',
    route: 'club/:id/graph'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {
        const graph = await generateGraph(request.params.id, "club");
        if (!graph) return response.json({ status: false, message: "Unable to fetch club graph data" });
        response.setContentType(MimeTypes.ImagePng).end(graph);
    }
}