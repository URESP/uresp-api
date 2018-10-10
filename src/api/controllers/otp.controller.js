var otpGenerator = require('otp-generator');
const User = require('../models/user.model');
const Audit = require('../models/audit.model');

exports.generateOtp = async (req, res, next) => {
  try {
    const otp = otpGenerator.generate(6, { digits: true, specialChars: false, alphabets: false, upperCase: false });
    const { email } = req.body;
    const message = await User.FindOneAndUpdate({ email }, { otp });

    return res.send({ otp });
  } catch (err) {
  	 const audit = new Audit({
        user: req.user || null,
        entity: "OTP",
        apiPath: "",
        errorType: "Error while Generating OTP",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
    await audit.save()
    return next(err);
  }
}

//8904242424