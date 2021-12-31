import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, MimeTypes, Route, RouteOptions } from '@sapphire/plugin-api';

@ApplyOptions<RouteOptions>({
    name: 'transcript:get',
    route: 'transcript/:id'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {
        try {
            const transcript = await this.container.database.models.transcript.findOne({ where: { id: request.params.id } });

            if (!transcript) return response.json({ message: "Transcript does not exist" });

            else response.setContentType("text/html" as MimeTypes).end(transcript.toJSON().html);

        } catch (e) {
            response.json({ message: 'An unexpected error has ocurred' });
        }
    }
}