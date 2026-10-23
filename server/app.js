const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const morgan = require('morgan');
const app = express();

app.set('trust proxy', ['loopback', 'uniquelocal']);
app.use(morgan('dev'));
app.use((req, res, next) => {
  try {
    decodeURIComponent(req.path);
    next();
  } catch (error) {
    res.status(400).send('Invalid URI');
  }
});

// credentials: true — cookie token с клиента :3001 (фаза 4 Cookie + Bearer)
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
  console.error(`Failed to start server on port ${port}:`, error);
});
