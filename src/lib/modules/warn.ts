import { container } from "@sapphire/pieces"
import { nanoid } from "nanoid"

export const createWarn = async function (target: string, executor: string, reason: string): Promise<{ id: string; target: string; executor: string; reason: string | null }> {

    const data = await container.database.models.warn.create({
        id: nanoid(10),
        target,
        executor,
        reason
    });

    return data.toJSON();
}