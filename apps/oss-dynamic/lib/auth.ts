import { betterAuth } from "better-auth";
import { createPool } from "mysql2";
import { Pool } from "pg";
import { Kysely, MysqlDialect, PostgresDialect } from "kysely";

// const dialect = new MysqlDialect({
//   pool: createPool({
//     database: "saas_foundations",
//     host: "localhost",
//     user: "root",
//     password: "password",
//     port: 3306,
//     connectionLimit: 10,
//   }),
// });

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "saas_foundations",
    host: "localhost",
    user: "postgres",
    password: "secret",
    port: 5432,
    max: 10,
  }),
});

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: {
    dialect,
    type: "postgres",
  },
});
