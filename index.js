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
 * выводится время появления значения в потоке. Интервалы имитации разведены на милисекунду: 101, 102, 202, 203. Всегда понятно когда и в каком порядке имитировано значение.
 * к значениям из одного потока добавляются унифицированные постфиксы '-1' | '-2' | '-dynamic'
 * в примерах расставлены закоментированные операторы логирования для отладки tap(logAll)
 * выходная строка subscribe унифицирована для облегчения отладки
 * унифицированные постфиксы '-$' помогают в чтении вывода https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b
 * операторы endWith('...') помогают понять когда происходит завершение(отписка) потока
 * выполняется как в консоли, так и в онлайн редакторе. Некоторые примеры работают только в браузере, когда необходимо его API
 * просто один файл. Суровый "кирпич", который обусловлен стартовым шаблоном stackblitz. Легко искать, скачивать, отправлять. Трудно модифицировать совместно, долго запускать. Нет оглавления, но его можно построить поиском ctrl+shift+f '$.subscribe('. Любое другое удобство усложнит код, и потребует ещё более могучего времени на рефакторинг, поиск компромиссов. Таким образом я подсократил огромное количество убитого на это пособие времени. И это - начальный этап, сбор примеров, создание методики.
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
 * subscribe(item => logAll('значение потока', item), err => logAll('ошибка', err), () => logAll('поток закрыт штатно')); - запускает поток, принимает три аргумента для значений(next), ошибок(error), завершения потока(complete)
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
 *
 * Типовой пример:

const auditProbe$ = item => { // функция-аргумент для передачи в оператор
    logAll('проверка: ' + item); // для отладки пишем полученное значение
    return interval(300).pipe(take(3)); // возвращаем наблюдатель. В данном случае - для имитации трёх значений.
    //.pipe(take(X)) - хорошее правило для ограничения утечек памяти
}

const audit2$ = interval(102).pipe( // поток для отладки оператора
    take(10), // ограничиваем количество значений
    map(item => item * 102), // делаем значения человеко-понятными, выводим время их имитации в мсек, выбрали 102 вместо 100 чтобы не было случайных гонок асинхронных потоков(перестраховка)
    tap(logAll), // выводим сырые значения перед отправкой в недра исследуемого оператора
    audit(auditProbe$) // исследуемый оператор
)

const audit1$ = interval(101).pipe( // контрольный поток для сравнения, без оператора для исследования
    take(10),
    map(item => item * 101 + '-control'), // добавляем постфикс для облегчения чтения отладки
)

const audit$ = of(audit1$, audit2$).pipe( // одновременно запускаем два потока
    mergeAll(), // собираем значения потоков в один, "конвертируем" потоки в значения
);

//запускаем потоки и выводим всё в консоль. префиксы нужны, чтобы понимать, что значение долетело до конца
audit$.subscribe((item) =>
    logAll('получил: ', item), // пишем всё, что получили по сигналу next().
    err => logAll('ошибка:', err), // пишем что прилетело по сигналу error()
    () => logAll('audit поток закрыт') // пишем когда прилетело complete(). Отдельно указываем какой именно оператор закончил тестирование, чтобы быстрее ловить другие ошибочно не закомментированые операторы
);
 
)
 */
var helloSource$ = rxjs_1.of('World').pipe(operators_1.map(function (x) { return "Hello " + x + "!"; }));
helloSource$.subscribe(function (x) { return logAll(x); });
/**
 * Чтобы обойти ошибку TS2496: The 'arguments' object cannot be referenced in an arrow function in ES3 and ES5. Consider using a standard function expression.
 * https://github.com/microsoft/TypeScript/issues/1609
 * Чтобы не светились ошибки использования console.log
 * Здесь такое логирование применимо, на проде - нет
 */
function logAll() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    console.log.apply(console, __spread(values)); // ...arguments
}
/**
 * map
 * Преобразует и возвращает текущее значение потока
 * interval(x) - Источник значений, который создаёт значения (i=0;i<Number.MAX_SAFE_INTEGER;i++) через каждые x мсек
 * для наглядности умножаю значения на интервал x, чтобы получалось время а не порядковый номер
 * tap - не меняет значения потока
 * take - останавливает поток после получения указанного количества значений
 */
var map$ = rxjs_1.interval(100).pipe(operators_1.take(3), operators_1.map(function (item) { return ['преобразуй это: ', item]; }), //используется для конвертирования значений счётчиков в милисекунды имитации значений
operators_1.tap(function (item) { return ['фига с два: ', item]; }), //не возвращает ничего
operators_1.tap(function (item) { return logAll('отладь меня: ', item); }));
/**
 * Три работающих варианта подписки
 * разведены во времени, чтобы не перемешивать вывод в консоль
 */
//map$.subscribe(item => logAll('самый простой, значение:', item));
/*
const mapTimeout1 = setTimeout(() => {
    map$.subscribe(
        item => logAll(
            'стрелочные функции, значение:', item),
        err => logAll('стрелочные функции, ошибка:', err),
        () => logAll('стрелочные функции, закрытие:', 'конец')
    );
    clearInterval(mapTimeout1)
}, 1000);
 */
/*
const mapTimeout2 = setTimeout(() => {
    map$.subscribe({
        next: item => logAll('объект, значение:', item),
        error: err => logAll('объект, ошибка', err),
        complete: () => logAll('объект, закрытие', 'конец')
    })
    clearInterval(mapTimeout2);
}, 2000);
 */
//========================================================================================================================
//==================================================BUFFER================================================================
//========================================================================================================================
/**
 * buffer
 * Полезен для создания листалки, ограничения большого потока значений.
 * Кэширует из входного потока, и возвращает одним массивом
 * Отсекает по каждому значению от параметра-наблюдателя
 *
 *
Hello World!
получил:  [ 0 ]
получил:  [ 101, 202 ]
получил:  [ 303, 404 ]
buffer поток закрыт
 */
var bufferCloseSignal$ = rxjs_1.interval(202);
var buffer$ = rxjs_1.interval(101).pipe(operators_1.take(7), operators_1.map(function (item) { return item * 101; }), operators_1.buffer(bufferCloseSignal$));
//buffer$.subscribe((item) => logAll('получил: ', item), null, () => logAll('buffer поток закрыт'));
/**
 * bufferCount
 * Кэширует из входного потока, и возвращает одним массивом
 * Завершает набор в кэш по параметру-количеству значений
 *
 *
 * bufferCount(bufferCountSize),
Hello World!
получил:  [ 0, 101, 202 ]
получил:  [ 303, 404 ]
bufferCount поток закрыт

bufferCount(bufferCountLengthSize, bufferCountLengthStartNew),
Hello World!
получил:  [ 0, 101, 202 ]
получил:  [ 202, 303, 404 ]
получил:  [ 404 ]
bufferCount поток закрыт
 */
var bufferCountSize = 3;
var bufferCountStartNew = 2;
var bufferCount$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101; }), operators_1.bufferCount(bufferCountSize), operators_1.bufferCount(bufferCountSize, bufferCountStartNew));
//bufferCount$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferCount поток закрыт'));
/**
 * bufferTime
 * Кэширует из входного потока, и возвращает одним массивом
 * Завершает набор в буфер по параметру-времени
 * Начинает заполнять новый буфер по второму параметру-времени
 *
 *
Hello World!
получил:  [ 0 ]
получил:  [ 0, 101 ]
получил:  [ 101, 202 ]
bufferTime поток закрыт
 */
var bufferTimeSize = 202;
var bufferTimeCreateNew = 102;
var bufferTime$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101; }), operators_1.bufferTime(bufferTimeSize, bufferTimeCreateNew));
//bufferTime$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferTime поток закрыт'));
/**
 * bufferToggle
 * Кэширует из входного потока, и возвращает одним массивом
 * асинхронный старт и стоп буфера по сигналу(значению) из параметров-наблюдателей
 * открываем новый буфер каждое bufferOpen$ значение, стартуем bufferClose$, закрываем с первым bufferClose$ значением
 *
 *
Hello World!
bufferOpen:  0
bufferClose:  0
получил:  [ 303, 404, 505 ]
bufferOpen:  404
bufferClose:  0
получил:  [ 707, 808, 909 ]
bufferOpen:  808
bufferClose:  0
получил:  [ 1111, 1212, 1313 ]
bufferOpen:  1212
bufferClose:  0
получил:  [ 1515, 1616, 1717 ]
bufferOpen:  1616
получил:  [ 1919 ]
bufferToggle поток закрыт
*/
var bufferOpen$ = rxjs_1.interval(404).pipe(operators_1.tap(function (item) { return logAll('bufferOpen: ', item * 404); }));
var bufferClose$ = function () { return rxjs_1.interval(303).pipe(operators_1.tap(function (item) { return logAll('bufferClose: ', item * 303); })); };
var bufferToggle$ = rxjs_1.interval(101).pipe(operators_1.take(20), operators_1.map(function (item) { return item * 101; }), operators_1.bufferToggle(bufferOpen$, bufferClose$));
//bufferToggle$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferToggle поток закрыт'));
/**
 * bufferWhen
 * Кэширует из входного потока, и возвращает одним массивом
 * выбор времени закрытия буфера
 *
Hello World!
bufferWhenInterval1$: 0
получил:  [ 0, 101, 202, 303 ]
bufferWhenInterval1$: 303
получил:  [ 404, 505, 606, 707, 808 ]
bufferWhenInterval2$: 808
получил:  [ 909, 1010 ]
bufferWhenInterval2$: 1010
получил:  [ 1111, 1212 ]
bufferWhenInterval2$: 1212
получил:  [ 1313, 1414 ]
bufferWhenInterval2$: 1414
получил:  [ 1515, 1616 ]
bufferWhenInterval2$: 1616
получил:  [ 1717, 1818 ]
bufferWhenInterval2$: 1818
получил:  [ 1919 ]
bufferWhen поток закрыт
*/
var bufferWhenCount = 0;
var bufferWhenInterval1$ = rxjs_1.interval(505).pipe(operators_1.map(function (item) { return item * 505 + '-1'; }));
var bufferWhenInterval2$ = rxjs_1.interval(202).pipe(operators_1.map(function (item) { return item * 202 + '-2'; }));
var bufferWhen$ = rxjs_1.interval(101).pipe(operators_1.take(20), operators_1.map(function (item) { return item * 101; }), operators_1.tap(function (item) { bufferWhenCount = item; }), // поскольку bufferWhen не принимает параметры, храним условие в отдельной переменной
operators_1.bufferWhen(function () {
    if (bufferWhenCount < 500) {
        logAll('bufferWhenInterval1$: ' + bufferWhenCount);
        return bufferWhenInterval1$;
    }
    else {
        logAll('bufferWhenInterval2$: ' + bufferWhenCount);
        return bufferWhenInterval2$;
    }
}));
//bufferWhen$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferWhen поток закрыт'));
//========================================================================================================================
//==================================================WINDOW================================================================
//========================================================================================================================
/**
 * window
 * "нарезка". В отличии от buffer возвращает потоки. Полезен для создания листалки, ограничения большого потока значений.
 * Возвращает новый поток(буфер) по таймеру, предыдущий закрывает
 
Hello World!
0-windowCloseInterval
получил:  [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
1000-windowCloseInterval
получил:  [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]
получил:  [ 19 ]
window поток закрыт
*/
var windowCloseInterval$ = rxjs_1.interval(1000).pipe(operators_1.map(function (item) { return item * 1000 + '-windowCloseInterval'; }), operators_1.tap(logAll));
var window$ = rxjs_1.interval(101).pipe(operators_1.take(20), operators_1.window(windowCloseInterval$), operators_1.switchMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
// window$.subscribe((item) => logAll('получил: ', item), null, () => logAll('window поток закрыт'));
/**
 * windowCount
 *
 * Возвращает новый поток(буфер) по количеству значений, предыдущий закрывает
 *
windowCount(windowCountSize),
["windowCount", 0, 1]
["windowCount", 2, 3]
["windowCount", 4, 5]
["windowCount", 6, 7]
["windowCount", 8, 9]
["windowCount"]

windowCount(windowCountSize, windowCountStartNew),
["windowCount", 0, 1]
["windowCount", 3, 4]
["windowCount", 6, 7]
["windowCount", 9]
*/
var windowCountSize = 2;
var windowCountStartNew = 3;
var windowCount$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }), 
// windowCount(windowCountSize),
operators_1.windowCount(windowCountSize, windowCountStartNew), operators_1.switchMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
// windowCount$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowCount поток закрыт'));
/**
 * WindowTime
 * Возвращает новый поток(буфер) по времени, предыдущий закрывает

Hello World!
получил:  [ 0 ]
получил:  [ 101, 202 ]
получил:  [ 303, 404 ]
получил:  [ 505, 606 ]
получил:  [ 707, 808 ]
получил:  [ 909 ]
windowCount поток закрыт
 */
