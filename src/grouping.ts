import { IRunListItem, logAll } from './utils';

import { interval, of, combineLatest, forkJoin, iif, from, throwError } from 'rxjs';

import { take, map, combineAll, tap, concatAll, delay, exhaust, mergeAll, withLatestFrom, toArray, mergeMap, groupBy, pairwise, endWith, switchAll, zipAll, zip, merge, concat, race, catchError, sequenceEqual, switchMap } from 'rxjs/operators';

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
groupingOperatorList.push({ observable$: combineAll$ });

/**
 * combineLatest
 * возвращает крайние значения combineLatestX$
 * на старте ждёт значения от всех асинхронных потоков combineLatestX$
 * !!!не работает внутри pipe
 * @deprecated Есть необязательный аргумент combineLatestParser для обработки всех входящих значений
 * combineLatest(combineLatest1$, combineLatest2$, combineLatest3$, combineLatestParser)
 * https://www.learnrxjs.io/operators/combination/combinelatest.html
 * 

Hello World!
получил:  item1:101--item2:0--item3:0
получил:  item1:202--item2:0--item3:0
получил:  item1:202--item2:202--item3:0
получил:  item1:303--item2:202--item3:0
получил:  item1:404--item2:202--item3:0
получил:  item1:404--item2:202--item3:303
получил:  item1:404--item2:404--item3:303
получил:  item1:505--item2:404--item3:303
получил:  item1:606--item2:404--item3:303
получил:  item1:606--item2:606--item3:303
получил:  item1:707--item2:606--item3:303
получил:  item1:707--item2:606--item3:606
получил:  item1:707--item2:606--item3:303-закрыт
получил:  item1:808--item2:606--item3:303-закрыт
получил:  item1:808--item2:808--item3:303-закрыт
получил:  item1:808--item2:202-закрыт--item3:303-закрыт
получил:  item1:909--item2:202-закрыт--item3:303-закрыт
получил:  item1:101-закрыт--item2:202-закрыт--item3:303-закрыт
combineLatest поток закрыт
 */
const combineLatestParser = ([item1, item2, item3]) => `item1:${item1}--item2:${item2}--item3:${item3}`;
const combineLatest1$ = interval(101).pipe(take(10), map(item => item * 101), endWith('101-закрыт'));
const combineLatest2$ = interval(202).pipe(take(5), map(item => item * 202), endWith('202-закрыт'));
const combineLatest3$ = interval(303).pipe(take(3), map(item => item * 303), endWith('303-закрыт'));

const combineLatest$ = combineLatest([combineLatest1$, combineLatest2$, combineLatest3$]).pipe(
	// take(9),
	map(combineLatestParser)
)

// combineLatest$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('combineLatest поток закрыт'));
groupingOperatorList.push({ observable$: combineLatest$ });

/**
 * concat
 * Возвращает все значения всех потоков
 * Группирует значения по потокам
 * На вход значения, потоки в аргументах
 * 
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

// concatAll$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('concatAll поток закрыт'));
groupingOperatorList.push({ observable$: concatAll$ });

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
 * Возвращает массив/снимок текущих(крайних) значений потоков после получения значений из основного(сигнального) потока источника 
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
groupingOperatorList.push({ observable$: withLatestFrom$ });

//========================================================================================================================
//==================================================GROUPING VALUES=======================================================
//========================================================================================================================
//


/**
 * mergeMap aka flatMap
 * Собирает все значения каждого поток поочерёдно
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

const zip0$ = of(1, 2, 3).pipe(map(item => item * 1 + '-0'),
	// tap(logAll),
	endWith('0-закрыт')
);
const zip1$ = interval(101).pipe(delay(1000), take(5), map(item => (item * 101 + 1000) + '-1'),
	// tap(logAll),
	endWith('1-закрыт')
);
const zip2$ = interval(202).pipe(delay(1000), take(5), map(item => (item * 202 + 1000) + '-2'),
	// tap(logAll),
	endWith('2-закрыт')
);
const zip$ = of(zip0$).pipe(
	mergeAll(), // для проверки асинхронности
	zip(zip1$, zip2$),
)

// zip$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('zip поток закрыт'));
groupingOperatorList.push({ observable$: zip$ });

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
 * выводит одно крайнее значение от каждого потока в виде массива
 * ! необходимо ловить ошибки внутри каждого потока, чтобы не прерывать родительский forkJoin
 * https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin

0-0
110-0
220-0
330-0
440-0
500-1
500-2
550-0
601-1
601-2
660-0
702-1
702-2
Error: ничоси
770-0
803-1
880-0
904-1
990-0
получил:  [ '1-закрыт', '0-закрыт', '2-закрыт' ]
forkJoin поток закрыт
 */

const forkJoinSrc0$ = interval(110).pipe(
	take(10),
	map(item => item * 110 + '-0'),
	// tap(logAll),
	endWith('0-закрыт')
);
const forkJoinSrc1$ = interval(101).pipe(
	delay(500),
	take(5),
	map(item => (item * 101 + 500) + '-1'),
	// tap(logAll),
	endWith('1-закрыт')
);
const forkJoinSrc2$ = interval(101).pipe(
	delay(500), 
	take(5), 
	map(item => (item * 101 + 500) + '-2'),
	// tap(logAll),
	map(item => {
		if (item === '702-2') {
			return throwError('ничоси');
		} else {
			return item;
		}
	}),
	catchError((error, caught$) => { logAll(error); return of('error-forkJoinSrc2') }),
	endWith('2-закрыт'),
);

const forkJoin$ = forkJoin(forkJoinSrc1$, forkJoinSrc0$, forkJoinSrc2$).pipe(
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


