const fs = require('fs');
const path = require('path');
const Product = require('./model')

const getProducts = async (req, res) => {
    const getProductsCallback = async () => Product.findAll();
    await tryCatch(res, getProductsCallback);
};

const getProductById = async (req, res) => {
    const productId = req.params.productId;
    const getProductCallback = async () => Product.findByPk(productId);
    await tryCatch(res, getProductCallback);
};

const addProduct = async (req, res) => {
  const { userId, name, price, stock, status } = req.body;
  const image = req.file;

  const addProductCallback = async () => {
    let imageUrl = null;
    
    if (image) {
      const originaFileName = image.originalname;
      const uploadPath = path.join(__dirname, '../uploads', originaFileName);
      fs.renameSync(image.path, uploadPath);
      imageUrl = `http://localhost:3000/public/${originaFileName}`;
    }
    
    const product = await Product.create({userId, name, price, stock, status, imageUrl});
    return product;
  };

    await tryCatch(res, addProductCallback);
};

const editProductById = async (req, res) => {
  const productId = req.params.productId;
  const { userId, name, price, stock, status } = req.body;
  const image = req.file;

  const editProductCallback = async () => {
    const product = await Product.findByPk(productId);
    const oldImageUrl = product.imageUrl;
    let imageUrl = null;
    
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }
    
    if (image) {
      if (oldImageUrl) {
        const oldImagePath = path.join(__dirname, '../uploads', path.basename(oldImageUrl));
        fs.unlink(oldImagePath, (unlinkError) => {
          if (unlinkError) {
            console.error('Error delete file gambar sebelumnya:', unlinkError);
          }
        });
      }
      const originaFileName = image.originalname;
      const uploadPath = path.join(__dirname, '../uploads', originaFileName);
      fs.renameSync(image.path, uploadPath);
      imageUrl = `http://localhost:3000/public/${originaFileName}`;

    } else if (oldImageUrl) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(oldImageUrl));
        fs.unlink(oldImagePath, (unlinkError) => {
          if (unlinkError) {
            console.error('Error delete file gambar sebelumnya:', unlinkError);
          }
        });
    }
    
    await product.update({userId, name, price, stock, status, imageUrl});
    return product;
  }

  await tryCatch(res, editProductCallback);
};

const deleteProductById = async (req, res) => {
  const productId = req.params.productId;

  const deleteProductCallback = async () => {
    const product = await Product.findByPk(productId);
    const imageUrl = product.imageUrl;

    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    if (imageUrl) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(imageUrl));
        fs.unlink(imagePath, (unlinkError) => {
          if (unlinkError) {
            console.error('Error delete file gambar:', unlinkError);
          }
          product.destroy();
        });
      } else {
        await product.destroy();
      }
  }

  await tryCatch(res, deleteProductCallback);
};

const tryCatch = async (res, functionCallback) => {
    try {
        const result = await functionCallback();
        res.json(result);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    editProductById,
    deleteProductById,
}