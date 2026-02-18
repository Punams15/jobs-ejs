const express = require("express");
require("express-async-errors");
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Flash messages
app.use(flash());

// Middleware to pass flash messages to views
app.use((req, res, next) => {
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
});

// --- Routes ---

// Homepage route
app.get("/", (req, res) => {
  res.render("index"); // Make sure views/index.ejs exists
});

// Secret Word page
app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.render("secretWord", { secretWord: req.session.secretWord });
});

app.post("/secretWord", (req, res) => {
  const newWord = req.body.secretWord;
  if (newWord.toUpperCase().startsWith("P")) {
    req.flash("error", "That word won't work! You can't use words that start with P.");
  } else {
    req.session.secretWord = newWord;
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
