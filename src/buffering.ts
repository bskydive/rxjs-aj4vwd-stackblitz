import { interval } from 'rxjs';
import { take, map, buffer, bufferCount, bufferTime, tap, bufferToggle, bufferWhen, switchMap, toArray, windowCount, windowTime, windowToggle, windowWhen, window, endWith } from 'rxjs/operators';
import { logAll, IRunListItem } from './utils';

/**
 * Операторы буферизации buffer*, window*
 * 
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 * 
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
export const bufferingOperatorList: IRunListItem[] = [];

//========================================================================================================================
//==================================================BUFFER================================================================
//========================================================================================================================

/**
 * buffer
 * Полезен для создания листалки, ограничения большого потока значений.
 * Кэширует из входного потока, и возвращает одним массивом
 * Отсекает по каждому значению от параметра-наблюдателя
 * 
 * 
Hello World!
получил:  [ 0 ]
получил:  [ 101, 202 ]
получил:  [ 303, 404 ]
buffer поток закрыт
 */
const bufferCloseSignal$ = interval(202);

const buffer$ = interval(101).pipe(
	take(7),
	map(item => item * 101),
	buffer(bufferCloseSignal$),
	endWith('buffer поток закрыт')
);

//buffer$.subscribe((item) => logAll('получил: ', item), null, () => logAll('buffer поток закрыт'));
bufferingOperatorList.push({ observable$: buffer$ });

/**
 * bufferCount
 * Кэширует из входного потока, и возвращает одним массивом
 * Завершает набор в кэш по параметру-количеству значений
 * 
 * 
 * bufferCount(bufferCountSize),
Hello World!
получил:  [ 0, 101, 202 ]
получил:  [ 303, 404 ]
bufferCount поток закрыт

bufferCount(bufferCountLengthSize, bufferCountLengthStartNew),
Hello World!
получил:  [ 0, 101, 202 ]
получил:  [ 202, 303, 404 ]
получил:  [ 404 ]
bufferCount поток закрыт
 */
const bufferCountSize = 3;
const bufferCountStartNew = 2;

const bufferCount$ = interval(101).pipe(
	take(5),
	map(item => item * 101),
	bufferCount(bufferCountSize),
	bufferCount(bufferCountSize, bufferCountStartNew),
);

//bufferCount$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferCount поток закрыт'));
bufferingOperatorList.push({ observable$: bufferCount$ });

/**
 * bufferTime
 * Кэширует из входного потока, и возвращает одним массивом
 * Завершает набор в буфер по параметру-времени
 * Начинает заполнять новый буфер по второму параметру-времени
 * 
 * 
Hello World!
получил:  [ 0 ]
получил:  [ 0, 101 ]
получил:  [ 101, 202 ]
bufferTime поток закрыт
 */

const bufferTimeSize = 202;
const bufferTimeCreateNew = 102;

const bufferTime$ = interval(101).pipe(
	take(3),
	map(item => item * 101),
	bufferTime(bufferTimeSize, bufferTimeCreateNew),
)

//bufferTime$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferTime поток закрыт'));
bufferingOperatorList.push({ observable$: bufferTime$ });

/**
 * bufferToggle
 * Кэширует из входного потока, и возвращает одним массивом
 * асинхронный старт и стоп буфера по сигналу(значению) из параметров-наблюдателей 
 * открываем новый буфер каждое bufferOpen$ значение, стартуем bufferClose$, закрываем с первым bufferClose$ значением
 * 
 * 
Hello World!
bufferOpen:  0
bufferClose:  0
получил:  [ 303, 404, 505 ]
bufferOpen:  404
bufferClose:  0
получил:  [ 707, 808, 909 ]
bufferOpen:  808
bufferClose:  0
получил:  [ 1111, 1212, 1313 ]
bufferOpen:  1212
bufferClose:  0
получил:  [ 1515, 1616, 1717 ]
bufferOpen:  1616
получил:  [ 1919 ]
bufferToggle поток закрыт
*/

const bufferOpen$ = interval(404).pipe(
	tap(item => logAll('bufferOpen: ', item * 404))
)
const bufferClose$ = () => interval(303).pipe(
	tap(item => logAll('bufferClose: ', item * 303))
)

const bufferToggle$ = interval(101).pipe(
	take(20),
	map(item => item * 101),
	bufferToggle(bufferOpen$, bufferClose$),
)

//bufferToggle$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferToggle поток закрыт'));
bufferingOperatorList.push({ observable$: bufferToggle$ });

/**
 * bufferWhen
 * Кэширует из входного потока, и возвращает одним массивом
 * выбор времени закрытия буфера
 * 
Hello World!
bufferWhenInterval1$: 0
получил:  [ 0, 101, 202, 303 ]
bufferWhenInterval1$: 303
получил:  [ 404, 505, 606, 707, 808 ]
bufferWhenInterval2$: 808
получил:  [ 909, 1010 ]
bufferWhenInterval2$: 1010
получил:  [ 1111, 1212 ]
bufferWhenInterval2$: 1212
получил:  [ 1313, 1414 ]
bufferWhenInterval2$: 1414
получил:  [ 1515, 1616 ]
bufferWhenInterval2$: 1616
получил:  [ 1717, 1818 ]
bufferWhenInterval2$: 1818
получил:  [ 1919 ]
bufferWhen поток закрыт
*/
let bufferWhenCount = 0;
const bufferWhenInterval1$ = interval(505).pipe(map(item => item * 505 + '-1'));
const bufferWhenInterval2$ = interval(202).pipe(map(item => item * 202 + '-2'));

