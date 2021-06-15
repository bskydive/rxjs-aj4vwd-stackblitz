
import { logAll, IRunListItem } from './utils';
import { interval, of } from 'rxjs';
import { take, map, endWith, skip, mergeAll, skipLast, skipUntil, skipWhile, takeLast, takeUntil, takeWhile, distinct, distinctUntilChanged, distinctUntilKeyChanged, filter, tap, sample, audit, throttle, first, last, min, max, elementAt, find, findIndex, single } from 'rxjs/operators';

/**
 * Операторы фильтрации
 * 
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 * 
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
export const filteringOperatorList: IRunListItem[] = [];

//========================================================================================================================
//==================================================FILTERING ONE=========================================================
//========================================================================================================================
//указанные операторы получают и возвращают значения в потоке

/**
 * skip
 * скрывает указанное количество значений


получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  306-2
получил:  404-1
получил:  101-закрыт
получил:  408-2
получил:  102-закрыт
skip поток закрыт
 */

const skipSrc1$ = interval(101).pipe(take(5), map(item => item * 101 + '-1'), endWith('101-закрыт'));
const skipSrc2$ = interval(102).pipe(
	take(5),
	map(item => item * 102 + '-2'),
	skip(3), endWith('102-закрыт')
);

const skip$ = of(skipSrc1$, skipSrc2$).pipe(
	mergeAll()
)

//skip$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
filteringOperatorList.push({ observable$: skip$ });

/**
 * skipLast
 * скрывает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений


получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  0-2
получил:  404-1
получил:  101-закрыт
получил:  102-2
получил:  102-закрыт
skipLast поток закрыт
 */
const skipLastSrc1$ = interval(101).pipe(take(5), map(item => item * 101 + '-1'), endWith('101-закрыт'));
const skipLastSrc2$ = interval(102).pipe(
	take(5),
	map(item => item * 102 + '-2'),
	skipLast(3),
	endWith('102-закрыт')
);

const skipLast$ = of(skipLastSrc1$, skipLastSrc2$).pipe(
	mergeAll()
)

//skipLast$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skipLast поток закрыт'));
filteringOperatorList.push({ observable$: skipLast$ });

/**
 * skipUntil
 * скрывает значения потока до момента получения первого значения из аргумента наблюдателя

получил:  0-1
получил:  101-1
получил:  202-1
получил:  204-2
получил:  303-1
получил:  306-2
получил:  404-1
получил:  101-закрыт
получил:  408-2
получил:  102-закрыт
skipUntil поток закрыт
 */
const skipUntilSrc1$ = interval(101).pipe(take(5), map(item => item * 101 + '-1'), endWith('101-закрыт'));

const skipUntilSignal$ = interval(303).pipe(take(1), map(item => item * 303 + '-1'), endWith('303-закрыт'));

const skipUntilSrc2$ = interval(102).pipe(
	take(5),
	map(item => item * 102 + '-2'),
	skipUntil(skipUntilSignal$),
	endWith('102-закрыт')
);

const skipUntil$ = of(skipUntilSrc1$, skipUntilSrc2$).pipe(
	mergeAll()
)

//skipUntil$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skipUntil поток закрыт'));
filteringOperatorList.push({ observable$: skipUntil$ });

/**
 * skipWhile
 * скрывает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false

получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  306-2
получил:  404-1
получил:  101-закрыт
получил:  408-2
получил:  102-закрыт
skipWhile поток закрыт
 */


const skipWhileSrc1$ = interval(101).pipe(take(5), map(item => item * 101 + '-1'), endWith('101-закрыт'));

const isSkipWhile = item => item !== '306-2';

const skipWhileSrc2$ = interval(102).pipe(
	take(5),
	map(item => item * 102 + '-2'),
	skipWhile(isSkipWhile),
	endWith('102-закрыт')
);

const skipWhile$ = of(skipWhileSrc1$, skipWhileSrc2$).pipe(
	mergeAll()
)

//skipWhile$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skipWhile поток закрыт'));
filteringOperatorList.push({ observable$: skipWhile$ });

/**
 * take
 * возвращает указанное количество значений

получил:  0-1
получил:  101-1
получил:  202-1
получил:  303-1
получил:  404-1
получил:  101-закрыт
take поток закрыт
 */
const take$ = interval(101).pipe(
	take(5),
	map(item => item * 101 + '-1'),
	endWith('101-закрыт')
);

//take$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('take поток закрыт'));
filteringOperatorList.push({ observable$: take$ });

/**
 * takeLast
 * возвращает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений


получил:  707-1
получил:  808-1
получил:  909-1
получил:  101-закрыт
takeLast поток закрыт
 */
