import { getBattlelog, ABattlelog } from "../apiHandler/getBattlelog"
import { battleLog_3v3 } from "./battlelog/3v3";
import { battleLog_duels } from "./battlelog/duels";
import { battleLog_duoShowdown } from "./battlelog/duoShowdown";
import { battleLog_soloShowdown } from "./battlelog/soloShowdown";

export const generateBattlelogCards = async (tag: string, limit = 10) => {
    const battleLog = await getBattlelog(tag);
    if (!battleLog) return null;

    const data = await Promise.all(battleLog.slice(0, limit).map((data) => {
        return generateBattlelogCard(data);
    }));

    return data;
}

export const generateBattlelogCard = async (data: ABattlelog) => {
    try {
        if (data.battle.mode === "soloShowdown") return battleLog_soloShowdown(data);
        if (data.battle.mode === "duoShowdown") return battleLog_duoShowdown(data);
        if (data.battle.mode === "duels") return battleLog_duels(data);
        if (["gemGrab", "brawlBall", "heist", "siege", "bounty", "hotZone", "knockout"].includes(data.battle.mode)) return battleLog_3v3(data);
        return null;
    } catch (e) {
        console.log(e);
        return null;
    }
} 