const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//Body parser
app.use(bodyParser.urlencoded(false));
app.use(bodyParser.json());

//MongoDb
const dbUri = require("./config/keys").mongoUri;

mongoose
	.connect(dbUri)
	.then(() => console.log("MongoDB connected"))
	.catch(err => console.log(err));

app.use(passport.initialize());

require('./config/passport')(passport);

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is listening on port ${port}`));
