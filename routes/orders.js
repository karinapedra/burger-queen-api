const { requiredAuth } = require('../middleware/auth');

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require('../controller/orders');
const config = require('../config');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.get('/orders', requiredAuth(secret), getOrders);

  app.get('/orders/:id', requiredAuth(secret), getOrderById);

  app.post('/orders', requiredAuth(secret), createOrder);

  app.put('/orders/:id', requiredAuth(secret), updateOrder);

  app.delete('/orders/:id', requiredAuth(secret), deleteOrder);

  nextMain();
};