const takeLast$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	takeLast(3),
	endWith('101-закрыт')
);

//takeLast$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('takeLast поток закрыт'));
filteringOperatorList.push({ observable$: takeLast$ });

/**
 * takeUntil
 * Возвращает поток до момента получения первого значения из аргумента наблюдателя takeUntilComplete$
 * Прерывает поток при получении первого значения из аргумента наблюдателя takeUntilComplete$
 * Используется для очистки мусора, как завершающий оператор


получил:  0-1
получил:  0-2
получил:  101-1
получил:  102-2
получил:  102-закрыт
получил:  202-1
получил:  303-1
получил:  404-1
получил:  101-закрыт
takeUntil поток закрыт
 */

const takeUntilSrc1$ = interval(101).pipe(take(5), map(item => item * 101 + '-1'), endWith('101-закрыт'));

const takeUntilSignal$ = interval(303).pipe(take(1), map(item => item * 303 + '-3'), endWith('303-закрыт'));
/*
//более сложный пример с событием из DOM, надо нажать на кнопку
const takeUntil2ButtonElement = document.getElementById('id-tight-button');
const takeUntilSignal$ = fromEvent(takeUntil2ButtonElement, 'click');
*/

const takeUntilSrc2$ = interval(102).pipe(
	take(5),
	map(item => item * 102 + '-2'),
	takeUntil(takeUntilSignal$),
	endWith('102-закрыт')
);

const takeUntil$ = of(takeUntilSrc1$, takeUntilSrc2$).pipe(
	mergeAll()
)

//takeUntil$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('takeUntil поток закрыт'));
filteringOperatorList.push({ observable$: takeUntilSignal$ });


/**
 * takeWhile
 * возвращает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false

получил:  0-1
isTakeWhile true
получил:  0-2
получил:  101-1
isTakeWhile true
получил:  102-2
получил:  202-1
isTakeWhile true
получил:  204-2
получил:  303-1
isTakeWhile false
получил:  2-закрыт
получил:  404-1
получил:  505-1
получил:  606-1
получил:  707-1
получил:  808-1
получил:  909-1
получил:  1-закрыт
takeWhile поток закрыт
 */
const takeWhileSrc1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'), endWith('1-закрыт'));

const isTakeWhile = item => { 
	const result = item !== '306-2'; 
	console.log('isTakeWhile', result); 
	return result
};

const takeWhileSrc2$ = interval(102).pipe(
	take(10),
	map(item => item * 102 + '-2'),
	takeWhile(isTakeWhile),
	endWith('2-закрыт')
);

const takeWhile$ = of(takeWhileSrc1$, takeWhileSrc2$).pipe(
	mergeAll()
)

// takeWhile$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('takeWhile поток закрыт'));
filteringOperatorList.push({ observable$: takeWhile$ });

/**
 * distinct
 * возвращает только уникальные значения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * можно передать функцию предварительной обработки значений


получил:  0
получил:  101
получил:  202
получил:  303
получил:  404
получил:  101-закрыт
получил:  102-закрыт
distinct поток закрыт
 */
const distinctSrc1$ = interval(101).pipe(take(5), map(item => item * 101), endWith('101-закрыт'));
const distinctSrc2$ = interval(101).pipe(take(5), map(item => item * 101), endWith('102-закрыт'));

const distinct$ = of(distinctSrc1$, distinctSrc2$).pipe(
	mergeAll(),
	distinct()
)

//distinct$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinct поток закрыт'));
filteringOperatorList.push({ observable$: distinct$ });

/**
 * distinct 
 * более сложный пример с функцией предварительной обработки значений перед сравнением
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * 

получил:  { value: 0, stream: '1' }
получил:  { value: 101, stream: '1' }
получил:  { value: 202, stream: '1' }
получил:  { value: 303, stream: '1' }
получил:  { value: 404, stream: '1' }
получил:  101-закрыт
distinct2 поток закрыт
 */
const distinctSrc3$ = interval(101).pipe(take(5), map(item => { return { value: item * 101, stream: '1' } }), endWith('101-закрыт'));
const distinctSrc4$ = interval(101).pipe(take(5), map(item => { return { value: item * 101, stream: '2' } }), endWith('102-закрыт'));
const distinctParse = item => item.value

const distinct2$ = of(distinctSrc3$, distinctSrc4$).pipe(
	mergeAll(),
	distinct(distinctParse)
)

//distinct2$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinct2 поток закрыт'));
filteringOperatorList.push({ observable$: distinct2$ });

/**
 * distinctUntilChanged
 * возвращает только уникальные значения в пределах двух значений: текущего и предыдущего
 * можно передать функцию сравнения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается


получил:  { value: 0, stream: '1' }
получил:  { value: 0, stream: '2' }
distinctUntilChanged поток закрыт
 */
