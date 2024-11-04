const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes'); // Импортируем основной файл маршрутов
const path = require("path")
const exphbs = require("express-handlebars")
const db = require("./data/db")


const app = express();
const hbs = exphbs.create({
  defaultLayout: "page",
  extname:"hbs"
})
app.use(bodyParser.json());
app.engine("hbs",hbs.engine)
app.set("view engine", "hbs")
app.set("views", "views")

app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended: true}))

// Используем основной файл маршрутов
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
