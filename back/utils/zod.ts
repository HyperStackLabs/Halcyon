import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body)
    if(!validation.success){
        const errors = validation.error.issues.map(error => error.message)
        console.log(errors)
        return res.status(400).json({message: 'Validation failure', errors})
    }
    next()
}