import z from "zod"
export const zodAIObject = z.object({
    soft_name: z.string().max(60, 'Name is too long for an language model'),
    codename: z.string().max(30, 'Name is too long for an language model'),
    image: z.string(),
    type: z.enum(['Nano', 'Pro'])
})