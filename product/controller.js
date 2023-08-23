const connection = require('../config/mysql');
const fs = require('fs');
const path = require('path');

const getProducts = (req, res) => {
    connection.query({
        sql: 'SELECT * FROM products',
    }, _response(res));
};

const getProductById = (req, res) => {
    const productId = req.params.id;
    connection.query({
        sql: `SELECT * FROM products WHERE products.id = ${productId}`
    }, _response(res));
};

const addProduct = (req, res) => {
    const { usersId, nameProduct, price, stock, status, categoryId, username, email, address } = req.body;
    const image = req.file;
    let sql = '';
    let values = [];

    if (image) {
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target);
        sql = 'INSERT INTO products (users_id, nama_produk, price, stock, status, category_id, nama_pengguna, email, alamat, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        values = [usersId, nameProduct, price, stock, status, categoryId, username, email, address, `http://localhost:3000/public/${image.originalname}`]
        } else {
            sql = 'INSERT INTO products (users_id, nama_produk, price, stock, status, category_id, nama_pengguna, email, alamat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            values = [usersId, nameProduct, price, stock, status, categoryId, username, email, address]
        }
        connection.query({sql, values}, _response(res));
};

const editProductById = (req, res) => {
    const { usersId, nameProduct, price, stock, status, categoryId, username, email, address } = req.body;
    const image = req.file;
    let sql = '';
    let values = [];
  
    connection.query('SELECT image_url FROM products WHERE id = ?', [req.params.id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }

      const oldImageUrl = results[0].image_url;
      if (image) {
        if (oldImageUrl) {
          const oldImagePath = path.join(__dirname, '../uploads', path.basename(oldImageUrl));
          fs.unlink(oldImagePath, (unlinkError) => {
            if (unlinkError) {
              console.error('Error delete file gambar sebelumnya:', unlinkError);
            }
          });
        }
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target);
        sql = 'UPDATE products SET users_id = ?, nama_produk = ?, price = ?, stock = ?, status = ?, category_id = ?, nama_pengguna =? , email = ?, alamat = ?, image_url = ? WHERE id = ?';
        values = [usersId, nameProduct, price, stock, status, categoryId, username, email, address, `http://localhost:3000/public/${image.originalname}`, req.params.id];
      } else {
        if (oldImageUrl) {
          const oldImagePath = path.join(__dirname, '../uploads', path.basename(oldImageUrl));
          fs.unlink(oldImagePath, (unlinkError) => {
            if (unlinkError) {
              console.error('Error delete file gambar sebelumnya:', unlinkError);
            }
          });
        }
        sql = 'UPDATE products SET users_id = ?, nama_produk = ?, price = ?, stock = ?, status = ?, category_id = ?, nama_pengguna = ? , email = ?, alamat = ?, image_url = ? WHERE id = ?';
        values = [usersId, nameProduct, price, stock, status, categoryId, username, email, address, null, req.params.id];
      }
  
      connection.query({ sql, values }, _response(res));
    });
};

const deleteProductById = (req, res) => {
    const productId = req.params.id;
    connection.query('SELECT image_url FROM products WHERE id = ?', [productId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imageUrl = results[0].image_url;

    if (imageUrl) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(imageUrl));
      fs.unlink(imagePath, (unlinkError) => {
        if (unlinkError) {
          console.error('Error deleting image:', unlinkError);
        }
        deleteProductImageFile(productId, res);
      });
    } else {
      deleteProductImageFile(productId, res);
    }
  });
};

const deleteProductImageFile = (productId, res) => {
    connection.query('DELETE FROM products WHERE id = ?', [productId], _response(res));
};

const _response = (res) => {
    return (error, result) => {
        if (error) {
            res.send({
                status:'failed',
                response: error
            });
        } else if (result.length === 0 ) {
            res.status(404).json({
                error: 'Product Not Found'
            });
        } else {
            res.send({
                status: 'success',
                response: result
            });
        }
    }
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    editProductById,
    deleteProductById,
}