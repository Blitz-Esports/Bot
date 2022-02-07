import { AClub, brawlstarsEmojis } from "../../api/brawlstars/brawlstars";

export const splitChunk = (array: any[], chunk?: number) => {
    const inputArray = array;
    var perChunk = chunk || 15;
    var result = inputArray.reduce((resultArray: any[], item: any, index: number) => {
        const chunkIndex = Math.floor(index / perChunk)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, [])
    return result;
}

export const list = (club: AClub, role: "member" | "senior" | "vicePresident" | "president") => {
    let r = [role];
    if (role === "vicePresident") r = ["president", role]
    const list = club.members.filter((x) => r.includes(x.role)).sort((a, b) => b.trophies - a.trophies).map((m) => `${brawlstarsEmojis.role[m.role] || brawlstarsEmojis.unknown}\`${m.trophies}\` [${m.name}](https://brawlify.com/stats/profile/${m.tag.replace("#", "")})`).slice(0, 5)
    return list.length === 0 ? ["- None -"] : list;
}