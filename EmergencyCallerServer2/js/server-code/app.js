const express = require("express");
const app = express();
const morgan = require("morgan");
const winston = require("./config/winston");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const itemRoutes = require("./api/routes/items");
const orderRoutes = require("./api/routes/categories");
const userRoutes = require("./api/routes/users");
const quoteRoutes = require("./api/routes/quotes");
const whitelistRoutes = require("./api/routes/whitelists");

mongoose.connect(
  "mongodb://admin:Bish123@cluster0-shard-00-00-hzc4x.gcp.mongodb.net:27017,cluster0-shard-00-01-hzc4x.gcp.mongodb.net:27017,cluster0-shard-00-02-hzc4x.gcp.mongodb.net:27017/emergencycalldb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
 // "mongodb://admin0:"+
  // process.env.MONGO_ATLAS_PW
  // +"@cluster0-shard-00-00-tmogd.mongodb.net:27017,cluster0-shard-00-01-tmogd.mongodb.net:27017,cluster0-shard-00-02-tmogd.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
  {
    useMongoClient: true
  }
).then(() => console.log('connected to DB'))
.catch(err => console.log(err));
mongoose.Promise = global.Promise;

app.use(morgan("combined", { stream : winston.stream }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/items", itemRoutes);
app.use("/categories", orderRoutes);
app.use("/users", userRoutes);
app.use("/quotes", quoteRoutes);

//Using...
app.use("/whitelist", whitelistRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