const distinctUntilChangedSrc3$ = interval(101).pipe(take(5), map(item => { return { value: item * 101, stream: '1' } }), endWith('101-закрыт'));
const distinctUntilChangedSrc4$ = interval(101).pipe(take(5), map(item => { return { value: item * 101, stream: '2' } }), endWith('102-закрыт'));
const distinctUntilChangedParse = (item, itemPrev) => item.value !== itemPrev.value

const distinctUntilChanged$ = of(distinctUntilChangedSrc3$, distinctUntilChangedSrc4$).pipe(
	mergeAll(),
	distinctUntilChanged(distinctUntilChangedParse), // функция сравнения
	// distinctUntilChanged(), // отбракует все, т.к. сравнивает object
)

// distinctUntilChanged$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinctUntilChanged поток закрыт'));
filteringOperatorList.push({ observable$: distinctUntilChanged$ });

/**
 * distinctUntilKeyChanged
 * возвращает только уникальные значения в пределах текущего и предыдущего
 * необходимо указать название ключа объекта для сравнения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * !!! люто работает проверка типов distinctUntilKeyChangedKeyName. В очевидных случаях несоответствия со значениями в потоке пишет: несовместимо с "never"

получил:  { value: 0, stream: '1' }
получил:  { value: 101, stream: '1' }
получил:  { value: 202, stream: '1' }
получил:  { value: 303, stream: '1' }
получил:  { value: 404, stream: '1' }
distinctUntilKeyChanged поток закрыт
 */

const distinctUntilKeyChangedSrc3$ = interval(101).pipe(take(5), map(item => { return { value: item * 101, stream: '1' } }));
const distinctUntilKeyChangedSrc4$ = interval(101).pipe(take(5), map(item => { return { value: item * 101, stream: '2' } }));
const distinctUntilKeyChangedKeyName = 'value';

const distinctUntilKeyChanged$ = of(distinctUntilKeyChangedSrc3$, distinctUntilKeyChangedSrc4$).pipe(
	mergeAll(),
	distinctUntilKeyChanged(distinctUntilKeyChangedKeyName)
)

// distinctUntilKeyChanged$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('distinctUntilKeyChanged поток закрыт'));
filteringOperatorList.push({ observable$: distinctUntilKeyChanged$ });

/**
 * filter
 * возвращает значения потока, если аргумент функция вернул true
 * Базовый оператор, которым можно заменить много других


получил:  0
получил:  101
получил:  202
filter поток закрыт
 */

const filterSrc$ = interval(101).pipe(take(5), map(item => item * 101));
const isFilter = item => item < 303;

const filter$ = filterSrc$.pipe(
	filter(isFilter)
);

// filter$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('filter поток закрыт'));
filteringOperatorList.push({ observable$: filterSrc$ });

/**
 * sample
 * возвращает первое значение потока после получения очередного значения из аргумента наблюдателя sampleProbe$
 * Отбирает второе значение из потока между таймерами(300)
 * Здесь имеет значение сколько имитировано в потоке sampleProbe$. После его закрытия 


0-проверяем
получил:  102
300-проверяем
получил:  408
600-проверяем
получил:  714
sample поток закрыт
 */
const sampleProbe$ = interval(300).pipe(
	take(3),
	map(item => item * 300 + '-проверяем'),
	tap(logAll),
	endWith('sampleProbe-закрыт')
);

const sample$ = interval(102).pipe(
	take(20),
	map(item => item * 102),
	sample(sampleProbe$)
)

//sample$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('sample поток закрыт'));
filteringOperatorList.push({ observable$: sampleProbe$ });

/**
 * audit
 * 
 * отбирает кайнее значение из потока между таймерами(300)
 * 


получил:  0-control
проверка: 0
получил:  101-control
получил:  202-control
получил:  303-control
получил:  204
проверка: 306
получил:  404-control
получил:  505-control
получил:  606-control
получил:  510
проверка: 612
получил:  707-control
получил:  808-control
получил:  909-control
получил:  816
проверка: 918
audit поток закрыт
 */
const auditProbe$ = item => {
	logAll('проверка: ' + item);
	return interval(300).pipe(take(3));
}

const audit2$ = interval(102).pipe(
	take(10),
	map(item => item * 102),
	audit(auditProbe$)
)

const audit1$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-control'),
)

const audit$ = of(audit1$, audit2$).pipe(
	mergeAll(),
);

// audit$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('audit поток закрыт'));
filteringOperatorList.push({ observable$: audit$ });

