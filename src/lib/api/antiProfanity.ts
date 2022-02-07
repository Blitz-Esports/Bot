import { fetch } from "@sapphire/fetch";
import { AsyncQueue } from "@sapphire/async-queue"
import config from "../../config";

const queue = new AsyncQueue();
const { perspective } = config.api;
const { antiProfanity } = config.features.automod;

const fetchApi = async function (content: string, languages: string[] = ["en"], threshold: number) {
    await queue.wait();
    try {
        const postPayload = {
            comment: {
                text: content,
                type: "PLAIN_TEXT"
            },
            requestedAttributes: {
                TOXICITY: {
                    scoreThreshold: threshold
                }
            },
            languages
        }

        const res = await fetch<PerspectiveAPIResponse>(`${perspective.url}?key=${perspective.apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postPayload)
        });

        queue.shift();
        return res;
    } catch (e) {
        queue.shift();
        return null;
    }
}

export const detectProfanity = async function (content: string) {
    let response = null;
    response = await fetchApi(content, ["hi-Latn"], antiProfanity.thresholds["hi-Latn"]);
    if (!response?.attributeScores) response = await fetchApi(content, ["en"] , antiProfanity.thresholds.en);
    return response?.attributeScores ? response : null;
}

export interface PerspectiveAPIResponse {
    attributeScores?: {
        TOXICITY: {
            spanScores: {
                begin: number;
                end: number;
                score: {
                    value: number;
                    type: string;
                }
            };
            summaryScore: {
                value: number;
                type: string;
            }
        }
    };
    languages: string[];
    detectedLanguages: string[];
}