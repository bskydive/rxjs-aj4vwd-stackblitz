"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var source = rxjs_1.of('World').pipe(operators_1.map(function (x) { return "Hello " + x + "!"; }));
source.subscribe(function (x) { return console.log(x); });
/**
 * ===============================================
 * ========== Библиотека живых примеров ==========
 * ===============================================
 *
 * ========== ПОЧИТАЙКА: README.md ===============
 *
 * Сделано как конспект при изучении различных материалов.
    https://www.learnrxjs.io/
    http://reactivex.io/documentation/operators.html
    https://rxmarbles.com/
    https://rxjs-dev.firebaseapp.com/api
    https://app.pluralsight.com/library/courses/rxjs-operators-by-example-playbook
    *
    * Поможет при изучении как справочник, и разобраться почему не работает оператор.
    * Содержит полный список правильных способов import {}
    *
    * Необходимые операторы ищутся ctrl+f, в конце добавляем $ к названию оператора
    * Перед каждым примером есть небольшое описание и результат выполнения
    * Если надо поменять поведение оператора необходимо:
    * * обновить страницу stackblitz
    * * раскомментировать subscribe строку необходимого оператора
    * * открыть консоль встроенного браузера stackblitz
    *
 *
 * ========== Конструктивная помощь ===============
 *
 * https://stepanovv.ru/portfolio/portfolio.html#id-contacts
 *
 * ==================== ЛИКБЕЗ ====================
 *
 * $ - символ в конце для интеллигентного обозначения наблюдателя
 * Observable - объект наблюдения - по сути генерирует поток значений. Есть метод подписки(subscribe) на значения потоков, а также метод последовательной обработки потока(pipe()). Может порождать несколько потоков значений.
 * Observer - наблюдатели - объекты(функции), которые обрабатывают(принимают/генерируют) поток значений.
    next()
    error()
    complete()
 * Subscriber - вид наблюдателя. Объект(функция), которая обрабатывает конечные результаты потока. Передаётся внутрь метода Observable.subscribe(subscriber)
 * pipe(аргументы) - организует последовательную передачу значений потока между аргументами-наблюдателями. Сделано для избегания конфликтов с методами объектов.
 * subscribe(item => console.log('значение потока', item), err => console.log('ошибка', err), () => console.log('поток закрыт штатно')); - запускает поток, принимает три аргумента для значений(next), ошибок(error), завершения потока(complete)
 * scan -
 *
 * Виды операторов по типу операций со значеними:
 * трансформация - изменение значений
 * фильтрация -
 * комбинация - операции со значениями нескольких потоков
 * утилиты - способ генерации значений
 * условные
 * агрегирующие - одно значение на выходе
 * распыляющие - multicast
 */
/**
 * Чтобы обойти ошибку TS2496: The 'arguments' object cannot be referenced in an arrow function in ES3 and ES5. Consider using a standard function expression.
 * https://github.com/microsoft/TypeScript/issues/1609
 */
function logAll() {
    console.log.apply(console, __spread(arguments));
}
/**
 * map
 * Преобразует и возвращает текущее значение потока
 * interval(x) - Источник значений, который создаёт значения (i=0;i<Number.MAX_SAFE_INTEGER;i++) через каждые x мсек
 * для наглядности умножаю значения на интервал x, чтобы получалось время а не порядковый номер
 * tap - не меняет значения потока
 * take - останавливает поток после получения указанного количества значений
 */
var map$ = rxjs_1.interval(100).pipe(operators_1.take(3), operators_1.map(function (item) { return ['преобразуй это: ', item]; }), operators_1.tap(function (item) { return ['фига с два: ', item]; }), //не возвращает ничего
operators_1.tap(function (item) { return console.log('отладь меня: ', item); }));
/**
 * Три работающих варианта подписки
 * разведены во времени, чтобы не перемешивать вывод в консоль
 */
//map$.subscribe(item => console.log('раз:', item));//без задержек
/*
setTimeout(() => {
  map$.subscribe(item => console.log('два', item), err => console.log('два', err), () => console.log('два', 'конец'));
}, 1000);//с задержкой в 1 сек
*/
/*
setTimeout(() => {
  map$.subscribe({
    next: item => console.log('три', item),
    error: err => console.log('три', err),
    complete: () => console.log('три', 'конец')
  })
}, 2000);//с задержкой в 2 сек
*/
//========================================================================================================================
//==================================================BUFFER================================================================
//========================================================================================================================
/**
 * Кэширует и возвращает пачку значений
 */
