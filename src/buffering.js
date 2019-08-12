"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var utils_1 = require("./utils");
/**
 * Операторы буферизации buffer*, window*
 *
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 *
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
exports.bufferingOperatorList = [];
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
var buffer$ = rxjs_1.interval(101).pipe(operators_1.take(7), operators_1.map(function (item) { return item * 101; }), operators_1.buffer(bufferCloseSignal$), operators_1.endWith('buffer поток закрыт'));
//buffer$.subscribe((item) => logAll('получил: ', item), null, () => logAll('buffer поток закрыт'));
exports.bufferingOperatorList.push({ observable$: buffer$ });
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
exports.bufferingOperatorList.push({ observable$: bufferCount$ });
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
exports.bufferingOperatorList.push({ observable$: bufferTime$ });
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
var bufferOpen$ = rxjs_1.interval(404).pipe(operators_1.tap(function (item) { return utils_1.logAll('bufferOpen: ', item * 404); }));
var bufferClose$ = function () { return rxjs_1.interval(303).pipe(operators_1.tap(function (item) { return utils_1.logAll('bufferClose: ', item * 303); })); };
var bufferToggle$ = rxjs_1.interval(101).pipe(operators_1.take(20), operators_1.map(function (item) { return item * 101; }), operators_1.bufferToggle(bufferOpen$, bufferClose$));
//bufferToggle$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferToggle поток закрыт'));
exports.bufferingOperatorList.push({ observable$: bufferToggle$ });
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
        utils_1.logAll('bufferWhenInterval1$: ' + bufferWhenCount);
        return bufferWhenInterval1$;
    }
    else {
        utils_1.logAll('bufferWhenInterval2$: ' + bufferWhenCount);
        return bufferWhenInterval2$;
    }
}));
//bufferWhen$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferWhen поток закрыт'));
exports.bufferingOperatorList.push({ observable$: bufferWhen$ });
//========================================================================================================================
//==================================================WINDOW================================================================
//========================================================================================================================
/**
 * window
 * 'нарезка'. В отличии от buffer возвращает потоки. Полезен для создания листалки, ограничения большого потока значений.
 * Возвращает новый поток(буфер) по таймеру, предыдущий закрывает
 
Hello World!
0-windowCloseInterval
получил:  [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
1000-windowCloseInterval
получил:  [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]
получил:  [ 19 ]
window поток закрыт
*/
var windowCloseInterval$ = rxjs_1.interval(1000).pipe(operators_1.map(function (item) { return item * 1000 + '-windowCloseInterval'; }), operators_1.tap(utils_1.logAll));
var window$ = rxjs_1.interval(101).pipe(operators_1.take(20), operators_1.window(windowCloseInterval$), operators_1.switchMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
// window$.subscribe((item) => logAll('получил: ', item), null, () => logAll('window поток закрыт'));
exports.bufferingOperatorList.push({ observable$: window$ });
/**
 * windowCount
 *
 * Возвращает новый поток(буфер) по количеству значений, предыдущий закрывает
 *
windowCount(windowCountSize),
['windowCount', 0, 1]
['windowCount', 2, 3]
['windowCount', 4, 5]
['windowCount', 6, 7]
['windowCount', 8, 9]
['windowCount']

windowCount(windowCountSize, windowCountStartNew),
['windowCount', 0, 1]
['windowCount', 3, 4]
['windowCount', 6, 7]
['windowCount', 9]
*/
var windowCountSize = 2;
var windowCountStartNew = 3;
var windowCount$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }), 
// windowCount(windowCountSize),
operators_1.windowCount(windowCountSize, windowCountStartNew), operators_1.switchMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
// windowCount$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowCount поток закрыт'));
exports.bufferingOperatorList.push({ observable$: windowCount$ });
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
exports.bufferingOperatorList.push({ observable$: windowTime$ });
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
var windowOpen$ = rxjs_1.interval(404).pipe(operators_1.map(function () { return utils_1.logAll('windowOpen', windowToggleCount); }));
var windowClose$ = function () { return rxjs_1.interval(303).pipe(operators_1.map(function () { return utils_1.logAll('windowClose', windowToggleCount++); }) // увеличиваем счётчик во внешней переменной
); };
var windowToggle$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101; }), operators_1.windowToggle(windowOpen$, windowClose$), operators_1.switchMap(function (item$) { return item$.pipe(operators_1.toArray()); }));
//windowToggle$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowToggle поток закрыт'));
exports.bufferingOperatorList.push({ observable$: windowToggle$ });
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
exports.bufferingOperatorList.push({ observable$: windowWhen$ });
