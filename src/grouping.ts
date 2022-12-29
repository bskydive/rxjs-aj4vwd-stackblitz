import { IRunListItem, logAll } from './utils';

import { interval, of, combineLatest, forkJoin, iif, from, throwError, BehaviorSubject, zip, ReplaySubject } from 'rxjs';

import { take, map, combineAll, tap, concatAll, delay, exhaust, mergeAll, withLatestFrom, toArray, mergeMap, groupBy, pairwise, endWith, switchAll, zipAll, merge, concat, race, catchError, sequenceEqual, switchMap, combineLatestWith, mergeScan, zipWith } from 'rxjs/operators';

/**
 * Операторы группировки потоков и значений
 * 
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 * 
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
export const groupingOperatorList: IRunListItem[] = [];

//========================================================================================================================
//==================================================GROUPING OBSERVABLES==================================================
//========================================================================================================================
//

/**
 * combineAll
 * https://rxjs.dev/api/operators/combineLatestAll
 * возвращает крайние значения, если они пришли от всех асинхронных потоков
 * повторяет крайние значения
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

const combine1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const combine2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const combine3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));


// [ 1, 24, 1 ]
// const combine1$ = new BehaviorSubject(1);
// const combine2$ = new BehaviorSubject(1);
// const combine3$ = new BehaviorSubject(1);
// combine2$.next(22);
// combine2$.next(23);
// combine2$.next(24);

const combineAll$ = of(combine1$, combine2$, combine3$).pipe(
	// tap(logAll), //возвращает три потока наблюдателей
	combineAll()
)

// combineAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('combineAll поток закрыт'));
groupingOperatorList.push({ observable$: combineAll$ });

/**
 * combineLatest
 * https://rxjs.dev/api/index/function/combineLatest
 * !!! import from 'rxjs'
 * возвращает крайние значения combineLatest*
 * на старте ждёт значения от всех асинхронных потоков combineLatest*
 * !!! теряет начальные
 * кэширует все последующие
 * стартует - не работает внутри pipe
 * combineLatestParser для обработки всех входящих значений
 * combineLatest(combineLatest1$, combineLatest2$, combineLatest3$, combineLatestParser)
 * повторяет крайнее значение https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest
 * 

получил:  [303-1, 202-2, 0-3]
получил:  [404-1, 202-2, 0-3]
получил:  [404-1, 404-2, 0-3]
получил:  [505-1, 404-2, 0-3]
получил:  [606-1, 404-2, 0-3]
получил:  [606-1, 606-2, 0-3]
получил:  [707-1, 606-2, 0-3]
получил:  [808-1, 606-2, 0-3]
получил:  [808-1, 606-2, 505-3]
получил:  [808-1, 808-2, 505-3]
получил:  [909-1, 808-2, 505-3]
получил:  [909-1, 808-2, 1010-3]
combineLatest поток закрыт
 */
const combineLatestParser = ([item1, item2, item3]) => `[${item1}, ${item2}, ${item3}]`;
// const combineLatestParser = logAll;

// const combineLatest1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
// const combineLatest2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
// const combineLatest3$ = interval(505).pipe(take(3), map(item => item * 505 + '-3'));

// получил:  [1, 2, 3]
// получил:  [11, 2, 3]
// получил:  [11, 21, 3]
// получил:  [11, 21, 31]
// получил:  [12, 21, 31]
// получил:  [13, 21, 31]
const setCombineLatest1$ = new ReplaySubject(5);
const setCombineLatest2$ = new ReplaySubject(5);
const setCombineLatest3$ = new ReplaySubject(5);
const combineLatest1$ = setCombineLatest1$.asObservable();
const combineLatest2$ = setCombineLatest2$.asObservable();
const combineLatest3$ = setCombineLatest3$.asObservable();

// const combineLatest3$ = of(1).pipe(delay(1000), map(item => item * 1000 + '-3'));

