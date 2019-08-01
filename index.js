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
 * Поможет при изучении как справочник в поиске, и при отладке.
 * Содержит полный список правильных способов import {}
 * типовые примеры, которые легко комбинировать и сопоставлять
 * входные значения всегда потоки с интервалами, изредка - простые значения. Это имитирует боевые условия.
 * время появления идентично значению в потоке. Всегда понятно когда и в каком порядке оно имитировано.
 * в примерах расставлены закоментированные операторы логирования для отладки tap(logAll)
 * выходная строка subscribe унифицирована для облегчения отладки
 * унифицированные постфиксы '-1' | '-$' | '-dynamic' помогают в чтении вывода
 * операторы endWith('...') помогают понять когда происходит завершение(отписка) потока
 * выполняется как в консоли, так и в онлайн редакторе. Некоторые примеры работают только в браузере, когда необходимо его API
 * просто один файл. Суровый простой "кирпич". Легко искать, скачивать, отправлять. Трудно модифицировать совместно, долго запускать. Нет оглавления, но его можно построить поиском ctrl+shift+f '$.subscribe('. Любое другое удобство усложнит код, и потребует ещё более могучего времени на рефакторинг, поиск компромиссов.
 * нет typescript, модульности и пр плюшек для ускорения работы над кодом. Основная работа в просмотре лекции и её конспектировании.
 * большое, очень большое количество операторов
 * все примеры рабочие и готовы к копипасту
 * примеры многопоточные
 * живой код. Что-то, что можно открыть IDE
 * объём работы конский, потому, извиняйте, не всё сделано одинаково хорошо. Ближе к концу сделано лучше.
 * чтобы заглушить ненужный входной поток достаточно сделать take(0)
 *
 * Необходимые операторы ищутся ctrl+f, в конце добавляем $ к названию оператора
 * Перед каждым примером есть небольшое описание и результат выполнения
 * Если надо поменять поведение оператора необходимо:
     * обновить страницу stackblitz
     * раскомментировать subscribe строку необходимого оператора
     * открыть консоль встроенного браузера stackblitz
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
 * window
 * "нарезка"
 * Возвращает новый поток(буфер) по таймеру, предыдущий закрывает
 
["window", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
["window", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
*/
var window$ = rxjs_1.interval(100).pipe(operators_1.window(rxjs_1.interval(1000)), operators_1.take(3), operators_1.switchMap(function (item) { return item.pipe(operators_1.toArray(), operators_1.map(function (item) { return __spread(['window'], item); })); }));
//window$.subscribe(a => console.log(a));
/**
 * windowCount
 *
 * Возвращает новый поток(буфер) по количеству значений, предыдущий закрывает
 *
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
/**
 * WindowTime
 * Возвращает новый поток(буфер) по таймеру, предыдущий закрывает
 * timer вместо interval
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
 * windowToggle
 *
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
/**
 * windowWhen
 * выбор времени закрытия буфера
 
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
 * catchError
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
 * errorHandler
 * ошибка  при пустом потоке
 * Можно подменять ошибку
 * Error {message: "no elements in sequence", name: "EmptyError"}
 */
var errorHandler = function () { return console.log("\u043D\u0438\u0447\u043E\u0441\u0438"); };
var errorEmpty$ = rxjs_1.of().pipe(operators_1.throwIfEmpty() //без подмены
//throwIfEmpty(errorHandler)//подмена ошибки
);
//errorEmpty$.subscribe(a => console.log(a), err=>console.log(err));
//
/**
 * errorNext
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
/**
 * errorRetry
 *
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
var swallow$ = rxjs_1.interval(200).pipe(operators_1.map(function (x) {
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
//swallow$.subscribe(  a => console.log('success: ' + a),  err => console.log('error: ' + err),  () => console.log('completed'))
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
 Hello World!
0-1
0-1
101-1
101-1
202-1
202-1
303-1
303-1
0-2
ошибка: 0-2
fin main
fin 1
fin 2
 */
var finalizeFn = function (item) { return function () { return console.log('fin', item); }; }; //обёртка для вывода названия завершающегося потока
var finalizeErr1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(logAll), 
// map(item => throwError(item)),
// mergeAll(),
operators_1.endWith('err1-закрыт'), operators_1.finalize(finalizeFn('1')));
var finalizeErr2 = rxjs_1.interval(505).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 505 + '-2'; }), operators_1.tap(logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.endWith('err2-закрыт'), operators_1.finalize(finalizeFn('2')));
var finalize$ = rxjs_1.of(finalizeErr1, finalizeErr2).pipe(operators_1.mergeAll(), operators_1.finalize(finalizeFn('main')));
//finalize$.subscribe(item => console.log(item), err => console.log('ошибка:', err), () => console.log('finalize поток закрыт'));
//========================================================================================================================
//==================================================TIME, DURATION & VALUES===============================================
//========================================================================================================================
//
/**
 * auditTime
 * возвращает предыдущее(текущее) значение из потока, имитированное до указанного интервала времени
 * значение 500 меньше 505 и 1010, потому так мало значений
 *
 * Hello World!
404-1
1-закрыт
1414-2
auditTime поток закрыт

 * Если раскомментировать tap
 Hello World!
0-1
0-2
101-1
202-1
202-2
303-1
404-1
404-1-audit500
404-1
404-2
505-1
606-1
606-2
707-1
808-1
808-2
909-1
1-закрыт-audit500
1-закрыт
1010-2
1212-2
1414-2
1414-2-audit500
1414-2
1616-2
1818-2
auditTime поток закрыт
 */