var windowTimeSize = 202;
var windowTime$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }), operators_1.windowTime(windowTimeSize), operators_1.switchMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
//windowTime$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowTime поток закрыт'));
/**
 * windowToggle
 * Возвращает новый поток(буфер) по значению от параметров-наблюдателей, предыдущий закрывает
Hello World!
windowOpen 0
windowClose 0
получил:  [ 303, 404, 505 ]
windowOpen 1
получил:  [ 707, 808, 909 ]
windowToggle поток закрыт
 */
var windowToggleCount = 0;
var windowOpen$ = rxjs_1.interval(404).pipe(operators_1.map(function () { return logAll('windowOpen', windowToggleCount); }));
var windowClose$ = function () { return rxjs_1.interval(303).pipe(operators_1.map(function () { return logAll('windowClose', windowToggleCount++); }) // увеличиваем счётчик во внешней переменной
); };
var windowToggle$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }), operators_1.windowToggle(windowOpen$, windowClose$), operators_1.switchMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
//windowToggle$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowToggle поток закрыт'));
/**
 * windowWhen
 * Возвращает новый поток(буфер) по значению от параметров-наблюдателей, предыдущий закрывает
 * выбор времени закрытия буфера
 *
 Hello World!
получил:  [ 0, 101, 202, 303 ]
получил:  [ 404, 505, 606, 707, 808 ]
получил:  [ 909 ]
windowWhen поток закрыт
*/
var windowWhenCount = 0;
var windowWhenInterval1$ = rxjs_1.interval(505);
var windowWhenInterval2$ = rxjs_1.interval(202);
var windowWhen$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }), operators_1.map(function (item) { return (windowWhenCount = item); }), // windowWhen е принимает параметров, потому используем внешнюю переменную
operators_1.windowWhen(function () {
    if (windowWhenCount < 500) {
        return windowWhenInterval1$;
    }
    else {
        return windowWhenInterval2$;
    }
}), operators_1.switchMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
//windowWhen$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowWhen поток закрыт'));
//========================================================================================================================
//==================================================ERRORS================================================================
//========================================================================================================================
/**
 * catchError
 * Перехват потока при ошибке
 * Практическое применение: самописные обработчики ошибок, сервисы хранения ошибок типа ravenjs
 *
Hello World!
словил: ошибка ошибковна источик: Observable { }
положь где взял: вернул взад ошибка ошибковна источик: Observable { }
получил:  янеошибка
error поток закрыт
 */
var error$ = rxjs_1.throwError('ошибка ошибковна')
    .pipe(operators_1.catchError(function (err, caught$) {
    logAll('словил:', err, 'источик:', caught$); //перехватчик ошибок
    return rxjs_1.throwError("\u0432\u0435\u0440\u043D\u0443\u043B \u0432\u0437\u0430\u0434 " + err); //генерируем новую ошибку вместо текущей
}), operators_1.catchError(function (err, caught$) {
    logAll('положь где взял:', err, 'источик:', caught$); //перехватчик ошибок работает последовательно
    return rxjs_1.of('янеошибка'); //подмена ошибки значением
}));
//error$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('error поток закрыт'));
//
/**
 * errorHandler
 * ошибка  при пустом потоке
 * Можно подменять ошибку
 *
 * Hello World!
ошибка: { [EmptyError: no elements in sequence] message: 'no elements in sequence', name: 'EmptyError' }
 */
var errorHandler = function () { return logAll('ничоси'); };
var errorEmpty$ = rxjs_1.of().pipe(operators_1.throwIfEmpty() //без подмены
//throwIfEmpty(errorHandler)//подмена ошибки
);
//errorEmpty$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('errorEmpty поток закрыт'));
//
/**
 * errorResumeNext
 * Новый поток при ошибке

Hello World!
получил:  0
получил:  101
получил:  202
получил:  303
получил:  0-next
получил:  202-next
получил:  404-next
errorSwitch поток закрыт
 */
var errorNext$ = rxjs_1.interval(202).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 202 + '-next'; })); //резервный поток после ошибок
var errorSwitch$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101; }), operators_1.map(function (item) {
    if (item > 303) {
        throw new Error('ничоси');
    }
    else {
        return item;
    }
}), operators_1.onErrorResumeNext(errorNext$));
//errorSwitch$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('errorSwitch поток закрыт'));
/**
 * retry
 *
 * Повторяет поток значений указанное количество раз при ошибке

Hello World!
получил:  0
получил:  101
получил:  202
получил:  303
получил:  0
получил:  101
получил:  202
получил:  303
получил:  0
получил:  101
получил:  202
получил:  303
получил:  0
получил:  101
получил:  202
получил:  303
получил:  404
получил:  505
получил:  606
получил:  707
получил:  808
получил:  909
errorRetry поток закрыт
 */
var errorRetryCountSuccess = 0;
var retry$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }), operators_1.map(function (item) {
    if (item > 303 && errorRetryCountSuccess <= 2) {
        errorRetryCountSuccess += 1; // эмулируем отсутствие ошибок после третьей попытки
        throw new Error('никогда не было, и вот опять');
    }
    else {
        return item;
    }
}), operators_1.retry(3));
//retry$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('retry поток закрыт'));
/**
 * retryWhen
 * повторяет поток пока не будет получен complete/error внутри аргумента наблюдателя retryCondition$

Hello World!
получил:  0
получил:  101
получил:  202
словили: Error: ничоси
получил:  0
получил:  101
получил:  202
словили: Error: ничоси
получил:  0
получил:  101
получил:  202
словили: Error: ничоси
retryWhen поток закрыт
 */
var retryWhen$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }), operators_1.map(function (item) {
    if (item === 303) {
        throw new Error('ничоси');
    }
    else {
        return item;
    }
}), operators_1.retryWhen(function (retryCondition$) {
    return retryCondition$.pipe(operators_1.map(function (item) {
        logAll('словили: ' + item);
    }), operators_1.take(3) //отправляет complete после 3 повторов
    );
}));
//retryWhen$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('retryWhen поток закрыт'));
/**
 * retryWhen более сложный пример
 *
Hello World!
получил:  0
получил:  101
ошибка-данные: 2
повтор: 1
получил:  0
получил:  101
ошибка-данные: 2
остановка
retryWhen2 поток закрыт
*/
var retryWhen2$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (x) {
    if (x === 2) {
        logAll('ошибка-данные: ' + x);
        throw new Error('errorN: ' + x);
    }
    return x;
}), operators_1.retryWhen(function (errors$) {
    return errors$.pipe(
    // tap(err => logAll(err)),
    operators_1.scan(function (acc) { return acc + 1; }, 0), operators_1.map(function (retryCount) {
        if (retryCount === 2) {
            logAll('остановка');
        }
        else {
            logAll('повтор: ' + retryCount);
        }
        return retryCount;
    }), operators_1.takeWhile(function (errCount) { return errCount < 2; }));
}), operators_1.map(function (item) { return item * 101; }));
//retryWhen2$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('retryWhen2 поток закрыт'));
/**
 * timeout
 * прерывает поток ошибкой, если нет значения за время интервала
 * также можно указать дату вместо интервала, но можно наступить на локализацию
 * !!! работает асинхронно, учитывает задержку выполнения предыдущих операторов: для 101 мс надо 105 мс минимум таймаута

Hello World!
получил:  0-1
получил:  0-2
получил:  101-1
получил:  202-1
получил:  202-2
Таймер сработал
получил:  { [TimeoutError: Timeout has occurred] message: 'Timeout has occurred', name: 'TimeoutError' }
timeOut поток закрыт
 */
var timeOut1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }));
var timeOut2$ = rxjs_1.interval(202).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 202 + '-2'; }));
var timeOut$ = rxjs_1.of(timeOut1$, timeOut2$).pipe(operators_1.mergeAll(), operators_1.timeout(111), operators_1.catchError(function (err, caught$) {
    if (err.name === 'TimeoutError') {
        // обрабатываем событие таймера
        logAll('Таймер сработал');
    }
    ;
    return rxjs_1.of(err);
}));
//timeOut$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('timeOut поток закрыт'));
/**
 * timeoutWith
 * стартует новый поток, если нет значения за время интервала
 * также можно указать дату вместо интервала, но можно наступить на локализацию
Hello World!
получил:  0-1
получил:  0-2
получил:  101-1
получил:  202-1
получил:  202-2
получил:  0-3
получил:  101-3
получил:  202-3
timeOutWith поток закрыт
 */
var timeOutWithSrc1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }));
var timeOutWithSrc2$ = rxjs_1.interval(202).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 202 + '-2'; }));
var timeOutWithFallback$ = rxjs_1.interval(103).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-3'; }));
var timeOutWith$ = rxjs_1.of(timeOutWithSrc1$, timeOutWithSrc2$).pipe(operators_1.mergeAll(), operators_1.timeoutWith(111, timeOutWithFallback$), operators_1.catchError(function (err, caught$) {
    if (err.name === 'timeOutWithError') {
        // обрабатываем событие таймера
        logAll('Таймер сработал');
    }
    ;
    return rxjs_1.of(err);
}));
//timeOutWith$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('timeOutWith поток закрыт'));
//========================================================================================================================
//==================================================FILTERING ONE=========================================================
//========================================================================================================================
//указанные операторы получают и возвращают значения в потоке
/**
 * skip
 * скрывает указанное количество значений

Hello World!
получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  306-2
получил:  404-1
получил:  101-закрыт
получил:  408-2
получил:  102-закрыт
skip поток закрыт
 */
