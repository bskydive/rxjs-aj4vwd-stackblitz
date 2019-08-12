"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var utils_1 = require("./utils");
/**
 * Операторы трансформации потоков и значений
 *
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 *
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
exports.transformingOperatorList = [];
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
exports.transformingOperatorList.push({ observable$: repeat$ });
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
var repeatWhenControl = function () { return rxjs_1.interval(202).pipe(operators_1.delay(1000), operators_1.take(3), operators_1.map(function (item) { return (item * 202 + 1000) + '-control'; }), operators_1.tap(utils_1.logAll), operators_1.endWith('control-закрыт')); };
var repeatWhen$ = repeatWhen1$.pipe(operators_1.repeatWhen(repeatWhenControl));
// repeatWhen$.subscribe(item => logAll(item), null, () => logAll('repeatWhen поток закрыт'));
exports.transformingOperatorList.push({ observable$: repeatWhen$ });
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
var ignoreElementsErr2$ = rxjs_1.interval(404).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 404 + '-2'; }), operators_1.tap(utils_1.logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.ignoreElements(), operators_1.endWith('err-закрыт'));
var ignoreElementsErr3$ = rxjs_1.interval(505).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 505 + '-3'; }), operators_1.tap(utils_1.logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.ignoreElements(), operators_1.endWith('err2-закрыт'));
var ignoreElements$ = rxjs_1.of(ignoreElements1$, ignoreElementsErr2$, ignoreElementsErr3$).pipe(operators_1.mergeAll());
//ignoreElements$.subscribe(item => logAll(item), err => logAll('ошибка:', err), () => logAll('ignoreElements поток закрыт'));
exports.transformingOperatorList.push({ observable$: ignoreElements$ });
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
var finalizeFn = function (item) { return function () { return utils_1.logAll('fin', item); }; }; //обёртка для вывода названия завершающегося потока
var finalizeErr1$ = rxjs_1.interval(101).pipe(operators_1.take(10), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(utils_1.logAll), 
// map(item => throwError(item)),
// mergeAll(),
operators_1.endWith('err1-закрыт'), operators_1.finalize(finalizeFn('1')));
var finalizeErr2$ = rxjs_1.interval(505).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 505 + '-2'; }), operators_1.tap(utils_1.logAll), operators_1.map(function (item) { return rxjs_1.throwError(item); }), operators_1.mergeAll(), operators_1.endWith('err2-закрыт'), operators_1.finalize(finalizeFn('2')));
var finalize$ = rxjs_1.of(finalizeErr1$, finalizeErr2$).pipe(operators_1.mergeAll(), operators_1.finalize(finalizeFn('main')));
//finalize$.subscribe(item => logAll(item), err => logAll('ошибка:', err), () => logAll('finalize поток закрыт'));
exports.transformingOperatorList.push({ observable$: finalize$ });
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
'0-1'-$
'0-2'-$
'0-21000'-$
'101-1'-$
'102-2'-$
'102-21000'-$
'202-1'-$
['0-2','delay200']-$
'204-2'-$
'204-21000'-$
'303-1'-$
'306-2'-$
'306-21000'-$
'404-1'-$
['102-2','delay200']-$
'408-2'-$
'408-21000'-$
'2-закрыт'-$
'505-1'-$
['204-2','delay200']-$
'606-1'-$
'707-1'-$
['306-2','delay200']-$
'808-1'-$
'909-1'-$
'1-закрыт'-$
['408-2','delay200']-$
'2-закрыт'-$
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
exports.transformingOperatorList.push({ observable$: concatMap$ });
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
exports.transformingOperatorList.push({ observable$: concatMapTo$ });
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
exports.transformingOperatorList.push({ observable$: defaultIfEmpty$ });
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
exports.transformingOperatorList.push({ observable$: endWith$ });
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
exports.transformingOperatorList.push({ observable$: startWith$ });
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
exports.transformingOperatorList.push({ observable$: exhaustMap$ });
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
exports.transformingOperatorList.push({ observable$: expand$ });
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
operators_1.tap(function (item) { return utils_1.logAll('отладь меня: ', item); }));
/**
 * Три работающих варианта подписки
 * разведены во времени, чтобы не перемешивать вывод в консоль
 */
