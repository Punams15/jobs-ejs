// middleware/isAuth.js
// protect routes that require login
export default function isAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/sessions/logon");
  }
  next();
}
