const express = require("express");
const bodyParser = require("express").json;
require("dotenv").config();
const connectDB = require("./shared/middlewares/connect-db");
const questionRoutes = require("./modules/questions/routes/questionRoutes");
const userRoutes = require("./modules/users/routes/userRoutes");
const categoryRoutes = require("./modules/categories/routes/categoryRoutes");
const notFound = require("./shared/middlewares/notFound");
const errorHandler = require("./shared/middlewares/errorHandler");
const logger = require("./shared/middlewares/logger");

const app = express();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

//Connect to MongoDB
connectDB();

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