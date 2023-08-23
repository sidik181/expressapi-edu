const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const productRouter = require('./product/routes');
const productRouterV2 = require('./productV2/routes');

app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended: true}));
app.use('/api/v1', productRouter);
app.use('/api/v2', productRouterV2);

app.listen(port, () => console.log(`Server sedang berjalan di http://localhost:${port}`));