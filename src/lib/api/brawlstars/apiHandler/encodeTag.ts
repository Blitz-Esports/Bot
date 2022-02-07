export const encodeTag = (tag?: string, type: "URL" | "STRING" = "URL") => {
    if (!tag) return null;
    else return (type === "URL") ? encodeURIComponent(`#${tag.toUpperCase().replace("#", "").replaceAll("O", "0")}`) : `#${tag.toUpperCase().replace("#", "").replaceAll("O", "0")}`;
}