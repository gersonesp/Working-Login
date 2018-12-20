const router = require("express").Router();
const { User } = require("./db");
module.exports = router;

const userNotFound = next => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
};

router.use("/google", require("./oauth"));

router.get("/me", (req, res, next) => {
  res.json(req.user || {});
});

router.put("/login", (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
    .then(user => {
      if (user) {
        req.login(user, err => (err ? next(err) : res.json(user)));
      } else {
        const err = new Error("Incorrect email or password!");
        err.status = 401;
        next(err);
      }
    })
    .catch(next);
});

router.delete("/logout", (req, res, next) => {
  req.logOut();
  req.session.destroy();
  res.status(204).end();
});
