const indexR = require("./index");
const usersR = require("./users");
const toysR = require("./toys");





exports.routesInit = (app) => {
  // Define routers where they belong 
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/toys", toysR);



}