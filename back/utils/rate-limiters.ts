import rateLimit from "express-rate-limit"
export const logInLimiter = rateLimit({windowMs: 1000 * 60, limit: 5})
export const RegistrationLimiter = rateLimit({windowMs: 1000 * 60, limit: 5})