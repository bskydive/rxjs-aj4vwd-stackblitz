import { interval, throwError, of, empty, Notification } from 'rxjs';
import { take, map, endWith, repeat, delay, tap, repeatWhen, mergeAll, ignoreElements, finalize, concatMap, concatMapTo, defaultIfEmpty, startWith, exhaustMap, expand, mapTo, scan, mergeScan, pluck, reduce, switchMap, mergeMapTo, switchMapTo, materialize, dematerialize } from 'rxjs/operators';
import { logAll, IRunListItem } from './utils';

/**
 * Операторы трансформации потоков и значений
 * 
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 * 
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
export const transformingOperatorList: IRunListItem[] = [];

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
const repeat1$ = interval(101).pipe(take(5), map(item => item * 101 + '-1'), endWith('1-закрыт'));

const repeat$ = repeat1$.pipe(
	repeat(3)
)

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
const repeatWhen1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'));
const repeatWhenControl = () => interval(202).pipe(
	delay(1000),
	take(3),
	map(item => (item * 202 + 1000) + '-control'),
	tap(logAll),
	endWith('control-закрыт')
);
const repeatWhen$ = repeatWhen1$.pipe(
	repeatWhen(repeatWhenControl)
)

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
const ignoreElements1$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	// mergeAll(), ignoreElements(),
	endWith('1-закрыт'));

const ignoreElementsErr2$ = interval(404).pipe(
	take(3),
	map(item => item * 404 + '-2'),
	tap(logAll),
	map(item => throwError(item)),
	mergeAll(), ignoreElements(),
	endWith('err-закрыт'));

const ignoreElementsErr3$ = interval(505).pipe(
	take(3),
	map(item => item * 505 + '-3'),
	tap(logAll),
	map(item => throwError(item)),
	mergeAll(), ignoreElements(),
	endWith('err2-закрыт'));

const ignoreElements$ = of(ignoreElements1$, ignoreElementsErr2$, ignoreElementsErr3$).pipe(
	mergeAll(),
)

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
const finalizeFn = item => () => logAll('fin', item);//обёртка для вывода названия завершающегося потока

const finalizeErr1$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	tap(logAll),
	// map(item => throwError(item)),
	// mergeAll(),
	endWith('err1-закрыт'),
	finalize(finalizeFn('1')),
);

const finalizeErr2$ = interval(505).pipe(
	take(3),
	map(item => item * 505 + '-2'),
	tap(logAll),
	map(item => throwError(item)),
	mergeAll(),
	endWith('err2-закрыт'),
	finalize(finalizeFn('2')),
);

const finalize$ = of(finalizeErr1$, finalizeErr2$).pipe(
	mergeAll(),
	finalize(finalizeFn('main')),
)

//finalize$.subscribe(item => logAll(item), err => logAll('ошибка:', err), () => logAll('finalize поток закрыт'));

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
const concatMap1$ = interval(101).pipe(
	// контрольный поток
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const concatMap2$ = interval(102).pipe(
	// просто меняем значение на массив
	take(5),
	map(item => item * 102 + '-2'),
	concatMap((item, index) => [item, item + 1000]),
	// tap(logAll),
	endWith('2-закрыт'),
)

const concatMap3$ = interval(103).pipe(
	// добавляем задержку
	take(5),
	map(item => item * 103 + '-3'),
	concatMap((item, index) => of([item, 'delay200']).pipe(delay(200))),
	// tap(logAll),
	endWith('3-закрыт'),
)

const concatMap$ = of(concatMap1$, concatMap2$, concatMap3$).pipe(
	mergeAll()
)

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
const concatMapTo1$ = interval(101).pipe(
	// контрольный поток
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const concatMapToInternal$ = interval(102).pipe(
	// внутренний поток для concatMap
	take(3),
	map(item => item * 102 + '-Internal'),
	// tap(logAll),
	endWith('Internal-закрыт'),
)

const concatMapToSignal$ = interval(103).pipe(
	// имитируем значения из внутреннего потока 
	take(5),
	map(item => item * 103 + '-Signal'),
	concatMapTo(concatMapToInternal$),
	// tap(logAll),
	endWith('Signal-закрыт'),
)

const concatMapTo$ = of(concatMapTo1$, concatMapToSignal$).pipe(
	mergeAll()
)

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

const defaultIfEmptyInternal = '1'
// const defaultIfEmptyInternal = 1

const defaultIfEmpty1$ = interval(103).pipe(
	// имитируем значения из внутреннего потока 
	take(0),
	map(item => item * 103 + '-1'),
	// tap(logAll),
	defaultIfEmpty(defaultIfEmptyInternal),
	endWith('1-закрыт'),
)

const defaultIfEmpty$ = of(defaultIfEmpty1$).pipe(
	mergeAll()
)

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

const endWith1$ = interval(101).pipe(
	map(item => item * 101 + '-1'),
	take(3),
	// tap(logAll),
	endWith('1-закрыт'),
)

const endWith2$ = interval(102).pipe(
	//неправильное положение оператора
	map(item => item * 102 + '-2'),
	endWith('2-закрыт'),
	take(3)
	// tap(logAll),
)

const endWith$ = of(endWith1$, endWith2$).pipe(
	mergeAll()
)

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
const startWith1$ = interval(101).pipe(
	map(item => item * 101 + '-1'),
	startWith('1-открыт'),
	take(3),
	endWith('1-закрыт'),
	// tap(logAll),
)

const startWith2$ = interval(102).pipe(
	//неправильное положение оператора
	map(item => item * 102 + '-2'),
	take(3),
	endWith('2-закрыт'),
	startWith('2-открыт'),
	// tap(logAll),
)

const startWith$ = of(startWith1$, startWith2$).pipe(
	mergeAll()
)

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
const exhaustMapFork$ = startItem => interval(100)
	.pipe(
		take(3),
		map(item => `${startItem} forkItem-${item * 100}`)
	);

const exhaustMap$ = interval(302).pipe(
	take(3),
	map(item => `startItem-${item * 302}`),
	exhaustMap(exhaustMapFork$)
);
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
const parserRecursive1 = item => {
	if (item < 500) {
		return of(item + 100);
	} else {
		return empty();
	}
}

const expand1$ = interval(501).pipe(
	take(3),
	expand(parserRecursive1),
	endWith('2-закрыт'),
	// tap(logAll),
)

const expand$ = of(expand1$).pipe(
	mergeAll()
)

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

const mapTo1$ = interval(101).pipe(
	// контрольный поток
	take(5),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const mapToSignal$ = interval(103).pipe(
	take(3),
	map(item => item * 103 + '-Signal'),
	mapTo('mapToInternal'),
	// tap(logAll),
	endWith('Signal-закрыт'),
)

const mapTo$ = of(mapTo1$, mapToSignal$).pipe(
	mergeAll()
)

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

const scanAccumulator = (accumulator, item) => {
	logAll(`time: ${item * 101}; item: ${item}; accumulator: ${accumulator}`);
	return item + accumulator
};
const scanAccumulatorInitial = 0;

const scan1$ = interval(101).pipe(
	take(5),
	scan(scanAccumulator, scanAccumulatorInitial),
	// tap(logAll),
	endWith('1-закрыт'),
)

const scan$ = of(scan1$).pipe(
	mergeAll()
)

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
const mergeScanInternal$ = interval(11).pipe(
	take(3),
	map(item => item * 11 + '-internal'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const mergeScanAccumulator = (accumulator, item) => {
	logAll(`time: ${item * 101}; item: ${item}; accumulator: ${accumulator}`);
	// return of(item + accumulator)
	return mergeScanInternal$
};

const mergeScanAccumulatorInitial = 0;

const mergeScan1$ = interval(102).pipe(
	take(5),
	mergeScan(mergeScanAccumulator, mergeScanAccumulatorInitial),
	// tap(logAll),
	endWith('2-закрыт'),
)

const mergeScan$ = of(mergeScan1$).pipe(
	mergeAll()
)

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
const pluck$ = interval(100)
	.pipe(
		take(3),
		map(item => { return { single: item, double: item * 2, nested: { triple: item * 3 } } }), //переделываем число в объект
		//pluck('nested','triple'), //возвращаем в поток только item.nested.triple
		pluck('double')//возвращаем в поток только item.double
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

const reduceAccumulator = (accumulator, item) => {
	logAll(`time: ${item * 101}; item: ${item}; accumulator: ${accumulator}`);
	return item + accumulator
};
const reduceAccumulatorInitial = 0;

const reduce1$ = interval(101).pipe(
	take(5),
	reduce(reduceAccumulator, reduceAccumulatorInitial),
	// tap(logAll),
	endWith('1-закрыт'),
)

const reduce$ = of(reduce1$).pipe(
	mergeAll()
)

//reduce$.subscribe(item => logAll(item + '-$'), null, () => logAll('reduce поток закрыт'));


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
const switchMapFork1$ = startItem => interval(101)
	.pipe(
		take(3),
		map(item => `${startItem} forkItem-${item * 101}`)
	);

const switchMap$ = interval(303).pipe(
	take(3),
	map(item => `startItem-${item * 303}`),
	switchMap(switchMapFork1$)
);

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
const mergeMapTo1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeMapTo2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeMapTo3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeMapTo4$ = of(1, 2, 3).pipe(delay(2000));

const mergeMapToInternal$ = interval(11).pipe(take(3), map(item => item * 11 + '-internal'));


const mergeMapTo$ = of(mergeMapTo1$, mergeMapTo2$, mergeMapTo3$, mergeMapTo4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	mergeMapTo(mergeMapToInternal$)
)

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

const switchMapTo1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const switchMapTo2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const switchMapTo3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const switchMapTo4$ = of(1, 2, 3).pipe(delay(2000));

const switchMapToInternal$ = interval(11).pipe(take(3), map(item => item * 11 + '-internal'));


const switchMapTo$ = of(switchMapTo1$, switchMapTo2$, switchMapTo3$, switchMapTo4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	switchMapTo(switchMapToInternal$)
)

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

const materialize1$ = interval(101).pipe(take(3), map(item => item * 101 + '-1'), endWith('1-закрыто'));
const materialize2$ = of(1).pipe(map(item => throwError('ошибка')));

const materialize$ = of(materialize1$, materialize2$).pipe(
	// tap(logAll),
	materialize()
)

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

const dematerialize1$ = interval(101).pipe(take(3), map(item => item * 101 + '-1'), endWith('1-закрыто'));
const dematerialize2$ = of(1).pipe(map(item => throwError('ошибка')), endWith('2-закрыто'));
const dematerialize3$ = of(Notification.createNext(0), Notification.createComplete()).pipe(endWith('3-закрыто'));

const dematerialize$ = of(dematerialize1$, dematerialize2$, dematerialize3$).pipe(
	// tap(logAll),
	materialize(),
	dematerialize(),
	mergeAll()
)

//dematerialize$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('dematerialize поток закрыт'));