/**
 * throttle
 * отбирает первое значение из потока между таймерами(300)
 * 

получил:  0-control
получил:  0
проверка: 0
получил:  101-control
получил:  202-control
получил:  303-control
получил:  306
проверка: 306
получил:  404-control
получил:  505-control
получил:  606-control
получил:  612
проверка: 612
получил:  707-control
получил:  808-control
получил:  909-control
получил:  918
проверка: 918
throttle поток закрыт
 */

const throttleProbe$ = item => {
	logAll('проверка: ' + item);
	return interval(300).pipe(take(1));
}

const throttle2$ = interval(102).pipe(
	take(10),
	map(item => item * 102),
	throttle(throttleProbe$)
)

const throttle1$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-control'),
)

const throttle$ = of(throttle1$, throttle2$).pipe(
	mergeAll(),
);

// throttle$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('throttle поток закрыт'));
filteringOperatorList.push({ observable$: throttle$ });

//========================================================================================================================
//==================================================FILTERING MULTIPLE====================================================
//========================================================================================================================
//


/**
 * first
 * Возвращает первое значение из потока
 * Если передать в аргументы функцию, то первое значение при возврате функции true


1
102
получил:  102
first поток закрыт
 */
const first$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + 1),
	tap(logAll),
	// first(), // вернёт первое значение
	first(item => item % 2 === 0)//вернёт первое чётное число
)

// first$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('first поток закрыт'));
filteringOperatorList.push({ observable$: first$ });

/**
 * last
 * Возвращает крайнее значение из потока
 * Поток должен быть конечным
 * Если передать в аргументы функцию, то крайнее значение при возврате функции true


1
102
203
304
405
506
607
708
809
910
получил:  910
last поток закрыт
 */
const last$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + 1),
	tap(logAll),
	// last(), // вернёт крайнее значение
	last(item => item % 2 === 0)//вернёт крайнее чётное число
)

// last$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('last поток закрыт'));
filteringOperatorList.push({ observable$: last$ });

/**
 * min
 * возвращает минимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки


получил: 0
min поток закрыт
 */
const min$ = of(-2, -1, 0, 4, 5, 6).pipe(
	// tap(logAll),
	//min()//вернёт минимальное число -2
	min((item1, item2) => {
		if (Math.abs(item1) > Math.abs(item2)) { return 1 } else { return -1 };
	})
)

// min$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('min поток закрыт'));
filteringOperatorList.push({ observable$: min$ });

/**
 * max
 * возвращает максимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки


получил:  6
max поток закрыт
 */

const max$ = of(-2, -1, 0, 4, 5, 6).pipe(
	// tap(logAll),
	// max()//вернёт максиимальное число 6
	max((item1, item2) => {
		if (Math.abs(item1) > Math.abs(item2)) { return 1 } else { return -1 };
	})
)

// max$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('max поток закрыт'));
filteringOperatorList.push({ observable$: max$ });

/**
 * возвращает элемент по индексу в потоке
 * можно заменить через toArray()[index]

получил:  4
elementAt поток закрыт
 */
const elementAt$ = of(-2, -1, 0, 4, 5, 6).pipe(
	// tap(item => logAll('получил: ' + item)),
	elementAt(3)
)

// elementAt$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('elementAt поток закрыт'));
filteringOperatorList.push({ observable$: elementAt$ });

/**
 * find
 * возвращает первый элемент потока, для которого функция аргумент findProbe возвращает true


получил:  4
find поток закрыт
 */
const findProbe = item => item > 0;
const find$ = of(-2, -1, 0, 4, 5, 6).pipe(
	// tap(logAll),
	find(findProbe)
)

// find$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('find поток закрыт'));
filteringOperatorList.push({ observable$: find$ });

/**
 * возвращает первый индекс элемента потока, для которого функция аргумент findIndexProbe возвращает true

получил:  3
findIndex поток закрыт

 */
const findIndexProbe = item => item > 0;

const findIndex$ = of(-2, -1, 0, 4, 5, 6).pipe(
	// tap(logAll),
	findIndex(findIndexProbe)
)

// findIndex$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('findIndex поток закрыт'));
filteringOperatorList.push({ observable$: findIndex$ });

/**
 * single
 * возвращает значение из входного потока, если функция аргумент singleProbe возвращает true
 * При значениях больше 1 штуки возвращает ошибку
 * если значений не найдено возвращает undefined
 
получил:  0
single поток закрыт
 */
const singleProbe = item => item === 0;
//const singleProbe = item=>item>0;//ошибка
//const singleProbe = item=>item===10;//undefined
const single$ = of(-2, -1, 0, 4, 5, 6).pipe(
	// tap(item => logAll('получил: ' + item)),
	single(singleProbe)
)

//single$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('single поток закрыт'));
filteringOperatorList.push({ observable$: single$ });
