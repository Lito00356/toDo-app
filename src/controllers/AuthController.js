import { validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const inputs = [
    {
      name: "email",
      label: "E-mail",
      type: "text",
      value: req.body?.email ? req.body.email : "",
      err: req.formErrorFields?.email ? req.formErrorFields.email : "",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: req.body?.password ? req.body.password : "",
      err: req.formErrorFields?.password ? req.formErrorFields.password : "",
    },
  ];

  const flash = req.flash || {};

  res.render("pages/login", {
    layout: "layouts/authentication",
    inputs,
    flash,
    title: "Login",
  });
};

export const register = async (req, res) => {
  // input fields
  const inputs = [
    {
      name: "nickname",
      label: "Nickname",
      type: "text",
      value: req.body?.nickname ? req.body.nickname : "",
      err: req.formErrorFields?.nickname ? req.formErrorFields.nickname : "",
    },

    {
      name: "email",
      label: "E-mail",
      type: "text",
      value: req.body?.email ? req.body.email : "",
      err: req.formErrorFields?.email ? req.formErrorFields.email : "",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: req.body?.password ? req.body.password : "",
      err: req.formErrorFields?.password ? req.formErrorFields.password : "",
    },
  ];

  const flash = req.flash || {};

  res.render("pages/register", {
    layout: "layouts/authentication",
    inputs,
    flash,
    title: "Register",
  });
};

export const postRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors.array()); // Debugging
    if (!errors.isEmpty()) {
      req.formErrorFields = {};
      errors.array().forEach((error) => {
        req.formErrorFields[error.path] = error.msg;
      });

      req.flash = {
        type: "danger",
        message: "Some errors occurred.",
      };

      return next();
    } else {
      const user = await User.query().findOne({ email: req.body.email });

      if (user) {
        req.flash = {
          type: "danger",
          message: "This e-mail is already in use!",
        };
        req.formErrorFields = { email: "This e-mail is already in use!" };
        return next();
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = await User.query().insert({
        nickname: req.body.nickname,
        email: req.body.email,
        password: hashedPassword,
      });

      if (!newUser) {
        console.error("User insertion failed.");
        req.flash = {
          type: "danger",
          message: "User could not be created.",
        };
        return next();
      }

      res.redirect("/login");
    }
  } catch (e) {
    console.error("Error occurred during registration:", e);
    next(e.message);
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.formErrorFields = {};

      errors.array().forEach((error) => {
        req.formErrorFields[error.path] = error.msg;
      });

      req.flash = {
        type: "danger",
        message: "Some errors occurred.",
      };

      return next();
    }

    const user = await User.query().findOne({
      email: req.body.email,
    });
    if (!user) {
      req.formErrorFields = { email: "This user does not exist" };
      req.flash = {
        type: "danger",
        message: "Some errors occurred.",
      };

      return next();
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      req.formErrorFields = { password: "Je hebt een ongeldig wachtwoord ingegeven." };
      req.flash = {
        type: "danger",
        message: "Some errors occurred.",
      };
      return next();
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.TOKEN_SALT,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (e) {
    next(e.message);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.json({ message: "Logged out successfully" });
};
