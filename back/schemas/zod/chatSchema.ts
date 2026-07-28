import z from "zod";

export const zodMessage = z.object({
    userMessage: z.string().min(1, "Value can't be empty for chatting."),
    LLM: z.string().min(1, "This is not an ai model"),
    user: z.string()
})