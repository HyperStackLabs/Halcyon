import z from "zod"
const zodBanValidation = z.object({
    id: z.string(),
    ban: z.boolean()
})