const combineLatest$ = combineLatest([
		combineLatest1$, 
		combineLatest2$, 
		combineLatest3$,
	]).pipe(
		// take(9),
		map(combineLatestParser)
	)

combineLatest$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('combineLatest поток закрыт'));
setCombineLatest1$.next(11);
setCombineLatest2$.next(21);
setCombineLatest3$.next(31);
setCombineLatest1$.next(12);
setCombineLatest1$.next(13);
groupingOperatorList.push({ observable$: combineLatest$ });


/**
 * combineLatestWith
 * https://rxjs.dev/api/operators/combineLatestWith
 * 
 */
// const combineLatestWith1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
// const combineLatestWith2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
// const combineLatestWith3$ = interval(505).pipe(take(3), map(item => item * 505 + '-3'));

// [ 13, 21, 31 ]
const setCombineLatestWith1$ = new BehaviorSubject(1);
const setCombineLatestWith2$ = new BehaviorSubject(2);
const setCombineLatestWith3$ = new BehaviorSubject(3);
setCombineLatestWith1$.next(11);
setCombineLatestWith2$.next(21);
setCombineLatestWith3$.next(31);
setCombineLatestWith1$.next(12);
setCombineLatestWith1$.next(13);

const combineLatestWith1$ = setCombineLatestWith1$.asObservable();
const combineLatestWith2$ = setCombineLatestWith2$.asObservable();
const combineLatestWith3$ = setCombineLatestWith3$.asObservable();

const combineLatestWith$ = combineLatestWith1$.pipe(
		// take(9),
		combineLatestWith([
			combineLatestWith2$, 
			combineLatestWith3$
		]),
	)

// combineLatestWith$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('combineLatestWith поток закрыт'));
groupingOperatorList.push({ observable$: combineLatestWith$ });

/**
 * concat
 * Возвращает все значения всех потоков
 * Группирует значения по потокам
 * На вход значения, потоки в аргументах
 * @deprecated
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
concat поток закрыт
 */
const concat1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const concat2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const concat3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const concat$ = of(concat1$).pipe(
	// tap(logAll), //возвращает три потока наблюдателей
	mergeAll(),
	concat(concat2$, concat3$)
)

// concat$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('concat поток закрыт'));
groupingOperatorList.push({ observable$: concat$ });

/**
 * concatAll
 * https://rxjs.dev/api/operators/concatAll
 * аналог withLatestFrom
 * Возвращает все значения всех потоков
 * Группирует/выводит значения по потокам
 * не теряет
 * кэширует
 * не сохраняет порядок между потоками, только внутри

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
concatAll поток закрыт
 */
const concatAll1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const concatAll2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const concatAll3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));

// 1
// const concatAll1$ = new BehaviorSubject(1);
// const concatAll2$ = new BehaviorSubject(2);
// const concatAll3$ = new BehaviorSubject(3);
// concatAll3$.next(33);
// concatAll3$.next(34);
// concatAll3$.next(35);

const concatAll$ = of(concatAll1$, concatAll2$, concatAll3$).pipe(
	// tap(logAll), //возвращает три потока наблюдателей
	concatAll()
)

// concatAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('concatAll поток закрыт'));
groupingOperatorList.push({ observable$: concatAll$ });

/**
 * exhaust - истощение
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
const exhaust1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const exhaust2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const exhaust3$ = interval(2000).pipe(take(3), map(item => item * 303 + '-3'));
const exhaust4$ = of(1, 2, 3).pipe(delay(2000));
const exhaust$ = of(exhaust1$, exhaust2$, exhaust3$, exhaust4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	exhaust()
)

// exhaust$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('exhaust поток закрыт'));
groupingOperatorList.push({ observable$: exhaust$ });


/**
 * merge
 *  Возвращает все значения всех потоков
 * Комбинирует по времени получения, как пришло
 * на вход значения, потоки в аргументах
 * 
 * получил:  0-1
получил:  101-1
получил:  0-2
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
merge поток закрыт
 */

