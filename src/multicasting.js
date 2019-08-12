"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
/**
 * Операторы асинхронного запуска потоков
 * Примеры пока не приведены к запуску по .subscribe, и требуют раскомментирования по несколько строк для ручной проверки
 *
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 *
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
exports.multicastingOperatorList = [];
//========================================================================================================================
//==================================================MULTICAST=============================================================
//========================================================================================================================
//
/**
 * multicast
 *
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
    utils_1.logAll('новый подписчик!');
    var countItem = 0;
    var interval1 = setInterval(function () {
        utils_1.logAll('генерируем: ' + countItem);
        if (countItem <= 3) {
            observer.next(countItem++);
        }
        else {
            utils_1.logAll('остановка генератора multicast');
            clearInterval(interval1);
        }
    }, 101);
};
var multicast$ = new rxjs_1.Observable(multicastObserver).pipe(
// const multicast$ = publish()(of(multicastIn1$, multicastIn2$).pipe( // пример костыля - в этом случае .connect() не работает как надо, потоки стартуют раньше .connect()
// tap(logAll),
operators_1.multicast(multicastProxy$));
multicast$.subscribe(function (item) { return utils_1.logAll(item + '-подписка1'); }, null, function () { return utils_1.logAll('multicast подписка1-закрыта'); });
multicast$.pipe(operators_1.delay(1000)).subscribe(function (item) { return utils_1.logAll(item + '-подписка2'); }, null, function () { return utils_1.logAll('multicast подписка2-закрыта'); });
// multicast$.connect();
exports.multicastingOperatorList.push({ observable$: rxjs_1.of('multicast не может быть запущен одним subscribe !') });
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
exports.multicastingOperatorList.push({ observable$: rxjs_1.of('share не может быть запущен одним subscribe !') });
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
exports.multicastingOperatorList.push({ observable$: rxjs_1.of('shareReply не может быть запущен одним subscribe !') });
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
    utils_1.logAll('новый подписчик!');
    var countItem = 0;
    var interval1 = setInterval(function () {
        utils_1.logAll('генерируем: ' + countItem);
        if (countItem <= 3) {
            observer.next(countItem++);
        }
        else {
            utils_1.logAll('остановка генератора publish');
            clearInterval(interval1);
        }
    }, 101);
};
var publish$ = new rxjs_1.Observable(publishObserver).pipe(
// tap(logAll),
operators_1.publish());
publish$.subscribe(function (item) { return utils_1.logAll(item + '-подписка1'); }, null, function () { return utils_1.logAll('publish подписка1-закрыта'); });
publish$.pipe(operators_1.delay(1000)).subscribe(function (item) { return utils_1.logAll(item + '-подписка2'); }, null, function () { return utils_1.logAll('publish подписка2-закрыта'); });
// publish$.connect();
exports.multicastingOperatorList.push({ observable$: rxjs_1.of('publish не может быть запущен одним subscribe !') });
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
    utils_1.logAll('новый подписчик!');
    var countItem = 0;
    var interval1 = setInterval(function () {
        utils_1.logAll('генерируем: ' + countItem);
        if (countItem <= 3) {
            observer.next(countItem++);
        }
        else {
            utils_1.logAll('остановка генератора publishBehavior');
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
exports.multicastingOperatorList.push({ observable$: rxjs_1.of('publishBehavior не может быть запущен одним subscribe !') });
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
publishLast$.subscribe(function (item) { return utils_1.logAll(item + '-подписка1'); }, null, function () { return utils_1.logAll('publishLast подписка1-закрыта'); });
var publishLastTimeout = setInterval(function () {
    publishLast$.subscribe(function (item) { return utils_1.logAll(item + '-подписка2'); }, null, function () { return utils_1.logAll('publishLast подписка2-закрыта'); });
    clearInterval(publishLastTimeout);
}, 300);
// publishLast$.connect();
exports.multicastingOperatorList.push({ observable$: rxjs_1.of('publishLast не может быть запущен одним subscribe !') });
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
publishReplay$.subscribe(function (item) { return utils_1.logAll(item + '-подписка1'); }, null, function () { return utils_1.logAll('publishReplay подписка1-закрыта'); });
var publishReplayTimeout1 = setInterval(function () {
    publishReplay$.subscribe(function (item) { return utils_1.logAll(item + '-подписка2'); }, null, function () { return utils_1.logAll('publishReplay подписка2-закрыта'); });
    clearInterval(publishReplayTimeout1);
}, 300);
var publishReplayTimeout2 = setInterval(function () {
    publishReplay$.subscribe(function (item) { return utils_1.logAll(item + '-подписка3'); }, null, function () { return utils_1.logAll('publishReplay подписка3-закрыта'); });
    clearInterval(publishReplayTimeout2);
}, 500);
// publishReplay$.connect();
exports.multicastingOperatorList.push({ observable$: rxjs_1.of('publishReplay не может быть запущен одним subscribe !') });
