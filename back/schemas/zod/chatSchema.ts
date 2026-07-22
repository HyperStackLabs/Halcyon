import z from "zod";

export const zodMessage = z.object({
    content: z.string().min(1, "Value can't be empty for chatting.")
})