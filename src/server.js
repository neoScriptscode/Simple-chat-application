require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const signinRoute = require("./controllers/signin.js");
const signupRoute = require("./controllers/signup.js");
const whoAmI = require("./controllers/whoAmI.js");
const logoutRoute = require("./controllers/logout");
const auth = require("./middleware/auth");
const cors = require("cors");
const session = require("./config/session.config.js");
const initPassport = require("./config/passport.config.js");


(async () => {
  if (!process.env.DB_CONNECTION_STRING) throw new Error('Mongo uri was not found!');
  const app = express();
  const port = process.env.PORT || 8080;

  // middlewares
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(session);

  // database 
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  const database = mongoose.connection;
  database.on("error", (error) => console.log(error));
  database.once("connected", () => console.log("Database Connected ..."));

  // initialize passport
  initPassport(app);

  // routes 
  app.use("/auth", auth);
  app.use("/me", whoAmI)
  app.use("/signin", signinRoute);
  app.use("/signup", signupRoute);
  app.use("/logout", logoutRoute);

  app.listen(port, () => console.log(`Server is runnig on port ${port} ...`));
})().catch(err => console.log(err));

