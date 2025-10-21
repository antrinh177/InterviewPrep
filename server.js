const express = require("express");
const bodyParser = require("express").json;
const questionRoutes = require("./modules/questions/routes/questionRoutes");
const userRoutes = require("./modules/users/routes/userRoutes");
const categoryRoutes = require("./modules/categories/routes/categoryRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

//Global Middlewares
app.use(bodyParser());
app.use(logger);

//Routes
app.use("/questions", questionRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);

//App-level Middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});