const merge1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const merge2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const merge3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const merge4$ = of(1, 2, 3).pipe(delay(2000));
const merge$ = of(merge1$).pipe(
	// tap(logAll), //возвращает три потока наблюдателей
	mergeAll(), // на вход значения из merge1$ вместо потока
	merge(merge2$, merge3$, merge4$)
)

// merge$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('merge поток закрыт'));
groupingOperatorList.push({ observable$: merge$ });

/**
 * mergeAll
 * Возвращает все значения всех потоков
 * Комбинирует по времени получения, как пришло

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
const mergeAll1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeAll2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeAll3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeAll4$ = of(1, 2, 3).pipe(delay(2000));
const mergeAll$ = of(mergeAll1$, mergeAll2$, mergeAll3$, mergeAll4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	mergeAll()
)

// mergeAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('mergeAll поток закрыт'));
groupingOperatorList.push({ observable$: mergeAll$ });


/**
 * withLatestFrom
 * аналог для concatAll
 * Возвращает массив/снимок текущих(крайних из кэша) значений потоков 
 * Возвращает из сигнального потока и из потоков аргументов withLatestFrom*
 * !!! Возвращает только после получения значений из основного(сигнального) потока
 * теряет начальные/промежуточные значения до очередного значения сигнального потока
 * кэширует все последующие
 * теряет начальные
 * 

получил:  [ '202-2', '202-1', '0-3', '0-4', '000-5' ]
получил:  [ '404-2', '404-1', '303-3', '0-4', '000-5' ]
получил:  [ '606-2', '606-1', '303-3', '0-4', '000-5' ]
получил:  [ '808-2', '808-1', '606-3', '0-4', '000-5' ]
withLatestFrom поток закрыт
 */
const withLatestFrom1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const withLatestFrom2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const withLatestFrom3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const withLatestFrom4$ = interval(404).pipe(take(1), map(item => item * 404 + '-4'));
const withLatestFrom5$ = of('000-5'); // кэшируется

// [ 2, 24 ]
// const withLatestFrom1$ = new BehaviorSubject(1);
// const withLatestFrom2$ = new BehaviorSubject(2);
// withLatestFrom1$.next(22);
// withLatestFrom1$.next(23);
// withLatestFrom1$.next(24);

const withLatestFrom$ = withLatestFrom2$.pipe( // сигнальный поток
	// take(3),
	withLatestFrom(
		withLatestFrom1$,
		withLatestFrom3$,
		withLatestFrom4$,
		withLatestFrom5$
	),
	// map(([item1,item2,item3,item4])=>logAll([item1,item2,item3,item4]))
)

// withLatestFrom$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('withLatestFrom поток закрыт'));
groupingOperatorList.push({ observable$: withLatestFrom$ });

//========================================================================================================================
//==================================================GROUPING VALUES=======================================================
//========================================================================================================================
//


/**
 * mergeMap aka flatMap
 * ждёт значение внешнего сигнального потока
 * подписывается на внутренний поток и выводит его
 * обрабатывает следующее значение сигнального потока не дожидаясь закрытия внутреннего
 * 
 * Преобразует каждый поток функцией аргументом mergeMapParse
 * Путает очерёдность
 * В данном случае значения потоков аккумулируются в массив
получил:  [ '0-3', '303-3', '606-3' ]
получил:  [ '0-2', '202-2', '404-2', '606-2', '808-2' ]
получил:  [
  '0-1',   '101-1',
  '202-1', '303-1',
  '404-1', '505-1',
  '606-1', '707-1',
  '808-1', '909-1'
]
получил:  [ 1, 2, 3 ]
mergeMap поток закрыт
 */
const mergeMapSrc1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeMapSrc2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeMapSrc3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeMapSrc4$ = of(1, 2, 3).pipe(delay(2000));

const mergeMapParse = item$ => item$.pipe(toArray())

const mergeMap$ = of(mergeMapSrc1$, mergeMapSrc2$, mergeMapSrc3$, mergeMapSrc4$).pipe(
	// tap(logAll), //возвращает 4 потока наблюдателей
	mergeMap(mergeMapParse),
	toArray() // один массив вместо 4 для удобства обработки
)

