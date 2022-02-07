import { ChartJSNodeCanvas } from "chartjs-node-canvas";

export const chart = function (options?: ChartOptions): ChartJSNodeCanvas {
    const defaultChart = new ChartJSNodeCanvas({ width: options?.width ?? 800, height: options?.height ?? 400, backgroundColour: options?.backgroundColour ?? '#1E1E1E' });
    defaultChart.registerFont("./assets/fonts/Arial-Unicode-Ms.ttf", { family: "Custom_Font" });
    return defaultChart;
}

export interface ChartOptions {
    backgroundColour?: string;
    width?: number;
    height?: number;
}