import axios from "axios";
import formData from "form-data";

import config from "../../config";

const { ocr: ocrConfig } = config.api;

export const ocr = async (image: string): Promise<OCRResponse | null> => {
    try {

        const form = new formData();
        form.append("document", image);

        const res = await axios({
            method: "POST",
            url: ocrConfig.url,
            headers: {
                Authorization: `Token ${ocrConfig.apiKey}`,
                ...form.getHeaders()
            },
            data: form
        });

        if (res.data.api_request.status_code !== 201) return null;
        else return res.data;
    } catch (e) {
        return null;
    }
}

export interface OCRResponse {
    api_request: {
        error: object;
        resources: string[];
        status: "success" | "fail";
        status_code: number;
        url: string;
    };
    document: {
        annotations: {
            labels: string[]
        };
        id: string;
        inference: {
            finished_at: string;
            pages: {
                id: number;
                prediction: {
                    ocr: {
                        confidence: number;
                        values: {
                            confidence: number;
                            content: string;
                            polygon: [number, number][]
                        }[];
                    }
                }
            }[];
            prediction: {
                ocr: {
                    confidence: number;
                    page_id: number;
                    values: {
                        confidence: number;
                        content: string;
                        polygon: [number, number][]
                    }[]
                }
            };
            processing_time: number;
            started_at: string;
        }
    }
}