//map$.subscribe(item => logAll('самый простой, значение:', item));
exports.transformingOperatorList.push({ observable$: map$ });
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
exports.transformingOperatorList.push({ observable$: mapTo$ });
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
    utils_1.logAll("time: " + item * 101 + "; item: " + item + "; accumulator: " + accumulator);
    return item + accumulator;
};
var scanAccumulatorInitial = 0;
var scan1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.scan(scanAccumulator, scanAccumulatorInitial), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var scan$ = rxjs_1.of(scan1$).pipe(operators_1.mergeAll());
//scan$.subscribe(item => logAll(item + '-$'), null, () => logAll('scan поток закрыт'));
exports.transformingOperatorList.push({ observable$: scan$ });
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
    utils_1.logAll("time: " + item * 101 + "; item: " + item + "; accumulator: " + accumulator);
    // return of(item + accumulator)
    return mergeScanInternal$;
};
var mergeScanAccumulatorInitial = 0;
var mergeScan1$ = rxjs_1.interval(102).pipe(operators_1.take(5), operators_1.mergeScan(mergeScanAccumulator, mergeScanAccumulatorInitial), 
// tap(logAll),
operators_1.endWith('2-закрыт'));
var mergeScan$ = rxjs_1.of(mergeScan1$).pipe(operators_1.mergeAll());
//mergeScan$.subscribe(item => logAll(item + '-$'), null, () => logAll('mergeScan поток закрыт'));
exports.transformingOperatorList.push({ observable$: mergeScan$ });
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
exports.transformingOperatorList.push({ observable$: pluck$ });
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
    utils_1.logAll("time: " + item * 101 + "; item: " + item + "; accumulator: " + accumulator);
    return item + accumulator;
};
var reduceAccumulatorInitial = 0;
var reduce1$ = rxjs_1.interval(101).pipe(operators_1.take(5), operators_1.reduce(reduceAccumulator, reduceAccumulatorInitial), 
// tap(logAll),
operators_1.endWith('1-закрыт'));
var reduce$ = rxjs_1.of(reduce1$).pipe(operators_1.mergeAll());
//reduce$.subscribe(item => logAll(item + '-$'), null, () => logAll('reduce поток закрыт'));
exports.transformingOperatorList.push({ observable$: reduce$ });
/**
 * switchMap
 * после каждого нового значения входящего потока interval(302)
 * выполняет функцию аргумент switchMapFork1$, который возвращает новый поток
 * предыдущий поток из switchMapFork1$ закрывается, потому рекомендуется только для чтения значений
 * https://www.learnrxjs.io/operators/transformation/switchmap.html
'startItem-0 forkItem-0'
'startItem-0 forkItem-100'
'startItem-0 forkItem-200'
'startItem-302 forkItem-0'
'startItem-302 forkItem-100'
'startItem-302 forkItem-200'
'startItem-604 forkItem-0'
'startItem-604 forkItem-100'
'startItem-604 forkItem-200'
поток закрыт
 */
var switchMapFork1$ = function (startItem) { return rxjs_1.interval(101)
    .pipe(operators_1.take(3), operators_1.map(function (item) { return startItem + " forkItem-" + item * 101; })); };
var switchMap$ = rxjs_1.interval(303).pipe(operators_1.take(3), operators_1.map(function (item) { return "startItem-" + item * 303; }), operators_1.switchMap(switchMapFork1$));
//switchMap$.subscribe(item => logAll(item), null, ()=> logAll('switchMap поток закрыт'));
exports.transformingOperatorList.push({ observable$: switchMap$ });
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
var mergeMapTo$ = rxjs_1.of(mergeMapTo1$, mergeMapTo2$, mergeMapTo3$, mergeMapTo4$).pipe(operators_1.tap(utils_1.logAll), //возвращает три потока наблюдателей
operators_1.mergeMapTo(mergeMapToInternal$));
// mergeMapTo$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('mergeMapTo поток закрыт'));
exports.transformingOperatorList.push({ observable$: mergeMapTo$ });
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
var switchMapTo$ = rxjs_1.of(switchMapTo1$, switchMapTo2$, switchMapTo3$, switchMapTo4$).pipe(operators_1.tap(utils_1.logAll), //возвращает три потока наблюдателей
operators_1.switchMapTo(switchMapToInternal$));
//switchMapTo$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('switchMapTo поток закрыт'));
exports.transformingOperatorList.push({ observable$: switchMapTo$ });
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
exports.transformingOperatorList.push({ observable$: materialize$ });
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
exports.transformingOperatorList.push({ observable$: dematerialize$ });