//[0, 1, 2, 3, 4, 5, 6, 7, 8]
//[9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
//[9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
var buffer$ = rxjs_1.interval(100).pipe(operators_1.buffer(rxjs_1.interval(1000)), operators_1.take(3), operators_1.map(function (item) { return __spread(['bufferInterval'], item); }));
//buffer$.subscribe(a => console.log(a));
//[0, 1, 2]
//[3, 4, 5]
//[6, 7, 8]
var bufferCount$ = rxjs_1.interval(100).pipe(operators_1.bufferCount(3), operators_1.take(3), operators_1.map(function (item) { return __spread(['bufferCount'], item); }));
//bufferCount$.subscribe(a => console.log(a));
//[0, 1, 2]
//[2, 3, 4]
//[4, 5, 6]
//стартует новый буфер каждое второе значение
var bufferCountLength$ = rxjs_1.interval(100).pipe(operators_1.bufferCount(3, 2), operators_1.take(3), operators_1.map(function (item) { return __spread(['bufferCountFork'], item); }));
//bufferCountLength$.subscribe(a => console.log(a));
//["bufferTime", 0]
//["bufferTime", 0, 1, 2]
//["bufferTime", 1, 2, 3]
var bufferTime$ = rxjs_1.interval(100).pipe(operators_1.bufferTime(200, 100), operators_1.take(3), operators_1.map(function (item) { return __spread(['bufferTime'], item); }));
//bufferTime$.subscribe(a => console.log(a));
/*
0
1
2
bufferOpen
0
3
4
5
6
bufferClose
0
[3, 4, 5, 6]
bufferOpen
1
7
8
9
10
bufferClose
1
[7, 8, 9, 10]
bufferOpen
2
11
12
*/
//асинхронный старт и стоп буфера
var count = 0;
var bufferOpen$ = rxjs_1.interval(400).pipe(operators_1.tap(function () { return console.log('bufferOpen', count); }));
var bufferClose$ = function () { return rxjs_1.interval(300).pipe(operators_1.tap(function () { return console.log('bufferClose', count++); })); };
var bufferToggle$ = rxjs_1.interval(100).pipe(operators_1.tap(function (item) { return console.log(item); }), operators_1.bufferToggle(bufferOpen$, bufferClose$), operators_1.take(3), operators_1.map(function (item) { return __spread(['bufferToggle'], item); }));
//bufferToggle$.subscribe(a => console.log(a));
//выбор времени закрытия буфера
/*
["bufferWhen", 0]
["bufferWhen", 1, 2, 3]
["bufferWhenElse", 4, 5]
["bufferWhenElse", 6]
["bufferWhenElse", 7]
["bufferWhenElse", 8]
["bufferWhenElse", 9]
*/
count = 0;
var bufferWhen$ = rxjs_1.interval(500).pipe(operators_1.take(10), operators_1.map(function (item) { return (count = item); }), operators_1.bufferWhen(function () {
    if (count < 5) {
        return rxjs_1.interval(1000);
    }
    else {
        return rxjs_1.interval(500);
    }
}), operators_1.map(function (item) {
    if (count < 5) {
        return __spread(['bufferWhen'], item);
    }
    else {
        return __spread(['bufferWhenElse'], item);
    }
}));
//bufferWhen$.subscribe(a => console.log(a));
//========================================================================================================================
//==================================================WINDOW================================================================
//========================================================================================================================
/**
 * Возвращает новые поток(буфер) по таймеру, предыдущий закрывает
 */
/*
["window", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
["window", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
*/
var window$ = rxjs_1.interval(100).pipe(operators_1.window(rxjs_1.interval(1000)), operators_1.take(3), operators_1.switchMap(function (item) { return item.pipe(operators_1.toArray(), operators_1.map(function (item) { return __spread(['window'], item); })); }));
//window$.subscribe(a => console.log(a));
/*
windowCount(2)
["windowCount", 0, 1]
["windowCount", 2, 3]
["windowCount", 4, 5]
["windowCount", 6, 7]
["windowCount", 8, 9]
["windowCount"]

windowCount(2,3)
["windowCount", 0, 1]
["windowCount", 3, 4]
["windowCount", 6, 7]
["windowCount", 9]
*/
var windowCount$ = rxjs_1.interval(100).pipe(operators_1.take(10), operators_1.windowCount(2, 3), operators_1.switchMap(function (item) { return item.pipe(operators_1.toArray(), operators_1.map(function (item) { return __spread(['windowCount'], item); })); }));
//windowCount$.subscribe(a => console.log(a));
/*
 * Дополнительный способ timer вместо interval
["windowTime", 0, 1]
["windowTime", 2, 3]
["windowTime", 4, 5]
["windowTime", 6, 7]
["windowTime", 8]
 */
var windowTime$ = rxjs_1.timer(0, 100)
    .pipe(operators_1.take(9), operators_1.windowTime(200), operators_1.switchMap(function (item) { return item.pipe(operators_1.toArray(), operators_1.map(function (item) { return __spread(['windowTime'], item); })); }));
//windowTime$.subscribe(a => console.log(a));
/**
 *
windowOpen 0
0
1
2
windowClose 0
["windowToggle", 0, 1, 2]
3
windowOpen 1
4
5
6
7
windowClose 1
["windowToggle", 4, 5, 6, 7]
windowOpen 2
8
9
["windowToggle", 8, 9]
 */
count = 0;
var windowOpen$ = rxjs_1.timer(0, 400).pipe(operators_1.map(function () { return console.log('windowOpen', count); }));
var windowClose$ = function () { return rxjs_1.timer(300).pipe(operators_1.map(function () { return console.log('windowClose', count++); })); };
var windowToggle$ = rxjs_1.timer(0, 100).pipe(operators_1.take(10), operators_1.tap(function (item) { return console.log(item); }), operators_1.windowToggle(windowOpen$, windowClose$), operators_1.switchMap(function (item) { return item.pipe(operators_1.toArray(), operators_1.map(function (item) { return __spread(['windowToggle'], item); })); }));
//windowToggle$.subscribe(a => console.log(a));
//выбор времени закрытия буфера
/*

*/
count = 0;
var windowWhen$ = rxjs_1.interval(500).pipe(operators_1.take(10), operators_1.map(function (item) { return (count = item); }), operators_1.windowWhen(function () {
    if (count < 5) {
        return rxjs_1.interval(1000);
    }
    else {
        return rxjs_1.interval(500);
    }
}), operators_1.switchMap(function (item) { return item
    .pipe(operators_1.toArray(), operators_1.map(function (item) {
    if (count < 5) {
        return __spread(['windowWhen'], item);
    }
    else {
        return __spread(['windowWhenElse'], item);
    }
})); }));
//windowWhen$.subscribe(a => console.log(a));
//========================================================================================================================
//==================================================ERRORS================================================================
//========================================================================================================================
//
/**
 * Перехват потока при ошибке
 * Практическое применение: самописные обработчики ошибок, сервисы хранения ошибок типа ravenjs
словил:ошибка ошибковна источик:Observable {_isScalar: false, source: {…}, operator: {…}}
положь где взял:вернул взад ошибка ошибковна источик:Observable {_isScalar: false, source: {…}, operator: {…}}
янеошибка
норм
 */