const bufferWhen$ = interval(101).pipe(
	take(20),
	map(item => item * 101),
	tap(item => { bufferWhenCount = item }), // поскольку bufferWhen не принимает параметры, храним условие в отдельной переменной
	bufferWhen(() => {
		if (bufferWhenCount < 500) {
			logAll('bufferWhenInterval1$: ' + bufferWhenCount);
			return bufferWhenInterval1$;
		} else {
			logAll('bufferWhenInterval2$: ' + bufferWhenCount);
			return bufferWhenInterval2$;
		}
	})
)

//bufferWhen$.subscribe((item) => logAll('получил: ', item), null, () => logAll('bufferWhen поток закрыт'));
bufferingOperatorList.push({ observable$: bufferWhen$ });

//========================================================================================================================
//==================================================WINDOW================================================================
//========================================================================================================================

/**
 * window
 * 'нарезка'. В отличии от buffer возвращает потоки. Полезен для создания листалки, ограничения большого потока значений.
 * Возвращает новый поток(буфер) по таймеру, предыдущий закрывает
 
Hello World!
0-windowCloseInterval
получил:  [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
1000-windowCloseInterval
получил:  [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]
получил:  [ 19 ]
window поток закрыт
*/

const windowCloseInterval$ = interval(1000).pipe(
	map(item => item * 1000 + '-windowCloseInterval'),
	tap(logAll),
);

const window$ = interval(101).pipe(
	take(20),
	window(windowCloseInterval$),
	switchMap(item$ => item$.pipe(
		toArray(),
	)),
)

// window$.subscribe((item) => logAll('получил: ', item), null, () => logAll('window поток закрыт'));
bufferingOperatorList.push({ observable$: window$ });

/**
 * windowCount
 * 
 * Возвращает новый поток(буфер) по количеству значений, предыдущий закрывает
 * 
windowCount(windowCountSize),
['windowCount', 0, 1]
['windowCount', 2, 3]
['windowCount', 4, 5]
['windowCount', 6, 7]
['windowCount', 8, 9]
['windowCount']

windowCount(windowCountSize, windowCountStartNew),
['windowCount', 0, 1]
['windowCount', 3, 4]
['windowCount', 6, 7]
['windowCount', 9]
*/

const windowCountSize = 2;
const windowCountStartNew = 3;

const windowCount$ = interval(101).pipe(
	take(10),
	map(item => item * 101),
	// windowCount(windowCountSize),
	windowCount(windowCountSize, windowCountStartNew),
	switchMap(item$ => item$.pipe(
		toArray()
	)),
)

// windowCount$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowCount поток закрыт'));
bufferingOperatorList.push({ observable$: windowCount$ });


/**
 * WindowTime
 * Возвращает новый поток(буфер) по времени, предыдущий закрывает

Hello World!
получил:  [ 0 ]
получил:  [ 101, 202 ]
получил:  [ 303, 404 ]
получил:  [ 505, 606 ]
получил:  [ 707, 808 ]
получил:  [ 909 ]
windowCount поток закрыт
 */

const windowTimeSize = 202;

const windowTime$ = interval(101).pipe(
	take(10),
	map(item => item * 101),
	windowTime(windowTimeSize),
	switchMap(item$ => item$.pipe(
		toArray(),
	)),
)

//windowTime$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowTime поток закрыт'));
bufferingOperatorList.push({ observable$: windowTime$ });

/**
 * windowToggle
 * Возвращает новый поток(буфер) по значению от параметров-наблюдателей, предыдущий закрывает
Hello World!
windowOpen 0
windowClose 0
получил:  [ 303, 404, 505 ]
windowOpen 1
получил:  [ 707, 808, 909 ]
windowToggle поток закрыт
 */
let windowToggleCount = 0;
const windowOpen$ = interval(404).pipe(map(() => logAll('windowOpen', windowToggleCount)))
const windowClose$ = () => interval(303).pipe(
	map(() => logAll('windowClose', windowToggleCount++)) // увеличиваем счётчик во внешней переменной
)

const windowToggle$ = interval(101).pipe(
	take(10),
	map(item => item * 101),
	windowToggle(windowOpen$, windowClose$),
	switchMap(item$ => item$.pipe(
		toArray(),
	)),
)

//windowToggle$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowToggle поток закрыт'));
bufferingOperatorList.push({ observable$: windowToggle$ });

/**
 * windowWhen
 * Возвращает новый поток(буфер) по значению от параметров-наблюдателей, предыдущий закрывает
 * выбор времени закрытия буфера 
 * 
 Hello World!
получил:  [ 0, 101, 202, 303 ]
получил:  [ 404, 505, 606, 707, 808 ]
получил:  [ 909 ]
windowWhen поток закрыт
*/
let windowWhenCount = 0;
const windowWhenInterval1$ = interval(505);
const windowWhenInterval2$ = interval(202);

const windowWhen$ = interval(101).pipe(
	take(10),
	map(item => item * 101),
	map(item => (windowWhenCount = item)), // windowWhen е принимает параметров, потому используем внешнюю переменную
	windowWhen(() => {
		if (windowWhenCount < 500) {
			return windowWhenInterval1$;
		} else {
			return windowWhenInterval2$
		}
	}),
	switchMap(item$ => item$.pipe(
		toArray(),
	))
)

//windowWhen$.subscribe((item) => logAll('получил: ', item), null, () => logAll('windowWhen поток закрыт'));
bufferingOperatorList.push({ observable$: windowWhen$ });
