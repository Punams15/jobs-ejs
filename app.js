require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const path = require("path");

const passportInit = require("./passport/passportInit");
const connectDB = require("./db/connect");
const storeLocals = require("./middleware/storeLocals");

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser
app.use(express.urlencoded({ extended: false }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Flash messages
app.use(flash());
app.use(storeLocals);

// Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", auth, secretWordRouter);

// 404 handler
app.use((req, res) => res.status(404).send(`Page ${req.url} not found`));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// Start server
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log("MongoDB connected successfully");
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
};

start();
