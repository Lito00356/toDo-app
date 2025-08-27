import express from "express";
import * as path from "path";
import expresLayouts from "express-ejs-layouts";
import helpers from "./utils/capitalize.js";
import * as PageController from "./controllers/pageController.js";
import * as API_Users from "./controllers/api/Users.js";
import * as API_Tasks from "./controllers/api/TaskController.js";
import * as API_Categories from "./controllers/api/CategoriesController.js";
import * as AuthController from "./controllers/AuthController.js";
import AuthRegisterValidation from "./middleware/validation/AuthRegisterValidation.js";
import AuthLoginValidation from "./middleware/validation/AuthLoginValidation.js";
import jwtAuth from "./middleware/jwtAuth.js";
import cookieParser from "cookie-parser";

const port = 2007;
const app = express();

Object.assign(app.locals, helpers);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(expresLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.set("views", path.resolve("src", "views"));

app.get("/api/users", API_Users.getUsers);
app.get("/api/users/:id", API_Users.getSingleUser);

app.get("/api/tasks", jwtAuth, API_Tasks.getAllTasks);
app.get("/api/tasks/:id", jwtAuth, API_Tasks.getSingleTask);
app.post("/api/tasks", jwtAuth, API_Tasks.createTask);
app.patch("/api/tasks/:id", jwtAuth, API_Tasks.updateTask);
app.delete("/api/tasks/:id", jwtAuth, API_Tasks.deleteTask);

// app.get("/api/categories", API_Categories.getAllCategories);
app.get("/api/categories", jwtAuth, API_Categories.getCategoriesUser);
app.get("/api/categories/:id", jwtAuth, API_Categories.getSingleCategory);
app.post("/api/categories", jwtAuth, API_Categories.createCategory);
app.patch("/api/categories/:id", jwtAuth, API_Categories.updateCategory);
app.delete("/api/categories/:id", jwtAuth, API_Categories.deleteCategory);

app.get("/login", AuthController.login);
app.get("/register", AuthController.register);
app.post("/logout", jwtAuth, AuthController.logout);
app.post("/register", AuthRegisterValidation, AuthController.postRegister, AuthController.register);
app.post("/login", AuthLoginValidation, AuthController.postLogin, AuthController.login);
app.get("/", jwtAuth, PageController.home);
app.get("/category/:id", jwtAuth, PageController.home);

app.get("*", (req, res) => {
  res.status(404).render("errors/404", {
    layout: "layouts/error",
  });
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}/login`);
});
