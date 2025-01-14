const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const { Allroutes } = require("./router/router");
module.exports = class Application {
  #app = express();
  #DB_URI;
  #PORT;
  constructor(PORT, DB_URI) {
    this.#PORT = PORT;
    this.#DB_URI = DB_URI;
    this.configApplication();
    this.connectToMongoDB();
    this.createServer();
    this.createRoutes();
    this.errorHandling();
  }
  configApplication() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
  }
  createServer() {
    const http = require("http");
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log("run http://localhost:" + this.#PORT);
    });
  }
  connectToMongoDB() {
    mongoose.connect(this.#DB_URI).then(() => {
      console.log("connected to mongoDB");
    });
  }
  createRoutes() {
    this.#app.use(Allroutes);
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      return res.status(404).json({
        statusCode: 404,
        message: "صفحه مورد نظر یافت نشد",
      });
    });
    this.#app.use((error, req, res, next) => {
      const statusCode = error.status || 500;
      const message = error.message || "internal server error";
      return res.status(statusCode).json({
        statusCode,
        message,
      });
    });
  }
};
