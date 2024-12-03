const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes'); // Импортируем основной файл маршрутов
const path = require("path")
const exphbs = require("express-handlebars")
const db = require("../server/data/db")
const morgan = require('morgan');




const app = express();

app.use(morgan('dev')); // Это будет логировать запросы в консоль
app.use((req, res, next) => {
  try {
    decodeURIComponent(req.path);
    next();
  } catch (error) {
    res.status(400).send('Invalid URI');
  }
});

const hbs = exphbs.create({
  defaultLayout: "page",
  extname: "hbs"
})
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3001'
}));
app.use(bodyParser.json());
app.use(express.json());
app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")
app.set("views", "views")

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))

// Используем основной файл маршрутов
app.use('/', routes);




// Запуск сервера с обработкой ошибок
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
  console.error(`Failed to start server on port ${port}:`, error);
});
