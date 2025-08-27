import knex from "knex";
import knexConfig from "../../knexfile.js";

const environment = process.env.NODE_ENV || "development";

const config = knexConfig[environment];

const Knex = knex(config);

(async () => {
  await Knex.raw("PRAGMA foreign_keys = ON;");
  console.log("Foreign key constraints are enabled.");
})();

export default Knex;
