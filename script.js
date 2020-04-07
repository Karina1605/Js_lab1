"use strict"
//Функция чтения даты из prompt (При некорректном вводе даты возвращается текущая)
function getDate (message){
    let dateSt = prompt(message);
    if (dateSt === ''){ 
        return new Date();
    }
    let arr = dateSt.trim().split('.');
    if (arr.length != 3){
        return new Date();
    }
    return new Date (+arr[2] ,+arr[1]-1 ,+arr[0]);
}
//Проверка года на високосность
function isLeapYear (year){
    if (year %4 === 0 || (year %100 === 0 && year %400 !== 0))
        return true;
    return false;
}
function countOfDays (months, year){
    switch (months)
    {
        case 0: case 2: case 4: case 6: case 7: case 9: case 11: 
            return 31;
        case 3: case 5: case 8: case 10 : 
            return 30;
        case 1 :
            return isLeapYear(year)+28;
    }
}
function getMillisecondsInYear(year, month){
    let year1 = isLeapYear(year)
    let year2 =isLeapYear(year+1);
    if ((year1 && month <= 1) || (year2 && month > 1))
        return (1000*60*60*24*366);
    return (1000*60*60*24*365);
}
//Установка начальной и конечной дат
let dateStart = getDate("Введите начальную дату в формате ДД.ММ.ГГГГ (если начальная дата- сегодняшний день, то пустая строка)");
let dateFinish =getDate("Введите конечную дату в формате ДД.ММ.ГГГГ");

function calculate(){
    //Кол-во миллисекунд между указанными датами
    let dateDifference = dateFinish - dateStart;
    //Если это одна и та же дата - возвращаем результат
    if (dateDifference===0)  return ("Даты эквивалентны")
    //Результирующая строка
    let resStr;

    //Переменные, хранящие номер текущего месяца (m2) и года (y2)
    let  m1, y1; 

    let format = parseInt(prompt ("Укажите формат вывода данных (годы - 1, месяцы - 2, недели - 3, дни - 4)"));
    //Переменные, хранящие кол-во миллисекунд в текущем месяце и годе
    let milliSecondsInCurrentYear=0, milliSecondsInCurrentMonth=0;

    //Если пользователь ввел даты наоборот, восстанавливаем значение DateDifference, редактируем результирующие строки
    //Устанавливаем начальные значения для года и месяца (больший год и его месяц)
    if (dateDifference < 0){
        resStr="Прошло ";
        dateDifference*=(-1);
        [m1, y1] = [ dateFinish.getMonth(), dateFinish.getFullYear()];
    } else {
        resStr = "Осталось ";
        [m1, y1] = [dateStart.getMonth(),  dateStart.getFullYear()];
    }

    //в ветках case нет break, тк при любом формате нам необходимо дойти до дней при формировании ответа
    switch (format)
    {
        case 1:
            let years =0;
            milliSecondsInCurrentYear = getMillisecondsInYear(y1, m1);
            //пока кол-во миллисекунд в текущем годе превышает общее кол-во миллисекунд между двумя датами - вычитаем их и увеличиваем счетчик
            while (dateDifference >= milliSecondsInCurrentYear){
                dateDifference -= milliSecondsInCurrentYear;
                y1++;
                years++;
                milliSecondsInCurrentYear = getMillisecondsInYear(y1, m1);
            }
            //Формирование корректных форм слова
            if ((years %10 === 0) || (years %10 >= 5) || (years %100 >= 11 && years %100 <=19 ) ){
                    resStr += years + " лет "
            } else {
                resStr+=years +" год"
                if (years %10 > 1)  resStr+="a ";
                else
                    resStr+=" ";
            }
        //Вычисление кол-ва месяцев, аналогично case 1
        case 2:
            //если разница между двумя датами - целое кол-во лет - выходим из функции
            if (dateDifference === 0) return resStr;

            let months =0;

            milliSecondsInCurrentMonth = 1000*60*60*24*countOfDays(m1, y1);
            //аналогочно с MilliSecondsInCurrentYear
            while (dateDifference >= milliSecondsInCurrentMonth){
                //Если дошли до декбря текущего года - переходим к январю следующего
                dateDifference-=milliSecondsInCurrentMonth;
                months++;
                if (m1===11){
                    m1=0;
                    y1++;
                }
                else m1++;
                  
                milliSecondsInCurrentMonth = 1000*60*60*24*countOfDays(m1, y1);
            }
            resStr += months + " месяц";
            if ((months%100 >= 11 && months %100 <= 19) || (months %10 === 0) || (months%10 >= 5) )  resStr+="ев ";
                else
                    if (months %10 > 1)  resStr+="a ";
                    else   resStr+=" ";
        //Остаточное число миллисекунд распределяем на недели
        case 3:
            if (dateDifference === 0)  return resStr;
            
            let weeks = Math.floor( dateDifference / (1000*60*60*24*7) );
            
            resStr+=weeks +  " недел";
            if ( (weeks %10 === 0) || (weeks %10 >= 5) || (weeks %100 >= 11 && weeks %100 <= 19))  resStr+="ь ";
                else
                    if (weeks %10 > 1)  resStr+="и ";
                    else   resStr+="я ";

            dateDifference -= weeks*7*1000*60*60*24;
        //Остаток миллисекунд расчитываем по дням 
        case 4:
            if (dateDifference === 0)  return resStr;

            let days = Math.floor(dateDifference/(1000*60*60*24));

            resStr+= days;
            if ( (days %10 === 0) || (days %10 >= 5) || (days %100 >= 11 && days %100 <= 19) ) {
                resStr+=" дней ";
            } else
                if (days %10 > 1)  resStr+=" дня ";
                    else   resStr+=" день ";
    }
    return resStr;
}
//вызов функции
alert(calculate());