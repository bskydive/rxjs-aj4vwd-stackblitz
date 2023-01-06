import { IRunListItem, logAll } from './utils';
import { interval, of } from 'rxjs';
import { take, map, endWith, mergeAll, auditTime, sampleTime, debounce, debounceTime, delay, delayWhen, throttleTime, timeInterval, timestamp } from 'rxjs/operators';



/**
 * Операторы времени, продолжительности и значений
 * 
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 * 
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
export const timingOperatorList: IRunListItem[] = [];





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
const auditTime1$ = interval(101).pipe(take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'));
const auditTime2$ = interval(202).pipe(take(10),
	map(item => item * 202 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'));

const auditTime$ = of(auditTime1$, auditTime2$).pipe(
	mergeAll(),
	auditTime(500),
	map(item => item + '-audit500')
)

// auditTime$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('auditTime поток закрыт'));
timingOperatorList.push({ observable$: auditTime$ });

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
const sampleTime1$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'));
const sampleTime5$ = interval(505).pipe(
	take(5),
	map(item => item * 505 + '-5'),
	// tap(logAll),
	endWith('5-закрыт'));

const sampleTime$ = of(sampleTime1$, sampleTime5$).pipe(
	mergeAll(),
	sampleTime(500),
	// map(item => item+'-sample500')
)

// sampleTime$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('sampleTime поток закрыт'));
timingOperatorList.push({ observable$: sampleTime$ });

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
const observeOn1$ = interval(101).pipe(
	take(3),
	// observeOn(asyncScheduler),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
);

const observeOn2$ = interval(102).pipe(
	take(3),
	// observeOn(asapScheduler),
	map(item => item * 102 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
);

const observeOn3$ = interval(103).pipe(
	take(3),
	// observeOn(queueScheduler),
	map(item => item * 103 + '-3'),
	// tap(logAll),
	endWith('3-закрыт'),
);

const observeOn4$ = interval(104).pipe(
	take(3),
	// observeOn(animationFrameScheduler),
	map(item => item * 104 + '-4'),
	// tap(logAll),
	endWith('4-закрыт')
);

const observeOn5$ = interval(105).pipe(
	// без observeOn считается, что приоритет immediate
	take(3),
	map(item => item * 105 + '-5'),
	// tap(logAll),
	endWith('5-закрыт')
);

const observeOn$ = of(observeOn1$, observeOn2$, observeOn3$, observeOn4$, observeOn5$).pipe(
	mergeAll(),
	// map(item => item+'-observe')
)

// observeOn$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('observeOn поток закрыт'));
timingOperatorList.push({ observable$: observeOn$ });

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
const subscribeOn1$ = interval(101).pipe(
	take(3),
	// subscribeOn(asyncScheduler),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
);

const subscribeOn2$ = interval(102).pipe(
	take(3),
	// subscribeOn(asapScheduler),
	map(item => item * 102 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
);

const subscribeOn3$ = interval(103).pipe(
	take(3),
	// subscribeOn(queueScheduler),
	map(item => item * 103 + '-3'),
	// tap(logAll),
	endWith('3-закрыт'),
);

const subscribeOn4$ = interval(104).pipe(
	take(3),
	// subscribeOn(animationFrameScheduler),
	map(item => item * 104 + '-4'),
	// tap(logAll),
	endWith('4-закрыт')
);

const subscribeOn5$ = interval(105).pipe(
	// без subscribeOn считается, что приоритет immediate
	take(3),
	map(item => item * 105 + '-5'),
	// tap(logAll),
	endWith('5-закрыт')
);

const subscribeOn$ = of(subscribeOn1$, subscribeOn2$, subscribeOn3$, subscribeOn4$, subscribeOn5$).pipe(
	mergeAll(),
	// map(item => item+'-subscribe')
)

// subscribeOn$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('subscribeOn поток закрыт'));
timingOperatorList.push({ observable$: subscribeOn$ });

/**
 * debounce
 * 'Спаморезка' сглаживание
 * Выводит крайнее значение из потока, если была пауза между значениями больше, чем интервал debounceSignal*
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

const debounceSignalOver$ = interval(2000)
const debounceSignalNorm$ = interval(50)
const debounceSignalDynamic = item => {
	const TIMER = 5; // interval имитирует 0,1,2,3,4...
	if (item > TIMER) {
		return interval(500)
	} else {
		return interval(0)
	}
}

const debounceOver$ = interval(101).pipe(
	take(10),
	debounce(item => debounceSignalOver$),
	map(item => item * 101 + '-over'),
	// tap(logAll),
	endWith('over-закрыт'),
);

const debounceNorm$ = interval(102).pipe(
	take(10),
	debounce(item => debounceSignalNorm$),
	map(item => item * 102 + '-norm'),
	// tap(logAll),
	endWith('norm-закрыт'),
);

const debounceDynamic$ = interval(103).pipe(
	take(10),
	debounce(item => debounceSignalDynamic(item)),
	map(item => item * 103 + '-dynamic'),
	// tap(logAll),
	endWith('dynamic-закрыт'),
);

const debounce$ = of(debounceOver$, debounceNorm$, debounceDynamic$).pipe(
	mergeAll(),
	// map(item => item+'-subscribe')
)

//debounce$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('debounce поток закрыт'));
timingOperatorList.push({ observable$: debounce$ });

/**
 * debounceTime
 * 'Спаморезка'
 * Выводит крайнее значение из потока, если была пауза больше, чем интервал х в debounceTime(х)
 * Выводит крайнее значение, если ни одно не прошло в интервал.
 * Таймер стартует(переподписывается) каждое значение. Т.е. в простом случае debounceTime(x) ждёт больших, чем интервал x промежутков между значениями потока для вывода. Т.е. игнорирует спам.
 * 
 * 
получил:  0-50
получил:  102-50
получил:  204-50
получил:  306-50
получил:  408-50
получил:  510-50
получил:  612-50
получил:  714-50
получил:  816-50
получил:  909-1000
получил:  1000-закрыт
получил:  918-50
получил:  50-закрыт
debounceTime поток закрыт
 */

