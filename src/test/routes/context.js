const { randomBytes } = require("crypto");
const format = require("pg-format");
const { default: migrate } = require("node-pg-migrate");
const pool = require("../../pool");

const DEFAULT_OPTS = {
    host: "localhost",
    port: 5432,
    database: "socialnetwork-test",
    user: "postgres",
    password: "******",
};

class Context {
    static async build() {
        const roleName = `user_${randomBytes(8).toString("hex")}`;
        await pool.connect(DEFAULT_OPTS);

        //create role

        await pool.query(
            format(
                "CREATE ROLE %I WITH LOGIN PASSWORD %L;",
                roleName,
                roleName,
            ),
        );

        //create schema

        await pool.query(
            format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName),
        );

        //disconnection

        await pool.close();

        //run our migrations in schema

        await migrate({
            schema: roleName,
            direction: "up",
            log: () => {},
            noLock: true,
            dir: "migrations",
            databaseUrl: {
                host: "localhost",
                port: 5432,
                database: "socialnetwork-test",
                user: roleName,
                password: roleName,
            },
        });

        //connection to pg as new role

        await pool.connect({
            host: "localhost",
            port: 5432,
            database: "socialnetwork-test",
            user: roleName,
            password: roleName,
        });

        return new Context(roleName);
    }
    constructor(roleName) {
        this.roleName = roleName;
    }

    async reset() {
        return pool.query(`
            DELETE FROM users
            `);
    }

    async close() {
        //disconect from pg

        await pool.close();

        //reconnect as root user
        await pool.connect(DEFAULT_OPTS);

        //delete role and schema

        await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));
        await pool.query(format("DROP ROLE %I", this.roleName));

        //disconnect
        await pool.close();
    }
}

module.exports = Context;
