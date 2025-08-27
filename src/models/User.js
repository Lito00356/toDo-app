import knex from "../lib/Knex.js";
import { Model } from "objection";
import Category from "./Category.js";
import Task from "./Task.js";

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["nickname", "email", "password"],
      properties: {
        id: { type: "integer" },
        nickname: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        password: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    return {
      categories: {
        relation: Model.HasManyRelation,
        modelClass: Category,
        join: {
          from: "users.id",
          to: "categories.users_id",
        },
        onDelete: "CASCADE",
      },
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: "users.id",
          to: "tasks.users_id",
        },
        onDelete: "CASCADE",
      },
    };
  }
}

export default User;