var error$ = rxjs_1.throwError('ошибка ошибковна')
    .pipe(operators_1.catchError(function (err, caught) {
    console.log('словил:', err, 'источик:', caught); //перехватчик ошибок
    return rxjs_1.throwError("\u0432\u0435\u0440\u043D\u0443\u043B \u0432\u0437\u0430\u0434 " + err); //генерируем новую ошибку вместо текущей
}), operators_1.catchError(function (err, caught) {
    console.log('положь где взял:', err, 'источик:', caught); //перехватчик ошибок работает последовательно
    return rxjs_1.of('янеошибка'); //подмена ошибки значением
}));
//error$.subscribe(a => console.log(a), err => console.log('ошибка:', err), ()=>console.log('норм'));
//
/**
 * Можно подменять ошибку при пустом потоке
 * Error {message: "no elements in sequence", name: "EmptyError"}
 */
var errorHandler = function () { return console.log("\u043D\u0438\u0447\u043E\u0441\u0438"); };
var errorEmpty$ = rxjs_1.of().pipe(operators_1.throwIfEmpty() //без подмены
//throwIfEmpty(errorHandler)//подмена ошибки
);
//errorEmpty$.subscribe(a => console.log(a), err=>console.log(err));
//
/**
 * Новый поток при ошибке
0
1
2
3
едем дальше
 */
var errorNext$ = rxjs_1.of("\u0435\u0434\u0435\u043C \u0434\u0430\u043B\u044C\u0448\u0435"); //резервный поток после ошибок
var errorSwitch$ = rxjs_1.timer(0, 100).pipe(operators_1.take(5), operators_1.map(function (item) {
    if (item > 3) {
        throw new Error('ничоси');
    }
    else {
        return item;
    }
}), operators_1.onErrorResumeNext(errorNext$));
//errorSwitch$.subscribe(a => console.log(a), err=>console.log(err));
//
/**
 * Повторяет поток значений указанное количество раз при ошибке
0
1
2
3
0
1
2
3
0
1
2
3
Error: ничоси
 */
var errorRetry$ = rxjs_1.timer(0, 100).pipe(operators_1.take(5), operators_1.map(function (item) {
    if (item > 3) {
        throw new Error('ничоси');
    }
    else {
        return item;
    }
}), operators_1.retry(2));
//errorRetry$.subscribe(a => console.log(a));
/**
 * retryWhen
 * повторяет поток пока не будет получен complete/error внутри аргумента наблюдателя retryCondition$
0
1
2
словили: Error: ничоси
0
1
2
словили: Error: ничоси
0
1
2
словили: Error: ничоси
 */
var errorRetryWhen$ = rxjs_1.timer(0, 100).pipe(operators_1.take(5), operators_1.map(function (item) {
    if (item === 3) {
        throw new Error('ничоси');
    }
    else {
        return item;
    }
}), operators_1.retryWhen(function (retryCondition$) {
    return retryCondition$.pipe(operators_1.map(function (item) {
        console.log('словили: ' + item);
    }), operators_1.take(3) //отправляет complete после 3 повторов
    );
}));
//errorRetryWhen$.subscribe(a => console.log(a));
//retryWhen
var swallow = false;
var sw$ = rxjs_1.interval(200).pipe(operators_1.map(function (x) {
    console.log('try: ' + x);
    if (x === 1) {
        throw 'error: ' + x;
    }
    return x;
}), operators_1.retryWhen(function (errors) {
    if (swallow) {
        return errors.pipe(operators_1.tap(function (err) { return console.log(err); }), operators_1.scan(function (acc) { return acc + 1; }, 0), operators_1.tap(function (retryCount) {
            if (retryCount === 2) {
                console.log('swallowing error and stop');
            }
            else {
                console.log('retry all: ' + retryCount);
            }
            return retryCount;
        }), operators_1.takeWhile(function (errCount) { return errCount < 2; }));
    }
    else {
        return errors.pipe(operators_1.tap(function (err) { return console.log(err); }), operators_1.scan(function (acc) { return acc + 1; }, 0), operators_1.tap(function (retryCount) {
            if (retryCount === 2) {
                console.log('fail');
                throw 'error';
            }
            else {
                console.log('retry whole source: ' + retryCount);
            }
        }));
    }
}));
//sw$.subscribe(  a => console.log('success: ' + a),  err => console.log('error: ' + err),  () => console.log('completed'))
//
/**
 * timeout
 * прерывает поток ошибкой, если нет значения за время интервала
 * также можно указать дату вместо интервала, но можно наступить на локализацию
Таймер сработал
Error {message: "Timeout has occurred", name: "TimeoutError"}
Observable {_isScalar: false, source: {…}, operator: {…}}
complete
 */
