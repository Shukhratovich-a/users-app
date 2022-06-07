import { InternalServerError, AuthorizationError } from "../utils/errors.js";
import { read, write } from "../utils/model.js";
import sha256 from "sha256";
import jwt from "../utils/jwt.js";

const GET = (req, res, next) => {
  try {
    let users = read("users").map((user) => {
      delete user.password;
      return user;
    });

    res.status(200).send(users);
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const LOGIN = (req, res, next) => {
  try {
    let { username, password } = req.body;
    let users = read("users");

    let user = users.find((user) => user.username == username && user.password == sha256(password));

    if (!user) {
      return next(new AuthorizationError(401, "wrong username or password"));
    }

    delete user.password;

    res.status(200).json({
      status: 200,
      message: "success",
      token: jwt.sign({ userId: user.userId }),
      data: user,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const REGISTER = (req, res, next) => {
  try {
    let users = read("users");
    console.log(users);

    req.body.userId = users.length ? users[users.length - 1].userId + 1 : 1;
    req.body.password = sha256(req.body.password);

    let user = users.find((user) => user.username == req.body.username);

    if (user) {
      return next(new AuthorizationError(401, "this username exits"));
    }

    users.push(req.body);
    write("users", users);

    delete req.body.password;

    res.status(200).json({
      status: 200,
      message: "success",
      token: jwt.sign({ userId: req.body.userId }),
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default { GET, LOGIN, REGISTER };
