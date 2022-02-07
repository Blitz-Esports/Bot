import { fetch, FetchResultTypes } from "@sapphire/fetch";


const BASE_URL = "https://blitz.only-fans.club";

export const upload = async (url: string, account: Account) => {
    try {
        const res = await fetch<UploadResponse>(`${BASE_URL}/api/upload/url?username=${encodeURIComponent(account.username)}&password=${encodeURIComponent(account.password)}&source=${new URL(url).toString()}`, FetchResultTypes.JSON);
        return {
            ...res,
            url: `${BASE_URL}${res.url}`,
            share: `${BASE_URL}/share/${res.file_name}`
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