var errorMsg = function () { return console.log('error'); };
var timeOut$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.tap(function (value) { return console.log(value * 102); }), operators_1.timeout(100), // таймер
operators_1.catchError(function (err, caught) {
    if (err.name === 'TimeoutError') {
        // обрабатываем событие таймера
        console.log('Таймер сработал');
    }
    ;
    return rxjs_1.of(err, caught);
}));
//timeOut$.subscribe(a => console.log(a), err => (console.log('ошибка: ' + err)), () => console.log('complete'));
/**
 * timeoutWith
 * стартует новый поток, если нет значения за время интервала
 * также можно указать дату вметсо интервала, но можно наступить на локализацию
ещё 0
ещё 100
1
2
3
complete
 */
var timeOutWithFallback$ = rxjs_1.of(1, 2, 3);
var timeOutWith$ = rxjs_1.Observable.create(function (observer) {
    observer.next('ещё 0');
    setTimeout(function () { return observer.next('ещё 100'); }, 100);
    setTimeout(function () { return observer.next('ещё 202'); }, 202); //заменить на 200, чтобы не было прерывания
    setTimeout(function () { return observer.complete('ещё 300'); }, 300);
}).pipe(operators_1.timeoutWith(101, timeOutWithFallback$));
//timeOutWith$.subscribe(a => console.log(a), err=>(console.log('ошибка: '+err)), ()=>console.log('complete'));
//========================================================================================================================
//==================================================FILTERING ONE=========================================================
//========================================================================================================================
//указанные операторы получают и возвращают значения в потоке
/**
 * skip
 * скрывает указанное количество значений
2
3
4
 */
var skip$ = rxjs_1.timer(0, 100).pipe(operators_1.take(5), operators_1.skip(2));
//skip$.subscribe(a => console.log(a));
/**
 * skipLast
 * скрывает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений
0
1
2
3
 */
var skipLast$ = rxjs_1.timer(0, 1000).pipe(operators_1.take(10), operators_1.skipLast(5));
//skipLast$.subscribe(a => console.log(a));
/**
 * skipUntil
 * скрывает значения потока до момента получения первого значения из аргумента наблюдателя
*6 секунд ожидания*
3
4
5
 */
var skipUntil$ = rxjs_1.timer(0, 1000).pipe(operators_1.take(6), operators_1.skipUntil(rxjs_1.timer(3000)));
//skipUntil$.subscribe(a => console.log(a));
/**
 * skipWhile
 * скрывает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false
3
4
5
 */
var skipWhile$ = rxjs_1.timer(0, 100).pipe(operators_1.take(6), operators_1.skipWhile(function (item) { return item !== 3; }));
//skipWhile$.subscribe(a => console.log(a));
/**
 * take
 * возвращает указанное количество значений
0
1
2
3
4
 */
var take$ = rxjs_1.timer(0, 100).pipe(operators_1.take(5));
//take$.subscribe(a => console.log(a));
/**
 * takeLast
 * возвращает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений
*6 секунд ожидания*
3
4
5
 */
var takeLast$ = rxjs_1.timer(0, 1000).pipe(operators_1.take(6), operators_1.takeLast(3));
//takeLast$.subscribe(a => console.log(a));
/**
 * takeUntil
 * Возвращает поток до момента получения первого значения из аргумента наблюдателя takeUntilComplete$
 * Прерывает поток при получении первого значения из аргумента наблюдателя takeUntilComplete$
 * Используется для очистки мусора, как завершающий оператор
0
1
2
поток закрыт
 */
/* const takeUntilButtonElement = document.getElementById('id-tight-button');
const takeUntilComplete$ = fromEvent(takeUntilButtonElement, 'click');//прерывание потока по кнопке

//const takeUntilComplete$ = timer(3000);//прерывание потока по таймеру

const takeUntil$ = timer(0, 1000).pipe(
    take(6),
    takeUntil(takeUntilComplete$)
)

//takeUntil$.subscribe(a => console.log(a), err => console.log('error', err), () => console.log('поток закрыт')); */
/**
 * takeWhile
 * возвращает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false
0
1
2
 */
var takeWhile$ = rxjs_1.timer(0, 100).pipe(operators_1.take(6), operators_1.takeWhile(function (item) { return item !== 3; }));
//takeWhile$.subscribe(a => console.log(a));
/**
 * distinct
 * возвращает только уникальные значения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * можно передать функцию предварительной обработки значений
1
2
3
5
 */
var distinct$ = rxjs_1.of(1, 1, 1, 2, 3, 1, 5, 5, 5).pipe(operators_1.distinct());
//distinct$.subscribe(a => console.log(a));
/**
 * distinct с функцией предварительной обработки значений
 * возвращает только уникальные значения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 *
{a: 1, b: "2"}
{a: 2, b: "3"}
 */
var distinctFunc$ = rxjs_1.of({ a: 1, b: '2' }, { a: 1, b: '3' }, { a: 2, b: '3' }, { a: 1, b: '4' }).pipe(operators_1.distinct(function (item) { return item.a; }));
//distinctFunc$.subscribe(a => console.log(a));
/**
 * distinctUntilChanged
 * возвращает только уникальные значения в пределах текущего и предыдущего
 * можно передать функцию предварительной обработки значений
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
1
2
3
1
5
 */
var distinctUntilChanged$ = rxjs_1.of(1, 1, 1, 2, 3, 1, 5, 5, 5).pipe(operators_1.distinctUntilChanged());
//distinctUntilChanged$.subscribe(a => console.log(a));
/**
 * distinctUntilKeyChanged
 * возвращает только уникальные значения в пределах текущего и предыдущего
 * необходимо указать название ключа объекта для сравнения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 *
{a: 1, b: "2"}
{a: 1, b: "3"}
{a: 1, b: "4"}
 */
