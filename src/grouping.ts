import { IRunListItem, logAll } from './utils';

import { interval, of, combineLatest } from 'rxjs';

import { take, map, combineAll, tap, concatAll, delay, exhaust, mergeAll, withLatestFrom, toArray, mergeMap, groupBy, pairwise, endWith, switchAll, zipAll } from 'rxjs/operators';

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

const combine1$ = interval(101).pipe(take(10), map(item => item * 101));
const combine2$ = interval(202).pipe(take(5), map(item => item * 202));
const combine3$ = interval(303).pipe(take(3), map(item => item * 303));
const combineAll$ = of(combine1$, combine2$, combine3$).pipe(
	// tap(logAll), //возвращает три потока наблюдателей
	combineAll()
)

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
const combineLatestParser = (item1, item2, item3) => `item1:${item1}-item2:${item2}-item3:${item3}`;
const combineLatest1$ = interval(101).pipe(take(10), map(item => item * 101));
const combineLatest2$ = interval(202).pipe(take(5), map(item => item * 202));
const combineLatest3$ = interval(303).pipe(take(3), map(item => item * 303));

// const combineLatest$ = combineLatest(combineLatest1$, combineLatest2$, combineLatest3$, combineLatestParser).pipe(
const combineLatest$ = combineLatest(combineLatest1$, combineLatest2$, combineLatest3$, combineLatestParser).pipe(
	take(9)
)

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
const concatAll1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const concatAll2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const concatAll3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const concatAll$ = of(concatAll1$, concatAll2$, concatAll3$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	concatAll()
)

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
const exhaust1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const exhaust2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const exhaust3$ = interval(2000).pipe(take(3), map(item => item * 303 + '-3'));
const exhaust4$ = of(1, 2, 3).pipe(delay(2000));
const exhaust$ = of(exhaust1$, exhaust2$, exhaust3$, exhaust4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	exhaust()
)

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
const mergeAll1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeAll2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeAll3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeAll4$ = of(1, 2, 3).pipe(delay(2000));
const mergeAll$ = of(mergeAll1$, mergeAll2$, mergeAll3$, mergeAll4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	mergeAll()
)

// mergeAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('mergeAll поток закрыт'));

/**
 * withLatestFrom
 * Возвращает массив текущих(предыдущих/крайних) значений потоков после получения значений из основного(сигнального) потока источника 
 * Возвращает из сигнального потока и из потоков аргументов withLatestFrom1, withLatestFrom2
 * Главный сигнальный поток - источник interval(303) withLatestFrom$
 * 

Hello World!
получил:  [ '0-3', '101-1', '0-2', 1 ]
получил:  [ '303-3', '404-1', '202-2', 1 ]
получил:  [ '606-3', '707-1', '606-2', 1 ]
withLatestFrom поток закрыт
 */
const withLatestFrom1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const withLatestFrom2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const withLatestFrom3$ = of(1);
//const withLatestFrom3 = of(1).pipe(delay(1000));
const withLatestFrom$ = interval(303).pipe(
	take(3),
	map(item => item * 303 + '-3'),
	withLatestFrom(withLatestFrom1$, withLatestFrom2$, withLatestFrom3$),
	//map(([item1,item2,item3,item4])=>logAll([item1,item2,item3,item4]))
)

// withLatestFrom$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('withLatestFrom поток закрыт'));


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
получил:['0-3', '303-3', '606-3']
получил:['0-1', '101-1', '202-1', '303-1', '404-1', '505-1', '606-1', '707-1', '808-1', '909-1']
получил:['0-2', '202-2', '404-2', '606-2', '808-2']
получил:[1, 2, 3]
 */
const mergeMap1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeMap2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeMap3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeMap4$ = of(1, 2, 3).pipe(delay(2000));
const mergeMapArray = item$ => item$.pipe(toArray())
const mergeMap$ = of(mergeMap1$, mergeMap2$, mergeMap3$, mergeMap4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	mergeMap(mergeMapArray)
)

//mergeMap$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('mergeMap поток закрыт'));

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
const zipAll0$ = of(1, 2, 3).pipe(map(item => item * 1 + '-0'), tap(logAll), endWith('0-закрыт'));
const zipAll1$ = interval(101).pipe(delay(1000), take(5), map(item => (item * 101 + 1000) + '-1'), tap(logAll), endWith('1-закрыт'));
const zipAll2$ = interval(202).pipe(delay(1000), take(5), map(item => (item * 202 + 1000) + '-2'), tap(logAll), endWith('2-закрыт'));
const zipAll$ = of(zipAll0$, zipAll1$, zipAll2$).pipe(
	// mergeAll(), // для проверки асинхронности
	zipAll()
)

// zipAll$.subscribe(item => logAll(item), null, () => logAll('zipAll поток закрыт'));
