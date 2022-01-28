import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';

@ApplyOptions<RouteOptions>({
    name: "onlyfans:auth",
    route: 'onlyfans/auth'
})
export class UserRoute extends Route {

    public async [methods.POST](request: ApiRequest, response: ApiResponse) {
        if (!request.body || request.body === {}) return response.json({ status: false });
        const data = request.body as Body;
        if (!data.user || !data.token) return response.json({ status: false });
        if (!data.user.username || !data.user.userToken || !data.user.password) return response.json({ status: false });

        const token = await this.container.database.models.token.findOne({
            where: {
                id: data.token
            }
        });
        if (!token) return response.json({ status: false });
        if (new Date(token.toJSON().expires).getTime() < Date.now()) return response.json({ status: false });

        await token.update({
            expires: new Date().toDateString()
        });

        const existingUser = await this.container.database.models.onlyfan.findOne({
            where: {
                userId: token.toJSON().userId
            }
        });
        if (existingUser) {
            await existingUser.update({
                username: data.user.username,
                password: data.user.password,
                token: data.user.userToken
            });
            return response.json({ status: true, message: `Updated user: ${data.user.username} with discord ID: ${token.toJSON().userId}` });
        }
        else {
            const newUser = await this.container.database.models.onlyfan.create({
                userId: token.toJSON().userId,
                username: data.user.username,
                password: data.user.password,
                token: data.user.userToken
            });
            return response.json({ status: true, message: `Linked the account with discord. ID: ${newUser.toJSON().userId}` });
        }
    }
}

interface Body {
    token?: string;
    user?: {
        username?: string;
        password?: string;
        userToken?: string;
    }
}