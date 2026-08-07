import z from "zod";

export const zodLogin = z.object({
    email: z.email(),
    password: z.string().min(6, 'Too short of a password').max(60, 'Password is too big'),
    rememberMe: z.boolean()
})
export const zodUser = z.object({
    id: z.string().optional(),
    name: z.string().max(40, 'Woah buddy what a long name!!!'),
    userName: z.string().min(4, 'Too small of a name, get creative!').max(30, 'Username too large'),
    email: z.email(),
    password: z.string().min(6, 'Too short of a password').max(60, 'Password is too big'),
    profilePicture: z.string().optional(),
    role: z.enum(['user', 'admin']).optional()
})