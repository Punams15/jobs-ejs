// protect routes that require login
const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/sessions/logon");
  }
  next();
};

module.exports = auth;
