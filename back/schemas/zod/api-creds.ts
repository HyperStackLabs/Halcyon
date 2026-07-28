import z from "zod"
export const zodAPICreds = z.object({
    apiKey: z.string().min(10),
    usageCap: z.number().lt(0.26).gt(0.05)
})