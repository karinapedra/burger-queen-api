const {
  requiredAuth,
  isAdmin,
} = require('../middleware/auth');

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controller/users');
const config = require('../config');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.get('/users', requiredAuth(secret), isAdmin, getUsers);

  app.get('/users/:id', requiredAuth(secret), isAdmin, getUserById);

  app.post('/users', requiredAuth(secret), isAdmin, createUser);

  app.put('/users/:id', requiredAuth(secret), isAdmin, updateUser);

  app.delete('/users/:id', requiredAuth(secret), isAdmin, deleteUser);

  nextMain();
};
