import z from "zod"
export const zodAPICreds = z.object({
    apiKey: z.string().trim(),
    usageCap: z.number().lt(0.26).gt(0.05)
})