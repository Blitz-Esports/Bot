import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { getPlayer } from "../apiHandler/getPlayer";
import type { ChartConfiguration } from "chart.js";
import { chart } from "./chart";
import { encodeTag } from "../brawlstars";

export const generateGraph = async (tag: string, type: "player" | "club") => {
    let borderColor = "#FFFFFF";
    try {
        const response = await fetch<any>(`https://api.brawlapi.com/v1/graphs/${type}/${encodeTag(tag, "STRING")?.replace("#", "")}`, {
            headers: {
                "Authorization": `y3@b$#MgW7!#L4@yX#&3*K#$qCYWu7HU6TL6f4jrLx9Y*PRRuw8^vU4k8HynZ%jN2VJRScD$px9gj85L8Y8JkvXe*Uy3Lh5NpKj&jtfz$LoiNp^H3C97v@Q!R7NJ*iHRRPBkxGZHhec@9eb53@TWpT^bAH^4r&VxNwvp4y!3@@x7Y@fKgbTTV7!Y6@G9fr5NENZbuE84#Wgpy254ZB!mX*83KuX#b!5BMh2F!G9#5Z*p2psC9PpDT5&E4^4J5Juw`
            }
        }, FetchResultTypes.JSON);
        if (!response.data || !response.labels) return null;

        if (type === "player") {
            const player = await getPlayer(tag);
            if (player) borderColor = "#" + player.nameColor.replace("0xff", "")
        }
        else if (type === "club") {
            borderColor = "#FFA500";
        }

        const graph = chart();
        const graphConfig: ChartConfiguration = {
            type: 'line',
            data: {
                datasets: [{
                    data: response.data,
                    borderColor,
                }],
                labels: response.labels
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    xAxis: {
                        ticks: {
                            maxTicksLimit: 20,
                            autoSkip: true,
                            font: {
                                size: 20
                            }
                        }
                    },
                    yAxis: {
                        ticks: {
                            font: {
                                size: 20
                            }
                        }
                    }
                }
            }
        }
        return await graph.renderToBuffer(graphConfig, "image/png");
    } catch (e) {
        return null;
    }
}