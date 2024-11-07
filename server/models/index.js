'use strict'; //Включение строгого режима JavaScript

const fs = require('fs'); //файловая система
const path = require('path'); //управление путями
const Sequelize = require('sequelize'); //для работы с ORM
const process = require('process'); //для доступа к переменным окружения
const basename = path.basename(__filename); //чтобы исключить index.js из загрузки как модель, когда сканируется папка models
const env = process.env.NODE_ENV || 'development'; //указывает, в каком режиме запущен сервер
const config = require(__dirname + '/../config/config.json')[env]; 
const db = {}; //объект будет использоваться для хранения всех загруженных моделей и самого объекта sequelize


// Инициализация объекта sequelize для подключения к базе данных.
// Если в конфигурации use_env_variable указана переменная окружения, то sequelize инициализируется с её использованием.
// Если переменной окружения нет, sequelize инициализируется с использованием данных database, username, и password из конфигурации.
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname) // Чтение всех файлов в текущей директории позволит динамически загружать все модели 
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && //Исключает скрытые файлы
      file !== basename && //Исключает текущий файл
      file.slice(-3) === '.js' && //Загружает только JavaScript файлы
      file.indexOf('.test.js') === -1 //Исключает файлы тестов
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname,  file))//Импортирует каждый файл как модель
    (sequelize, Sequelize.DataTypes);  // позволяет инициализировать каждую модель с подключением к BD
    db[model.name] = model; // cохраняет модель в объекте
    // позволяет обращаться к каждой модели по её названию db.Movie
  });


Object.keys(db).forEach(modelName => { // возвращает массив имен всех моделей
  if (db[modelName].associate) { //Проверяет, существует ли метод associate у модели.
    db[modelName].associate(db); //позволяет установить ассоциации между моделями (например, Movie.belongsTo(Director)).
  }
});

db.sequelize = sequelize; // model
db.Sequelize = Sequelize; // class

module.exports = db;
