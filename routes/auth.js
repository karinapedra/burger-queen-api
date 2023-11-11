const { login } = require('../controller/login');

module.exports = (app, nextMain) => {
  app.post('/login', login);

  return nextMain();
};
