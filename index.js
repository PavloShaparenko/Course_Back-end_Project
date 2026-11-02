const app = require("./src/app");
const pool = require("./src/pool");

pool.connect({
    host: "localhost",
    port: 5432,
    database: "socialnetwork",
    user: "postgres",
    password: "*****",
})

    .then(() => {
        app().listen(3002, () => {
            console.log("listening on port 3002");
        });
    })
    .catch((err) => console.error(err));