var skipSrc1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('101-закрыт'));
var skipSrc2$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.skip(3), operators_1.endWith('102-закрыт'));
var skip$ = rxjs_1.of(skipSrc1$, skipSrc2$).pipe(operators_1.mergeAll());
//skip$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
/**
 * skipLast
 * скрывает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений

Hello World!
получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  0-2
получил:  404-1
получил:  101-закрыт
получил:  102-2
получил:  102-закрыт
skipLast поток закрыт
 */
var skipLastSrc1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('101-закрыт'));
var skipLastSrc2$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.skipLast(3), operators_1.endWith('102-закрыт'));
var skipLast$ = rxjs_1.of(skipLastSrc1$, skipLastSrc2$).pipe(operators_1.mergeAll());
//skipLast$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skipLast поток закрыт'));
/**
 * skipUntil
 * скрывает значения потока до момента получения первого значения из аргумента наблюдателя

Hello World!
получил:  0-1
получил:  101-1
получил:  202-1
получил:  204-2
получил:  303-1
получил:  306-2
получил:  404-1
получил:  101-закрыт
получил:  408-2
получил:  102-закрыт
skipUntil поток закрыт
 */
var skipUntilSrc1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('101-закрыт'));
var skipUntilSignal$ = rxjs_1.interval(303).pipe(operators_1.take(1), operators_1.map(function (item) { return item * 303 + '-1'; }), operators_1.endWith('303-закрыт'));
var skipUntilSrc2$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.skipUntil(skipUntilSignal$), operators_1.endWith('102-закрыт'));
var skipUntil$ = rxjs_1.of(skipUntilSrc1$, skipUntilSrc2$).pipe(operators_1.mergeAll());
//skipUntil$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skipUntil поток закрыт'));
/**
 * skipWhile
 * скрывает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false
Hello World!
получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  306-2
получил:  404-1
получил:  101-закрыт
получил:  408-2
получил:  102-закрыт
skipWhile поток закрыт
 */
var skipWhileSrc1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('101-закрыт'));
var isSkipWhile = function (item) { return item !== '306-2'; };
var skipWhileSrc2$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.skipWhile(isSkipWhile), operators_1.endWith('102-закрыт'));
var skipWhile$ = rxjs_1.of(skipWhileSrc1$, skipWhileSrc2$).pipe(operators_1.mergeAll());
//skipWhile$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skipWhile поток закрыт'));
/**
 * take
 * возвращает указанное количество значений
Hello World!
получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  404-1
получил:  101-закрыт
take поток закрыт
 */
var take$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('101-закрыт'));
//take$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('take поток закрыт'));
/**
 * takeLast
 * возвращает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений

Hello World!
получил:  707-1
получил:  808-1
получил:  909-1
получил:  101-закрыт
takeLast поток закрыт
 */
var takeLast$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.takeLast(3), operators_1.endWith('101-закрыт'));
//takeLast$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('takeLast поток закрыт'));
/**
 * takeUntil
 * Возвращает поток до момента получения первого значения из аргумента наблюдателя takeUntilComplete$
 * Прерывает поток при получении первого значения из аргумента наблюдателя takeUntilComplete$
 * Используется для очистки мусора, как завершающий оператор

Hello World!
получил:  0-1
получил:  0-2
получил:  101-1
получил:  102-2
получил:  102-закрыт
получил:  202-1
получил:  303-1
получил:  404-1
получил:  101-закрыт
takeUntil поток закрыт
 */
var takeUntilSrc1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('101-закрыт'));
var takeUntilSignal$ = rxjs_1.interval(303).pipe(operators_1.take(1), operators_1.map(function (item) { return item * 303 + '-3'; }), operators_1.endWith('303-закрыт'));
/*
//более сложный пример с событием из DOM, надо нажать на кнопку
const takeUntil2ButtonElement = document.getElementById('id-tight-button');
const takeUntilSignal$ = fromEvent(takeUntil2ButtonElement, 'click');
*/
var takeUntilSrc2$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.takeUntil(takeUntilSignal$), operators_1.endWith('102-закрыт'));
var takeUntil$ = rxjs_1.of(takeUntilSrc1$, takeUntilSrc2$).pipe(operators_1.mergeAll());
//takeUntil$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('takeUntil поток закрыт'));
/**
 * takeWhile
 * возвращает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false

Hello World!
получил:  0-1
получил:  0-2
получил:  101-1
получил:  102-2
получил:  202-1
получил:  204-2
получил:  303-1
получил:  102-закрыт
получил:  404-1
получил:  101-закрыт
takeWhile поток закрыт
 */
var takeWhileSrc1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('101-закрыт'));
var isTakeWhile = function (item) { return item !== '306-2'; };
var takeWhileSrc2$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.takeWhile(isTakeWhile), operators_1.endWith('102-закрыт'));
var takeWhile$ = rxjs_1.of(takeWhileSrc1$, takeWhileSrc2$).pipe(operators_1.mergeAll());
//takeWhile$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('takeWhile поток закрыт'));
/**
 * distinct
 * возвращает только уникальные значения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * можно передать функцию предварительной обработки значений

Hello World!
получил:  0
получил:  101
получил:  202
получил:  303
получил:  404
получил:  101-закрыт
получил:  102-закрыт
distinct поток закрыт
 */
var distinctSrc1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101; }), operators_1.endWith('101-закрыт'));
var distinctSrc2$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101; }), operators_1.endWith('102-закрыт'));
var distinct$ = rxjs_1.of(distinctSrc1$, distinctSrc2$).pipe(operators_1.mergeAll(), operators_1.distinct());
//distinct$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinct поток закрыт'));
/**
 * distinct
 * более сложный пример с функцией предварительной обработки значений перед сравнением
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 *
Hello World!
получил:  { value: 0, stream: '1' }
получил:  { value: 101, stream: '1' }
получил:  { value: 202, stream: '1' }
получил:  { value: 303, stream: '1' }
получил:  { value: 404, stream: '1' }
получил:  101-закрыт
distinct2 поток закрыт
 */
var distinctSrc3$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return { value: item * 101, stream: '1' }; }), operators_1.endWith('101-закрыт'));
var distinctSrc4$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return { value: item * 101, stream: '2' }; }), operators_1.endWith('102-закрыт'));
var distinctParse = function (item) { return item.value; };
var distinct2$ = rxjs_1.of(distinctSrc3$, distinctSrc4$).pipe(operators_1.mergeAll(), operators_1.distinct(distinctParse));
//distinct2$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinct2 поток закрыт'));
/**
 * distinctUntilChanged
 * возвращает только уникальные значения в пределах двух значений: текущего и предыдущего
 * можно передать функцию сравнения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается

Hello World!
получил:  { value: 0, stream: '1' }
получил:  { value: 0, stream: '2' }
distinctUntilChanged поток закрыт
 */
var distinctUntilChangedSrc3$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return { value: item * 101, stream: '1' }; }), operators_1.endWith('101-закрыт'));
var distinctUntilChangedSrc4$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return { value: item * 101, stream: '2' }; }), operators_1.endWith('102-закрыт'));
var distinctUntilChangedParse = function (item, itemPrev) { return item.value !== itemPrev.value; };
var distinctUntilChanged$ = rxjs_1.of(distinctUntilChangedSrc3$, distinctUntilChangedSrc4$).pipe(operators_1.mergeAll(), operators_1.distinctUntilChanged(distinctUntilChangedParse));
// distinctUntilChanged$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinctUntilChanged поток закрыт'));
/**
 * distinctUntilKeyChanged
 * возвращает только уникальные значения в пределах текущего и предыдущего
 * необходимо указать название ключа объекта для сравнения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * !!! люто работает проверка типов distinctUntilKeyChangedKeyName. В очевидных случаях несоответствия со значениями в потоке пишет: несовместимо с "never"
Hello World!
получил:  { value: 0, stream: '1' }
получил:  { value: 101, stream: '1' }
получил:  { value: 202, stream: '1' }
получил:  { value: 303, stream: '1' }
получил:  { value: 404, stream: '1' }
distinctUntilKeyChanged поток закрыт
 */
var distinctUntilKeyChangedSrc3$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return { value: item * 101, stream: '1' }; }));
var distinctUntilKeyChangedSrc4$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return { value: item * 101, stream: '2' }; }));
var distinctUntilKeyChangedKeyName = 'value';
var distinctUntilKeyChanged$ = rxjs_1.of(distinctUntilKeyChangedSrc3$, distinctUntilKeyChangedSrc4$).pipe(operators_1.mergeAll(), operators_1.distinctUntilKeyChanged(distinctUntilKeyChangedKeyName));
// distinctUntilKeyChanged$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinctUntilKeyChanged поток закрыт'));
/**
 * filter
 * возвращает значения потока, если аргумент функция вернул true
 * Базовый оператор, которым можно заменить много других

Hello World!
получил:  0
получил:  101
получил:  202
filter поток закрыт
 */
var filterSrc$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101; }));
var isFilter = function (item) { return item < 303; };
var filter$ = filterSrc$.pipe(operators_1.filter(isFilter));
// filter$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('filter поток закрыт'));
/**
 * sample
 * возвращает первое значение потока после получения очередного значения из аргумента наблюдателя sampleProbe$
 * Отбирает второе значение из потока между таймерами(300)
 * Здесь имеет значение сколько имитировано в потоке sampleProbe$. После его закрытия

Hello World!
0-проверяем
получил:  102
300-проверяем
получил:  408
600-проверяем
получил:  714
sample поток закрыт
 */
var sampleProbe$ = rxjs_1.interval(300).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 300 + '-проверяем'; }), operators_1.tap(logAll), operators_1.endWith('sampleProbe-закрыт'));
var sample$ = rxjs_1.interval(102).pipe(operators_1.take(20), operators_1.map(function (item) { return item * 102; }), operators_1.sample(sampleProbe$));
//sample$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('sample поток закрыт'));
/**
 * audit
 *
 * отбирает кайнее значение из потока между таймерами(300)
 *

Hello World!
получил:  0-control
проверка: 0
получил:  101-control
получил:  202-control
получил:  303-control
получил:  204
проверка: 306
получил:  404-control
получил:  505-control
получил:  606-control
получил:  510
проверка: 612
получил:  707-control
получил:  808-control
получил:  909-control
получил:  816
проверка: 918
audit поток закрыт
 */
