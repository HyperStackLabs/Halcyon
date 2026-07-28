import z from "zod"
export const zodBanValidation = z.object({
    id: z.string(),
    ban: z.boolean()
})
export const zodPasswordChange = z.object({
    currentPassword: z.string().min(6, 'Too small of a password, try longer one').max(60, 'Woah woah slow down!').optional(),
    newPassword: z.string().min(6, 'Too small of a password, try longer one').max(60, 'Woah woah slow down!').optional()
})
export const zodProfileChange = z.object({
    id: z.string(),
    profile: z.object({
        profilePicture: z.string().optional(),
        email: z.string().optional(),
        userName: z.string().optional(),
        name: z.string().optional()
    })
})