const createResponse = (loggedIn) => {
  return loggedIn
    ? {
        loggedIn: false,
        errors: "",
      }
    : {
        created: false,
        error: "",
      };
};

module.exports = createResponse;
