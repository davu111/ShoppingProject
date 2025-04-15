const User = require("../models/User");

class UserController {
  // [GET] /users/:id
  getUser(req, res, next) {
    User.findById(req.params.id)
      .then((user) => res.json(user))
      .catch(next);
  }
}

module.exports = new UserController();
