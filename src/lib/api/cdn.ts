import axios from "axios";

const BASE_URL = "https://cdn.blitz-esports.ml";

export interface CDNOptions {
    file_name?: string;
    file_path?: string;
    file_extension?: string
}
export const uploadFileWithUrl = async (url: string, options?: CDNOptions): Promise<CDNResponse | null> => {

    try {
        const res = await axios.post(`${BASE_URL}/upload/url`, {
            ...options,
            source: url
        }, { responseType: "json" });
        return res.data;
    } catch (e) {
        return null;
    }

}

interface CDNResponse {
    status: boolean;
    data: {
        url: string
    }
}