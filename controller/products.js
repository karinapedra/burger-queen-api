const Products = require('../models/Products');

const createProduct = async (req, resp) => {
  try {
    const {
      name,
      price,
      image,
      type,
    } = req.body;

    if (!name || !price || !type) {
      return resp.status(400).json({ error: 'Fields name, price and type are required' });
    }

    const product = new Products({
      name,
      price,
      image,
      type,
    });

    const newProduct = await product.save();
    resp.status(201).json({ newProduct });
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProductById = async (req, resp) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);

    if (!product) {
      resp.status(404).json({ error: 'Product not found' });
    }

    resp.json(product);
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: 'Product not found' });
    } else {
      resp.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const getProducts = async (req, resp) => {
  try {
    const products = await Products.find();
    resp.json(products);
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProduct = async (req, resp) => {
  try {
    const productId = req.params.id;
    const {
      name,
      price,
      image,
      type,
    } = req.body;
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        image,
        type,
      },
      { new: true },
    );
    if (!updatedProduct) {
      resp.status(404).json({ error: 'Product not found' });
    }

    resp.json({ updatedProduct });
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: 'Product not found' });
    } else {
      resp.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const deleteProduct = async (req, resp) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      resp.status(404).json({ error: 'Product not found' });
    }

    resp.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: 'Product not found' });
    } else {
      resp.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
