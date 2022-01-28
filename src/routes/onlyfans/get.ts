import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';

const REDIRECT_URL = "http://localhost/auth";

@ApplyOptions<RouteOptions>({
    name: "onlyfans:get",
    route: 'onlyfans'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {
        const validate = await this.validateToken(request);
        if (!validate) return response.json({ status: false, message: "Invalid access token" });

        response.setHeader('Location', `${REDIRECT_URL}?${request.url?.split('?')[1]}`);
        response.statusCode = 302;
        response.end();

    }

    private async validateToken(request: ApiRequest) {
        const { token } = request.query;
        if (!token) return false;
        const fetchToken = await this.container.database.models.token.findOne({ where: { id: token } });
        if (!fetchToken || new Date(fetchToken.toJSON().expires).getTime() < new Date().getTime()) return false;
        return fetchToken.toJSON().userId;
    }
}