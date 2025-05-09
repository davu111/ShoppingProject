require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser"); //cookie
const port = 3000;

const routes = require("./src/routes");

// Cho phép frontend (React) gửi cookie
app.use(
  cors({
    origin: "http://localhost:5173", // frontend domain
    credentials: true,
  })
);

// Database
const db = require("./src/config/db");
db.connect();

// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
routes(app);

app.listen(port, () => {
  console.log(`Project is running on http://localhost:${port}`);
});