var auditProbe$ = function (item) {
    logAll('проверка: ' + item);
    return rxjs_1.interval(300).pipe(operators_1.take(3));
};
var audit2$ = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102; }), operators_1.audit(auditProbe$));
var audit1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-control'; }));
var audit$ = rxjs_1.of(audit1$, audit2$).pipe(operators_1.mergeAll());
// audit$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('audit поток закрыт'));
/**
 * throttle
 * отбирает первое значение из потока между таймерами(300)
 *
Hello World!
получил:  0-control
получил:  0
проверка: 0
получил:  101-control
получил:  202-control
получил:  303-control
получил:  306
проверка: 306
получил:  404-control
получил:  505-control
получил:  606-control
получил:  612
проверка: 612
получил:  707-control
получил:  808-control
получил:  909-control
получил:  918
проверка: 918
throttle поток закрыт
 */
var throttleProbe$ = function (item) {
    logAll('проверка: ' + item);
    return rxjs_1.interval(300).pipe(operators_1.take(1));
};
var throttle2$ = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102; }), operators_1.throttle(throttleProbe$));
var throttle1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-control'; }));
var throttle$ = rxjs_1.of(throttle1$, throttle2$).pipe(operators_1.mergeAll());
// throttle$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('throttle поток закрыт'));
//========================================================================================================================
//==================================================FILTERING MULTIPLE====================================================
//========================================================================================================================
//
/**
 * first
 * Возвращает первое значение из потока
 * Если передать в аргументы функцию, то первое значение при возврате функции true

Hello World!
1
102
получил:  102
first поток закрыт
 */
var first$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + 1; }), operators_1.tap(logAll), 
// first(), // вернёт первое значение
operators_1.first(function (item) { return item % 2 === 0; }) //вернёт первое чётное число
);
// first$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('first поток закрыт'));
/**
 * last
 * Возвращает крайнее значение из потока
 * Поток должен быть конечным
 * Если передать в аргументы функцию, то крайнее значение при возврате функции true

Hello World!
1
102
203
304
405
506
607
708
809
910
получил:  910
last поток закрыт
 */
var last$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + 1; }), operators_1.tap(logAll), 
// last(), // вернёт крайнее значение
operators_1.last(function (item) { return item % 2 === 0; }) //вернёт крайнее чётное число
);
// last$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('last поток закрыт'));
/**
 * min
 * возвращает минимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки

Hello World!
получил: 0
min поток закрыт
 */
var min$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(logAll),
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
// min$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('min поток закрыт'));
/**
 * max
 * возвращает максимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки

Hello World!
получил:  6
max поток закрыт
 */
var max$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(logAll),
// max()//вернёт максиимальное число 6
operators_1.max(function (item1, item2) {
    if (Math.abs(item1) > Math.abs(item2)) {
        return 1;
    }
    else {
        return -1;
    }
    ;
}));
// max$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('max поток закрыт'));
/**
 * возвращает элемент по индексу в потоке
 * можно заменить через toArray()[index]
Hello World!
получил:  4
elementAt поток закрыт
 */
var elementAt$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(item => logAll('получил: ' + item)),
operators_1.elementAt(3));
// elementAt$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('elementAt поток закрыт'));
/**
 * find
 * возвращает первый элемент потока, для которого функция аргумент findProbe возвращает true

Hello World!
получил:  4
find поток закрыт
 */
var findProbe = function (item) { return item > 0; };
var find$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(logAll),
operators_1.find(findProbe));
// find$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('find поток закрыт'));
/**
 * возвращает первый индекс элемента потока, для которого функция аргумент findIndexProbe возвращает true
Hello World!
получил:  3
findIndex поток закрыт

 */
var findIndexProbe = function (item) { return item > 0; };
var findIndex$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(logAll),
operators_1.findIndex(findIndexProbe));
// findIndex$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('findIndex поток закрыт'));
/**
 * single
 * возвращает значение из входного потока, если функция аргумент singleProbe возвращает true
 * При значениях больше 1 штуки возвращает ошибку
 * если значений не найдено возвращает undefined
 Hello World!
получил:  0
single поток закрыт
 */
var singleProbe = function (item) { return item === 0; };
//const singleProbe = item=>item>0;//ошибка
//const singleProbe = item=>item===10;//undefined
var single$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(item => logAll('получил: ' + item)),
operators_1.single(singleProbe));
// single$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('single поток закрыт'));
//========================================================================================================================
//==================================================GROUPING OBSERVABLES==================================================
//========================================================================================================================
//
/**
 * combineAll
 * возвращает крайние значения, если они пришли от всех асинхронных потоков
 * в данном случае ожидает по три значения

получил:  [ 101, 0, 0 ]
получил:  [ 202, 0, 0 ]
получил:  [ 202, 202, 0 ]
получил:  [ 303, 202, 0 ]
получил:  [ 404, 202, 0 ]
получил:  [ 404, 202, 303 ]
получил:  [ 404, 404, 303 ]
получил:  [ 505, 404, 303 ]
получил:  [ 606, 404, 303 ]
получил:  [ 606, 606, 303 ]
получил:  [ 707, 606, 303 ]
получил:  [ 707, 606, 606 ]
получил:  [ 808, 606, 606 ]
получил:  [ 808, 808, 606 ]
получил:  [ 909, 808, 606 ]
combineAll поток закрыт
 */
var combine1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }));
var combine2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202; }));
var combine3$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303; }));
var combineAll$ = rxjs_1.of(combine1$, combine2$, combine3$).pipe(
// tap(logAll), //возвращает три потока наблюдателей
operators_1.combineAll());
// combineAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('combineAll поток закрыт'));
/**
 * combineLatest
 * возвращает крайние значения combineLatestX$
 * на старте ждёт значения от всех асинхронных потоков combineLatestX$
 * !!!не работает внутри pipe
 * Есть необязательный аргумент combineLatestParser для обработки всех входящих значений
 * https://www.learnrxjs.io/operators/combination/combinelatest.html
 *

Hello World!
получил:  item1:101-item2:0-item3:0
получил:  item1:202-item2:0-item3:0
получил:  item1:202-item2:202-item3:0
получил:  item1:303-item2:202-item3:0
получил:  item1:404-item2:202-item3:0
получил:  item1:404-item2:202-item3:303
получил:  item1:404-item2:404-item3:303
получил:  item1:505-item2:404-item3:303
получил:  item1:606-item2:404-item3:303
combineLatest поток закрыт
 */
var combineLatestParser = function (item1, item2, item3) { return "item1:" + item1 + "-item2:" + item2 + "-item3:" + item3; };
var combineLatest1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }));
var combineLatest2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202; }));
var combineLatest3$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303; }));
// const combineLatest$ = combineLatest(combineLatest1$, combineLatest2$, combineLatest3$, combineLatestParser).pipe(
var combineLatest$ = rxjs_1.combineLatest(combineLatest1$, combineLatest2$, combineLatest3$, combineLatestParser).pipe(operators_1.take(9));
// combineLatest$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('combineLatest поток закрыт'));
/**
 * concatAll
 * Возвращает все значения всех потоков
 * Группирует значения по потокам
 *

Hello World!
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  404-1
получил:  505-1
получил:  606-1
получил:  707-1
получил:  808-1
получил:  909-1
получил:  0-2
получил:  202-2
получил:  404-2
получил:  606-2
получил:  808-2
получил:  0-3
получил:  303-3
получил:  606-3
combineAll поток закрыт
 */
var concatAll1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var concatAll2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var concatAll3$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var concatAll$ = rxjs_1.of(concatAll1$, concatAll2$, concatAll3$).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.concatAll());
// concatAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('combineAll поток закрыт'));
/**
 * exhaust
 * Возвращает значения потока, который первый их имитировал. Остальные потоки блокируются

Hello World!
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  404-1
получил:  505-1
получил:  606-1
получил:  707-1
получил:  808-1
получил:  909-1
exhaust поток закрыт
 */
var exhaust1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var exhaust2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var exhaust3$ = rxjs_1.interval(2000).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var exhaust4$ = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(2000));
var exhaust$ = rxjs_1.of(exhaust1$, exhaust2$, exhaust3$, exhaust4$).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.exhaust());
// exhaust$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('exhaust поток закрыт'));
/**
 * mergeAll
 * ВОзвращает все значения всех потоков
 * Комбинирует по времени получения

Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:  0-1
получил:  0-2
получил:  101-1
получил:  0-3
получил:  202-1
получил:  202-2
получил:  303-1
получил:  404-1
получил:  303-3
получил:  404-2
получил:  505-1
получил:  606-1
получил:  606-2
получил:  707-1
получил:  606-3
получил:  808-1
получил:  808-2
получил:  909-1
получил:  1
получил:  2
получил:  3
mergeAll поток закрыт
 */
var mergeAll1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var mergeAll2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var mergeAll3$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var mergeAll4$ = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(2000));
var mergeAll$ = rxjs_1.of(mergeAll1$, mergeAll2$, mergeAll3$, mergeAll4$).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.mergeAll());
// mergeAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('mergeAll поток закрыт'));
/**
 * withLatestFrom
 * Возвращает массив текущих(предыдущих/крайних) значений потоков после получения значений из основного(сигнального) потока источника
 * Возвращает из сигнального потока и из потоков аргументов withLatestFrom1, withLatestFrom2
 * Главный сигнальный поток - источник interval(303) withLatestFrom$
 *
получил:["0-3", "202-1", "0-2"]
получил:["303-3", "505-1", "404-2"]
получил:["606-3", "808-1", "606-2"]
 */
