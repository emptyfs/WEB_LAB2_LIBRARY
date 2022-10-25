function add_book() //добавление книги
{
    callAjaxPut
    (
        document.getElementById("element1").value, //автор (значения принимаем из pug)
        document.getElementById("element2").value, //название книги
        document.getElementById("element3").value //год выпуска
    );
}

function callAjaxPut(author, name, release)
{
    const xhr = new XMLHttpRequest(); //создание объекта XMLHttpRequest

    //обработчик события, который вызывается всякий раз, когда изменяется состояние свойства readyState
    //(только для асинхронных запросов)
    //readtState - номер состояни от 0 до 4 (UNSENT, OPENED, HEADERS_RECEIVED, LOADING, DONE)
    xhr.onreadystatechange = function()
    {
        //Когда в свойстве readyState установлено значение 4, а в свойстве status – 200, ответ сервера готов
        if (this.readyState == 4 && this.status == 200) {
            document.documentElement.innerHTML = this.responseText; //в корневой элемент записывает ответ сервера
        }
    };

    //open - инициализирует новый запрос или повторно инициализирует уже созданный
    xhr.open("PUT", '/books', true);//метод - put, директория - books(url), асинхр - да

    //указываем заголовок Content-Type, где указываем кодировку для xml
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    //отправляет этот запрос с телом, в котором указаны автор, книга, год издания
    if (!author || !name || !release.toString().match(/^\d{4}$/))
    {
        alert("Неправильная форма!");
    }
    else
    {
        xhr.send(`author=${author}&name=${name}&release=${release}`);//
    }
}

function delete_book(index) //удаление книги по ее индексу
{
    if (confirm("Вы точно хотите удалить книгу из списка?"))
    {
        callAjaxDelete(index);
    }
}

function callAjaxDelete(index)
{
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.documentElement.innerHTML = this.responseText;
        }
    };

    //open - инициализирует новый запрос или повторно инициализирует уже созданный
    xhttp.open("DELETE", `/${index}`, true);
    xhttp.send(); //отправляет запрос на удаление /${index}
}

function book_filter_by_instock()
{
    // в in_stock идет 0, если книга отсутсвует, и 1, если присутствует (приведение типов потом превращает в false или
    //true соотвественно
    let in_stock = document.getElementById("element4").checked ?
        document.getElementById("element4").value : document.getElementById("element5").value;

    callAjaxGet('in_stock', in_stock);
}

function book_filter_by_overdue()
{
    // в in_stock идет 0, если книга просрочена, и 1, если не просрочена (приведение типов потом превращает в false или
    //true соотвественно
    let overdue = document.getElementById("element6").checked ?
        document.getElementById("element6").value : document.getElementById("element7").value;

    callAjaxGet('overdue', overdue);
}

function callAjaxGet(par, val)
{
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        { //window.location.href - свойство, которое сообщает текущее местоположение URL-адреса
            //браузера. Измение значения свойства приведет к перенаправлению страницы
            window.location.href=`http://localhost:3000/books/filter/${par}/${val}`;
        }
    };

    //open - инициализирует новый запрос или повторно инициализирует уже созданный
    xhttp.open("GET", `/books/filter/${par}/${val}`, true);//указываем метод get и url, асинхр
    xhttp.send(); //отпроавляем запрос на получение данных
}

function add_btn()
{
    temp_x = document.getElementById("add_books").hidden;
    if(temp_x)
    {
        document.getElementById("add_books").hidden = false;
        document.getElementById("filterbtn").disabled = true;
    } else
    {
        document.getElementById("add_books").hidden = true;
        document.getElementById("filterbtn").disabled = false;
    }
}

function filter_btn()
{
    temp_x = document.getElementById("filt").hidden;
    if(temp_x)
    {
        document.getElementById("filt").hidden = false;
        document.getElementById("addbtn").disabled = true;
    } else
    {
        document.getElementById("filt").hidden = true;
        document.getElementById("addbtn").disabled = false;
    }
}

function is_fields_correct()
{
    let element1 = document.getElementById('element1');
    let element2 = document.getElementById('element2');
    let element3 = document.getElementById('element3');
    document.getElementById('btn').disabled = element1.value && element2.value && element3.value ? false : true;
}