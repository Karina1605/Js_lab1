"use strict"
//Функция чтения даты из prompt (При некорректном вводе даты возвращается текущая)
function GetDate (Message)
{
    let DateSt = prompt(Message);
    if (DateSt==='')
        return new Date();
    let arr = DateSt.trim().split('.');
    if (arr.length!=3)
        return new Date();
    return new Date (+arr[2] ,+arr[1]-1 ,+arr[0]);
}
//Проверка года на високосность
function IsLeapYear (year)
{
    if (year%4===0 || (year%100===0 && year%400!==0))
        return true;
    return false;
}
function CountOfDays (months, year)
{
    switch (months)
    {
        case 0: case 2: case 4: case 6: case 7: case 9: case 11: 
            return 31;
        case 3: case 5: case 8: case 10 : 
            return 30;
        case 1 :
            return IsLeapYear(year)+28;
    }
}
function GetMillisecondsInYear(year, month)
{
    let year1 = IsLeapYear(year)
    let year2 =IsLeapYear(year+1);
    if ((year1 && month<=1) || (year2 && month>1))
        return (1000*60*60*24*366);
    return (1000*60*60*24*365);
}
//Установка начальной и конечной дат
let DateStart = GetDate("Введите начальную дату в формате ДД.ММ.ГГГГ (если начальная дата- сегодняшний день, то пустая строка)");
let DateFinish =GetDate("Введите конечную дату в формате ДД.ММ.ГГГГ");
function Calculate()
{
    //Кол-во миллисекунд между указанными датами
    let DateDifference =DateFinish -DateStart;
    //Если это одна и та же дата - возвращаем результат
    if (DateDifference===0)
        return ("Даты эквивалентны")
    //Результирующая строка
    let ResStr;
    //Переменные, хранящие номер текущего месяца (m2) и года (y2)
    let  m1, y1; 
    let format = parseInt(prompt ("Укажите формат вывода данных (годы - 1, месяцы - 2, недели - 3, дни - 4)"));
    //Переменные, хранящие кол-во миллисекунд в текущем месяце и годе
    let MilliSecondsInCurrentYear=0, MilliSecondsInCurrentMonth=0;
    //Если пользователь ввел даты наоборот, восстанавливаем значение DateDifference, редактируем результирующие строки
    //Устанавливаем начальные значения для года и месяца (больший год и его месяц)
    if (DateDifference<0)
    {
        ResStr="Прошло ";
        DateDifference*=(-1);
        [m1, y1] = [ DateFinish.getMonth(), DateFinish.getFullYear()];
    }
    else
    {
        ResStr = "Осталось ";
        [m1, y1] = [DateStart.getMonth(),  DateStart.getFullYear()];
    }
    //в ветках case нет break, тк при любом формате нам необходимо дойти до дней при формировании ответа
    switch (format)
    {
        case 1:
            let years =0;
            MilliSecondsInCurrentYear = GetMillisecondsInYear(y1, m1);
            //пока кол-во миллисекунд в текущем годе превышает общее кол-во миллисекунд между двумя датами - вычитаем их и увеличиваем счетчик
            while (DateDifference>=MilliSecondsInCurrentYear)
            {

                DateDifference -= MilliSecondsInCurrentYear;
                y1++;
                years++;
                MilliSecondsInCurrentYear = GetMillisecondsInYear(y1, m1);
            }
            //alert ("year = "+y1.toString()+" mill = "+DateDifference.toString());
            //Формирование корректных форм слова
            if ((years%100>=11 && years%100<=19) || years%10>=5)
                    ResStr+=years.toString()+" лет "
            else
            {
                ResStr+=years.toString()+" год"
                if (years%10>1)
                    ResStr+="a ";
                else
                ResStr+=" ";
            }
        //Вычисление кол-ва месяцев, аналогично case 1
        case 2:
            //если разница между двумя датами - целое кол-во лет - выходим из функции
            if (DateDifference===0)
            return ResStr;
            let months =0;
            MilliSecondsInCurrentMonth =1000*60*60*24*CountOfDays(m1, y1);
            //аналогочно с MilliSecondsInCurrentYear
            while (DateDifference>=MilliSecondsInCurrentMonth)
            {
                //Если дошли до декбря текущего года - переходим к январю следующего
                DateDifference-=MilliSecondsInCurrentMonth;
                months++;
                if (m1===11)
                {
                    m1=0;
                    y1++;
                }
                else m1++;
                  
                MilliSecondsInCurrentMonth = 1000*60*60*24*CountOfDays(m1, y1);    
               // alert ("month = "+m1.toString()+" mill = "+DateDifference.toString());
            }
            ResStr+=(months).toString()+ " месяц";
            if (months == 1)
                ResStr+=" ";
                else
                    if (months<5)
                        ResStr+="a ";
                        else
                            ResStr+="ев ";
        //Остаточное число миллисекунд распределяем на недели
        case 3:
            if (DateDifference===0)
            return ResStr;
            
            let weeks = Math.floor(DateDifference/(1000*60*60*24*7)); 
            ResStr+=weeks.toString() +  " недель ";
            DateDifference-=weeks*7*1000*60*60*24;
        //Остаток миллисекунд расчитываем по дням 
        case 4:
            if (DateDifference===0)
            return ResStr;
            let days = Math.floor(DateDifference/(1000*60*60*24));
            ResStr+= days.toString()+" дней ";
        break;
    }
    return ResStr;
}
//вызов функции
alert(Calculate());