// mergeMap$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('mergeMap поток закрыт'));
groupingOperatorList.push({ observable$: mergeMap$ });

/**
 * mergeMap
 * Более сложный пример. Группировка аргументов. Используется для передачи внутрь *Src* потоков значений входящего потока
 * 
получил:  [Function]
получил:  Observable {
  _isScalar: false,
  source: Observable {
    _isScalar: false,
    source: Observable { _isScalar: false, _subscribe: [Function] },
    operator: TakeOperator { total: 10 }
  },
  operator: MapOperator { project: [Function], thisArg: undefined }
}
получил:  [Function]
получил:  Observable {
  _isScalar: false,
  source: Observable {
    _isScalar: false,
    source: Observable { _isScalar: false, _subscribe: [Function] },
    operator: TakeOperator { total: 10 }
  },
  operator: MapOperator { project: [Function], thisArg: undefined }
}
получил:  [Function]
получил:  Observable {
  _isScalar: false,
  source: Observable {
    _isScalar: false,
    source: Observable { _isScalar: false, _subscribe: [Function] },
    operator: TakeOperator { total: 10 }
  },
  operator: MapOperator { project: [Function], thisArg: undefined }
}
mergeMap2 поток закрыт
 */
const mergeMap2$ = mergeMapSrc4$.pipe(
	mergeMap(item => of(item1 => item1 + '-of', mergeMapSrc1$)),

)

// mergeMap2$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('mergeMap2 поток закрыт'));
groupingOperatorList.push({ observable$: mergeMap2$ });

/**
 * groupBy
 * Возвращает несколько потоков из значений, сгруппированных по возврату функции groupSort
 * Каждый новый уникальный возврат функции создаёт новый поток
[{'a':1,'b':'2'}]
[{'a':1,'b':'3'},{'a':2,'b':'3'}]
[{'a':1,'b':'4'}]
 */

const groupSort = item => item.b + 1;
const groupBy$ = of(
	{ a: 1, b: '2' },
	{ a: 1, b: '3' },
	{ a: 2, b: '3' },
	{ a: 1, b: '4' }
).pipe(
	groupBy(groupSort),
	mergeMap(item$ => item$.pipe(toArray()))
)

//groupBy$.subscribe((item) => logAll(JSON.stringify(item)))
groupingOperatorList.push({ observable$: groupBy$ });

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
const pairwise$ = interval(100).pipe(
	take(9),
	pairwise()
)

//pairwise$.subscribe((item) => logAll(JSON.stringify(item)))
groupingOperatorList.push({ observable$: pairwise$ });

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
const switchAll0$ = of(1, 2, 3).pipe(map(item => item * 1 + '-0'), tap(logAll), endWith('0-закрыт'));
const switchAll1$ = interval(101).pipe(delay(1000), take(5), map(item => item * 101 + '-1'), tap(logAll), endWith('1-закрыт'));
const switchAll2$ = interval(202).pipe(delay(1000), take(5), map(item => item * 202 + '-2'), tap(logAll), endWith('2-закрыт'));
const switchAll$ = of(switchAll0$, switchAll1$, switchAll2$).pipe(
	// mergeAll(), // для проверки асинхронности
	switchAll()
)

// switchAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('switchAll поток закрыт'));
groupingOperatorList.push({ observable$: switchAll$ });



/**
 * zip - ждёт значения от всех потоков, и выдаёт по одному от каждого в общий массив. 
 * Принимает на вход только значения, комбинирует с потоками-параметрами, 
 * 
 * 
[ '1-0', '1000-1', '1000-2' ]
[ '2-0', '1101-1', '1202-2' ]
[ '3-0', '1202-1', '1404-2' ]
[ '0-закрыт', '1303-1', '1606-2' ]
zip поток закрыт
 */

