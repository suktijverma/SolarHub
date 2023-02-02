const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
app.use(morgan("dev"));
// app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use("/SolarHub-Discourse/user", require("./Routers/userRouter"));
app.use("/SolarHub-Discourse/post", require("./Routers/postRouter"));
app.use("/SolarHub-Discourse/stats", require("./Routers/generalStats"));
app.use("/SolarHub-Discourse/category", require("./Routers/categoryRouter"));
app.use(
  "/SolarHub-Discourse/invitation",
  require("./Routers/invitationRouter")
);
app.use("/", require("./Routers/authRouter"));
module.exports = app;
