const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("data is missing");
  } else if (firstName.length < 3 || firstName.length > 28) {
    throw new Error("firstname is not valid");
  } else if (lastName.length < 3 || lastName.length > 28) {
    throw new Error("firstname is not valid");
  } else if (!validator?.isEmail(emailId)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong");
  }
  return true;
};

module.exports = {
  validateSignUpData,
};
