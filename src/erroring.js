"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
/**
 * Операторы обработки ошибок
 *
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 *
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
exports.erroringOperatorList = [];
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
    utils_1.logAll('словил:', err, 'источик:', caught$); //перехватчик ошибок
    return rxjs_1.throwError("\u0432\u0435\u0440\u043D\u0443\u043B \u0432\u0437\u0430\u0434 " + err); //генерируем новую ошибку вместо текущей
}), operators_1.catchError(function (err, caught$) {
    utils_1.logAll('положь где взял:', err, 'источик:', caught$); //перехватчик ошибок работает последовательно
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
var errorHandler = function () { return utils_1.logAll('ничоси'); };
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
        utils_1.logAll('словили: ' + item);
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
        utils_1.logAll('ошибка-данные: ' + x);
        throw new Error('errorN: ' + x);
    }
    return x;
}), operators_1.retryWhen(function (errors$) {
    return errors$.pipe(
    // tap(err => logAll(err)),
    operators_1.scan(function (acc) { return acc + 1; }, 0), operators_1.map(function (retryCount) {
        if (retryCount === 2) {
            utils_1.logAll('остановка');
        }
        else {
            utils_1.logAll('повтор: ' + retryCount);
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
        utils_1.logAll('Таймер сработал');
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
        utils_1.logAll('Таймер сработал');
    }
    ;
    return rxjs_1.of(err);
}));
//timeOutWith$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('timeOutWith поток закрыт'));
