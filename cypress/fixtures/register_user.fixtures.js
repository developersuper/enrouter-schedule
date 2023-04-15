const validRegistrationDetails = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password123",
  password2: "password123",
};

const invalidEmailDetails = {
  name: "John Doe",
  email: "john.doeexample.com",
  password: "password123",
  password2: "password123",
};

const passwordsDoNotMatchDetails = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password123",
  password2: "password456",
};

module.exports = {
  validRegistrationDetails,
  invalidEmailDetails,
  passwordsDoNotMatchDetails,
};