var withLatestFrom1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var withLatestFrom2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var withLatestFrom3$ = rxjs_1.of(1);
//const withLatestFrom3 = of(1).pipe(delay(1000));
var withLatestFrom$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }), operators_1.withLatestFrom(withLatestFrom1$, withLatestFrom2$, withLatestFrom3$));
withLatestFrom$.subscribe(function (item) { return logAll('получил: ', item); }, function (err) { return logAll('ошибка:', err); }, function () { return logAll('withLatestFrom поток закрыт'); });
//========================================================================================================================
//==================================================GROUPING VALUES=======================================================
//========================================================================================================================
//
/**
 * mergeMap
 * Преобразует каждый поток функцией аргументом mergeMapArray
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
var mergeMap1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var mergeMap2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var mergeMap3$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var mergeMap4$ = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(2000));
var mergeMapArray = function (item$) { return item$.pipe(operators_1.toArray()); };
var mergeMap$ = rxjs_1.of(mergeMap1$, mergeMap2$, mergeMap3$, mergeMap4$).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.mergeMap(mergeMapArray));
//mergeMap$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('mergeMap поток закрыт'));
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
//groupBy$.subscribe((item) => logAll(JSON.stringify(item)))
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
//pairwise$.subscribe((item) => logAll(JSON.stringify(item)))
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
var switchAll0$ = rxjs_1.of(1, 2, 3).pipe(operators_1.map(function (item) { return item * 1 + '-0'; }), operators_1.tap(logAll), operators_1.endWith('0-закрыт'));
var switchAll1$ = rxjs_1.interval(101).pipe(operators_1.delay(1000), operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(logAll), operators_1.endWith('1-закрыт'));
var switchAll2$ = rxjs_1.interval(202).pipe(operators_1.delay(1000), operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }), operators_1.tap(logAll), operators_1.endWith('2-закрыт'));
var switchAll$ = rxjs_1.of(switchAll0$, switchAll1$, switchAll2$).pipe(
// mergeAll(), // для проверки асинхронности
operators_1.switchAll());
// switchAll$.subscribe(item => logAll(item), null, () => logAll('switchAll поток закрыт'));
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
var zipAll0$ = rxjs_1.of(1, 2, 3).pipe(operators_1.map(function (item) { return item * 1 + '-0'; }), operators_1.tap(logAll), operators_1.endWith('0-закрыт'));
var zipAll1$ = rxjs_1.interval(101).pipe(operators_1.delay(1000), operators_1.take(5), operators_1.map(function (item) { return (item * 101 + 1000) + '-1'; }), operators_1.tap(logAll), operators_1.endWith('1-закрыт'));
var zipAll2$ = rxjs_1.interval(202).pipe(operators_1.delay(1000), operators_1.take(5), operators_1.map(function (item) { return (item * 202 + 1000) + '-2'; }), operators_1.tap(logAll), operators_1.endWith('2-закрыт'));
var zipAll$ = rxjs_1.of(zipAll0$, zipAll1$, zipAll2$).pipe(
// mergeAll(), // для проверки асинхронности
operators_1.zipAll());
// zipAll$.subscribe(item => logAll(item), null, () => logAll('zipAll поток закрыт'));
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
var repeat1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('1-закрыт'));
var repeat$ = repeat1$.pipe(operators_1.repeat(3));
// repeat$.subscribe(item => logAll(item), null, () => logAll('repeat поток закрыт'));
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
var repeatWhen1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var repeatWhenControl = function () { return rxjs_1.interval(202).pipe(operators_1.delay(1000), operators_1.take(3), operators_1.map(function (item) { return (item * 202 + 1000) + '-control'; }), operators_1.tap(logAll), operators_1.endWith('control-закрыт')); };
var repeatWhen$ = repeatWhen1$.pipe(operators_1.repeatWhen(repeatWhenControl));
// repeatWhen$.subscribe(item => logAll(item), null, () => logAll('repeatWhen поток закрыт'));
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
var ignoreElements1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
// mergeAll(), ignoreElements(),
operators_1.endWith('1-закрыт'));
var ignoreElementsErr2$ = rxjs_1.interval(404).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 404 + '-2'; }), operators_1.tap(logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.ignoreElements(), operators_1.endWith('err-закрыт'));
var ignoreElementsErr3$ = rxjs_1.interval(505).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 505 + '-3'; }), operators_1.tap(logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.ignoreElements(), operators_1.endWith('err2-закрыт'));
var ignoreElements$ = rxjs_1.of(ignoreElements1$, ignoreElementsErr2$, ignoreElementsErr3$).pipe(operators_1.mergeAll());
//ignoreElements$.subscribe(item => logAll(item), err => logAll('ошибка:', err), () => logAll('ignoreElements поток закрыт'));
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
var finalizeFn = function (item) { return function () { return logAll('fin', item); }; }; //обёртка для вывода названия завершающегося потока
var finalizeErr1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(logAll), 
// map(item => throwError(item)),
// mergeAll(),
operators_1.endWith('err1-закрыт'), operators_1.finalize(finalizeFn('1')));
var finalizeErr2$ = rxjs_1.interval(505).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 505 + '-2'; }), operators_1.tap(logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.endWith('err2-закрыт'), operators_1.finalize(finalizeFn('2')));
var finalize$ = rxjs_1.of(finalizeErr1$, finalizeErr2$).pipe(operators_1.mergeAll(), operators_1.finalize(finalizeFn('main')));
//finalize$.subscribe(item => logAll(item), err => logAll('ошибка:', err), () => logAll('finalize поток закрыт'));
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
var auditTime1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var auditTime2$ = rxjs_1.interval(202).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 202 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var auditTime$ = rxjs_1.of(auditTime1$, auditTime2$).pipe(operators_1.mergeAll(), operators_1.auditTime(500), operators_1.map(function (item) { return item + '-audit500'; }));
// auditTime$.subscribe(item => logAll(item), null, () => logAll('auditTime поток закрыт'));
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
var sampleTime1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var sampleTime5$ = rxjs_1.interval(505).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 505 + '-5'; }), 
// tap(logAll),
operators_1.endWith('5-закрыт'));
var sampleTime$ = rxjs_1.of(sampleTime1$, sampleTime5$).pipe(operators_1.mergeAll(), operators_1.sampleTime(500));
// sampleTime$.subscribe(item => logAll(item), null, () => logAll('sampleTime поток закрыт'));
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
var observeOn1$ = rxjs_1.interval(101).pipe(operators_1.take(3), 
// observeOn(asyncScheduler),
operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var observeOn2$ = rxjs_1.interval(102).pipe(operators_1.take(3), 
// observeOn(asapScheduler),
operators_1.map(function (item) { return item * 102 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var observeOn3$ = rxjs_1.interval(103).pipe(operators_1.take(3), 
// observeOn(queueScheduler),
operators_1.map(function (item) { return item * 103 + '-3'; }), 
// tap(logAll),
operators_1.endWith('3-закрыт'));
var observeOn4$ = rxjs_1.interval(104).pipe(operators_1.take(3), 
// observeOn(animationFrameScheduler),
operators_1.map(function (item) { return item * 104 + '-4'; }), 
// tap(logAll),
operators_1.endWith('4-закрыт'));
var observeOn5$ = rxjs_1.interval(105).pipe(
// без observeOn считается, что приоритет immediate
operators_1.take(3), operators_1.map(function (item) { return item * 105 + '-5'; }), 
// tap(logAll),
operators_1.endWith('5-закрыт'));
var observeOn$ = rxjs_1.of(observeOn1$, observeOn2$, observeOn3$, observeOn4$, observeOn5$).pipe(operators_1.mergeAll());
// observeOn$.subscribe(item => logAll(item), null, () => logAll('observeOn поток закрыт'));
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
var subscribeOn1$ = rxjs_1.interval(101).pipe(operators_1.take(3), 
// subscribeOn(asyncScheduler),
operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var subscribeOn2$ = rxjs_1.interval(102).pipe(operators_1.take(3), 
// subscribeOn(asapScheduler),
operators_1.map(function (item) { return item * 102 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var subscribeOn3$ = rxjs_1.interval(103).pipe(operators_1.take(3), 
// subscribeOn(queueScheduler),
operators_1.map(function (item) { return item * 103 + '-3'; }), 
// tap(logAll),
operators_1.endWith('3-закрыт'));
var subscribeOn4$ = rxjs_1.interval(104).pipe(operators_1.take(3), 
// subscribeOn(animationFrameScheduler),
operators_1.map(function (item) { return item * 104 + '-4'; }), 
// tap(logAll),
operators_1.endWith('4-закрыт'));
var subscribeOn5$ = rxjs_1.interval(105).pipe(
// без subscribeOn считается, что приоритет immediate
operators_1.take(3), operators_1.map(function (item) { return item * 105 + '-5'; }), 
// tap(logAll),
operators_1.endWith('5-закрыт'));
var subscribeOn$ = rxjs_1.of(subscribeOn1$, subscribeOn2$, subscribeOn3$, subscribeOn4$, subscribeOn5$).pipe(operators_1.mergeAll());
// subscribeOn$.subscribe(item => logAll(item), null, () => logAll('subscribeOn поток закрыт'));
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
var debounceSignalOver$ = rxjs_1.interval(2000);
var debounceSignalNorm$ = rxjs_1.interval(50);
var debounceSignalDynamic = function (item) {
    var TIMER = 5; // interval имитирует 0,1,2,3,4...
    if (item > TIMER) {
        return rxjs_1.interval(500);
    }
    else {
        return rxjs_1.interval(0);
    }
};
var debounceOver$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.debounce(function (item) { return debounceSignalOver$; }), operators_1.map(function (item) { return item * 101 + '-over'; }), 
// tap(logAll),
operators_1.endWith('over-закрыт'));
var debounceNorm$ = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.debounce(function (item) { return debounceSignalNorm$; }), operators_1.map(function (item) { return item * 102 + '-norm'; }), 
// tap(logAll),
operators_1.endWith('norm-закрыт'));
var debounceDynamic$ = rxjs_1.interval(103).pipe(operators_1.take(10), operators_1.debounce(function (item) { return debounceSignalDynamic(item); }), operators_1.map(function (item) { return item * 103 + '-dynamic'; }), 
// tap(logAll),
operators_1.endWith('dynamic-закрыт'));
var debounce$ = rxjs_1.of(debounceOver$, debounceNorm$, debounceDynamic$).pipe(operators_1.mergeAll());
//debounce$.subscribe(item => logAll(item + '-$'), null, () => logAll('debounce поток закрыт'));
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
var debounceTimeOver$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-over'; }), 
// tap(logAll),
operators_1.debounceTime(1000), operators_1.endWith('over-закрыт'));
var debounceTimeNorm$ = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102 + '-norm'; }), 
// tap(logAll),
operators_1.debounceTime(50), operators_1.endWith('norm-закрыт'));
var debounceTime$ = rxjs_1.of(debounceTimeOver$, debounceTimeNorm$).pipe(operators_1.mergeAll());
// debounceTime$.subscribe(item => logAll(item + '-$'), null, () => logAll('debounceTime поток закрыт'));
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
var delay1$ = rxjs_1.interval(101).pipe(operators_1.delay(1000), operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var delay2$ = rxjs_1.interval(102).pipe(operators_1.delay(new Date(Date.now() + 1000)), operators_1.take(3), operators_1.map(function (item) { return item * 102 + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var delay3$ = rxjs_1.interval(103).pipe(
// контрольный поток без задержек
operators_1.take(10), operators_1.map(function (item) { return item * 103 + '-3'; }), 
// tap(logAll),
operators_1.endWith('3-закрыт'));
var delay$ = rxjs_1.of(delay1$, delay2$, delay3$).pipe(operators_1.mergeAll());
//delay$.subscribe(item => logAll(item + '-$'), null, () => logAll('delay поток закрыт'));
/**
 * delayWhen
 * Задерживает имитацию значений потока на указанный интервал
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
var delayWhen1$ = rxjs_1.interval(101).pipe(
// контрольный поток без задержек
operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var delayWhen2$ = rxjs_1.interval(102).pipe(operators_1.delayWhen(function (item, index) { return rxjs_1.interval(200); }), operators_1.take(10), operators_1.map(function (item) { return (item * 102 + 200) + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var delayWhen$ = rxjs_1.of(delayWhen1$, delayWhen2$).pipe(operators_1.mergeAll());
//delayWhen$.subscribe(item => logAll(item + '-$'), null, () => logAll('delayWhen поток закрыт'));
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
var throttleTime1$ = rxjs_1.interval(101).pipe(
// контрольный поток без задержек
operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var throttleTime2$ = rxjs_1.interval(102).pipe(operators_1.throttleTime(300), operators_1.take(10), operators_1.map(function (item) { return (item * 102 + 300) + '-2'; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var throttleTime$ = rxjs_1.of(throttleTime1$, throttleTime2$).pipe(operators_1.mergeAll());
//throttleTime$.subscribe(item => logAll(item + '-$'), null, () => logAll('throttleTime поток закрыт'));
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
var timeInterval1$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.timeInterval(), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var timeInterval$ = rxjs_1.of(timeInterval1$).pipe(operators_1.mergeAll());
//timeInterval$.subscribe(item => logAll(JSON.stringify(item) + '-$'), null, () => logAll('timeInterval поток закрыт'));
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
var timestamp1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.timestamp(), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var timestamp2$ = rxjs_1.interval(102).pipe(
// добавим немного человекочитаемости к дате
operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.timestamp(), operators_1.map(function (item) { return { value: item.value, timestamp: new Date(item.timestamp) }; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var timestamp$ = rxjs_1.of(timestamp1$, timestamp2$).pipe(operators_1.mergeAll());
//timestamp$.subscribe(item => logAll(JSON.stringify(item) + '-$'), null, () => logAll('timestamp поток закрыт'));
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
var concatMap1$ = rxjs_1.interval(101).pipe(
// контрольный поток
operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var concatMap2$ = rxjs_1.interval(102).pipe(
// просто меняем значение на массив
operators_1.take(5), operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.concatMap(function (item, index) { return [item, item + 1000]; }), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var concatMap3$ = rxjs_1.interval(103).pipe(
// добавляем задержку
operators_1.take(5), operators_1.map(function (item) { return item * 103 + '-3'; }), operators_1.concatMap(function (item, index) { return rxjs_1.of([item, 'delay200']).pipe(operators_1.delay(200)); }), 
// tap(logAll),
operators_1.endWith('3-закрыт'));
var concatMap$ = rxjs_1.of(concatMap1$, concatMap2$, concatMap3$).pipe(operators_1.mergeAll());
// concatMap$.subscribe(item => logAll(JSON.stringify(item) + '-$'), null, () => logAll('concatMap поток закрыт'));
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
var concatMapTo1$ = rxjs_1.interval(101).pipe(
// контрольный поток
operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var concatMapToInternal$ = rxjs_1.interval(102).pipe(
// внутренний поток для concatMap
operators_1.take(3), operators_1.map(function (item) { return item * 102 + '-Internal'; }), 
// tap(logAll),
operators_1.endWith('Internal-закрыт'));
var concatMapToSignal$ = rxjs_1.interval(103).pipe(
// имитируем значения из внутреннего потока 
operators_1.take(5), operators_1.map(function (item) { return item * 103 + '-Signal'; }), operators_1.concatMapTo(concatMapToInternal$), 
// tap(logAll),
operators_1.endWith('Signal-закрыт'));
var concatMapTo$ = rxjs_1.of(concatMapTo1$, concatMapToSignal$).pipe(operators_1.mergeAll());
// concatMapTo$.subscribe(item => logAll(item + '-$'), null, () => logAll('concatMapTo поток закрыт'));
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
var defaultIfEmpty1$ = rxjs_1.interval(103).pipe(
// имитируем значения из внутреннего потока 
operators_1.take(0), operators_1.map(function (item) { return item * 103 + '-1'; }), 
// tap(logAll),
operators_1.defaultIfEmpty(defaultIfEmptyInternal), operators_1.endWith('1-закрыт'));
var defaultIfEmpty$ = rxjs_1.of(defaultIfEmpty1$).pipe(operators_1.mergeAll());
//defaultIfEmpty$.subscribe(item => logAll(item + '-$'), null, () => logAll('defaultIfEmpty поток закрыт'));
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
var endWith1$ = rxjs_1.interval(101).pipe(operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.take(3), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var endWith2$ = rxjs_1.interval(102).pipe(
//неправильное положение оператора
operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.endWith('2-закрыт'), operators_1.take(3)
// tap(logAll),
);
var endWith$ = rxjs_1.of(endWith1$, endWith2$).pipe(operators_1.mergeAll());
//endWith$.subscribe(item => logAll(item + '-$'), null, () => logAll('endWith поток закрыт'));
/**
 * startWith
 * Пишет значения в поток сразу после его открытия
 *
 * Hello World!
1-открыт-$
2-открыт-$
0-1-$
0-2-$
101-1-$
1-закрыт-$
102-2-$
204-2-$
2-закрыт-$
startWith поток закрыт
 */