var distinctUntilKeyChanged$ = rxjs_1.of({ a: 1, b: '2' }, { a: 1, b: '3' }, { a: 2, b: '3' }, { a: 1, b: '4' }).pipe(
//distinctUntilKeyChanged('a')
operators_1.distinctUntilKeyChanged('b'));
//distinctUntilKeyChanged$.subscribe(a => console.log(a));
/**
 * filter
 * возвращает значения потока, если аргумент функция вернул true
0
2
4
 */
var filter$ = rxjs_1.timer(0, 100).pipe(operators_1.take(6), operators_1.filter(function (item) { return item % 2 === 0; }));
//filter$.subscribe(a => console.log(a));
/**
 * sample
 * возвращает первое значение потока interval после получения очередного значения из аргумента наблюдателя sampleProbe$
 * Отбирает второе значение из потока между таймерами(300)
получил: 0
получил: 102
102
получил: 204
получил: 306
получил: 408
408
получил: 510
получил: 612
получил: 714
714
получил: 816
получил: 918
complete
 */
var sampleProbe$ = rxjs_1.interval(300);
var sample$ = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102; }), operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.sample(sampleProbe$));
//sample$.subscribe(a => console.log(a), err=>(console.log('ошибка: '+err)), ()=>console.log('complete'));
/**
 * audit
 *
 * отбирает кайнее значение из потока между таймерами(300)
получил: 0
обработал: 0
получил: 102
получил: 204
204
получил: 306
обработал: 306
получил: 408
получил: 510
510
получил: 612
обработал: 612
получил: 714
получил: 816
816
получил: 918
обработал: 918
 */
var auditProbe$ = function (item) {
    console.log('обработал: ' + item);
    return rxjs_1.interval(300);
};
var audit$ = rxjs_1.timer(0, 102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102; }), operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.audit(auditProbe$));
//audit$.subscribe(a => console.log(a));
/**
 * throttle
 * отбирает первое значение из потока между таймерами(300)
 *
получил: 0
0
обработал: 0
получил: 102
получил: 204
получил: 306
306
обработал: 306
получил: 408
получил: 510
получил: 612
612
обработал: 612
получил: 714
получил: 816
получил: 918
918
обработал: 918
 */
var throttleProbe$ = function (item) {
    console.log('обработал: ' + item);
    return rxjs_1.timer(300);
};
var throttle$ = rxjs_1.timer(0, 102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102; }), operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.throttle(throttleProbe$));
//throttle$.subscribe(a => console.log(a));
//========================================================================================================================
//==================================================FILTERING MULTIPLE====================================================
//========================================================================================================================
//
/**
 * first
 * Возвращает первое значение из потока
 * Если передать в аргументы функцию, то первое значение при возврате функции true
получил: 0
0
 */
var first$ = rxjs_1.timer(0, 100).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 100; }), operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.first()
//first(item=>item % 2 === 0)//вернёт первое чётное число
);
//first$.subscribe(a => console.log(a));
/**
 * last
 * Возвращает крайнее значение из потока
 * Поток должен быть конечным
 * Если передать в аргументы функцию, то крайнее значение при возврате функции true
получил: 0
получил: 100
получил: 200
получил: 300
получил: 400
получил: 500
получил: 600
получил: 700
получил: 800
получил: 900
900
 */
var last$ = rxjs_1.timer(0, 100).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 100; }), operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.last()
//last(item=>item % 2 === 0)//вернёт первое чётное число
);
//last$.subscribe(a => console.log(a));
/**
 * min
 * возвращает минимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки
получил: -2
получил: -1
получил: 0
получил: 4
получил: 5
получил: 6
0
 */
var min$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(operators_1.tap(function (item) { return console.log('получил: ' + item); }), 
//min()//вернёт минимальное число -2
operators_1.min(function (item1, item2) {
    if (Math.abs(item1) > Math.abs(item2)) {
        return 1;
    }
    else {
        return -1;
    }
    ;
}));
//min$.subscribe(a => console.log(a));
/**
 * max
 * возвращает максимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки
получил: -2
получил: -1
получил: 0
получил: 4
получил: 5
получил: 6
6
 */
var max$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.max() //вернёт максиимальное число 6
//max((item1, item2) => {
//    if (Math.abs(item1) < Math.abs(item2)) { return 1 } else { return -1 };
//  })
);
//max$.subscribe(a => console.log(a));
/**
 * возвращает элемент по индексу в потоке
4
 */
var elementAt$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.elementAt(3));
//elementAt$.subscribe(a => console.log(a));
/**
 * возвращает элемент потока, если функция аргумент findProbe возвращает true
0
 */
var findProbe = function (item) { return item === 0; };
var find$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.find(findProbe));
//find$.subscribe(a => console.log(a));
/**
 * возвращает индекс элемента потока, если функция аргумент findIndexProbe возвращает true
2
 */
var findIndexProbe = function (item) { return item === 0; };
var findIndex$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.findIndex(findIndexProbe));
//findIndex$.subscribe(a => console.log(a));
/**
 * single
 * возвращает значение потока, если функция аргумент singleProbe возвращает true
 * При значениях больше 1 штуки возвращает ошибку
 * если значений не найдено возвращает undefined
 0
 */