var auditTime1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var auditTime2 = rxjs_1.interval(202).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 202 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var auditTime$ = rxjs_1.of(auditTime1, auditTime2).pipe(operators_1.mergeAll(), operators_1.auditTime(500), operators_1.map(function (item) { return item + '-audit500'; }));
// auditTime$.subscribe(item => console.log(item), null, () => console.log('auditTime поток закрыт'));
/**
 * sampleTime
 * выводит крайнее значение из потока перед таймером.
 * Если между таймерами не было значений - не выводит ничего, т.е. после вывода значения обнуляет свой кэш.
 *
 * Hello World!
303-1
808-1
1-закрыт
1010-5
1515-5
sampleTime поток закрыт
 *
 * Если раскомментировать tap
 * Hello World!
0-1
101-1
202-1
303-1
303-1-sample500
0-5
404-1
505-1
606-1
707-1
808-1
808-1-sample500
505-5
909-1
1-закрыт-sample500
1010-5
1010-5-sample500
1515-5
1515-5-sample500
2020-5
sampleTime поток закрыт
 */
var sampleTime1 = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var sampleTime5 = rxjs_1.interval(505).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 505 + '-5'; }), 
// tap(logAll),
operators_1.endWith('5-закрыт'));
var sampleTime$ = rxjs_1.of(sampleTime1, sampleTime5).pipe(operators_1.mergeAll(), operators_1.sampleTime(500));
// sampleTime$.subscribe(item => console.log(item), null, () => console.log('sampleTime поток закрыт'));
/**
 * observeOn
 * работает только в браузере/stackblitz
 * Управляет приоритетами(очередями) выполнения потока. Похоже на применение setTimeout().
 * Перекрывает указанные вручную scheduler?: SchedulerLike
 * порядок в цепочке pipe имеет значение, меняется порядок вызова у последующих операторов
 *
 * Дополнительно:
 * node_modules/rxjs/internal/scheduler/queue.d.ts
 * node_modules/rxjs/internal/scheduler/async.d.ts
 * node_modules/rxjs/internal/scheduler/asap.d.ts
 * node_modules/rxjs/internal/scheduler/animationFrame.d.ts
 * https://webdraftt.com/tutorial/rxjs/scheduler
 * https://www.youtube.com/watch?v=8cV4ZvHXQL4
 * http://reactivex.io/documentation/operators/observeon.html
 * https://rxjs-dev.firebaseapp.com/api/operators/observeOn
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/EventLoop
 *
 *
Hello World!
0-2
0-3
0-1
0-4
0-5
101-1
102-2
103-3
105-5
104-4
202-1
1-закрыт
204-2
2-закрыт
206-3
3-закрыт
210-5
5-закрыт
208-4
4-закрыт
observeOn поток закрыт
 *
 * Закоментировано observeOn
Hello World!
0-1
0-2
0-3
0-4
0-5
101-1
102-2
103-3
104-4
105-5
202-1
1-закрыт
204-2
2-закрыт
206-3
3-закрыт
208-4
4-закрыт
210-5
5-закрыт
observeOn поток закрыт
 */
