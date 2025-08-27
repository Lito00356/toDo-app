import Task from "../models/Task.js";
import Category from "../models/Category.js";

export const login = async (req, res) => {
  await res.render("pages/login");
};

export const home = async (req, res) => {
  const tasks = await Task.query();
  const categories = await Category.query();

  const user = req.user;

  await res.render("pages/home", {
    categories,
    tasks,
    user,
  });
};
