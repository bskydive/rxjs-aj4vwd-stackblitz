"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
/**
 * Операторы времени, продолжительности и значений
 *
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 *
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
exports.timingOperatorList = [];
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
 * 'Спаморезка'
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
 * 'Спаморезка'
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
{'value':'0-2','interval':105}-$
{'value':'102-2','interval':104}-$
{'value':'204-2','interval':102}-$
{'value':'306-2','interval':103}-$
{'value':'408-2','interval':102}-$
'2-закрыт'-$
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
{'value':'0-1','timestamp':1564341146592}-$
{'value':'0-2','timestamp':'2019-07-28T19:12:26.595Z'}-$
{'value':'101-1','timestamp':1564341146694}-$
{'value':'102-2','timestamp':'2019-07-28T19:12:26.698Z'}-$
{'value':'202-1','timestamp':1564341146796}-$
{'value':'204-2','timestamp':'2019-07-28T19:12:26.800Z'}-$
{'value':'303-1','timestamp':1564341146898}-$
{'value':'306-2','timestamp':'2019-07-28T19:12:26.902Z'}-$
{'value':'404-1','timestamp':1564341147000}-$
'1-закрыт'-$
{'value':'408-2','timestamp':'2019-07-28T19:12:27.006Z'}-$
'2-закрыт'-$
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