var singleProbe = function (item) { return item === 0; };
//const singleProbe = item=>item>0;//ошибка
//const singleProbe = item=>item===10;//undefined
var single$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(operators_1.tap(function (item) { return console.log('получил: ' + item); }), operators_1.single(singleProbe));
//single$.subscribe(a => console.log(a));
//========================================================================================================================
//==================================================GROUPING OBSERVABLES==================================================
//========================================================================================================================
//
/**
 * combineAll
 * возвращает крайние значения если они пришли от всех асинхронных потоков
 * в данном случае ожидает по три значения
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
[202, 0, 0]
[303, 0, 0]
[303, 202, 0]
[404, 202, 0]
[505, 202, 0]
[505, 404, 0]
[505, 404, 303]
[606, 404, 303]
[707, 404, 303]
[707, 606, 303]
[808, 606, 303]
[808, 606, 606]
[909, 606, 606]
[909, 808, 606]
 */
var combine1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }));
var combine2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202; }));
var combine3$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303; }));
var combineAll$ = rxjs_1.of(combine1$, combine2$, combine3$).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.combineAll());
//combineAll$.subscribe(() => console.log( ...arguments))
/**
 * combineLatest
 * возвращает крайние значения combineXX$
 * на старте ждёт значения от всех асинхронных потоков combineXX$
 * не работает внутри pipe
 * Есть необязательный аргумент combineLatestParser для обработки всех входящих значений
 * https://www.learnrxjs.io/operators/combination/combinelatest.html
 *
item1:101-item2:0-item3:0
item1:202-item2:0-item3:0
item1:202-item2:202-item3:0
item1:303-item2:202-item3:0
item1:404-item2:202-item3:0
item1:404-item2:202-item3:303
item1:404-item2:404-item3:303
item1:505-item2:404-item3:303
item1:606-item2:404-item3:303
 */
var combineLatestParser = function (item1, item2, item3) { return "item1:" + item1 + "-item2:" + item2 + "-item3:" + item3; };
var combineLatest$ = rxjs_1.combineLatest(combine1$, combine2$, combine3$, combineLatestParser).pipe(operators_1.take(9));
//combineLatest$.subscribe(logAll)
/**
 * concatAll
 * Возвращает все значения всех потоков
 * Комбинирует значения по потокам
 *
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:0-1
получил:101-1
получил:202-1
получил:303-1
получил:404-1
получил:505-1
получил:606-1
получил:707-1
получил:808-1
получил:909-1
получил:0-2
получил:202-2
получил:404-2
получил:606-2
получил:808-2
получил:0-3
получил:303-3
получил:606-3
 */
var concat1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var concat2 = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var concat3 = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var concatAll$ = rxjs_1.of(concat1, concat2, concat3).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.concatAll());
//concatAll$.subscribe((item) => console.log('получил: ',item))
/**
 * exhaust
 * Возвращает значения потока, который первый их прислал. Остальные потоки блокируются, пока первый поток не закончися
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:0-1
получил:101-1
получил:202-1
получил:303-1
получил:404-1
получил:505-1
получил:606-1
получил:707-1
получил:808-1
получил:909-1
 */
var exhaust1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var exhaust2 = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var exhaust3 = rxjs_1.interval(2000).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var exhaust4 = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(2000));
var exhaust$ = rxjs_1.of(exhaust1, exhaust2, exhaust3, exhaust4).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.exhaust());
//exhaust$.subscribe((item) => console.log('получил: ',...arguments))
/**
 * mergeAll
 * ВОзвращает все значения всех потоков
 * Комбинирует по времени получения

Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:0-1
получил:101-1
получил:0-2
получил:202-1
получил:0-3
получил:303-1
получил:202-2
получил:404-1
получил:505-1
получил:404-2
получил:303-3
получил:606-1
получил:707-1
получил:606-2
получил:808-1
получил:606-3
получил:909-1
получил:808-2
получил:1
получил:2
получил:3
 */
var mergeAll1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var mergeAll2 = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var mergeAll3 = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var mergeAll4 = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(2000));
var mergeAll$ = rxjs_1.of(mergeAll1, mergeAll2, mergeAll3, mergeAll4).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.mergeAll());
//mergeAll$.subscribe((item) => console.log('получил: ',item))
/**
 * withLatestFrom
 * Возвращает массив текущих(предыдущих/крайних) значений потоков после получения значений из основного(сигнального) потока источника
 * Возвращает из сигнального потока и из потоков аргументов withLatestFrom1, withLatestFrom2
 * Главный сигнальный поток - источник interval(303)
 *
получил:["0-3", "202-1", "0-2"]
получил:["303-3", "505-1", "404-2"]
получил:["606-3", "808-1", "606-2"]
 */
var withLatestFrom1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var withLatestFrom2 = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var withLatestFrom3 = rxjs_1.of(1);
//const withLatestFrom3 = of(1).pipe(delay(1000));
var withLatestFrom$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }), operators_1.withLatestFrom(withLatestFrom1, withLatestFrom2, withLatestFrom3));
//withLatestFrom$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('поток закрыт'));
//========================================================================================================================
//==================================================GROUPING VALUES=======================================================
//========================================================================================================================
//
/**
 * mergeMap
 * Преобразует каждый поток функцией аргументом mapTo
 * В данном случае значения потоков аккумулируются в массив
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:["0-3", "303-3", "606-3"]
получил:["0-1", "101-1", "202-1", "303-1", "404-1", "505-1", "606-1", "707-1", "808-1", "909-1"]
получил:["0-2", "202-2", "404-2", "606-2", "808-2"]
получил:[1, 2, 3]
 */
