var express = require('express'); //загрузка модуля express
var router = express.Router(); //получаем объект
//Node.js express.Router() позволяет создавать составные модульные
// маршруты без повторного указания повторяющихся частей URL.

//var list_of_book = require('../library');
//извлечение библиотеки в массив
var copy_list_of_book = JSON.parse(JSON.stringify(require('../library.json'))); //подгружаем библиотеку
var list_of_book = [];
for (let key in copy_list_of_book)
{
  copy_list_of_book[key].index = Number(key);
  list_of_book.push(copy_list_of_book[key]);
}

/* GET home page. */
router.get('/', function(req, res, next)
{
  res.render('index', { title: 'Библиотека' });
});

//вывод клиенту список книг по методу get
router.get('/books', function(req, res, next)
{
  res.render('library', {books: list_of_book});
});

//изменение информации о книге
//:num - Конструкция «:num» указывает, что в данном фрагменте URL будет передаваться изменяемое значение и е
// му задается имя «num», это же имя используется для доступа – req.params.num
//(.т.е. http://localhost:3000/books/<число>)
//«req.body» – это свойство доступно благодаря подключенному модулю «body-parser»
//Свойство req.body содержит пары ключ-значение данных, отправленных в теле запроса
router.put('/books/:num(\\d+)', (req, res) =>
{
  let body = req.body;
  if (!body.author || !body.name ||
      !body.release.toString().match(/^\d{4}$/))
  //если в теле запроса нет ни author, ни name, ни даты публикации
  {
    res.status(400); // Ошибка – нет такой страницы
    res.json({message: "Bad Request"});
  } else {
    for (var i = 0; i < list_of_book.length; i++) //в ином случае меняем
    {
      if (list_of_book[i].index == req.params.num)
      {
        list_of_book[i].author = body.author;
        list_of_book[i].name = body.name;
        list_of_book[i].release = body.release;
        break;
      }
    }
  }
});

//открыть информацию о книге (клиенту вывод)  Отображение страницы с шаблоном .pug из папки views
router.get('/books/:num(\\d+)', function(req, res, next)
{
  const book = list_of_book.filter((b) => {
    if (b.index == req.params.num)
    {
      return true;
    }
  });
  res.render('book', {
    name: book[0].name,
    author: book[0].author,
    release: book[0].release,
    in_stock: book[0].in_stock,
    out_stock_date: book[0].out_stock.date,
    out_stock_pname: book[0].out_stock.pname
  });
});

//добавить книгу
router.put('/books', (req, res) => {
  let body = req.body;
  if (!body.author || !body.name || !body.release.toString().match(/^\d{4}$/))
  {
    alert("Неправильная форма!");
    res.status(400);
    res.json({message: "Bad Request"});
  } else
  {
    list_of_book.push({
      name: body.name,
      author: body.author,
      release: body.release,
      return_date: '-',
      in_stock: true,
      out_stock: { date: '', pname: '' },
      index: list_of_book.length
    });
  }
  res.render('library', {books: list_of_book});
});

//удаление записи о книге
router.delete('/:index', (req, res)=>{
  list_of_book.splice(req.params.index, 1);
  for (let i = 0; i < list_of_book.length; i++)
  {
    list_of_book[i].index = i;
  }
  res.render('library', {books: list_of_book});
});

//фильтр по наличию
router.get('/books/filter/in_stock/:val', function(req, res, next)
{
  let in_stock = Boolean(Number(req.params.val));
  let filtered_books = [];
  for (let i = 0; i < list_of_book.length; i++)
  {
    if (list_of_book[i].in_stock === in_stock)
    {
      filtered_books.push(list_of_book[i]);
    }
  }
    res.render('library', { books: filtered_books, is_back: true});
});

//фильтрация по просрочке
router.get('/books/filter/overdue/:val', function(req, res, next)
{
  let out_stock_l = Boolean(Number(req.params.val));
  let filtered_books = [];
  for (let i = 0; i < list_of_book.length; i++)
  {
    if (list_of_book[i].in_stock === false)
    {
      let date_parts = list_of_book[i].out_stock.date.split(".");
      let date_string = date_parts[1] + '-' + date_parts[0] + '-' + date_parts[2];
      let current_date = new Date();
      if (!out_stock_l && Number(Date.parse(date_string)) < Number(Date.parse(current_date)))
      {//если книга в запасе есть и время прошло
        filtered_books.push(list_of_book[i]);
      } else if (out_stock_l && Date.parse(date_string) > current_date)
      {//если книги в запасе нет и время не прошло
        filtered_books.push(list_of_book[i]);
      }
    }
  }
    res.render('library', { books: filtered_books, is_back: true});
});

//отдать или возвратить книгу
router.post('/books/:num(\\d+)', (req, res) => {
  let body = req.body;
  if (!body.in_stock || !body.out_stockName || !body.out_stockDate.toString().match(/^\d\d\.\d\d\.\d\d\d\d$/g))
  {
    res.status(400);
    res.json({message: "Bad Request"});
  }
  else
  {
    for (var i = 0; i < list_of_book.length; i++)
    {
      if (list_of_book[i].index == req.params.num)
      {
        if (body.in_stock === 'true')
        {
          list_of_book[i].in_stock = false;
          list_of_book[i].out_stock.date = body.out_stockDate;
          list_of_book[i].out_stock.pname = body.out_stockName;
        } else
        {
          list_of_book[i].in_stock = true;
          list_of_book[i].return_date = body.out_stockDate;
          list_of_book[i].out_stock.date = "";
          list_of_book[i].out_stock.pname = "";
        }
        break;
      }
    }
  }
});

module.exports = router;
module.exports.book_list = list_of_book;