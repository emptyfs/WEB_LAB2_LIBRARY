//создает объект приложения express (с именем app, по соглашению), настраивает приложение и промежуточное по
//а затем экспортирует приложение из модуля


const createError = require('http-errors');//экспорт модулей по умолчанию
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');//экспорт модулей по умолчанию

const indexRouter = require('./routes/index'); //экспорт модулей из каталога routes
const usersRouter = require('./routes/users'); //экспорт модулей из каталога routes

const app = express(); //создаем объект app (он устанавливает движки-шаблоны представления)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// path.join('/foo', 'bar', 'baz/asdf', 'quux', '..') - join возвращает объединенный путь (нормализованный)
// Returns: '/foo/bar/baz/asdf'
// '__dirname' - переменная, которая указывает абсолютный путь к каталогу, содержащему текущий файл
// т.е. здесь укзывается папка, в которой находятся шаблоны представления
app.set('view engine', 'pug'); //а здесь указывается сам движок (pug)

//добавление промежуточных (middleware) модулей в цепочку обработки запросов
//грубо говоря, middleware - это код, который выполняется между получением запроса сервера и возвратом им ответа клиенту
//т.к. запрос-ответ - это не линейное исполенение кода
app.use(logger('dev')); //логирование

//в запросах http 2 строчки для парсинга
app.use(express.json()); //(первая строчка, работает, когда идет POST-запрос)
// анализирует входящие запросы JSON и помещает проанализированные данные в request.body
app.use(express.urlencoded({ extended: false })); //(вторая строчка) анализирует данные строки
//запроса в URL-адресе
app.use(cookieParser()); //берет все куки, что присылает клиент и помещает их в request.cookies
//также позволяет изменять их до того, как отправить их клиенту назад (response.cookies)
app.use(express.static(path.join(__dirname, 'public'))); //обслуживает статические файлы из ./public
//(код, изображения, css и т.д.)
//app.use - обрабатывает запроос, когда клиент попадает на путь, который прописан в use и применяет
//функцию(второй параметр)


app.use('/', indexRouter);//добавление кода обработки путей в цепочку обработки запросов (импортированы выше)
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
module.exports.book_list = indexRouter.book_list; //экспорт массива книг