var mergeMap1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var mergeMap2 = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var mergeMap3 = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var mergeMap4 = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(2000));
var mapTo = function (item$) { return item$.pipe(operators_1.toArray()); };
var mergeMap$ = rxjs_1.of(mergeMap1, mergeMap2, mergeMap3, mergeMap4).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.mergeMap(mapTo));
//mergeMap$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('поток закрыт'));
/**
 * groupBy
 * Возвращает несколько потоков из значений, сгруппированных по возврату функции groupSort
 * Каждый новый уникальный возврат функции создаёт новый поток
[{"a":1,"b":"2"}]
[{"a":1,"b":"3"},{"a":2,"b":"3"}]
[{"a":1,"b":"4"}]
 */
var groupSort = function (item) { return item.b + 1; };
var groupBy$ = rxjs_1.of({ a: 1, b: '2' }, { a: 1, b: '3' }, { a: 2, b: '3' }, { a: 1, b: '4' }).pipe(operators_1.groupBy(groupSort), operators_1.mergeMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
//groupBy$.subscribe((item) => console.log(JSON.stringify(item)))
/**
 * pairwise
 * Возвращает массивы текущего и предыдущего значений потока
[0,1]
[1,2]
[2,3]
[3,4]
[4,5]
[5,6]
[6,7]
[7,8]

 */
var pairwise$ = rxjs_1.interval(100).pipe(operators_1.take(9), operators_1.pairwise());
//pairwise$.subscribe((item) => console.log(JSON.stringify(item)))
/**
 * partition
 * @deprecated заменяется filter
 * отфильтровывает в массив true/false значения функции
 * https://github.com/ReactiveX/rxjs/issues/2995
 */
/**
 * switchAll
 * выдаёт значения самого длинного входного потока после его закрытия
 * закрывает все потоки, которые закрылись раньше
 * Вывод:
1
2
3
0-закрыт
0-2
0-2
202-2
202-2
404-2
404-2
606-2
606-2
808-2
808-2
2-закрыт
поток закрыт
 *
 * если включить отладку mergeAll:
1
2
3
0-закрыт
0-1
0-1
101-1
101-1
0-2
0-2
202-1
202-1
202-2
202-2
303-1
303-1
404-1
404-1
1-закрыт
404-2
404-2
606-2
606-2
808-2
808-2
2-закрыт
поток закрыт

 */
var switchAll0 = rxjs_1.of(1, 2, 3).pipe(operators_1.map(function (item) { return item * 1 + '-0'; }), operators_1.tap(logAll), operators_1.endWith('0-закрыт'));
var switchAll1 = rxjs_1.interval(101).pipe(operators_1.delay(1000), operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(logAll), operators_1.endWith('1-закрыт'));
var switchAll2 = rxjs_1.interval(202).pipe(operators_1.delay(1000), operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }), operators_1.tap(logAll), operators_1.endWith('2-закрыт'));
var switchAll$ = rxjs_1.of(switchAll0, switchAll1, switchAll2).pipe(
// mergeAll(), // для проверки асинхронности
operators_1.switchAll());
// switchAll$.subscribe(item => console.log(item), null, () => console.log('switchAll поток закрыт'));
/**
 * zipAll - ждёт значения от всех потоков, и выдаёт по одному от каждого
 *
 Hello World!
1-0
2-0
3-0
1000-1
1000-2
[ '1-0', '1000-1', '1000-2' ]
1101-1
1202-1
1202-2
[ '2-0', '1101-1', '1202-2' ]
1303-1
1404-1
1404-2
[ '3-0', '1202-1', '1404-2' ]
1606-2
[ '0-закрыт', '1303-1', '1606-2' ]
поток закрыт
 */
var zipAll0 = rxjs_1.of(1, 2, 3).pipe(operators_1.map(function (item) { return item * 1 + '-0'; }), operators_1.tap(logAll), operators_1.endWith('0-закрыт'));
var zipAll1 = rxjs_1.interval(101).pipe(operators_1.delay(1000), operators_1.take(5), operators_1.map(function (item) { return item * 101 + 1000 + '-1'; }), operators_1.tap(logAll), operators_1.endWith('1-закрыт'));
var zipAll2 = rxjs_1.interval(202).pipe(operators_1.delay(1000), operators_1.take(5), operators_1.map(function (item) { return item * 202 + 1000 + '-2'; }), operators_1.tap(logAll), operators_1.endWith('2-закрыт'));
var zipAll$ = rxjs_1.of(zipAll0, zipAll1, zipAll2).pipe(
// mergeAll(), // для проверки асинхронности
operators_1.zipAll());
// zipAll$.subscribe(item => console.log(item), null, () => console.log('zipAll поток закрыт'));
//========================================================================================================================
//==================================================OBSERVABLE TRANSFORMATION=============================================
//========================================================================================================================
//
/**
 * repeat
 * Повторение значений одного входного потока
 * Hello World!
0-1
101-1
202-1
303-1
404-1
1-закрыт
0-1
101-1
202-1
303-1
404-1
1-закрыт
0-1
101-1
202-1
303-1
404-1
1-закрыт
поток закрыт
 */
var repeat1 = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('1-закрыт'));
var repeat$ = repeat1.pipe(operators_1.repeat(3));
// repeat$.subscribe(item => console.log(item), null, () => console.log('repeat поток закрыт'));
/**
 * repeatWhen
 * Повторяет значения входного потока repeatWhen1 пока есть значения в контрольном потоке-функции repeatWhenControl
 * Переподписывается на входной поток при каждом значении контрольного
 *
Hello World!
0-1
101-1
202-1
303-1
404-1
505-1
606-1
707-1
808-1
909-1
1-закрыт
1000-control
0-1
1202-control
101-1
0-1
202-1
1404-control
101-1
303-1
0-1
0-1
202-1
404-1
101-1
101-1
303-1
505-1
202-1
202-1
404-1
606-1
303-1
303-1
505-1
707-1
404-1
404-1
606-1
808-1
505-1
505-1
707-1
909-1
1-закрыт
поток закрыт

 * Без повторения:
Hello World!
0-1
101-1
202-1
303-1
404-1
505-1
606-1
707-1
808-1
909-1
1-закрыт
поток закрыт


 */
