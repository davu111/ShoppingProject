const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

const routes = require("./src/routes");

app.use(cors());

// Database
const db = require("./src/config/db");
db.connect();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
routes(app);

app.listen(port, () => {
    console.log(`Project is running on http://localhost:${port}`);
});
