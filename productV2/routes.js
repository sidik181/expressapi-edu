const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const productController = require('../productV2/controller');

router.get('/products', productController.getProducts);
router.get('/product/:productId', productController.getProductById);
router.post('/product', upload.single('image'), productController.addProduct);
router.put('/product/:productId', upload.single('image'), productController.editProductById);
router.delete('/product/:productId', productController.deleteProductById);

module.exports = router;