const zip1$ = of(1, 2, 3).pipe(map(item => item * 1 + '-0'),
	// tap(logAll),
	endWith('0-закрыт')
);
const zip2$ = interval(101).pipe(delay(1000), take(5), map(item => (item * 101 + 1000) + '-1'),
	// tap(logAll),
	endWith('1-закрыт')
);
const zip3$ = interval(202).pipe(delay(1000), take(5), map(item => (item * 202 + 1000) + '-2'),
	// tap(logAll),
	endWith('2-закрыт')
);

// [ 13, 21, 31 ]
// const setzip1$ = new BehaviorSubject(1);
// const setzip2$ = new BehaviorSubject(2);
// const setzip3$ = new BehaviorSubject(3);
// setzip1$.next(11);
// setzip2$.next(21);
// setzip3$.next(31);
// setzip1$.next(12);
// setzip1$.next(13);

// const zip1$ = setzip1$.asObservable();
// const zip2$ = setzip2$.asObservable();
// const zip3$ = setzip3$.asObservable();

// !!! import from rxjs
const zipStart$ = zip([zip1$, zip2$, zip3$]).pipe(
	// mergeAll(), // для проверки асинхронности
)

// zipStart$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('zipStart поток закрыт'));
// !!! import from operators
// zip$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('zip поток закрыт'));
groupingOperatorList.push({ observable$: zipStart$ });

/**
 * zipWith
 * https://rxjs.dev/api/index/function/zipWith
 */
// const zipWithParser = ([item1, item2, item3]) => `[${item1}, ${item2}, ${item3}]`;
// // const zipWithParser = logAll;

// // const zipWith1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
// // const zipWith2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
// // const zipWith3$ = interval(505).pipe(take(3), map(item => item * 505 + '-3'));

// // [13, 2, 3]
// const setzipWith1$ = new BehaviorSubject(1);
// const setzipWith2$ = new BehaviorSubject(2);
// const setzipWith3$ = new BehaviorSubject(3);
// setzipWith1$.next(11);
// setzipWith2$.next(21);
// setzipWith3$.next(31);
// setzipWith1$.next(12);
// setzipWith1$.next(13);

// const zipWith1$ = setzipWith1$.asObservable();
// const zipWith2$ = setzipWith2$.asObservable();
// const zipWith3$ = setzipWith3$.asObservable();

// // const zipWith3$ = of(1).pipe(delay(1000), map(item => item * 1000 + '-3'));

// const zipStart$ = zipWith1$.pipe(
// 		// take(9),
// 		zipWith([
// 			zipWith2$, 
// 			zipWith3$,
// 		]),
// 		map(zipWithParser)
// 	)

// // zipWith$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('zipWith поток закрыт'));
// groupingOperatorList.push({ observable$: zipWith$ });

/**
 * zipAll - ждёт значения от всех потоков, и выдаёт по одному от каждого в общий массив. 
 * Принимает на вход потоки
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
const zipAll0$ = of(1, 2, 3).pipe(map(item => item * 1 + '-0'),
	// tap(logAll),
	endWith('0-закрыт')
);
const zipAll1$ = interval(101).pipe(delay(1000), take(5), map(item => (item * 101 + 1000) + '-1'),
	// tap(logAll),
	endWith('1-закрыт')
);
const zipAll2$ = interval(202).pipe(delay(1000), take(5), map(item => (item * 202 + 1000) + '-2'),
	// tap(logAll),
	endWith('2-закрыт')
);
const zipAll$ = of(zipAll0$, zipAll1$, zipAll2$).pipe(
	// mergeAll(), // для проверки асинхронности
	zipAll()
)

// zipAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('zipAll поток закрыт'));
groupingOperatorList.push({ observable$: zipAll$ });

/**
 * race
 * Выводит значение из потока, первого имитировавшего значение
 * 
0-0
получил:  0-0
110-0
получил:  110-0
220-0
получил:  220-0
330-0
получил:  330-0
440-0
получил:  440-0
550-0
получил:  550-0
660-0
получил:  660-0
770-0
получил:  770-0
880-0
получил:  880-0
990-0
получил:  990-0
получил:  0-закрыт
race поток закрыт
 */

