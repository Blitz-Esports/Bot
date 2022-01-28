import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';
import type { APIEmbed } from 'discord-api-types';

@ApplyOptions<RouteOptions>({
    name: 'embed:post',
    route: 'embed/post'
})
export class UserRoute extends Route {
    public async [methods.POST](request: ApiRequest, response: ApiResponse) {

        const validation = await this.validateToken(request);
        if (!validation) return response.json({ status: false, message: "The token has expired or is invalid." });

        const post = await this.emitEvent(request.body as Body, validation);
        return response.json(post);

    }

    private async validateToken(request: ApiRequest) {
        const token = request.headers.authorization?.split("Token ")[1];
        if (!token) return false;
        const fetchToken = await this.container.database.models.token.findOne({ where: { id: token } });
        if (!fetchToken || new Date(fetchToken.toJSON().expires).getTime() < new Date().getTime()) return false;
        return fetchToken.toJSON().userId;
    }

    private async emitEvent(body: Body, userId: string) {

        try {
            const user = await this.container.client.users.fetch(userId);
            if (!user) return { status: false, message: "Unable to find the user" };

            await this.container.database.models.token.update({
                metaData: body.data
            }, {
                where: {
                    id: body.token
                }
            });

            this.container.client.emit(this.container.config.features.embedBuilder.events.EmbedCreate, body, user);
            return { status: true, message: `Sent the embed to ${user.tag}` };
        } catch (e) {
            console.log(e)
            return { status: false, message: "Unable to send the message" };
        }

    }

}

interface Body {
    token: string;
    data: {
        content: string;
        embed: APIEmbed
    }
}