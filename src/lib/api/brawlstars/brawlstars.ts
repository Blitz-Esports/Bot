import { registerFont } from "canvas";

//* Register custom fonts
registerFont("./assets/fonts/Lilita-One.ttf", { family: "Liliita" });
registerFont("./assets/fonts/Arial-Unicode-Ms.ttf", { family: "Arial-Unicode-Ms" });
registerFont("./assets/fonts/Nougat-ExtraBlack.ttf", { family: "Nougat-ExtraBlack" });
registerFont("./assets/fonts/NotoColorEmoji.ttf", { family: "NotoColorEmoji" });
registerFont("./assets/fonts/Segoe-UI-Symbol.ttf", { family: "Segoe-UI-Symbol" });


//* Export api Handlers
export * from "./apiHandler/capitalizeString";
export * from "./apiHandler/encodeTag";
export * from "./apiHandler/getBrawlerIcon";
export * from "./apiHandler/getBrawlerInfo";
export * from "./apiHandler/getClub";
export * from "./apiHandler/getMap";
export * from "./apiHandler/getPlayer";
export * from "./apiHandler/searchMap";
export * from "./apiHandler/splitChunk";
export * from "./apiHandler/getBattlelog";
export * from "./apiHandler/getGamemodes";

//* Export image Builders
export * from "./imageBuilder/generateBrawlerCard";
export * from "./imageBuilder/generateBrawlerListCard";
export * from "./imageBuilder/generateGraph";
export * from "./imageBuilder/generateMapCard";
export * from "./imageBuilder/generateMemberListCard";
export * from "./imageBuilder/generateBattlelogCard(s)";

//* Export brawler emojis
export * from "./emojis";