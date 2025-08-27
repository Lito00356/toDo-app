import { body } from "express-validator";

export default [body("nickname").notEmpty().isLength({ min: 2 }).withMessage("Nickname is required"), body("email").notEmpty().withMessage("A valid e-mail is required").bail().isEmail().withMessage("this e-mail is not valid"), body("password").isLength({ min: 6 }).withMessage("Password needs to contain at least 6 characters")];
