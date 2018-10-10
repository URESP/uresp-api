const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/user.model');
const { handler: errorHandler } = require('../middlewares/error');
const Audit = require('../models/audit.model');
/**
 * Load user and append to req.
 * @public
 */
  exports.load = async (req, res, next, id) => {
    try {
      const user = await User.get(id);
      req.locals = { user };
      return next();
    } catch (err) {
      const audit = new Audit({
        user: req.user || null,
        entity: "USER",
        apiPath: "",
        errorType: "Error while loading User",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
      await audit.save()
      return errorHandler(err, req, res);
    }
  };

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (err) {
    const audit = new Audit({
        user: req.user || null,
        entity: "USER",
        apiPath: "",
        errorType: "Error while Creating User",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
      await audit.save()
    next(User.checkDuplicateEmail(err));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (err) {
    const audit = new Audit({
        user: req.user || null,
        entity: "USER",
        apiPath: "",
        errorType: "Error while replacing User",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
      await audit.save()
    next(User.checkDuplicateEmail(err));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(async (err) => {
      const audit = new Audit({
        user: req.user || null,
        entity: "USER",
        apiPath: "",
        errorType: "Error while updating User",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
      await audit.save()
     next(User.checkDuplicateEmail(err)) 
    });
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map(user => user.transform());
    res.json(transformedUsers);
  } catch (err) {
    const audit = new Audit({
        user: req.user || null,
        entity: "USER",
        apiPath: "",
        errorType: "Error while listing User",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
      await audit.save()
    next(err);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(async(err) => {
      const audit = new Audit({
        user: req.user || null,
        entity: "USER",
        apiPath: "",
        errorType: "Error while Removing User",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
      await audit.save()
     next(err) 
    });
};