var observeOn1 = rxjs_1.interval(101).pipe(operators_1.take(3), 
// observeOn(asyncScheduler),
operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var observeOn2 = rxjs_1.interval(102).pipe(operators_1.take(3), 
// observeOn(asapScheduler),
operators_1.map(function (item) { return item * 102 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var observeOn3 = rxjs_1.interval(103).pipe(operators_1.take(3), 
// observeOn(queueScheduler),
operators_1.map(function (item) { return item * 103 + '-3'; }), 
// tap(logAll),
operators_1.endWith('3-закрыт'));
var observeOn4 = rxjs_1.interval(104).pipe(operators_1.take(3), 
// observeOn(animationFrameScheduler),
operators_1.map(function (item) { return item * 104 + '-4'; }), 
// tap(logAll),
operators_1.endWith('4-закрыт'));
var observeOn5 = rxjs_1.interval(105).pipe(
// без observeOn считается, что приоритет immediate
operators_1.take(3), operators_1.map(function (item) { return item * 105 + '-5'; }), 
// tap(logAll),
operators_1.endWith('5-закрыт'));
var observeOn$ = rxjs_1.of(observeOn1, observeOn2, observeOn3, observeOn4, observeOn5).pipe(operators_1.mergeAll());
// observeOn$.subscribe(item => console.log(item), null, () => console.log('observeOn поток закрыт'));
/**
 * subscribeOn
 * работает только в браузере/stackblitz
 * Управляет приоритетами(очередями) выполнения потока. Похоже на применение setTimeout().
 * Перекрывает указанные вручную scheduler?: SchedulerLike
 * порядок в цепочке pipe не имеет значения, меняется порядок вызова у всего потока
 *
 * http://reactivex.io/documentation/operators/subscribeon.html
 * https://rxjs-dev.firebaseapp.com/api/operators/subscribeOn
 *
Hello World!
0-2
0-3
0-5
0-1
0-4
102-2
103-3
105-5
101-1
104-4
204-2
2-закрыт
206-3
3-закрыт
210-5
5-закрыт
202-1
1-закрыт
208-4
4-закрыт
subscribeOn поток закрыт
 *
 * закоментировано subscribeOn
 * Hello World!
0-1
0-2
0-3
0-4
0-5
101-1
102-2
103-3
104-4
105-5
202-1
1-закрыт
204-2
2-закрыт
206-3
3-закрыт
208-4
4-закрыт
210-5
5-закрыт
subscribeOn поток закрыт
 */
var subscribeOn1 = rxjs_1.interval(101).pipe(operators_1.take(3), 
// subscribeOn(asyncScheduler),
operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var subscribeOn2 = rxjs_1.interval(102).pipe(operators_1.take(3), 
// subscribeOn(asapScheduler),
operators_1.map(function (item) { return item * 102 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var subscribeOn3 = rxjs_1.interval(103).pipe(operators_1.take(3), 
// subscribeOn(queueScheduler),
operators_1.map(function (item) { return item * 103 + '-3'; }), 
// tap(logAll),
operators_1.endWith('3-закрыт'));
var subscribeOn4 = rxjs_1.interval(104).pipe(operators_1.take(3), 
// subscribeOn(animationFrameScheduler),
operators_1.map(function (item) { return item * 104 + '-4'; }), 
// tap(logAll),
operators_1.endWith('4-закрыт'));
var subscribeOn5 = rxjs_1.interval(105).pipe(
// без subscribeOn считается, что приоритет immediate
operators_1.take(3), operators_1.map(function (item) { return item * 105 + '-5'; }), 
// tap(logAll),
operators_1.endWith('5-закрыт'));
var subscribeOn$ = rxjs_1.of(subscribeOn1, subscribeOn2, subscribeOn3, subscribeOn4, subscribeOn5).pipe(operators_1.mergeAll());
// subscribeOn$.subscribe(item => console.log(item), null, () => console.log('subscribeOn поток закрыт'));
/**
 * debounce
 * "Спаморезка"
 * Выводит крайнее значение из потока, если была пауза больше, чем интервал debounceSignal*
 * Выводит крайнее значение, если ни одно не прошло в интервал debounceOver.
 * Таймер стартует(переподписывается) каждое значение. Т.е. в простом случае debounce(interval(x)) debounce ждёт больших, чем интервал x промежутков между значениями потока для вывода. Т.е. игнорирует спам.
 * Можно управлять интервалом динамически, см. debounceDynamic
 *
Hello World!
0-dynamic-$
0-norm-$
103-dynamic-$
102-norm-$
206-dynamic-$
204-norm-$
309-dynamic-$
306-norm-$
412-dynamic-$
408-norm-$
515-dynamic-$
510-norm-$
612-norm-$
714-norm-$
909-over-$
over-закрыт-$
816-norm-$
918-norm-$
norm-закрыт-$
927-dynamic-$
dynamic-закрыт-$
debounce поток закрыт
 */
var debounceSignalOver = rxjs_1.interval(2000);
var debounceSignalNorm = rxjs_1.interval(50);
var debounceSignalDynamic = function (item) {
    var TIMER = 5; // interval имитирует 0,1,2,3,4...
    if (item > TIMER) {
        return rxjs_1.interval(500);
    }
    else {
        return rxjs_1.interval(0);
    }
};
var debounceOver = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.debounce(function (item) { return debounceSignalOver; }), operators_1.map(function (item) { return item * 101 + '-over'; }), 
// tap(logAll),
operators_1.endWith('over-закрыт'));
var debounceNorm = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.debounce(function (item) { return debounceSignalNorm; }), operators_1.map(function (item) { return item * 102 + '-norm'; }), 
// tap(logAll),
operators_1.endWith('norm-закрыт'));
var debounceDynamic = rxjs_1.interval(103).pipe(operators_1.take(10), operators_1.debounce(function (item) { return debounceSignalDynamic(item); }), operators_1.map(function (item) { return item * 103 + '-dynamic'; }), 
// tap(logAll),
operators_1.endWith('dynamic-закрыт'));
var debounce$ = rxjs_1.of(debounceOver, debounceNorm, debounceDynamic).pipe(operators_1.mergeAll());
//debounce$.subscribe(item => console.log(item + '-$'), null, () => console.log('debounce поток закрыт'));
/**
 * debounceTime
 * "Спаморезка"
 * Выводит крайнее значение из потока, если была пауза больше, чем интервал х в debounceTime(х)
 * Выводит крайнее значение, если ни одно не прошло в интервал.
 * Таймер стартует(переподписывается) каждое значение. Т.е. в простом случае debounceTime(x) ждёт больших, чем интервал x промежутков между значениями потока для вывода. Т.е. игнорирует спам.
 *
 *
Hello World!
0-dynamic-$
0-norm-$
103-dynamic-$
102-norm-$
206-dynamic-$
204-norm-$
309-dynamic-$
306-norm-$
412-dynamic-$
408-norm-$
515-dynamic-$
510-norm-$
612-norm-$
714-norm-$
909-over-$
over-закрыт-$
816-norm-$
918-norm-$
norm-закрыт-$
927-dynamic-$
dynamic-закрыт-$
debounce поток закрыт
 */
var debounceTimeOver = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-over'; }), 
// tap(logAll),
operators_1.debounceTime(1000), operators_1.endWith('over-закрыт'));
var debounceTimeNorm = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102 + '-norm'; }), 
// tap(logAll),
operators_1.debounceTime(50), operators_1.endWith('norm-закрыт'));
var debounceTime$ = rxjs_1.of(debounceTimeOver, debounceTimeNorm).pipe(operators_1.mergeAll());
// debounceTime$.subscribe(item => console.log(item + '-$'), null, () => console.log('debounceTime поток закрыт'));
/**
 * delay
 * задержка имитации значений потока на указанный интервал или дату
 *
 * Hello World!
0-3-$
103-3-$
206-3-$
309-3-$
412-3-$
515-3-$
618-3-$
721-3-$
824-3-$
927-3-$
3-закрыт-$
0-1-$
0-2-$
101-1-$
102-2-$
202-1-$
1-закрыт-$
204-2-$
2-закрыт-$
delay поток закрыт
 */
var delay1 = rxjs_1.interval(101).pipe(operators_1.delay(1000), operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var delay2 = rxjs_1.interval(102).pipe(operators_1.delay(new Date(Date.now() + 1000)), operators_1.take(3), operators_1.map(function (item) { return item * 102 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var delay3 = rxjs_1.interval(103).pipe(
// контрольный поток без задержек
operators_1.take(10), operators_1.map(function (item) { return item * 103 + '-3'; }), 
// tap(logAll),
operators_1.endWith('3-закрыт'));
var delay$ = rxjs_1.of(delay1, delay2, delay3).pipe(operators_1.mergeAll());
//delay$.subscribe(item => console.log(item + '-$'), null, () => console.log('delay поток закрыт'));
/**
 * delayWhen
 * Задерживает мимтацию значений потока на указанный интервал
 *
 * Hello World!
0-1-$
101-1-$
200-2-$
202-1-$
303-1-$
302-2-$
404-1-$
404-2-$
505-1-$
506-2-$
606-1-$
608-2-$
707-1-$
710-2-$
808-1-$
812-2-$
909-1-$
1-закрыт-$
914-2-$
1016-2-$
1118-2-$
2-закрыт-$
delayWhen поток закрыт
 */
var delayWhen1 = rxjs_1.interval(101).pipe(
// контрольный поток без задержек
operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var delayWhen2 = rxjs_1.interval(102).pipe(operators_1.delayWhen(function (item, index) { return rxjs_1.interval(200); }), operators_1.take(10), operators_1.map(function (item) { return item * 102 + 200 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var delayWhen$ = rxjs_1.of(delayWhen1, delayWhen2).pipe(operators_1.mergeAll());
//delayWhen$.subscribe(item => console.log(item + '-$'), null, () => console.log('delayWhen поток закрыт'));
/**
 * throttleTime
 * пропускает первое значение потока и задерживает остальные на указанное время.
 * по окончании интервала начинает заново
 *
 * Hello World!
0-1-$
300-2-$
101-1-$
202-1-$
303-1-$
606-2-$
404-1-$
505-1-$
606-1-$
912-2-$
707-1-$
808-1-$
909-1-$
1-закрыт-$
1218-2-$
1524-2-$
1830-2-$
2136-2-$
2442-2-$
2748-2-$
3054-2-$
2-закрыт-$
throttleTime поток закрыт
 */
var throttleTime1 = rxjs_1.interval(101).pipe(
// контрольный поток без задержек
operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var throttleTime2 = rxjs_1.interval(102).pipe(operators_1.throttleTime(300), operators_1.take(10), operators_1.map(function (item) { return item * 102 + 300 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var throttleTime$ = rxjs_1.of(throttleTime1, throttleTime2).pipe(operators_1.mergeAll());
//throttleTime$.subscribe(item => console.log(item + '-$'), null, () => console.log('throttleTime поток закрыт'));
/**
 * timeInterval
 * оборачивает каждое значение в объект, добавляя поле со значением интервала во времени от предыдущего до текущего значения
 * судя по всему, используется performance.now()
 *
 * Hello World!
{"value":"0-2","interval":105}-$
{"value":"102-2","interval":104}-$
{"value":"204-2","interval":102}-$
{"value":"306-2","interval":103}-$
{"value":"408-2","interval":102}-$
"2-закрыт"-$
timeInterval поток закрыт
 */
var timeInterval1 = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.timeInterval(), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var timeInterval$ = rxjs_1.of(timeInterval1).pipe(operators_1.mergeAll());
//timeInterval$.subscribe(item => console.log(JSON.stringify(item) + '-$'), null, () => console.log('timeInterval поток закрыт'));
/**
 * timestamp
 * оборачивает каждое значение в объект, добавляя время его имитации
 *
 * Hello World!
{"value":"0-1","timestamp":1564341146592}-$
{"value":"0-2","timestamp":"2019-07-28T19:12:26.595Z"}-$
{"value":"101-1","timestamp":1564341146694}-$
{"value":"102-2","timestamp":"2019-07-28T19:12:26.698Z"}-$
{"value":"202-1","timestamp":1564341146796}-$
{"value":"204-2","timestamp":"2019-07-28T19:12:26.800Z"}-$
{"value":"303-1","timestamp":1564341146898}-$
{"value":"306-2","timestamp":"2019-07-28T19:12:26.902Z"}-$
{"value":"404-1","timestamp":1564341147000}-$
"1-закрыт"-$
{"value":"408-2","timestamp":"2019-07-28T19:12:27.006Z"}-$
"2-закрыт"-$
timestamp поток закрыт
 */
var timestamp1 = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.timestamp(), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var timestamp2 = rxjs_1.interval(102).pipe(
// добавим немного человекочитаемости к дате
operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.timestamp(), operators_1.map(function (item) { return { value: item.value, timestamp: new Date(item.timestamp) }; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var timestamp$ = rxjs_1.of(timestamp1, timestamp2).pipe(operators_1.mergeAll());
//timestamp$.subscribe(item => console.log(JSON.stringify(item) + '-$'), null, () => console.log('timestamp поток закрыт'));
//========================================================================================================================
//==================================================TRANSFORM VALUES======================================================
//========================================================================================================================
//
/**
 * concatMap
 * преобразует входное значение потока, сохраняя их порядок даже при задержке преобразования
 * в отличии от map может возвращать потоки
 *
 * Hello World!
"0-1"-$
"0-2"-$
"0-21000"-$
"101-1"-$
"102-2"-$
"102-21000"-$
"202-1"-$
["0-2","delay200"]-$
"204-2"-$
"204-21000"-$
"303-1"-$
"306-2"-$
"306-21000"-$
"404-1"-$
["102-2","delay200"]-$
"408-2"-$
"408-21000"-$
"2-закрыт"-$
"505-1"-$
["204-2","delay200"]-$
"606-1"-$
"707-1"-$
["306-2","delay200"]-$
"808-1"-$
"909-1"-$
"1-закрыт"-$
["408-2","delay200"]-$
"2-закрыт"-$
concatMap поток закрыт
 */
var concatMap1 = rxjs_1.interval(101).pipe(
// контрольный поток
operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var concatMap2 = rxjs_1.interval(102).pipe(
// просто меняем значение на массив
operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.concatMap(function (item, index) { return [item, item + 1000]; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var concatMap3 = rxjs_1.interval(103).pipe(
// добавляем задержку
operators_1.take(5), operators_1.map(function (item) { return item * 103 + '-3'; }), operators_1.concatMap(function (item, index) { return rxjs_1.of([item, 'delay200']).pipe(operators_1.delay(200)); }), 
// tap(logAll),
operators_1.endWith('3-закрыт'));
var concatMap$ = rxjs_1.of(concatMap1, concatMap2, concatMap3).pipe(operators_1.mergeAll());
// concatMap$.subscribe(item => console.log(JSON.stringify(item) + '-$'), null, () => console.log('concatMap поток закрыт'));
/**
 * concatMapTo
 * входные значения - это сигнальный поток для имитации значений внутреннего потока concatMapToInternal
 * повторяет весь внутренний поток при каждом сигнале
 *
 * Hello World!
0-1-$
101-1-$
0-Internal-$
202-1-$
102-Internal-$
303-1-$
204-Internal-$
Internal-закрыт-$
404-1-$
0-Internal-$
505-1-$
102-Internal-$
606-1-$
204-Internal-$
Internal-закрыт-$
707-1-$
0-Internal-$
808-1-$
102-Internal-$
909-1-$
1-закрыт-$
204-Internal-$
Internal-закрыт-$
0-Internal-$
102-Internal-$
204-Internal-$
Internal-закрыт-$
0-Internal-$
102-Internal-$
204-Internal-$
Internal-закрыт-$
Signal-закрыт-$
concatMapTo поток закрыт
 */
var concatMapTo1 = rxjs_1.interval(101).pipe(
// контрольный поток
operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var concatMapToInternal = rxjs_1.interval(102).pipe(
// внутренний поток для concatMap
operators_1.take(3), operators_1.map(function (item) { return item * 102 + '-Internal'; }), 
// tap(logAll),
operators_1.endWith('Internal-закрыт'));
var concatMapToSignal = rxjs_1.interval(103).pipe(
// имитируем значения из внутреннего потока 
operators_1.take(5), operators_1.map(function (item) { return item * 103 + '-Signal'; }), operators_1.concatMapTo(concatMapToInternal), 
// tap(logAll),
operators_1.endWith('Signal-закрыт'));
var concatMapTo$ = rxjs_1.of(concatMapTo1, concatMapToSignal).pipe(operators_1.mergeAll());
// concatMapTo$.subscribe(item => console.log(item + '-$'), null, () => console.log('concatMapTo поток закрыт'));
/**
 * defaultIfEmpty
 * возвращает указанное значение defaultIfEmptyInternal, если поток завершился без значений
 *
 * Hello World!
1-$
1-закрыт-$
defaultIfEmpty поток закрыт
 */
var defaultIfEmptyInternal = '1';
// const defaultIfEmptyInternal = 1
var defaultIfEmpty1 = rxjs_1.interval(103).pipe(
// имитируем значения из внутреннего потока 
operators_1.take(0), operators_1.map(function (item) { return item * 103 + '-1'; }), 
// tap(logAll),
operators_1.defaultIfEmpty(defaultIfEmptyInternal), operators_1.endWith('1-закрыт'));
var defaultIfEmpty$ = rxjs_1.of(defaultIfEmpty1).pipe(operators_1.mergeAll());
//defaultIfEmpty$.subscribe(item => console.log(item + '-$'), null, () => console.log('defaultIfEmpty поток закрыт'));
/**
 * endWith
 * Выводит указанное значение перед закрытием потока
 *
 * Hello World!
0-1-$
0-2-$
101-1-$
102-2-$
202-1-$
1-закрыт-$
204-2-$
endWith поток закрыт
 */
var endWith1 = rxjs_1.interval(101).pipe(operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.take(3), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var endWith2 = rxjs_1.interval(102).pipe(
//неправильное положение оператора
operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.endWith('2-закрыт'), operators_1.take(3)
// tap(logAll),
);
var endWith$ = rxjs_1.of(endWith1, endWith2).pipe(operators_1.mergeAll());
//endWith$.subscribe(item => console.log(item + '-$'), null, () => console.log('endWith поток закрыт'));
var startWith1 = rxjs_1.interval(101).pipe(operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.startWith('1-открыт'), operators_1.take(3), operators_1.endWith('1-закрыт'));
var startWith2 = rxjs_1.interval(102).pipe(
//неправильное положение оператора
operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.take(3), operators_1.endWith('2-закрыт'), operators_1.startWith('2-открыт'));
var startWith$ = rxjs_1.of(startWith1, startWith2).pipe(operators_1.mergeAll());
startWith$.subscribe(function (item) { return console.log(item + '-$'); }, null, function () { return console.log('startWith поток закрыт'); });
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
//exhaustMap$.subscribe(item => console.log(item), null, ()=> console.log('exhaustMap поток закрыт'));
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
//pluck$.subscribe(item => console.log(item), null, ()=> console.log('pluck поток закрыт'));
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
//switchMap$.subscribe(item => console.log(item), null, ()=> console.log('switchMap поток закрыт'));