const raceSrc0$ = interval(110).pipe(take(10), map(item => item * 110 + '-0'),
	tap(logAll),
	endWith('0-закрыт')
);
const raceSrc1$ = interval(101).pipe(delay(500), take(5), map(item => (item * 101 + 500) + '-1'),
	tap(logAll),
	endWith('1-закрыт')
);
const raceSrc2$ = interval(101).pipe(delay(500), take(5), map(item => (item * 101 + 500) + '-2'),
	tap(logAll),
	endWith('2-закрыт')
);

const race$ = of(raceSrc2$).pipe(
	mergeAll(),
	race(raceSrc1$, raceSrc0$)
)

// race$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('race поток закрыт'));
groupingOperatorList.push({ observable$: race$ });


/**
 * forkJoin
 * выводит одно крайнее значение от каждого потока в виде массива после закрытия всех потоков
 * теряет
 * кэширует одно значение
 * выводит после закрытия потоков
 * ! необходимо ловить ошибки внутри каждого потока, чтобы не прерывать родительский forkJoin
 * https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin

ничоси-3
получил:  [ '909-1', '808-2', 'я норм-3' ]
forkJoin поток закрыт
 */

const forkJoinSrc1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));

const forkJoinSrc2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const forkJoinSrc3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'),
	map(item => {
		if (item === '606-3') {
			return throwError('ничоси-3');
		} else {
			return item;
		}
	}),
	mergeAll(), // вернули значение throwError в текущий поток иначе получим Observable { _isScalar: false, _subscribe: [Function] }
	catchError((error, caught$) => { logAll(error); return of('я норм-3') }), // если закомментировать, обработается в родительском потоке
	// endWith('2-закрыт'), // если раскомментировать, то ошибка не будет видна
);

// const forkJoin$ = forkJoin(forkJoinSrc1$, forkJoinSrc0$, forkJoinSrc2$).pipe( // @deprecated
const forkJoin$ = forkJoin([forkJoinSrc1$, forkJoinSrc2$, forkJoinSrc3$]).pipe(
	// tap(logAll),
	// mergeAll(),
	catchError((error, caught$) => { logAll(error); return of('error-forkJoin') }),
)

// forkJoin$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('forkJoin поток закрыт'));
groupingOperatorList.push({ observable$: forkJoin$ });

/**
 * iif
 * в зависимости от boolean возврата параметра-функции стартует один или другой поток
 * 
 * 0-0--
110-0--
220-0--
получил:  0-1
330-0--
получил:  101-1
440-0--
0-закрыт--
получил:  202-1
получил:  1-закрыт
получил:  500-2
получил:  602-2
получил:  500-2
получил:  704-2
получил:  2-закрыт
получил:  602-2
получил:  704-2
получил:  2-закрыт
получил:  500-2
получил:  602-2
получил:  500-2
получил:  500-2
получил:  704-2
получил:  2-закрыт
получил:  602-2
получил:  602-2
получил:  704-2
получил:  2-закрыт
получил:  704-2
получил:  2-закрыт
iif поток закрыт
 */


const iifSrc0$ = interval(110).pipe(take(5), map(item => item * 110 + '-0'),
	// tap(logAll),
	endWith('0-закрыт')
);
const iifSrc1$ = interval(101).pipe(take(3), map(item => (item * 101) + '-1'),
	// tap(logAll),
	endWith('1-закрыт')
);
const iifSrc2$ = interval(102).pipe(delay(500), take(3), map(item => (item * 102 + 500) + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
);

const iif$ = iifSrc0$.pipe(
	// mergeAll()
	// tap(logAll),
	mergeMap(item => iif(() => {
		logAll(item + '--');
		return item === '220-0'
	}, iifSrc1$, iifSrc2$
	)),
)

// iif$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('iif поток закрыт'));
groupingOperatorList.push({ observable$: iif$ });


