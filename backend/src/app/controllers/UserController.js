const User = require("../models/User");

class UserController {
  // [GET] /users/:id
  getUser(req, res, next) {
    User.findById(req.params.id)
      .then((user) => res.json(user))
      .catch(next);
  }

  // [PUT] /users/:id
  updateUser(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((user) => res.json(user))
      .catch(next);
  }

  // [POST] /users
  createUser(req, res, next) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch(next);
  }

  // /users/login
  login(req, res, next) {
    User.findOne({ account: req.body.account, password: req.body.password })
      .then((user) => res.json(user))
      .catch(next);
  }
}

module.exports = new UserController();
