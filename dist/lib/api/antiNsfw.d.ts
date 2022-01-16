export declare const detectNsfw: (url: string) => Promise<{
    image: string;
    data: [{
        className: "Neutral";
        probability: number;
    }, {
        className: "Drawing";
        probability: number;
    }, {
        className: "Sexy";
        probability: number;
    }, {
        className: "Hentai";
        probability: number;
    }, {
        className: "Porn";
        probability: number;
    }];
    isPorn: boolean;
    isHentai: boolean;
} | null>;
export interface AntiNsfw {
    data: APIResponse;
    isPorn: boolean;
    isHentai: boolean;
}
interface APIResponse {
    status: boolean;
    image: string;
    data: [
        {
            className: "Neutral";
            probability: number;
        },
        {
            className: "Drawing";
            probability: number;
        },
        {
            className: "Sexy";
            probability: number;
        },
        {
            className: "Hentai";
            probability: number;
        },
        {
            className: "Porn";
            probability: number;
        }
    ];
}
export {};
//# sourceMappingURL=antiNsfw.d.ts.map