var repeatWhen1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var repeatWhenControl = function () { return rxjs_1.interval(202).pipe(operators_1.delay(1000), operators_1.take(3), operators_1.map(function (item) { return item * 202 + 1000 + '-control'; }), operators_1.tap(logAll), operators_1.endWith('control-закрыт')); };
var repeatWhen$ = repeatWhen1.pipe(operators_1.repeatWhen(repeatWhenControl));
// repeatWhen$.subscribe(item => console.log(item), null, () => console.log('repeatWhen поток закрыт'));
/**
 * ignoreElements
 * пропускает значения, оставляет сигналы
 * Hello World!
0-1
101-1
202-1
0-2
ошибка: 0-2
 */
var ignoreElements1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
// mergeAll(), ignoreElements(),
operators_1.endWith('1-закрыт'));
var ignoreElementsErr2 = rxjs_1.interval(404).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 404 + '-2'; }), operators_1.tap(logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.ignoreElements(), operators_1.endWith('err-закрыт'));
var ignoreElementsErr3 = rxjs_1.interval(505).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 505 + '-3'; }), operators_1.tap(logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.ignoreElements(), operators_1.endWith('err2-закрыт'));
var ignoreElements$ = rxjs_1.of(ignoreElements1, ignoreElementsErr2, ignoreElementsErr3).pipe(operators_1.mergeAll());
//ignoreElements$.subscribe(item => console.log(item), err => console.log('ошибка:', err), () => console.log('ignoreElements поток закрыт'));
/**
 * finalize
 * выполняет функцию finalizeFn
 * функция без параметров!
 */
var finalizeFn = function (item) { return function () { return console.log('fin', item); }; }; //обёртка для вывода названия завершающегося потока
var finalizeErr1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(logAll), 
// map(item => throwError(item)),
// mergeAll(),
operators_1.endWith('err1-закрыт'), operators_1.finalize(finalizeFn('1')));
var finalizeErr2 = rxjs_1.interval(505).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 505 + '-2'; }), operators_1.tap(logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.endWith('err2-закрыт'), operators_1.finalize(finalizeFn('2')));
var finalize$ = rxjs_1.of(finalizeErr1, finalizeErr2).pipe(operators_1.mergeAll(), operators_1.finalize(finalizeFn('main')));
finalize$.subscribe(function (item) { return console.log(item); }, function (err) { return console.log('ошибка:', err); }, function () { return console.log('finalize поток закрыт'); });
//========================================================================================================================
//==================================================TRANSFORM VALUES======================================================
//========================================================================================================================
//
//========================================================================================================================
//==================================================TIME, DURATION & VALUES===============================================
//========================================================================================================================
//
/**
 * exhaustMap
 * Пропускает входящие значения пока не завершится поток аргумента exhaustMapFork$
startItem-0 forkItem-0
startItem-0 forkItem-100
startItem-0 forkItem-200
startItem-604 forkItem-0
startItem-604 forkItem-100
startItem-604 forkItem-200
поток закрыт
 */
var exhaustMapFork$ = function (startItem) { return rxjs_1.interval(100)
    .pipe(operators_1.take(3), operators_1.map(function (item) { return startItem + " forkItem-" + item * 100; })); };
var exhaustMap$ = rxjs_1.interval(302).pipe(operators_1.take(3), operators_1.map(function (item) { return "startItem-" + item * 302; }), operators_1.exhaustMap(exhaustMapFork$));
//exhaustMap$.subscribe(item => console.log(item), null, ()=> console.log('поток закрыт'));
/**
 * pluck(x:string)
 * возвращает в поток конкретное свойство x из значений входного потока
 * pluck(propertyName) аналогично map(item=>item.propertyName)
0
2
4
поток закрыт
 */
var pluck$ = rxjs_1.interval(100)
    .pipe(operators_1.take(3), operators_1.map(function (item) { return { single: item, double: item * 2, nested: { triple: item * 3 } }; }), //переделываем число в объект
//pluck('nested','triple'),//возвращаем в поток только item.nested.triple
operators_1.pluck('double') //возвращаем в поток только item.double
);
//pluck$.subscribe(item => console.log(item), null, ()=> console.log('поток закрыт'));
/**
 * switchMap
 * после каждого нового значения входящего потока interval(302)
 * выполняет функцию аргумент switchMapFork$, который возвращает новый поток
 * предыдущий поток из switchMapFork$ закрывается, потому рекомендуется только для чтения значений
 * https://www.learnrxjs.io/operators/transformation/switchmap.html
"startItem-0 forkItem-0"
"startItem-0 forkItem-100"
"startItem-0 forkItem-200"
"startItem-302 forkItem-0"
"startItem-302 forkItem-100"
"startItem-302 forkItem-200"
"startItem-604 forkItem-0"
"startItem-604 forkItem-100"
"startItem-604 forkItem-200"
поток закрыт
 */
var switchMapFork1$ = function (startItem) { return rxjs_1.interval(101)
    .pipe(operators_1.take(3), operators_1.map(function (item) { return startItem + " forkItem-" + item * 101; })); };
var switchMap$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return "startItem-" + item * 303; }), operators_1.switchMap(switchMapFork1$));
//switchMap$.subscribe(item => console.log(item), null, ()=> console.log('поток закрыт'));