var startWith1$ = rxjs_1.interval(101).pipe(operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.startWith('1-открыт'), operators_1.take(3), operators_1.endWith('1-закрыт'));
var startWith2$ = rxjs_1.interval(102).pipe(
//неправильное положение оператора
operators_1.map(function (item) { return item * 102 + '-2'; }), operators_1.take(3), operators_1.endWith('2-закрыт'), operators_1.startWith('2-открыт'));
var startWith$ = rxjs_1.of(startWith1$, startWith2$).pipe(operators_1.mergeAll());
//startWith$.subscribe(item => logAll(item + '-$'), null, () => logAll('startWith поток закрыт'));
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
//exhaustMap$.subscribe(item => logAll(item), null, ()=> logAll('exhaustMap поток закрыт'));
/**
 * expand
 * рекурсивная обработка значений
 *
 * Hello World!
0-$
100-$
200-$
300-$
400-$
500-$
1-$
101-$
201-$
301-$
401-$
501-$
2-$
102-$
202-$
302-$
402-$
502-$
2-закрыт-$
expand поток закрыт
 */
var parserRecursive1 = function (item) {
    if (item < 500) {
        return rxjs_1.of(item + 100);
    }
    else {
        return rxjs_1.empty();
    }
};
var expand1$ = rxjs_1.interval(501).pipe(operators_1.take(3), operators_1.expand(parserRecursive1), operators_1.endWith('2-закрыт'));
var expand$ = rxjs_1.of(expand1$).pipe(operators_1.mergeAll());
//expand$.subscribe(item => logAll(item + '-$'), null, () => logAll('expand поток закрыт'));
/**
 * map
 * описан в начале
 */
/**
 * mapTo
 * внешний поток значений - сигнальный, на каждое значение имитируется внутренняя функция
 *
 * Hello World!
0-1-$
mapToInternal-$
101-1-$
mapToInternal-$
202-1-$
mapToInternal-$
Signal-закрыт-$
303-1-$
404-1-$
1-закрыт-$
mapTo поток закрыт
 */
var mapTo1$ = rxjs_1.interval(101).pipe(
// контрольный поток
operators_1.take(5), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var mapToSignal$ = rxjs_1.interval(103).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 103 + '-Signal'; }), operators_1.mapTo('mapToInternal'), 
// tap(logAll),
operators_1.endWith('Signal-закрыт'));
var mapTo$ = rxjs_1.of(mapTo1$, mapToSignal$).pipe(operators_1.mergeAll());
//mapTo$.subscribe(item => logAll(item + '-$'), null, () => logAll('mapTo поток закрыт'));
/**
 * scan
 * позволяет аккумулировать значения. Записывает в аккумулятор текущий возврат функции scanAccumulator
 *
 * Hello World!
time: 0; item: 0; accumulator: 0
0-$
time: 101; item: 1; accumulator: 0
1-$
time: 202; item: 2; accumulator: 1
3-$
time: 303; item: 3; accumulator: 3
6-$
time: 404; item: 4; accumulator: 6
10-$
1-закрыт-$
 */
var scanAccumulator = function (accumulator, item) {
    logAll("time: " + item * 101 + "; item: " + item + "; accumulator: " + accumulator);
    return item + accumulator;
};
var scanAccumulatorInitial = 0;
var scan1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.scan(scanAccumulator, scanAccumulatorInitial), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var scan$ = rxjs_1.of(scan1$).pipe(operators_1.mergeAll());
//scan$.subscribe(item => logAll(item + '-$'), null, () => logAll('scan поток закрыт'));
/**
 * mergeScan
 * позволяет аккумулировать значения. Записывает в аккумулятор текущий возврат функции scanAccumulator
 * имитирует наблюдаемый поток mergeScanInternal
 *
 * Hello World!
time: 0; item: 0; accumulator: 0
0-internal-$
11-internal-$
22-internal-$
1-закрыт-$
time: 101; item: 1; accumulator: 1-закрыт
0-internal-$
11-internal-$
22-internal-$
1-закрыт-$
time: 202; item: 2; accumulator: 1-закрыт
0-internal-$
11-internal-$
22-internal-$
1-закрыт-$
time: 303; item: 3; accumulator: 1-закрыт
0-internal-$
11-internal-$
22-internal-$
1-закрыт-$
time: 404; item: 4; accumulator: 1-закрыт
0-internal-$
11-internal-$
22-internal-$
1-закрыт-$
2-закрыт-$
mergeScan поток закрыт

 */
var mergeScanInternal$ = rxjs_1.interval(11).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 11 + '-internal'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var mergeScanAccumulator = function (accumulator, item) {
    logAll("time: " + item * 101 + "; item: " + item + "; accumulator: " + accumulator);
    // return of(item + accumulator)
    return mergeScanInternal$;
};
var mergeScanAccumulatorInitial = 0;
var mergeScan1$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.mergeScan(mergeScanAccumulator, mergeScanAccumulatorInitial), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var mergeScan$ = rxjs_1.of(mergeScan1$).pipe(operators_1.mergeAll());
//mergeScan$.subscribe(item => logAll(item + '-$'), null, () => logAll('mergeScan поток закрыт'));
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
//pluck('nested','triple'), //возвращаем в поток только item.nested.triple
operators_1.pluck('double') //возвращаем в поток только item.double
);
//pluck$.subscribe(item => logAll(item), null, ()=> logAll('pluck поток закрыт'));
/**
 * reduce
 * позволяет аккумулировать значения. Записывает в аккумулятор текущий возврат функции scanAccumulator
 * возвращает итоговое значение один раз, когда входной поток завершится
 *
Hello World!
time: 0; item: 0; accumulator: 0
time: 101; item: 1; accumulator: 0
time: 202; item: 2; accumulator: 1
time: 303; item: 3; accumulator: 3
time: 404; item: 4; accumulator: 6
10-$
1-закрыт-$
reduce поток закрыт
 */
