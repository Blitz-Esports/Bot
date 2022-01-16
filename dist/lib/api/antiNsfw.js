"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectNsfw = void 0;
const tslib_1 = require("tslib");
const axios_1 = (0, tslib_1.__importDefault)(require("axios"));
const config_1 = (0, tslib_1.__importDefault)(require("../../config"));
const { antiNsfw } = config_1.default.features.automod;
const API_URL = "https://api.tke-esports.tk/api/nsfw/classify";
const detectNsfw = async (url) => {
    try {
        const rawRequest = await axios_1.default.get(`${API_URL}?image=${url}`);
        const response = rawRequest.data;
        if (!response.status)
            return null;
        const isPorn = (response.data.find((data) => data.className === "Porn")?.probability || 0) > antiNsfw.threshold;
        const isHentai = (response.data.find((data) => data.className === "Hentai")?.probability || 0) > antiNsfw.threshold;
        const output = {
            image: url,
            data: response.data,
            isPorn,
            isHentai
        };
        return output;
    }
    catch (e) {
        return null;
    }
};
exports.detectNsfw = detectNsfw;
//# sourceMappingURL=antiNsfw.js.map