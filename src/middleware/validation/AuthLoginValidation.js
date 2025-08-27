import { body } from "express-validator";

export default [body("email").notEmpty().withMessage("E-mail is required").bail().isEmail().withMessage("E-mail is invalid"), body("password").isLength({ min: 6 }).withMessage("Password needs at least 6 characters.")];
