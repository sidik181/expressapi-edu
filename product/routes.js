const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const productController = require('../product/controller');

router.get('/products', productController.getProducts);
router.get('/product/:id', productController.getProductById);
router.post('/product', upload.single('image'), productController.addProduct);
router.put('/product/:id', upload.single('image'), productController.editProductById);
router.delete('/product/:id', productController.deleteProductById);

module.exports = router;