var reduceAccumulator = function (accumulator, item) {
    logAll("time: " + item * 101 + "; item: " + item + "; accumulator: " + accumulator);
    return item + accumulator;
};
var reduceAccumulatorInitial = 0;
var reduce1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.reduce(reduceAccumulator, reduceAccumulatorInitial), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var reduce$ = rxjs_1.of(reduce1$).pipe(operators_1.mergeAll());
//reduce$.subscribe(item => logAll(item + '-$'), null, () => logAll('reduce поток закрыт'));
/**
 * switchMap
 * после каждого нового значения входящего потока interval(302)
 * выполняет функцию аргумент switchMapFork1$, который возвращает новый поток
 * предыдущий поток из switchMapFork1$ закрывается, потому рекомендуется только для чтения значений
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
//switchMap$.subscribe(item => logAll(item), null, ()=> logAll('switchMap поток закрыт'));
/**
 * mergeMapTo
 * Выводит вместо входящего значения потока наблюдаемый поток mergeMapToInternal
 *
Hello World!
Observable {
  _isScalar: false,
  source:
   Observable {
     _isScalar: false,
     source: Observable { _isScalar: false, _subscribe: [Function] },
     operator: TakeOperator { total: 10 } },
  operator: MapOperator { project: [Function], thisArg: undefined } }
Observable {
  _isScalar: false,
  source:
   Observable {
     _isScalar: false,
     source: Observable { _isScalar: false, _subscribe: [Function] },
     operator: TakeOperator { total: 5 } },
  operator: MapOperator { project: [Function], thisArg: undefined } }
Observable {
  _isScalar: false,
  source:
   Observable {
     _isScalar: false,
     source: Observable { _isScalar: false, _subscribe: [Function] },
     operator: TakeOperator { total: 3 } },
  operator: MapOperator { project: [Function], thisArg: undefined } }
Observable {
  _isScalar: false,
  source: Observable { _isScalar: false, _subscribe: [Function] },
  operator:
   DelayOperator {
     delay: 2000,
     scheduler:
      AsyncScheduler {
        SchedulerAction: [Function: AsyncAction],
        now: [Function],
        actions: [],
        active: false,
        scheduled: undefined } } }
получил:  0-internal
получил:  0-internal
получил:  0-internal
получил:  0-internal
получил:  11-internal
получил:  11-internal
получил:  11-internal
получил:  11-internal
получил:  22-internal
получил:  22-internal
получил:  22-internal
получил:  22-internal
mergeMapTo поток закрыт
 */
var mergeMapTo1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var mergeMapTo2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var mergeMapTo3$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var mergeMapTo4$ = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(2000));
var mergeMapToInternal$ = rxjs_1.interval(11).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 11 + '-internal'; }));
var mergeMapTo$ = rxjs_1.of(mergeMapTo1$, mergeMapTo2$, mergeMapTo3$, mergeMapTo4$).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.mergeMapTo(mergeMapToInternal$));
// mergeMapTo$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('mergeMapTo поток закрыт'));
/**
 * switchMapTo
 * Выводит вместо входящего значения потока наблюдаемый поток switchMapToInternal
 * закрывает предыдущий поток, если на вход пришёл новый, т.е. значения теряются.
 * Рекомендуется только для чтения
 *
 * Hello World!
Observable {
  _isScalar: false,
  source:
   Observable {
     _isScalar: false,
     source: Observable { _isScalar: false, _subscribe: [Function] },
     operator: TakeOperator { total: 10 } },
  operator: MapOperator { project: [Function], thisArg: undefined } }
Observable {
  _isScalar: false,
  source:
   Observable {
     _isScalar: false,
     source: Observable { _isScalar: false, _subscribe: [Function] },
     operator: TakeOperator { total: 5 } },
  operator: MapOperator { project: [Function], thisArg: undefined } }
Observable {
  _isScalar: false,
  source:
   Observable {
     _isScalar: false,
     source: Observable { _isScalar: false, _subscribe: [Function] },
     operator: TakeOperator { total: 3 } },
  operator: MapOperator { project: [Function], thisArg: undefined } }
Observable {
  _isScalar: false,
  source: Observable { _isScalar: false, _subscribe: [Function] },
  operator:
   DelayOperator {
     delay: 2000,
     scheduler:
      AsyncScheduler {
        SchedulerAction: [Function: AsyncAction],
        now: [Function],
        actions: [],
        active: false,
        scheduled: undefined } } }
получил:  0-internal
получил:  11-internal
получил:  22-internal
switchMapTo поток закрыт
 */
var switchMapTo1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }));
var switchMapTo2$ = rxjs_1.interval(202).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 202 + '-2'; }));
var switchMapTo3$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 303 + '-3'; }));
var switchMapTo4$ = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(2000));
var switchMapToInternal$ = rxjs_1.interval(11).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 11 + '-internal'; }));
var switchMapTo$ = rxjs_1.of(switchMapTo1$, switchMapTo2$, switchMapTo3$, switchMapTo4$).pipe(operators_1.tap(logAll), //возвращает три потока наблюдателей
operators_1.switchMapTo(switchMapToInternal$));
//switchMapTo$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('switchMapTo поток закрыт'));
/**
 * materialize
 * Конвертирует входное(имитированное) значение потока в объект-оповещение (emission object to notification object)
 * Указывается тип оповещения: next, close, error
 * Используется для сохранения(сериализации) в json
 *
 * Hello World!
получил:  Notification {
  kind: 'N',
  value:
   Observable {
     _isScalar: false,
     source: Observable { _isScalar: false, _subscribe: [Function] },
     operator:
      MergeMapOperator { project: [Function: identity], concurrent: 1 } },
  error: undefined,
  hasValue: true }
получил:  Notification {
  kind: 'N',
  value:
   Observable {
     _isScalar: false,
     source: Observable { _isScalar: false, _subscribe: [Function] },
     operator: MapOperator { project: [Function], thisArg: undefined } },
  error: undefined,
  hasValue: true }
получил:  Notification { kind: 'C', value: undefined, error: undefined, hasValue: false }
materialize поток закрыт
 */
var materialize1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('1-закрыто'));
var materialize2$ = rxjs_1.of(1).pipe(operators_1.map(function (item) { return rxjs_1.throwError('ошибка'); }));
var materialize$ = rxjs_1.of(materialize1$, materialize2$).pipe(
// tap(logAll),
operators_1.materialize());
// materialize$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('materialize поток закрыт'));
/**
 * dematerialize
 * Конвертирует объект-оповещение в значение
 * Используется для восстановления(десериализации) сохранённого ранее в json значения
 *
 *Hello World!
получил:  Observable { _isScalar: false, _subscribe: [Function] }//<-- это ошибка
получил:  2-закрыто
получил:  Notification { kind: 'N', value: 0, error: undefined, hasValue: true }
получил:  Notification { kind: 'C', value: undefined, error: undefined, hasValue: false }
получил:  3-закрыто
получил:  0-1
получил:  101-1
получил:  202-1
получил:  1-закрыто
dematerialize поток закрыт
 */
var dematerialize1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('1-закрыто'));
var dematerialize2$ = rxjs_1.of(1).pipe(operators_1.map(function (item) { return rxjs_1.throwError('ошибка'); }), operators_1.endWith('2-закрыто'));
var dematerialize3$ = rxjs_1.of(rxjs_1.Notification.createNext(0), rxjs_1.Notification.createComplete()).pipe(operators_1.endWith('3-закрыто'));
var dematerialize$ = rxjs_1.of(dematerialize1$, dematerialize2$, dematerialize3$).pipe(
// tap(logAll),
operators_1.materialize(), operators_1.dematerialize(), operators_1.mergeAll());
//dematerialize$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('dematerialize поток закрыт'));
//========================================================================================================================
//==================================================MULTICAST=============================================================
//========================================================================================================================
//
/**
 * multicast
 * Конвертирует поток в ConnectableObservable
 * Перенаправляет входящие потоки multicastIn в специальный поток(прокси) multicastProxy
 * Позволяет одновременно стартовать все потоки через прокси методом connect()
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * ! в примере нет эмуляции задержки старта одного из входных потоков
 *
 * https://www.learnrxjs.io/operators/multicasting/multicast.html
 * https://blog.angularindepth.com/rxjs-multicasts-secret-760e1a2b176e
 * http://reactivex.io/documentation/operators/publish.html
 *
 *

Hello World!
0-поток1-подписка1
0-поток2-подписка1
101-поток1-подписка1
102-поток2-подписка1
202-поток1-подписка1
поток1-закрыто-подписка1
204-поток2-подписка1
поток2-закрыто-подписка1
подписка1-закрыта
0-поток1-подписка2
0-поток2-подписка2
101-поток1-подписка2
102-поток2-подписка2
202-поток1-подписка2
поток1-закрыто-подписка2
204-поток2-подписка2
поток2-закрыто-подписка2
подписка2-закрыта
 */
var multicastIn1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-поток1'; }), operators_1.endWith('поток1-закрыто'));
var multicastIn2$ = rxjs_1.interval(102).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 102 + '-поток2'; }), operators_1.endWith('поток2-закрыто'));
var multicastProxy$ = new rxjs_1.Subject();
// традиционный пример, который работает без костылей
var multicastObserver = function (observer) {
    logAll('новый подписчик!');
    var countItem = 0;
    var interval1 = setInterval(function () {
        logAll('генерируем: ' + countItem);
        if (countItem <= 3) {
            observer.next(countItem++);
        }
        else {
            logAll('остановка генератора multicast');
            clearInterval(interval1);
        }
    }, 101);
};
var multicast$ = new rxjs_1.Observable(multicastObserver).pipe(
// const multicast$ = publish()(of(multicastIn1$, multicastIn2$).pipe( // пример костыля - в этом случае .connect() не работает как надо, потоки стартуют раньше .connect()
// tap(logAll),
operators_1.multicast(multicastProxy$));
multicast$.subscribe(function (item) { return logAll(item + '-подписка1'); }, null, function () { return logAll('multicast подписка1-закрыта'); });
multicast$.pipe(operators_1.delay(1000)).subscribe(function (item) { return logAll(item + '-подписка2'); }, null, function () { return logAll('multicast подписка2-закрыта'); });
// multicast$.connect();
/**
 * share
 * подписывается на входящий поток share1, когда подписываются на него share$
 * отписывается, если все отписались от него share$
 * делает поток горячим - новые подписчики получают значения только с момента своей подписки
 * используется для websocket
 *
 *
Hello World!
получил1:  0-1
получил1:  101-1
получил1:  202-1
получил1:  303-1
получил1:  404-1
получил1:  505-1
получил1:  606-1
получил2:  606-1 // вместо 0 получили 606
получил1:  707-1
получил2:  707-1
получил1:  808-1
получил2:  808-1
получил1:  909-1
получил2:  909-1
получил1:  1-закрыто
получил2:  1-закрыто
share1 поток закрыт
share2 поток закрыт
 */
var share1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('1-закрыто'));
var share$ = share1$.pipe(operators_1.share());
//!!! контрольный подписчик
// share$.subscribe((item) => logAll('получил1: ', item), null, () => logAll('share1 поток закрыт'));
var shareTimeout = setTimeout(function () {
    // опаздываем на 700
    // share$.subscribe((item) => logAll('получил2: ', item), null, () => logAll('share2 поток закрыт'));
    clearInterval(shareTimeout);
}, 700);
/**
 * shareReply
 * подписывается на входящий поток share1, когда подписываются на него share$
 * отписывается, если все отписались от него share$
 * делает поток горячим - новые подписчики получают значения только с момента своей подписки, включая буфер из указанного количества значений shareReplayBufferSize
 * используется для websocket
 *
 * Hello World!
получил1:  0-1
получил1:  101-1
получил1:  202-1
получил1:  303-1
получил1:  404-1
получил1:  505-1
получил2:  303-1 // вместо 606 получили 303
получил2:  404-1
получил2:  505-1
получил1:  606-1
получил2:  606-1
получил1:  707-1
получил2:  707-1
получил1:  808-1
получил2:  808-1
получил1:  909-1
получил2:  909-1
получил1:  1-закрыто
получил2:  1-закрыто
shareReplay1 поток закрыт
shareReplay2 поток закрыт
 */
