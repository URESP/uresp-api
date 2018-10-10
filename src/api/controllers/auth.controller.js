const httpStatus = require('http-status');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
const { jwtExpirationInterval } = require('../../config/vars');
const { sendVerificationEmail } = require('./verification.controller');
const { sendVerificationMail, sendVerificationSms } = require('../../config/vars');
const Audit = require('../models/audit.model');
/**
* Returns a formated object with tokens
* @private
*/
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const user = await (new User(req.body)).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    if(sendVerificationMail) {
      sendVerificationEmail(user.uuid, { to: userTransformed.email });
    }
    return res.json({ token, user: userTransformed });
  } catch (err) {
    const audit = new Audit({
        user: req.user || null,
        entity: "AUTH",
        apiPath: "",
        errorType: "Error while Registering User",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
    await audit.save()
    return next(User.checkDuplicateEmail(err));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (err) {
    const audit = new Audit({
        user: req.user || null,
        entity: "AUTH",
        apiPath: "",
        errorType: "Error while logging User In",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
    await audit.save()
    return next(err);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    console.info("inside oAuth>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (err) {
    const audit = new Audit({
        user: req.user || null,
        entity: "AUTH",
        apiPath: "",
        errorType: "Error while OAuth",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
    await audit.save()
    return next(err);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (err) {
    const audit = new Audit({
        user: req.user || null,
        entity: "AUTH",
        apiPath: "",
        errorType: "Error while refreshing Token",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
    await audit.save()
    return next(err);
  }
};
