import z from "zod";

export const zodMessage = z.object({
    userMessage: z.string().min(1, "Value can't be empty for chatting."),
    LLM: z.string().min(1, "This is not an ai model").trim(),
    user: z.string().optional(),
    convoId: z.string().optional(),
})
export const zodDeleteID = z.object({
    messageID: z.string()
})
