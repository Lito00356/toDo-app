import knex from "../lib/Knex.js";
import { Model } from "objection";
import Task from "./Task.js";
import User from "./User.js";

// instantiate the model
Model.knex(knex);

// define the NavigationItem model
class Category extends Model {
  static get tableName() {
    return "categories";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["category"],
      properties: {
        id: { type: "integer" },
        category: { type: "string", minLength: 1, maxLength: 255 },
        slug: { type: "string", minLength: 1, maxLength: 255 },
        users_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: "categories.id",
          to: "tasks.category_id",
        },
        onDelete: "CASCADE",
      },
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "categories.users_id",
          to: "users.id",
        },
      },
    };
  }
}

export default Category;
