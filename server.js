const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

const orderRoutes = require('./routes/orders');
const uploadRoute = require('./routes/upload');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const notifRoutes = require('./routes/notifications');
const statsRoutes = require('./routes/stats');
const cartRoutes = require('./routes/cartRoutes');
const templateRoutes = require('./routes/template');

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', require('./routes/chat'));
app.use('/api/templates', templateRoutes);

// Routes
app.get('/', (req, res) => res.send('SERBAADABOX Backend API is running'));

// TODO: Tambahkan route lainnya di sini

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});