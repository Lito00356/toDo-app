import knex from "../lib/Knex.js";
import { Model } from "objection";
import Category from "./Category.js";
import User from "./User.js";

// instantiate the model
Model.knex(knex);

// define the NavigationItem model
class Task extends Model {
  static get tableName() {
    return "tasks";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["taskName"],
      properties: {
        id: { type: "integer" },
        taskName: { type: "string", minLength: 1, maxLength: 255 },
        category_id: { type: "integer" },
        is_completed: { type: "integer" },
        users_id: { type: "integer" },
      },
    };
  }
  static get relationMappings() {
    return {
      categories: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: "tasks.category_id",
          to: "categories.id",
        },
      },
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tasks.users_id",
          to: "users.id",
        },
      },
    };
  }
}

export default Task;
