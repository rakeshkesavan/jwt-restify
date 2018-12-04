const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const customerRoute = require("./routes/Customers");
const userRoute = require("./routes/Users");
const rjwt = require("restify-jwt-community");

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

server.use(rjwt({ secret: config.JWT_SECTRET }).unless({ path: ["/auth"] }));

server.listen(config.PORT, () => {
  mongoose.set("useFindAndModify", false);
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});

const db = mongoose.connection;
db.on("error", error => console.log(error));

db.once("open", () => {
  customerRoute(server);
  userRoute(server);
  console.log("server started on port ", config.PORT);
});
