const {
  requiredAuth,
  isAdmin,
} = require('../middleware/auth');

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controller/products');
const config = require('../config');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.get('/products', requiredAuth(secret), getProducts);

  app.get('/products/:id', requiredAuth(secret), getProductById);

  app.post('/products', requiredAuth(secret), isAdmin, createProduct);

  app.put('/products/:id', requiredAuth(secret), isAdmin, updateProduct);

  app.delete('/products/:id', requiredAuth(secret), isAdmin, deleteProduct);

  nextMain();
};
