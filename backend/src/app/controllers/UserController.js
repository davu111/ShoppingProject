const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

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

  // [POST] /users/createUser
  async createUser(req, res, next) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({ ...req.body, password: hashedPassword });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  // [POST] /users/login
  async login(req, res, next) {
    try {
      const user = await User.findOne({ account: req.body.account });
      if (!user) return res.status(401).json({ message: "User not found" });

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign(
        { id: user._id, account: user.account, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // set true nếu deploy với HTTPS
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Login successful" });
    } catch (err) {
      next(err);
    }
  }

  // [POST] /users/logout
  logout(req, res) {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  }

  // [GET] /users/profile
  async profile(req, res) {
    const token = req.cookies.token;
    console.log(token);

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password"); // bỏ password
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user); // trả user đầy đủ cho frontend
    } catch (err) {
      res.status(403).json({ message: "Invalid token" });
    }
  }
}

module.exports = new UserController();
