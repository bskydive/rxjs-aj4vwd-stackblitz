import { IRunListItem, logAll } from './utils';
import { interval, of, from, throwError } from 'rxjs';
import { take, map, endWith, tap, every, mergeAll, isEmpty, sequenceEqual, count, switchMap, delay, mergeMap, catchError } from 'rxjs/operators';

import { transformingOperatorList } from './transforming';
import { EMPTY } from 'rxjs/internal/observable/empty';


/**
 * Операторы вспоможения в трудах
 * 
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 * 
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
export const toolingOperatorList: IRunListItem[] = [];

//========================================================================================================================
//==================================================UTILITY===============================================================
//========================================================================================================================
//

/**
 * count
 * Выводит количество значений имитированных входным потоком
 * 
 * Hello World!
получил:  4
count поток закрыт
 */

const count1$ = interval(101).pipe(take(3), map(item => item * 101 + '-1'), endWith('1-закрыто'));

const count$ = count1$.pipe(
	// tap(logAll),
	count(),
)

// count$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('count поток закрыт'));
transformingOperatorList.push({ observable$: count$ });

/**
 * every
 * проверяет значения входного потока функцией isEveryLess400
 * если true, выводит после закрытия потока true
 * если поймал false, выводит false и отписывается
 * 
 * Hello World!
0
isLess400 0
0
isLess400 0
101
isLess400 101
202
isLess400 202
получил:  true
получил:  1-закрыто
202
isLess400 202
404
isLess400 404
получил:  false
получил:  2-закрыто
every поток закрыт
 */

const isEveryLess400 = item => {
	logAll('isLess400', item);
	return item < 400
};

const every1$ = interval(101).pipe(
	take(3),
	map(item => item * 101),
	tap(logAll),
	every(isEveryLess400),
	endWith('1-закрыто')
);

const every2$ = interval(202).pipe(
	take(3),
	map(item => item * 202),
	tap(logAll),
	every(isEveryLess400),
	endWith('2-закрыто')
);

const every$ = of(every1$, every2$).pipe(
	// tap(logAll),
	mergeAll()
)

// every$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('every поток закрыт'));
transformingOperatorList.push({ observable$: every$ });

/**
 * isEmpty
 * имитирует true, если входной поток закрыт без значений
 * имитирует false и отписывается, если получено значение
 * 
 * Hello World!
получил:  true
получил:  1-закрыто
0
получил:  false
получил:  2-закрыто
isEmpty поток закрыт
 */

const isEmpty1$ = interval(101).pipe(
	take(0),
	map(item => item * 101),
	tap(logAll),
	isEmpty(),
	endWith('1-закрыто')
);

const isEmpty2$ = interval(202).pipe(
	take(3),
	map(item => item * 202),
	tap(logAll),
	isEmpty(),
	endWith('2-закрыто')
);

const isEmpty$ = of(isEmpty1$, isEmpty2$).pipe(
	// tap(logAll),
	mergeAll()
)

// isEmpty$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('isEmpty поток закрыт'));
transformingOperatorList.push({ observable$: isEmpty$ });

/**
 * EMPTY
 * формирует пустое значение Observable<never>
 * используется для удаления значений из потока или подмены ошибки
 * 
получил:  0-1
получил:  101-1
получил:  Observable { _isScalar: false, _subscribe: [Function] }
получил:  202-1
получил:  303-1
получил:  404-1
получил:  Observable { _isScalar: false, _subscribe: [Function] }
получил:  505-1
получил:  606-1
получил:  707-1
получил:  Observable { _isScalar: false, _subscribe: [Function] }
получил:  808-1
получил:  909-1
isEmpty поток закрыт
 */
const empty1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const empty2$ = interval(303).pipe(take(3), map(item => throwError(item * 303 + '-3'))); // поток ошибок

/* eslint-disable node/handle-callback-err */
const empty$ = of(empty1$, empty2$).pipe(
	mergeAll(),
	catchError(err => EMPTY),
)

// empty$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('isEmpty поток закрыт'));
transformingOperatorList.push({ observable$: isEmpty$ });

/**
 * sequenceEqual
 * сравнивает значения входного потока и потока-аргумента
 * время игнорируется
 * 
 * Hello World!
0-1
0-2
0-2другой
получил:  false
получил:  2-закрыто
0-1
101-1
202-1
101-1
202-1
получил:  true
получил:  1-закрыто
sequenceEqual поток закрыт
 */


