import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required().max(30).min(1),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("viewer", "analyst", "admin").default("viewer"),
    isActive: Joi.boolean().default(true),
});

