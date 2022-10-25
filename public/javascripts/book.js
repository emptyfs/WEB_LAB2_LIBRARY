var inputsArray = [document.getElementById('element1'), document.getElementById('element2'),
    document.getElementById('element3')]; //извлекаем массив из автора, книги и года выпуска

inputsArray.forEach(function (input)  //запись при нажатии enter
{
    input.addEventListener("keydown", function (event)
    {
        if (event.keyCode === 13)
        {
            callAjaxPut(inputsArray[0].value, inputsArray[1].value, inputsArray[2].value);
        }
    });
});

function save()
{
    callAjaxPut(inputsArray[0].value, inputsArray[1].value, inputsArray[2].value);
}


function callAjaxPut(author, name, release) //для записи измений
{
    const xhttp = new XMLHttpRequest();

    xhttp.open("PUT", `/books/${document.location.href.split('/')[4]}`, true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send(`author=${author}&name=${name}&release=${release}`);
}

function give_book() //даем книгу
{
    callAjaxPost(true, document.getElementById("element5").value, document.getElementById("element4").value);
}

function return_book() //забираеи книгу
{
    callAjaxPost(false, get_current_date(), document.getElementById("element4"));
}

function get_current_date()
{
    let date = new Date();
    let day = date.getDate();
    if (day.toString().length === 1) day = '0' + day;
    let month = date.getMonth();
    if (month.toString().length === 1) month = '0' + month;

    return day + '.' + month + '.' + date.getFullYear();
}

function callAjaxPost(in_stock, out_stock_date, out_stock_name)
{
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/books/${document.location.href.split('/')[4]}`, true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send(`in_stock=${in_stock}&out_stockDate=${out_stock_date}&out_stockName=${out_stock_name}`);
}

function is_fields_correct() {
    let element4 = document.getElementById('element4');
    let element5 = document.getElementById('element5');

    if (element4.value && element5.value && element5.value.match(/^[0-3]\d\.[0-1]\d\.\d\d\d\d$/g))
    {
        document.getElementById('btn').disabled = false;
    } else
    {
        document.getElementById('btn').disabled = true;
    }
}