const sequenceEqualSrc1Control$ = interval(101).pipe(
	take(3),
	map(item => item * 101 + '-1'),
	tap(logAll)
);

const sequenceEqualSrc1$ = interval(202).pipe( // !время разное
	take(3),
	map(item => item * 101 + '-1'),
	tap(logAll),
	sequenceEqual(sequenceEqualSrc1Control$),
	endWith('1-закрыто')
);

const sequenceEqualSrc2Control$ = interval(101).pipe(
	take(3),
	map(item => item * 101 + '-2'),
	tap(logAll)
);

const sequenceEqualSrc2$ = interval(101).pipe(
	take(3),
	map(item => item * 101 + '-2другой'),
	tap(logAll),
	sequenceEqual(sequenceEqualSrc2Control$),
	endWith('2-закрыто')
);

const sequenceEqual$ = of(sequenceEqualSrc1$, sequenceEqualSrc2$).pipe(
	// tap(logAll),
	mergeAll()
)

// sequenceEqual$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('sequenceEqual поток закрыт'));
transformingOperatorList.push({ observable$: sequenceEqual$ });


/**
 * sequenceEqual
 * пример с логированием перед сравнением потока
 * 
 * 
сравниваем: {"_isScalar":false,"source":{"_isScalar":false,"source":{"_isScalar":false},"operator":{"total":5}},"operator":{}}
сравниваем: {"_isScalar":false,"source":{"_isScalar":false,"source":{"_isScalar":false,"source":{"_isScalar":false},"operator":{"delay":500,"scheduler":{"actions":[],"active":false}}},"operator":{"total":5}},"operator":{}}
сравниваем: {"_isScalar":false,"source":{"_isScalar":false,"source":{"_isScalar":false},"operator":{"total":5}},"operator":{}}
разные: 0 !== "0-1"
получил:  false
получил:  true
получил:  true
sequenceEqual2 поток закрыт
 */

const sequenceEqualSrc3$ = interval(101).pipe(take(5), map(item => item * 101 + '-1'),
	// tap(logAll),
	// endWith('0-закрыт')
);
const sequenceEqualSrc4$ = interval(201).pipe(delay(500), take(5), map(item => item * 101 + '-1'), // другой интервал и задержка
	// tap(logAll),
	// endWith('1-закрыт')
);
const sequenceEqualSrc5$ = interval(101).pipe(take(5), map(item => item * 101),
	// tap(logAll),
	// endWith('1-закрыт')
);

const sequenceEqual2SrcControl$ = interval(101).pipe(take(5), map(item => item * 101 + '-1'),
	// tap(logAll),
	// endWith('2-закрыт'),
);

const isSequenceEqual = (item1: any, item2: any) => {
	if (item1 === item2) {
		return true;
	} else {
		logAll(`разные: ${JSON.stringify(item1)} !== ${JSON.stringify(item2)}`);
		return false;
	}
};

const sequenceEqual2$ = of(sequenceEqualSrc3$, sequenceEqualSrc4$, sequenceEqualSrc5$).pipe(
	// tap(logAll),
	mergeMap(item$ => {
		// логируем что сравнили
		logAll('сравниваем: ' + JSON.stringify(item$));
		return from(item$).pipe(sequenceEqual(sequenceEqual2SrcControl$, isSequenceEqual));
		// return from(item$).pipe(sequenceEqual(sequenceEqual2SrcControl$));
	}),
)

// sequenceEqual2$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('sequenceEqual2 поток закрыт'));
toolingOperatorList.push({ observable$: sequenceEqual2$ });

/**
 * sequenceEqual
 * Пример с функцией-сравнением
 * 
 * разные: "0-1" !== 0
получил:  false
получил:  true
разные: "0-1" !== 0
получил:  false
sequenceEqual3 поток закрыт
 */

const sequenceEqual3$ = of(sequenceEqualSrc3$, sequenceEqualSrc4$, sequenceEqualSrc5$).pipe(
	// tap(logAll),
	mergeMap(sequenceEqual(sequenceEqualSrc5$, isSequenceEqual)), // сравниваем параллельно сразу с двумя потоками
)

// sequenceEqual3$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('sequenceEqual3 поток закрыт'));
toolingOperatorList.push({ observable$: sequenceEqual3$ });
