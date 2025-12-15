const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('./config/config');
const { fetchRemoteConfig } = require('./service/config.service');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Connect to MongoDB
mongoose.connect(config.localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.static(path.join(__dirname, 'uploads')));

app.use(cors(corsOptions));

const users = require('./routes/users');
const auth = require('./routes/auth');
const common = require('./routes/common');
const property = require('./routes/property');
const email = require('./routes/email');

app.get('/', (req, res) => { res.status(200).send('Success'); });

app.use('/api/user', users);
app.use('/api/auth', auth);
app.use('/api/common', common);
app.use('/api/property', property);
app.use('/api/email', email);

const PORT = process.env.PORT || 5001;

server.listen(PORT, async () => {
  await fetchRemoteConfig();
  console.log(`Server running on port ${PORT}`);
});