import z from "zod";
import { zodLogin, zodUser } from "../schemas/zod/authSchema.js";
import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export type User = z.infer<typeof zodUser>
export type InferLogin = z.infer<typeof zodLogin>

export interface AuthTokenPayload extends JwtPayload {
    id?: string
}

export interface AuthRequest extends Request {
    user?: User | undefined
}