var shareReplay1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('1-закрыто'));
var shareReplayBufferSize = 3;
var shareReplay$ = shareReplay1$.pipe(operators_1.shareReplay(shareReplayBufferSize));
//!!! контрольный подписчик
// shareReplay$.subscribe((item) => logAll('получил1: ', item), null, () => logAll('shareReplay1 поток закрыт'));
var shareReplayTimeout = setTimeout(function () {
    // опаздываем на 700
    // shareReplay$.subscribe((item) => logAll('получил2: ', item), null, () => logAll('shareReplay2 поток закрыт'));
    clearInterval(shareReplayTimeout);
}, 700);
/**
 * publish
 * Конвертирует поток в ConnectableObservable
 * Позволяет одновременно стартовать все потоки через методом connect()
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * ! в примере нет эмуляции задержки старта одного из входных потоков
 * в отличии от multicast нет аргумента-прокси
 *
 *
Hello World!
новый подписчик!
генерируем: 0
0-подписка1
генерируем: 1
1-подписка1
генерируем: 2
2-подписка1
генерируем: 3
3-подписка1
генерируем: 4
остановка генератора
0-подписка2
1-подписка2
2-подписка2
3-подписка2

 */
// традиционный подход, который работает без костылей
var publishObserver = function (observer) {
    logAll('новый подписчик!');
    var countItem = 0;
    var interval1 = setInterval(function () {
        logAll('генерируем: ' + countItem);
        if (countItem <= 3) {
            observer.next(countItem++);
        }
        else {
            logAll('остановка генератора publish');
            clearInterval(interval1);
        }
    }, 101);
};
var publish$ = new rxjs_1.Observable(publishObserver).pipe(
// tap(logAll),
operators_1.publish());
publish$.subscribe(function (item) { return logAll(item + '-подписка1'); }, null, function () { return logAll('publish подписка1-закрыта'); });
publish$.pipe(operators_1.delay(1000)).subscribe(function (item) { return logAll(item + '-подписка2'); }, null, function () { return logAll('publish подписка2-закрыта'); });
// publish$.connect();
/**
 * publishBehavior
 * Конвертирует поток в ConnectableObservable
 * Имитирует вначале итогового потока указанное значение publishBehaviorInitialValue
 * Позволяет одновременно стартовать все потоки через методом connect()
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * ! имитирует  указанное значение publishBehaviorInitialValue раньше .connect
 *
 * Hello World!
новый подписчик!
start-подписка1
новый подписчик!
генерируем: 0
0-подписка1
генерируем: 0
0-подписка1
генерируем: 1
1-подписка1
генерируем: 1
1-подписка1
генерируем: 2
2-подписка1
генерируем: 2
2-подписка1
генерируем: 3
3-подписка1
генерируем: 3
3-подписка1
генерируем: 4
остановка генератора
генерируем: 4
остановка генератора
start-подписка2
0-подписка2
0-подписка2
1-подписка2
1-подписка2
2-подписка2
2-подписка2
3-подписка2
3-подписка2
 */
var publishBehaviorObserver = function (observer) {
    logAll('новый подписчик!');
    var countItem = 0;
    var interval1 = setInterval(function () {
        logAll('генерируем: ' + countItem);
        if (countItem <= 3) {
            observer.next(countItem++);
        }
        else {
            logAll('остановка генератора publishBehavior');
            clearInterval(interval1);
        }
    }, 101);
};
var publishBehaviorInitialValue = 'publishBehaviorInitialValue';
var publishBehavior$ = new rxjs_1.Observable(publishBehaviorObserver).pipe(
// tap(logAll),
operators_1.publishBehavior(publishBehaviorInitialValue));
// ! раскомментировать 3 строки
// publishBehavior$.subscribe((item) => logAll(item + '-подписка1'), null, () => logAll('publishBehavior подписка1-закрыта'));
// publishBehavior$.pipe(delay(1000)).subscribe((item) => logAll(item + '-подписка2'), null, () => logAll('publishBehavior подписка2-закрыта'));
// publishBehavior$.connect();
/**
 * publishLast
 * Конвертирует поток в ConnectableObservable
 * Имитирует только крайнее значение входного потока
 * Позволяет одновременно стартовать все потоки через методом connect()
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * ! работает с pipe, но требуется указывать as ConnectableObservable<any>;
 *
 *
Hello World!
1-закрыт-подписка1
1-закрыт-подписка2
publishLast подписка1-закрыта
publishLast подписка2-закрыта
 */
var publishLast1$ = rxjs_1.interval(101).pipe(
// контрольный поток
operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var publishLast$ = rxjs_1.of(publishLast1$).pipe(
// tap(logAll),
operators_1.mergeAll(), operators_1.publishLast());
publishLast$.subscribe(function (item) { return logAll(item + '-подписка1'); }, null, function () { return logAll('publishLast подписка1-закрыта'); });
var publishLastTimeout = setInterval(function () {
    publishLast$.subscribe(function (item) { return logAll(item + '-подписка2'); }, null, function () { return logAll('publishLast подписка2-закрыта'); });
    clearInterval(publishLastTimeout);
}, 300);
// publishLast$.connect();
/**
 * publishReplay
 * Конвертирует поток в ConnectableObservable
 * Позволяет одновременно стартовать все потоки через методом connect()
 * После .connect имитирует все значения входного потока для подписчика
 * Если .connect после закрытия входного потока, то имитирует только указанное количество значений publishReplayCount входного потока
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 *
 * Hello World!
0-1-подписка1
101-1-подписка1
0-1-подписка2
101-1-подписка2
202-1-подписка1
202-1-подписка2
1-закрыт-подписка1
1-закрыт-подписка2
publishReplay подписка1-закрыта
publishReplay подписка2-закрыта
0-1-подписка3
101-1-подписка3
202-1-подписка3
1-закрыт-подписка3
publishReplay подписка3-закрыта
 */
var publishReplay1$ = rxjs_1.interval(101).pipe(
// контрольный поток
operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var publishReplay$ = rxjs_1.of(publishReplay1$).pipe(
// tap(logAll),
operators_1.mergeAll(), operators_1.publishReplay());
publishReplay$.subscribe(function (item) { return logAll(item + '-подписка1'); }, null, function () { return logAll('publishReplay подписка1-закрыта'); });
var publishReplayTimeout1 = setInterval(function () {
    publishReplay$.subscribe(function (item) { return logAll(item + '-подписка2'); }, null, function () { return logAll('publishReplay подписка2-закрыта'); });
    clearInterval(publishReplayTimeout1);
}, 300);
var publishReplayTimeout2 = setInterval(function () {
    publishReplay$.subscribe(function (item) { return logAll(item + '-подписка3'); }, null, function () { return logAll('publishReplay подписка3-закрыта'); });
    clearInterval(publishReplayTimeout2);
}, 500);
// publishReplay$.connect();
//========================================================================================================================
//==================================================UTILITY===============================================================
//========================================================================================================================
//
/**
 * count
 * Выводит количество значений имитированных входным потоком
 *
 * Hello World!
получил:  4
count поток закрыт
 */
var count1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('1-закрыто'));
var count$ = count1$.pipe(
// tap(logAll),
operators_1.count());
// count$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('count поток закрыт'));
/**
 * every
 * проверяет значения входного потока функцией isEveryLess400
 * если true, выводит после закрытия потока true
 * если поймал false, выводит false и отписывается
 *
 * Hello World!
0
isLess400 0
0
isLess400 0
101
isLess400 101
202
isLess400 202
получил:  true
получил:  1-закрыто
202
isLess400 202
404
isLess400 404
получил:  false
получил:  2-закрыто
every поток закрыт
 */
var isEveryLess400 = function (item) {
    logAll('isLess400', item);
    return item < 400;
};
var every1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101; }), operators_1.tap(logAll), operators_1.every(isEveryLess400), operators_1.endWith('1-закрыто'));
var every2$ = rxjs_1.interval(202).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 202; }), operators_1.tap(logAll), operators_1.every(isEveryLess400), operators_1.endWith('2-закрыто'));
var every$ = rxjs_1.of(every1$, every2$).pipe(
// tap(logAll),
operators_1.mergeAll());
// every$.subscribe((item) => logAll('получил: ', item), null, () => logAll('every поток закрыт'));
/**
 * isEmpty
 * имитирует true, если входной поток закрыт без значений
 * имитирует false и отписывается, если получено значение
 *
 * Hello World!
получил:  true
получил:  1-закрыто
0
получил:  false
получил:  2-закрыто
isEmpty поток закрыт
 */
var isEmpty1$ = rxjs_1.interval(101).pipe(operators_1.take(0), operators_1.map(function (item) { return item * 101; }), operators_1.tap(logAll), operators_1.isEmpty(), operators_1.endWith('1-закрыто'));
var isEmpty2$ = rxjs_1.interval(202).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 202; }), operators_1.tap(logAll), operators_1.isEmpty(), operators_1.endWith('2-закрыто'));
var isEmpty$ = rxjs_1.of(isEmpty1$, isEmpty2$).pipe(
// tap(logAll),
operators_1.mergeAll());
// isEmpty$.subscribe((item) => logAll('получил: ', item), null, () => logAll('isEmpty поток закрыт'));
/**
 * sequenceEqual
 * сравнивает значения входного потока и потока-аргумента
 * время игнорируется
 *
 * Hello World!
0-1
0-2
0-2другой
получил:  false
получил:  2-закрыто
0-1
101-1
202-1
101-1
202-1
получил:  true
получил:  1-закрыто
sequenceEqual поток закрыт
 */
var sequenceEqual1Control$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(logAll));
var sequenceEqual1$ = rxjs_1.interval(202).pipe(// !время разное
operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(logAll), operators_1.sequenceEqual(sequenceEqual1Control$), operators_1.endWith('1-закрыто'));
var sequenceEqual2Control$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-2'; }), operators_1.tap(logAll));
var sequenceEqual2$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-2другой'; }), operators_1.tap(logAll), operators_1.sequenceEqual(sequenceEqual2Control$), operators_1.endWith('2-закрыто'));
var sequenceEqual$ = rxjs_1.of(sequenceEqual1$, sequenceEqual2$).pipe(
// tap(logAll),
operators_1.mergeAll());
// sequenceEqual$.subscribe((item) => logAll('получил: ', item), null, () => logAll('sequenceEqual поток закрыт'));
//====
/**
 * forkJoin
 */
/**
 * merge
 */
/**
 * concat
 */
/**
 * race
 */
/**
 * zip
 */
/**
 * iif
 */
/**
  * scan
 */
