import { fetch, FetchResultTypes } from "@sapphire/fetch";


const API_URL = "https://blitz.only-fans.club";

export const upload = async (url: string, account: Account) => {
    try {
        const res = await fetch<UploadResponse>(`${API_URL}/api/upload/url?username=${encodeURIComponent(account.username)}&password=${encodeURIComponent(account.password)}&source=${new URL(url).toString()}`, FetchResultTypes.JSON);
        return {
            ...res,
            url: `${API_URL}${res.url}`
        }
    } catch (e) {
        return null;
    }
}

interface Account {
    userId: string;
    username: string;
    password: string;
    token: string;
}

interface UploadResponse {
    status: boolean;
    username: string;
    file_name: string;
    file_extension: string;
    url: string;
}