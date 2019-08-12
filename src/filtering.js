"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
/**
 * Операторы фильтрации
 *
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 *
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
exports.filteringOperatorList = [];
//========================================================================================================================
//==================================================FILTERING ONE=========================================================
//========================================================================================================================
//указанные операторы получают и возвращают значения в потоке
/**
 * skip
 * скрывает указанное количество значений


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
var skip$ = rxjs_1.of(skipSrc1$, skipSrc2$).pipe(operators_1.mergeAll(), operators_1.endWith('skip поток закрыт'));
//skip$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
exports.filteringOperatorList.push({ observable$: skip$ });
/**
 * skipLast
 * скрывает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений


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
exports.filteringOperatorList.push({ observable$: skipLast$ });
/**
 * skipUntil
 * скрывает значения потока до момента получения первого значения из аргумента наблюдателя

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
exports.filteringOperatorList.push({ observable$: skipUntil$ });
/**
 * skipWhile
 * скрывает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false

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
exports.filteringOperatorList.push({ observable$: skipWhile$ });
/**
 * take
 * возвращает указанное количество значений

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
exports.filteringOperatorList.push({ observable$: take$ });
/**
 * takeLast
 * возвращает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений


получил:  707-1
получил:  808-1
получил:  909-1
получил:  101-закрыт
takeLast поток закрыт
 */
var takeLast$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.takeLast(3), operators_1.endWith('101-закрыт'));
//takeLast$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('takeLast поток закрыт'));
exports.filteringOperatorList.push({ observable$: takeLast$ });
/**
 * takeUntil
 * Возвращает поток до момента получения первого значения из аргумента наблюдателя takeUntilComplete$
 * Прерывает поток при получении первого значения из аргумента наблюдателя takeUntilComplete$
 * Используется для очистки мусора, как завершающий оператор


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
exports.filteringOperatorList.push({ observable$: takeUntilSignal$ });
/**
 * takeWhile
 * возвращает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false


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
exports.filteringOperatorList.push({ observable$: takeWhile$ });
/**
 * distinct
 * возвращает только уникальные значения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * можно передать функцию предварительной обработки значений


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
exports.filteringOperatorList.push({ observable$: distinct$ });
/**
 * distinct
 * более сложный пример с функцией предварительной обработки значений перед сравнением
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 *

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
exports.filteringOperatorList.push({ observable$: distinct2$ });
/**
 * distinctUntilChanged
 * возвращает только уникальные значения в пределах двух значений: текущего и предыдущего
 * можно передать функцию сравнения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается


получил:  { value: 0, stream: '1' }
получил:  { value: 0, stream: '2' }
distinctUntilChanged поток закрыт
 */
var distinctUntilChangedSrc3$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return { value: item * 101, stream: '1' }; }), operators_1.endWith('101-закрыт'));
var distinctUntilChangedSrc4$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return { value: item * 101, stream: '2' }; }), operators_1.endWith('102-закрыт'));
var distinctUntilChangedParse = function (item, itemPrev) { return item.value !== itemPrev.value; };
var distinctUntilChanged$ = rxjs_1.of(distinctUntilChangedSrc3$, distinctUntilChangedSrc4$).pipe(operators_1.mergeAll(), operators_1.distinctUntilChanged(distinctUntilChangedParse));
// distinctUntilChanged$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinctUntilChanged поток закрыт'));
exports.filteringOperatorList.push({ observable$: distinctUntilChanged$ });
/**
 * distinctUntilKeyChanged
 * возвращает только уникальные значения в пределах текущего и предыдущего
 * необходимо указать название ключа объекта для сравнения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * !!! люто работает проверка типов distinctUntilKeyChangedKeyName. В очевидных случаях несоответствия со значениями в потоке пишет: несовместимо с "never"

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
exports.filteringOperatorList.push({ observable$: distinctUntilKeyChanged$ });
/**
 * filter
 * возвращает значения потока, если аргумент функция вернул true
 * Базовый оператор, которым можно заменить много других


получил:  0
получил:  101
получил:  202
filter поток закрыт
 */
var filterSrc$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.map(function (item) { return item * 101; }));
var isFilter = function (item) { return item < 303; };
var filter$ = filterSrc$.pipe(operators_1.filter(isFilter));
// filter$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('filter поток закрыт'));
exports.filteringOperatorList.push({ observable$: filterSrc$ });
/**
 * sample
 * возвращает первое значение потока после получения очередного значения из аргумента наблюдателя sampleProbe$
 * Отбирает второе значение из потока между таймерами(300)
 * Здесь имеет значение сколько имитировано в потоке sampleProbe$. После его закрытия


0-проверяем
получил:  102
300-проверяем
получил:  408
600-проверяем
получил:  714
sample поток закрыт
 */