const debounceTimeOver$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1000'),
	// tap(logAll),
	debounceTime(1000),
	endWith('1000-закрыт'),
);

const debounceTimeNorm$ = interval(102).pipe(
	take(10),
	map(item => item * 102 + '-50'),
	// tap(logAll),
	debounceTime(50),
	endWith('50-закрыт'),
);

const debounceTime$ = of(debounceTimeOver$, debounceTimeNorm$).pipe(
	mergeAll(),
	// map(item => item+'-subscribe')
)

// debounceTime$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('debounceTime поток закрыт'));
timingOperatorList.push({ observable$: debounceTime$ });

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
const delay1$ = interval(101).pipe(
	delay(1000),
	take(3),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const delay2$ = interval(102).pipe(
	delay(new Date(Date.now() + 1000)),
	take(3),
	map(item => item * 102 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
)

const delay3$ = interval(103).pipe(
	// контрольный поток без задержек
	take(10),
	map(item => item * 103 + '-3'),
	// tap(logAll),
	endWith('3-закрыт'),
)

const delay$ = of(delay1$, delay2$, delay3$).pipe(
	mergeAll()
)

//delay$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('delay поток закрыт'));
timingOperatorList.push({ observable$: delay$ });

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
const delayWhen1$ = interval(101).pipe(
	// контрольный поток без задержек
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const delayWhen2$ = interval(102).pipe(
	delayWhen((item, index) => interval(200)),
	take(10),
	map(item => (item * 102 + 200) + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
)

const delayWhen$ = of(delayWhen1$, delayWhen2$).pipe(
	mergeAll()
)

//delayWhen$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('delayWhen поток закрыт'));
timingOperatorList.push({ observable$: delayWhen$ });

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
const throttleTime1$ = interval(101).pipe(
	// контрольный поток без задержек
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const throttleTime2$ = interval(102).pipe(
	throttleTime(300),
	take(10),
	map(item => (item * 102 + 300) + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
)

const throttleTime$ = of(throttleTime1$, throttleTime2$).pipe(
	mergeAll()
)

//throttleTime$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('throttleTime поток закрыт'));
timingOperatorList.push({ observable$: throttleTime$ });

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
const timeInterval1$ = interval(102).pipe(
	take(5),
	map(item => item * 102 + '-2'),
	timeInterval(),
	// tap(logAll),
	endWith('2-закрыт'),
)

const timeInterval$ = of(timeInterval1$).pipe(
	mergeAll()
)

//timeInterval$.subscribe(item => logAll(JSON.stringify(item) + '-$'), null, () => logAll('timeInterval поток закрыт'));
timingOperatorList.push({ observable$: throttleTime$ });

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
const timestamp1$ = interval(101).pipe(
	take(5),
	map(item => item * 101 + '-1'),
	timestamp(),
	// tap(logAll),
	endWith('1-закрыт'),
)

const timestamp2$ = interval(102).pipe(
	// добавим немного человекочитаемости к дате
	take(5),
	map(item => item * 102 + '-2'),
	timestamp(),
	map(item => { return { value: item.value, timestamp: new Date(item.timestamp) } }),
	// tap(logAll),
	endWith('2-закрыт'),
)

const timestamp$ = of(timestamp1$, timestamp2$).pipe(
	mergeAll()
)

//timestamp$.subscribe(item => logAll(JSON.stringify(item) + '-$'), null, () => logAll('timestamp поток закрыт'));
timingOperatorList.push({ observable$: timestamp$ });