var sampleProbe$ = rxjs_1.interval(300).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 300 + '-проверяем'; }), operators_1.tap(utils_1.logAll), operators_1.endWith('sampleProbe-закрыт'));
var sample$ = rxjs_1.interval(102).pipe(operators_1.take(20), operators_1.map(function (item) { return item * 102; }), operators_1.sample(sampleProbe$));
//sample$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('sample поток закрыт'));
exports.filteringOperatorList.push({ observable$: sampleProbe$ });
/**
 * audit
 *
 * отбирает кайнее значение из потока между таймерами(300)
 *


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
    utils_1.logAll('проверка: ' + item);
    return rxjs_1.interval(300).pipe(operators_1.take(3));
};
var audit2$ = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102; }), operators_1.audit(auditProbe$));
var audit1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-control'; }));
var audit$ = rxjs_1.of(audit1$, audit2$).pipe(operators_1.mergeAll());
// audit$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('audit поток закрыт'));
exports.filteringOperatorList.push({ observable$: audit$ });
/**
 * throttle
 * отбирает первое значение из потока между таймерами(300)
 *

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
    utils_1.logAll('проверка: ' + item);
    return rxjs_1.interval(300).pipe(operators_1.take(1));
};
var throttle2$ = rxjs_1.interval(102).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 102; }), operators_1.throttle(throttleProbe$));
var throttle1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-control'; }));
var throttle$ = rxjs_1.of(throttle1$, throttle2$).pipe(operators_1.mergeAll());
// throttle$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('throttle поток закрыт'));
exports.filteringOperatorList.push({ observable$: throttle$ });
//========================================================================================================================
//==================================================FILTERING MULTIPLE====================================================
//========================================================================================================================
//
/**
 * first
 * Возвращает первое значение из потока
 * Если передать в аргументы функцию, то первое значение при возврате функции true


1
102
получил:  102
first поток закрыт
 */
var first$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + 1; }), operators_1.tap(utils_1.logAll), 
// first(), // вернёт первое значение
operators_1.first(function (item) { return item % 2 === 0; }) //вернёт первое чётное число
);
// first$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('first поток закрыт'));
exports.filteringOperatorList.push({ observable$: first$ });
/**
 * last
 * Возвращает крайнее значение из потока
 * Поток должен быть конечным
 * Если передать в аргументы функцию, то крайнее значение при возврате функции true


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
var last$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + 1; }), operators_1.tap(utils_1.logAll), 
// last(), // вернёт крайнее значение
operators_1.last(function (item) { return item % 2 === 0; }) //вернёт крайнее чётное число
);
// last$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('last поток закрыт'));
exports.filteringOperatorList.push({ observable$: last$ });
/**
 * min
 * возвращает минимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки


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
exports.filteringOperatorList.push({ observable$: min$ });
/**
 * max
 * возвращает максимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки


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
exports.filteringOperatorList.push({ observable$: max$ });
/**
 * возвращает элемент по индексу в потоке
 * можно заменить через toArray()[index]

получил:  4
elementAt поток закрыт
 */
var elementAt$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(item => logAll('получил: ' + item)),
operators_1.elementAt(3));
// elementAt$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('elementAt поток закрыт'));
exports.filteringOperatorList.push({ observable$: elementAt$ });
/**
 * find
 * возвращает первый элемент потока, для которого функция аргумент findProbe возвращает true


получил:  4
find поток закрыт
 */
var findProbe = function (item) { return item > 0; };
var find$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(logAll),
operators_1.find(findProbe));
// find$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('find поток закрыт'));
exports.filteringOperatorList.push({ observable$: find$ });
/**
 * возвращает первый индекс элемента потока, для которого функция аргумент findIndexProbe возвращает true

получил:  3
findIndex поток закрыт

 */
var findIndexProbe = function (item) { return item > 0; };
var findIndex$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(logAll),
operators_1.findIndex(findIndexProbe));
// findIndex$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('findIndex поток закрыт'));
exports.filteringOperatorList.push({ observable$: findIndex$ });
/**
 * single
 * возвращает значение из входного потока, если функция аргумент singleProbe возвращает true
 * При значениях больше 1 штуки возвращает ошибку
 * если значений не найдено возвращает undefined
 
получил:  0
single поток закрыт
 */
var singleProbe = function (item) { return item === 0; };
//const singleProbe = item=>item>0;//ошибка
//const singleProbe = item=>item===10;//undefined
var single$ = rxjs_1.of(-2, -1, 0, 4, 5, 6).pipe(
// tap(item => logAll('получил: ' + item)),
operators_1.single(singleProbe));
//single$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('single поток закрыт'));
exports.filteringOperatorList.push({ observable$: single$ });
