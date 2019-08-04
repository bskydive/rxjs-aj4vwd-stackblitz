import { of, interval, timer, throwError, Observable, forkJoin, fromEvent, combineLatest, merge, concat, race, zip, iif, asyncScheduler, asapScheduler, queueScheduler, animationFrameScheduler, VirtualTimeScheduler, empty, Notification, Subject, from, ConnectableObservable } from 'rxjs';
import { map, buffer, take, bufferCount, bufferTime, tap, bufferToggle, bufferWhen, switchMap, toArray, window, windowCount, windowTime, windowToggle, windowWhen, catchError, throwIfEmpty, onErrorResumeNext, retry, scan, takeWhile, retryWhen, timeout, timeoutWith, skip, skipLast, skipUntil, skipWhile, takeLast, takeUntil, distinct, distinctUntilChanged, distinctUntilKeyChanged, filter, sample, audit, throttle, first, last, min, max, elementAt, find, findIndex, single, combineAll, concatAll, exhaust, delay, mergeAll, switchAll, withLatestFrom, groupBy, mergeMap, pairwise, exhaustMap, pluck, endWith, zipAll, repeat, repeatWhen, ignoreElements, finalize, auditTime, sampleTime, observeOn, subscribeOn, debounce, debounceTime, delayWhen, throttleTime, timeInterval, timestamp, concatMap, concatMapTo, defaultIfEmpty, startWith, expand, mapTo, mergeScan, reduce, mergeMapTo, switchMapTo, materialize, dematerialize, multicast, publish, share, shareReplay, publishBehavior, publishLast, publishReplay, count, every, isEmpty, sequenceEqual } from 'rxjs/operators';


const helloSource$ = of('World').pipe(
	map(x => `Hello ${x}!`)
);
helloSource$.subscribe(x => logAll(x));

/**
 * ===============================================
 * ========== Библиотека живых примеров ==========
 * ===============================================
 * 
 * ========== ПОЧИТАЙКА: README.md ===============
 * 
 * Сделано как конспект при изучении различных материалов.
	https://www.learnrxjs.io/ 
	http://reactivex.io/documentation/operators.html 
	https://rxmarbles.com/ 
	https://rxjs-dev.firebaseapp.com/api
	https://app.pluralsight.com/library/courses/rxjs-operators-by-example-playbook
 * 
 * Поможет при изучении как справочник в поиске, и при отладке.
 * Содержит полный список правильных способов import {}
 * типовые примеры, которые легко комбинировать и сопоставлять
 * входные значения всегда потоки с интервалами, изредка - простые значения. Это имитирует боевые условия.
 * время появления идентично значению в потоке. Всегда понятно когда и в каком порядке оно имитировано.
 * в примерах расставлены закоментированные операторы логирования для отладки tap(logAll)
 * выходная строка subscribe унифицирована для облегчения отладки
 * унифицированные постфиксы '-1' | '-$' | '-dynamic' помогают в чтении вывода https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b
 * операторы endWith('...') помогают понять когда происходит завершение(отписка) потока
 * выполняется как в консоли, так и в онлайн редакторе. Некоторые примеры работают только в браузере, когда необходимо его API
 * просто один файл. Суровый простой "кирпич". Легко искать, скачивать, отправлять. Трудно модифицировать совместно, долго запускать. Нет оглавления, но его можно построить поиском ctrl+shift+f '$.subscribe('. Любое другое удобство усложнит код, и потребует ещё более могучего времени на рефакторинг, поиск компромиссов.
 * нет typescript, модульности и пр плюшек для ускорения работы над кодом. Основная работа в просмотре лекции и её конспектировании.
 * большое, очень большое количество операторов
 * все примеры рабочие и готовы к копипасту
 * примеры многопоточные
 * живой код. Что-то, что можно открыть IDE
 * объём работы конский, потому, извиняйте, не всё сделано одинаково хорошо. Ближе к концу сделано лучше.
 * чтобы заглушить ненужный входной поток достаточно сделать take(0)
 * 
 * Необходимые операторы ищутся ctrl+f, в конце добавляем $ к названию оператора
 * Перед каждым примером есть небольшое описание и результат выполнения
 * Если надо поменять поведение оператора необходимо:
	 * обновить страницу stackblitz
	 * раскомментировать subscribe строку необходимого оператора
	 * открыть консоль встроенного браузера stackblitz
 * 
 * 
 * ========== Конструктивная помощь ===============
 * 
 * https://stepanovv.ru/portfolio/portfolio.html#id-contacts
 * 
 * ==================== ЛИКБЕЗ ====================
 * 
 * $ - символ в конце для интеллигентного обозначения наблюдателя
 * Observable - объект наблюдения - по сути генерирует поток значений. Есть метод подписки(subscribe) на значения потоков, а также метод последовательной обработки потока(pipe()). Может порождать несколько потоков значений.
 * Observer - наблюдатели - объекты(функции), которые обрабатывают(принимают/генерируют) поток значений. 
	next()
	error()
	complete()
 * Subscriber - вид наблюдателя. Объект(функция), которая обрабатывает конечные результаты потока. Передаётся внутрь метода Observable.subscribe(subscriber)
 * pipe(аргументы) - организует последовательную передачу значений потока между аргументами-наблюдателями. Сделано для избегания конфликтов с методами объектов.
 * subscribe(item => logAll('значение потока', item), err => logAll('ошибка', err), () => logAll('поток закрыт штатно')); - запускает поток, принимает три аргумента для значений(next), ошибок(error), завершения потока(complete)
 * scan - 
 * 
 * Виды операторов по типу операций со значеними: 
 * трансформация - изменение значений
 * фильтрация - 
 * комбинация - операции со значениями нескольких потоков
 * утилиты - способ генерации значений
 * условные
 * агрегирующие - одно значение на выходе
 * распыляющие - multicast
 */

/**
 * Чтобы обойти ошибку TS2496: The 'arguments' object cannot be referenced in an arrow function in ES3 and ES5. Consider using a standard function expression.
 * https://github.com/microsoft/TypeScript/issues/1609
 * Чтобы не светились ошибки использования console.log
 * Здесь логирование применимо, на проде - нет
 */
function logAll(...values) {
	console.log(...values); // ...arguments
}

/**
 * map
 * Преобразует и возвращает текущее значение потока
 * interval(x) - Источник значений, который создаёт значения (i=0;i<Number.MAX_SAFE_INTEGER;i++) через каждые x мсек
 * для наглядности умножаю значения на интервал x, чтобы получалось время а не порядковый номер
 * tap - не меняет значения потока
 * take - останавливает поток после получения указанного количества значений
 */
const map$ = interval(100).pipe(
	take(3),
	map(item => ['преобразуй это: ', item]),
	tap(item => ['фига с два: ', item]), //не возвращает ничего
	tap(item => logAll('отладь меня: ', item)), //используется для отладки
)

/**
 * Три работающих варианта подписки
 * разведены во времени, чтобы не перемешивать вывод в консоль
 */
//map$.subscribe(item => logAll('раз:', item));//без задержек

/* 
const mapTimeout1 = setTimeout(() => {
  map$.subscribe(item => logAll('два', item), err => logAll('два', err), () => logAll('два', 'конец'));
  clearInterval(mapTimeout1)
}, 1000);//с задержкой в 1 сек
 */

/* const mapTimeout2 = setTimeout(() => {
	map$.subscribe({
		next: item => logAll('три', item),
		error: err => logAll('три', err),
		complete: () => logAll('три', 'конец')
	})
	clearInterval(mapTimeout2);
}, 2000);//с задержкой в 2 сек
 */

//========================================================================================================================
//==================================================BUFFER================================================================
//========================================================================================================================

/**
 * Кэширует и возвращает пачку значений
 * [0, 1, 2, 3, 4, 5, 6, 7, 8]
[9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
[9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
 */

const buffer$ = interval(100).pipe(
	buffer(interval(1000)),
	take(3),
	map(item => ['bufferInterval', ...item])
)
// buffer$.subscribe(a => logAll(a));

/**
 * bufferCount
 * 
 * [0, 1, 2]
[3, 4, 5]
[6, 7, 8]
 */

const bufferCount$ = interval(100).pipe(
	bufferCount(3),
	take(3),
	map(item => ['bufferCount', ...item])
)
//bufferCount$.subscribe(a => logAll(a));

/**
 * bufferCount(length)
 * стартует новый буфер каждое второе значение
[0, 1, 2]
[2, 3, 4]
[4, 5, 6]
 */

const bufferCountLength$ = interval(100).pipe(
	bufferCount(3, 2),
	take(3),
	map(item => ['bufferCountFork', ...item])
)
//bufferCountLength$.subscribe(a => logAll(a));

/**
 * bufferTime
 * 
 * ["bufferTime", 0]
["bufferTime", 0, 1, 2]
["bufferTime", 1, 2, 3]
 */

const bufferTime$ = interval(100).pipe(
	bufferTime(200, 100),
	take(3),
	map(item => ['bufferTime', ...item])
)
//bufferTime$.subscribe(a => logAll(a));

/**
 * bufferToggle
 * асинхронный старт и стоп буфера
0
1
2
bufferOpen
0
3
4
5
6
bufferClose
0
[3, 4, 5, 6]
bufferOpen
1
7
8
9
10
bufferClose
1
[7, 8, 9, 10]
bufferOpen
2
11
12
*/

let bufferToggleCount = 0;
const bufferOpen$ = interval(400).pipe(tap(() => logAll('bufferOpen', bufferToggleCount)))
const bufferClose$ = () => interval(300).pipe(tap(() => logAll('bufferClose', bufferToggleCount++)))

const bufferToggle$ = interval(100).pipe(
	tap(item => logAll(item)),
	bufferToggle(bufferOpen$, bufferClose$),
	take(3),
	map(item => ['bufferToggle', ...item])
)
//bufferToggle$.subscribe(a => logAll(a));


/**
 * bufferWhen
 * выбор времени закрытия буфера
["bufferWhen", 0]
["bufferWhen", 1, 2, 3]
["bufferWhenElse", 4, 5]
["bufferWhenElse", 6]
["bufferWhenElse", 7]
["bufferWhenElse", 8]
["bufferWhenElse", 9]
*/
let bufferWhenCount = 0;
const bufferWhen$ = interval(500).pipe(
	take(10),
	map(item => (bufferWhenCount = item)),
	bufferWhen(() => {
		if (bufferWhenCount < 5) {
			return interval(1000)
		} else { return interval(500) }
	}),
	map(item => {
		if (bufferWhenCount < 5) {
			return ['bufferWhen', ...item]
		} else {
			return ['bufferWhenElse', ...item]
		}
	})
)
//bufferWhen$.subscribe(a => logAll(a));


//========================================================================================================================
//==================================================WINDOW================================================================
//========================================================================================================================

/**
 * window
 * "нарезка"
 * Возвращает новый поток(буфер) по таймеру, предыдущий закрывает
 
["window", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
["window", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
*/
const window$ = interval(100).pipe(
	window(interval(1000)),
	take(3),
	switchMap(item$ => item$.pipe(
		toArray(),
		map(item1 => ['window', ...item1]))
	),
)
//window$.subscribe(a => logAll(a));


/**
 * windowCount
 * 
 * Возвращает новый поток(буфер) по количеству значений, предыдущий закрывает
 * 
windowCount(2)
["windowCount", 0, 1]
["windowCount", 2, 3]
["windowCount", 4, 5]
["windowCount", 6, 7]
["windowCount", 8, 9]
["windowCount"]

windowCount(2,3)
["windowCount", 0, 1]
["windowCount", 3, 4]
["windowCount", 6, 7]
["windowCount", 9]
*/
const windowCount$ = interval(100).pipe(
	take(10),
	windowCount(2, 3),
	switchMap(item$ => item$.pipe(
		toArray(),
		map(item1 => ['windowCount', ...item1]))
	),
)
//windowCount$.subscribe(a => logAll(a));



/**
 * WindowTime
 * Возвращает новый поток(буфер) по таймеру, предыдущий закрывает
 * timer вместо interval
["windowTime", 0, 1]
["windowTime", 2, 3]
["windowTime", 4, 5]
["windowTime", 6, 7]
["windowTime", 8]
 */
const windowTime$ = timer(0, 100)
	.pipe(
		take(9),
		windowTime(200),
		switchMap(item$ => item$.pipe(
			toArray(),
			map(item1 => ['windowTime', ...item1]))
		),
	)
//windowTime$.subscribe(a => logAll(a));

/**
 * windowToggle
 * 
 * 
windowOpen 0
0
1
2
windowClose 0
["windowToggle", 0, 1, 2]
3
windowOpen 1
4
5
6
7
windowClose 1
["windowToggle", 4, 5, 6, 7]
windowOpen 2
8
9
["windowToggle", 8, 9]
 */
let windowToggleCount = 0;
const windowOpen$ = timer(0, 400).pipe(map(() => logAll('windowOpen', windowToggleCount)))
const windowClose$ = () => timer(300).pipe(map(() => logAll('windowClose', windowToggleCount++)))

const windowToggle$ = timer(0, 100).pipe(
	take(10),
	tap(item => logAll(item)),
	windowToggle(windowOpen$, windowClose$),
	switchMap(item$ => item$.pipe(
		toArray(),
		map(item1 => ['windowToggle', ...item1]))
	),
)
//windowToggle$.subscribe(a => logAll(a));


/**
 * windowWhen
 * выбор времени закрытия буфера 
 
*/
let windowWhenCount = 0;
const windowWhen$ = interval(500).pipe(
	take(10),
	map(item => (windowWhenCount = item)),
	windowWhen(() => {
		if (windowWhenCount < 5) {
			return interval(1000)
		} else { return interval(500) }
	}),
	switchMap(item$ => item$.pipe(
		toArray(),
		map(item1 => {
			if (windowWhenCount < 5) {
				return ['windowWhen', ...item1]
			} else {
				return ['windowWhenElse', ...item1]
			}
		})
	)
	)
)
//windowWhen$.subscribe(a => logAll(a));

//========================================================================================================================
//==================================================ERRORS================================================================
//========================================================================================================================

//
/**
 * catchError
 * Перехват потока при ошибке
 * Практическое применение: самописные обработчики ошибок, сервисы хранения ошибок типа ravenjs
словил:ошибка ошибковна источик:Observable {_isScalar: false, source: {…}, operator: {…}}
положь где взял:вернул взад ошибка ошибковна источик:Observable {_isScalar: false, source: {…}, operator: {…}}
янеошибка
норм
 */
const error$ = throwError('ошибка ошибковна')
	.pipe(
		catchError((err, caught$) => {
			logAll('словил:', err, 'источик:', caught$);//перехватчик ошибок
			return throwError(`вернул взад ${err}`);//генерируем новую ошибку вместо текущей
		}),
		catchError((err, caught$) => {
			logAll('положь где взял:', err, 'источик:', caught$);//перехватчик ошибок работает последовательно
			return of('янеошибка');//подмена ошибки значением
		}),
	)
//error$.subscribe(a => logAll(a), err => logAll('ошибка:', err), ()=>logAll('норм'));


//
/**
 * errorHandler
 * ошибка  при пустом потоке
 * Можно подменять ошибку
 * Error {message: "no elements in sequence", name: "EmptyError"}
 */
const errorHandler = () => logAll('ничоси');
const errorEmpty$ = of().pipe(
	throwIfEmpty()//без подмены
	//throwIfEmpty(errorHandler)//подмена ошибки
)

//errorEmpty$.subscribe(a => logAll(a), err=>logAll(err));


//
/**
 * errorNext
 * Новый поток при ошибке
0
1
2
3
едем дальше
 */
const errorNext$ = of('едем дальше');//резервный поток после ошибок
const errorSwitch$ = timer(0, 100).pipe(
	take(5),
	map(item => {
		if (item > 3) {
			throw new Error('ничоси');
		} else {
			return item;
		}
	}),
	onErrorResumeNext(errorNext$)
)

//errorSwitch$.subscribe(a => logAll(a), err=>logAll(err));

/**
 * errorRetry
 * 
 * Повторяет поток значений указанное количество раз при ошибке
0
1
2
3
0
1
2
3
0
1
2
3
Error: ничоси
 */

const errorRetry$ = timer(0, 100).pipe(
	take(5),
	map(item => {
		if (item > 3) {
			throw new Error('ничоси');
		} else {
			return item;
		}
	}),
	retry(2)
)

//errorRetry$.subscribe(a => logAll(a));

/**
 * retryWhen
 * повторяет поток пока не будет получен complete/error внутри аргумента наблюдателя retryCondition$
0
1
2
словили: Error: ничоси
0
1
2
словили: Error: ничоси
0
1
2
словили: Error: ничоси
 */

const errorRetryWhen$ = timer(0, 100).pipe(
	take(5),
	map(item => {
		if (item === 3) {
			throw new Error('ничоси');
		} else {
			return item;
		}
	}),
	retryWhen(retryCondition$ => {
		return retryCondition$.pipe(
			map(item => {
				logAll('словили: ' + item)
			}),
			take(3)//отправляет complete после 3 повторов
		)
	})
)
//errorRetryWhen$.subscribe(a => logAll(a));

/* 
 * retryWhen

Hello World!
try: 0
получил:  0
try: 1
error: 1
retry whole source: 1
try: 0
получил:  0
try: 1
error: 1
fail
ошибка: error
*/
const swallow = false;
const retryWhen$ = interval(200).pipe(
	map(x => {
		logAll('try: ' + x);
		if (x === 1) {
			throw 'error: ' + x;
		}
		return x;
	}),
	retryWhen(errors$ => {
		if (swallow) {
			return errors$.pipe(
				tap(err => logAll(err)),
				scan(acc => acc + 1, 0),
				tap(retryCount => {
					if (retryCount === 2) {
						logAll('swallowing error and stop')
					} else {
						logAll('retry all: ' + retryCount);
					}
					return retryCount;
				}),
				takeWhile(errCount => errCount < 2)
			)
		} else {
			return errors$.pipe(
				tap(err => logAll(err)),
				scan(acc => acc + 1, 0),
				tap(retryCount => {
					if (retryCount === 2) {
						logAll('fail');
						throw 'error';
					} else {
						logAll('retry whole source: ' + retryCount);
					}
				})
			)
		}

	})
)

//retryWhen$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка: ' + err), () => logAll('retryWhen поток закрыт'));

/**
 * timeout
 * прерывает поток ошибкой, если нет значения за время интервала
 * также можно указать дату вместо интервала, но можно наступить на локализацию
Таймер сработал
Error {message: "Timeout has occurred", name: "TimeoutError"}
Observable {_isScalar: false, source: {…}, operator: {…}}
complete
 */
const errorMsg = () => logAll('error');
const timeOut$ = interval(102).pipe(
	take(5),
	tap(value => logAll(value * 102)),
	timeout(100), // таймер
	catchError((err, caught$) => {
		if (err.name === 'TimeoutError') {
			// обрабатываем событие таймера
			logAll('Таймер сработал')
		};
		return of(err, caught$)
	})
)

//timeOut$.subscribe(a => logAll(a), err => (logAll('ошибка: ' + err)), () => logAll('complete'));

/**
 * timeoutWith
 * стартует новый поток, если нет значения за время интервала
 * также можно указать дату вместо интервала, но можно наступить на локализацию
ещё 0
ещё 100
1
2
3
complete
 */
const timeOutWithFallback$ = of(1, 2, 3);
const timeOutWith$ = new Observable(observer => {
	observer.next('ещё 0');
	setTimeout(() => observer.next('ещё 100'), 100);
	setTimeout(() => observer.next('ещё 202'), 202);//заменить на 200, чтобы не было прерывания
	setTimeout(() => observer.complete(), 300);
}).pipe(timeoutWith(101, timeOutWithFallback$))

//timeOutWith$.subscribe(a => logAll(a), err=>(logAll('ошибка: '+err)), ()=>logAll('complete'));


//========================================================================================================================
//==================================================FILTERING ONE=========================================================
//========================================================================================================================
//указанные операторы получают и возвращают значения в потоке

/**
 * skip
 * скрывает указанное количество значений
2
3
4
 */
const skip$ = timer(0, 100).pipe(
	take(5),
	skip(2)
)

//skip$.subscribe(a => logAll(a));


/**
 * skipLast
 * скрывает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений
0
1
2
3
 */
const skipLast$ = timer(0, 1000).pipe(
	take(10),
	skipLast(5)
)

//skipLast$.subscribe(a => logAll(a));

/**
 * skipUntil
 * скрывает значения потока до момента получения первого значения из аргумента наблюдателя
*6 секунд ожидания*
3
4
5
 */
const skipUntil$ = timer(0, 1000).pipe(
	take(6),
	skipUntil(timer(3000))
)

//skipUntil$.subscribe(a => logAll(a));

/**
 * skipWhile
 * скрывает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false
3
4
5
 */
const skipWhile$ = timer(0, 100).pipe(
	take(6),
	skipWhile(item => item !== 3)
)

//skipWhile$.subscribe(a => logAll(a));


/**
 * take
 * возвращает указанное количество значений
0
1
2
3
4
 */
const take$ = timer(0, 100).pipe(
	take(5),
)

//take$.subscribe(a => logAll(a));


/**
 * takeLast
 * возвращает указанное количество значений с конца
 * поток должен быть конечным
 * начинает раотать после получения всех входящих значений
*6 секунд ожидания*
3
4
5
 */
const takeLast$ = timer(0, 1000).pipe(
	take(6),
	takeLast(3)
)

//takeLast$.subscribe(a => logAll(a));

/**
 * takeUntil
 * Возвращает поток до момента получения первого значения из аргумента наблюдателя takeUntilComplete$
 * Прерывает поток при получении первого значения из аргумента наблюдателя takeUntilComplete$
 * Используется для очистки мусора, как завершающий оператор
0
1
2
поток закрыт
 */

/* const takeUntilButtonElement = document.getElementById('id-tight-button');
const takeUntilComplete$ = fromEvent(takeUntilButtonElement, 'click');//прерывание потока по кнопке

//const takeUntilComplete$ = timer(3000);//прерывание потока по таймеру

const takeUntil$ = timer(0, 1000).pipe(
	take(6),
	takeUntil(takeUntilComplete$)
)

//takeUntil$.subscribe(a => logAll(a), err => logAll('error', err), () => logAll('поток закрыт')); */


/**
 * takeWhile
 * возвращает поток пока получает true из аргумента функции
 * переключается только один раз, после первого false
0
1
2
 */
const takeWhile$ = timer(0, 100).pipe(
	take(6),
	takeWhile(item => item !== 3)
)

//takeWhile$.subscribe(a => logAll(a));

/**
 * distinct
 * возвращает только уникальные значения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * можно передать функцию предварительной обработки значений
1
2
3
5
 */
const distinct$ = of(1, 1, 1, 2, 3, 1, 5, 5, 5).pipe(
	distinct()
)
//distinct$.subscribe(a => logAll(a));

/**
 * distinct с функцией предварительной обработки значений
 * возвращает только уникальные значения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * 
{a: 1, b: "2"}
{a: 2, b: "3"}
 */
const distinctFunc$ =
	of(
		{ a: 1, b: '2' },
		{ a: 1, b: '3' },
		{ a: 2, b: '3' },
		{ a: 1, b: '4' }
	).pipe(
		distinct(item => item.a)
	)
//distinctFunc$.subscribe(a => logAll(a));

/**
 * distinctUntilChanged
 * возвращает только уникальные значения в пределах текущего и предыдущего
 * можно передать функцию предварительной обработки значений
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
1
2
3
1
5
 */
const distinctUntilChanged$ = of(1, 1, 1, 2, 3, 1, 5, 5, 5).pipe(
	distinctUntilChanged()
)
//distinctUntilChanged$.subscribe(a => logAll(a));

/**
 * distinctUntilKeyChanged
 * возвращает только уникальные значения в пределах текущего и предыдущего
 * необходимо указать название ключа объекта для сравнения
 * не ожидает весь поток, работает сразу
 * следует аккуратно отнестись к операции сравнения. Он использует set или Array.indexOf, если set не поддерживается
 * 
{a: 1, b: "2"}
{a: 1, b: "3"}
{a: 1, b: "4"}
 */
const distinctUntilKeyChanged$ =
	of(
		{ a: 1, b: '2' },
		{ a: 1, b: '3' },
		{ a: 2, b: '3' },
		{ a: 1, b: '4' }
	).pipe(
		//distinctUntilKeyChanged('a')
		distinctUntilKeyChanged('b')
	)
//distinctUntilKeyChanged$.subscribe(a => logAll(a));

/**
 * filter
 * возвращает значения потока, если аргумент функция вернул true
0
2
4
 */
const filter$ = timer(0, 100).pipe(
	take(6),
	filter(item => item % 2 === 0)
)

//filter$.subscribe(a => logAll(a));

/**
 * sample
 * возвращает первое значение потока interval после получения очередного значения из аргумента наблюдателя sampleProbe$
 * Отбирает второе значение из потока между таймерами(300)
получил: 0
получил: 102
102
получил: 204
получил: 306
получил: 408
408
получил: 510
получил: 612
получил: 714
714
получил: 816
получил: 918
complete
 */
const sampleProbe$ = interval(300)
const sample$ = interval(102).pipe(
	take(10),
	map(item => item * 102),
	tap(item => logAll('получил: ' + item)),
	sample(sampleProbe$)
)

//sample$.subscribe(a => logAll(a), err=>(logAll('ошибка: '+err)), ()=>logAll('complete'));

/**
 * audit
 * 
 * отбирает кайнее значение из потока между таймерами(300)
получил: 0
обработал: 0
получил: 102
получил: 204
204
получил: 306
обработал: 306
получил: 408
получил: 510
510
получил: 612
обработал: 612
получил: 714
получил: 816
816
получил: 918
обработал: 918
 */
const auditProbe$ = item => {
	logAll('обработал: ' + item);
	return interval(300);
}
const audit$ = timer(0, 102).pipe(
	take(10),
	map(item => item * 102),
	tap(item => logAll('получил: ' + item)),
	audit(auditProbe$)
)

//audit$.subscribe(a => logAll(a));

/**
 * throttle
 * отбирает первое значение из потока между таймерами(300)
 * 
получил: 0
0
обработал: 0
получил: 102
получил: 204
получил: 306
306
обработал: 306
получил: 408
получил: 510
получил: 612
612
обработал: 612
получил: 714
получил: 816
получил: 918
918
обработал: 918
 */

const throttleProbe$ = item => {
	logAll('обработал: ' + item);
	return timer(300);
}
const throttle$ = timer(0, 102).pipe(
	take(10),
	map(item => item * 102),
	tap(item => logAll('получил: ' + item)),
	throttle(throttleProbe$)
)

//throttle$.subscribe(a => logAll(a));


//========================================================================================================================
//==================================================FILTERING MULTIPLE====================================================
//========================================================================================================================
//


/**
 * first
 * Возвращает первое значение из потока
 * Если передать в аргументы функцию, то первое значение при возврате функции true
получил: 0
0
 */
const first$ = timer(0, 100).pipe(
	take(10),
	map(item => item * 100),
	tap(item => logAll('получил: ' + item)),
	first()
	//first(item=>item % 2 === 0)//вернёт первое чётное число
)

//first$.subscribe(a => logAll(a));

/**
 * last
 * Возвращает крайнее значение из потока
 * Поток должен быть конечным
 * Если передать в аргументы функцию, то крайнее значение при возврате функции true
получил: 0
получил: 100
получил: 200
получил: 300
получил: 400
получил: 500
получил: 600
получил: 700
получил: 800
получил: 900
900
 */
const last$ = timer(0, 100).pipe(
	take(10),
	map(item => item * 100),
	tap(item => logAll('получил: ' + item)),
	last()
	//last(item=>item % 2 === 0)//вернёт первое чётное число
)

//last$.subscribe(a => logAll(a));

/**
 * min
 * возвращает минимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки
получил: -2
получил: -1
получил: 0
получил: 4
получил: 5
получил: 6
0
 */
const min$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => logAll('получил: ' + item)),
	//min()//вернёт минимальное число -2
	min((item1, item2) => {
		if (Math.abs(item1) > Math.abs(item2)) { return 1 } else { return -1 };
	})
)
//min$.subscribe(a => logAll(a));


/**
 * max
 * возвращает максимальное значение из потока
 * поток должен быть конечным
 * можно передать аргумент функцию сортировки
получил: -2
получил: -1
получил: 0
получил: 4
получил: 5
получил: 6
6
 */

const max$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => logAll('получил: ' + item)),
	max()//вернёт максиимальное число 6
	//max((item1, item2) => {
	//    if (Math.abs(item1) < Math.abs(item2)) { return 1 } else { return -1 };
	//  })
)
//max$.subscribe(a => logAll(a));


/**
 * возвращает элемент по индексу в потоке
4
 */
const elementAt$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => logAll('получил: ' + item)),
	elementAt(3)

)
//elementAt$.subscribe(a => logAll(a));


/**
 * возвращает элемент потока, если функция аргумент findProbe возвращает true
0
 */
const findProbe = item => item === 0;
const find$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => logAll('получил: ' + item)),
	find(findProbe)
)
//find$.subscribe(a => logAll(a));

/**
 * возвращает индекс элемента потока, если функция аргумент findIndexProbe возвращает true
2
 */
const findIndexProbe = item => item === 0;
const findIndex$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => logAll('получил: ' + item)),
	findIndex(findIndexProbe)
)
//findIndex$.subscribe(a => logAll(a));

/**
 * single
 * возвращает значение потока, если функция аргумент singleProbe возвращает true
 * При значениях больше 1 штуки возвращает ошибку
 * если значений не найдено возвращает undefined
 0
 */
const singleProbe = item => item === 0;
//const singleProbe = item=>item>0;//ошибка
//const singleProbe = item=>item===10;//undefined
const single$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => logAll('получил: ' + item)),
	single(singleProbe)
)
//single$.subscribe(a => logAll(a));


//========================================================================================================================
//==================================================GROUPING OBSERVABLES==================================================
//========================================================================================================================
//

/**
 * combineAll
 * возвращает крайние значения если они пришли от всех асинхронных потоков
 * в данном случае ожидает по три значения
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
[202, 0, 0]
[303, 0, 0]
[303, 202, 0]
[404, 202, 0]
[505, 202, 0]
[505, 404, 0]
[505, 404, 303]
[606, 404, 303]
[707, 404, 303]
[707, 606, 303]
[808, 606, 303]
[808, 606, 606]
[909, 606, 606]
[909, 808, 606]
 */

const combine1$ = interval(101).pipe(take(10), map(item => item * 101));
const combine2$ = interval(202).pipe(take(5), map(item => item * 202));
const combine3$ = interval(303).pipe(take(3), map(item => item * 303));
const combineAll$ = of(combine1$, combine2$, combine3$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	combineAll()
)

//combineAll$.subscribe(() => logAll( ...arguments))

/**
 * combineLatest
 * возвращает крайние значения combineXX$
 * на старте ждёт значения от всех асинхронных потоков combineXX$
 * не работает внутри pipe
 * Есть необязательный аргумент combineLatestParser для обработки всех входящих значений
 * https://www.learnrxjs.io/operators/combination/combinelatest.html
 * 
item1:101-item2:0-item3:0
item1:202-item2:0-item3:0
item1:202-item2:202-item3:0
item1:303-item2:202-item3:0
item1:404-item2:202-item3:0
item1:404-item2:202-item3:303
item1:404-item2:404-item3:303
item1:505-item2:404-item3:303
item1:606-item2:404-item3:303
 */
const combineLatestParser = (item1, item2, item3) => `item1:${item1}-item2:${item2}-item3:${item3}`;
const combineLatest$ = combineLatest(combine1$, combine2$, combine3$, combineLatestParser).pipe(
	take(9)
)
//combineLatest$.subscribe(logAll)

/**
 * concatAll
 * Возвращает все значения всех потоков
 * Комбинирует значения по потокам
 * 
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:0-1
получил:101-1
получил:202-1
получил:303-1
получил:404-1
получил:505-1
получил:606-1
получил:707-1
получил:808-1
получил:909-1
получил:0-2
получил:202-2
получил:404-2
получил:606-2
получил:808-2
получил:0-3
получил:303-3
получил:606-3
 */
const concat1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const concat2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const concat3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const concatAll$ = of(concat1$, concat2$, concat3$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	concatAll()
)

//concatAll$.subscribe((item) => logAll('получил: ',item))

/**
 * exhaust
 * Возвращает значения потока, который первый их прислал. Остальные потоки блокируются, пока первый поток не закончится
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:0-1
получил:101-1
получил:202-1
получил:303-1
получил:404-1
получил:505-1
получил:606-1
получил:707-1
получил:808-1
получил:909-1
 */
const exhaust1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const exhaust2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const exhaust3$ = interval(2000).pipe(take(3), map(item => item * 303 + '-3'));
const exhaust4$ = of(1, 2, 3).pipe(delay(2000));
const exhaust$ = of(exhaust1$, exhaust2$, exhaust3$, exhaust4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	exhaust()
)

//exhaust$.subscribe((item) => logAll('получил: ',...arguments))

/**
 * mergeAll
 * ВОзвращает все значения всех потоков
 * Комбинирует по времени получения

Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
Observable {_isScalar: false, source: {…}, operator: {…}}
получил:0-1
получил:101-1
получил:0-2
получил:202-1
получил:0-3
получил:303-1
получил:202-2
получил:404-1
получил:505-1
получил:404-2
получил:303-3
получил:606-1
получил:707-1
получил:606-2
получил:808-1
получил:606-3
получил:909-1
получил:808-2
получил:1
получил:2
получил:3
 */
const mergeAll1$ = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeAll2$ = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeAll3$ = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeAll4$ = of(1, 2, 3).pipe(delay(2000));
const mergeAll$ = of(mergeAll1$, mergeAll2$, mergeAll3$, mergeAll4$).pipe(
	tap(logAll), //возвращает три потока наблюдателей
	mergeAll()
)

//mergeAll$.subscribe((item) => logAll('получил: ',item))

/**
 * withLatestFrom
 * Возвращает массив текущих(предыдущих/крайних) значений потоков после получения значений из основного(сигнального) потока источника
 * Возвращает из сигнального потока и из потоков аргументов withLatestFrom1, withLatestFrom2
 * Главный сигнальный поток - источник interval(303)
 * 
получил:["0-3", "202-1", "0-2"]
получил:["303-3", "505-1", "404-2"]
получил:["606-3", "808-1", "606-2"]
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

//withLatestFrom$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('поток закрыт'));


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
получил:["0-3", "303-3", "606-3"]
получил:["0-1", "101-1", "202-1", "303-1", "404-1", "505-1", "606-1", "707-1", "808-1", "909-1"]
получил:["0-2", "202-2", "404-2", "606-2", "808-2"]
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
[{"a":1,"b":"2"}]
[{"a":1,"b":"3"},{"a":2,"b":"3"}]
[{"a":1,"b":"4"}]
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

// subscribeOn$.subscribe(item => logAll(item), null, () => logAll('subscribeOn поток закрыт'));

/**
 * debounce
 * "Спаморезка"
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

//debounce$.subscribe(item => logAll(item + '-$'), null, () => logAll('debounce поток закрыт'));

/**
 * debounceTime
 * "Спаморезка"
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

const debounceTimeOver$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-over'),
	// tap(logAll),
	debounceTime(1000),
	endWith('over-закрыт'),
);

const debounceTimeNorm$ = interval(102).pipe(
	take(10),
	map(item => item * 102 + '-norm'),
	// tap(logAll),
	debounceTime(50),
	endWith('norm-закрыт'),
);

const debounceTime$ = of(debounceTimeOver$, debounceTimeNorm$).pipe(
	mergeAll(),
	// map(item => item+'-subscribe')
)

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

//throttleTime$.subscribe(item => logAll(item + '-$'), null, () => logAll('throttleTime поток закрыт'));

/**
 * timeInterval
 * оборачивает каждое значение в объект, добавляя поле со значением интервала во времени от предыдущего до текущего значения
 * судя по всему, используется performance.now()
 * 
 * Hello World!
{"value":"0-2","interval":105}-$
{"value":"102-2","interval":104}-$
{"value":"204-2","interval":102}-$
{"value":"306-2","interval":103}-$
{"value":"408-2","interval":102}-$
"2-закрыт"-$
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

/**
 * timestamp
 * оборачивает каждое значение в объект, добавляя время его имитации
 * 
 * Hello World!
{"value":"0-1","timestamp":1564341146592}-$
{"value":"0-2","timestamp":"2019-07-28T19:12:26.595Z"}-$
{"value":"101-1","timestamp":1564341146694}-$
{"value":"102-2","timestamp":"2019-07-28T19:12:26.698Z"}-$
{"value":"202-1","timestamp":1564341146796}-$
{"value":"204-2","timestamp":"2019-07-28T19:12:26.800Z"}-$
{"value":"303-1","timestamp":1564341146898}-$
{"value":"306-2","timestamp":"2019-07-28T19:12:26.902Z"}-$
{"value":"404-1","timestamp":1564341147000}-$
"1-закрыт"-$
{"value":"408-2","timestamp":"2019-07-28T19:12:27.006Z"}-$
"2-закрыт"-$
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
"0-1"-$
"0-2"-$
"0-21000"-$
"101-1"-$
"102-2"-$
"102-21000"-$
"202-1"-$
["0-2","delay200"]-$
"204-2"-$
"204-21000"-$
"303-1"-$
"306-2"-$
"306-21000"-$
"404-1"-$
["102-2","delay200"]-$
"408-2"-$
"408-21000"-$
"2-закрыт"-$
"505-1"-$
["204-2","delay200"]-$
"606-1"-$
"707-1"-$
["306-2","delay200"]-$
"808-1"-$
"909-1"-$
"1-закрыт"-$
["408-2","delay200"]-$
"2-закрыт"-$
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
"startItem-0 forkItem-0"
"startItem-0 forkItem-100"
"startItem-0 forkItem-200"
"startItem-302 forkItem-0"
"startItem-302 forkItem-100"
"startItem-302 forkItem-200"
"startItem-604 forkItem-0"
"startItem-604 forkItem-100"
"startItem-604 forkItem-200"
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

//========================================================================================================================
//==================================================MULTICAST=============================================================
//========================================================================================================================
//

/**
 * multicast
 * Конвертирует поток в ConnectableObservable
 * Перенаправляет входящие потоки multicastIn в специальный поток(прокси) multicastProxy
 * Позволяет одновременно стартовать все потоки через прокси методом connect()
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * ! в примере нет эмуляции задержки старта одного из входных потоков
 * 
 * https://www.learnrxjs.io/operators/multicasting/multicast.html
 * https://blog.angularindepth.com/rxjs-multicasts-secret-760e1a2b176e
 * http://reactivex.io/documentation/operators/publish.html
 * 
 * 

Hello World!
0-поток1-подписка1
0-поток2-подписка1
101-поток1-подписка1
102-поток2-подписка1
202-поток1-подписка1
поток1-закрыто-подписка1
204-поток2-подписка1
поток2-закрыто-подписка1
подписка1-закрыта
0-поток1-подписка2
0-поток2-подписка2
101-поток1-подписка2
102-поток2-подписка2
202-поток1-подписка2
поток1-закрыто-подписка2
204-поток2-подписка2
поток2-закрыто-подписка2
подписка2-закрыта
 */

const multicastIn1$ = interval(101).pipe(
	take(3),
	map(item => item * 101 + '-поток1'),
	endWith('поток1-закрыто')
);
const multicastIn2$ = interval(102).pipe(
	take(3),
	map(item => item * 102 + '-поток2'),
	endWith('поток2-закрыто')
);

const multicastProxy$ = new Subject();


// традиционный пример, который работает без костылей
const multicastObserver = observer => {
	logAll('новый подписчик!');
	let countItem = 0;
	const interval1 = setInterval(
		() => {
			logAll('генерируем: ' + countItem);
			if (countItem <= 3) {
				observer.next(countItem++);
			} else {
				logAll('остановка генератора multicast');
				clearInterval(interval1);
			}
		}, 101);
}

const multicast$ = new Observable(multicastObserver).pipe(
	// const multicast$ = publish()(of(multicastIn1$, multicastIn2$).pipe( // пример костыля - в этом случае .connect() не работает как надо, потоки стартуют раньше .connect()
	// tap(logAll),
	multicast(multicastProxy$), //если закомментировать, потоки стартуют по .subscribe вместо .connect
);

multicast$.subscribe((item) => logAll(item + '-подписка1'), null, () => logAll('multicast подписка1-закрыта'));
multicast$.pipe(delay(1000)).subscribe((item) => logAll(item + '-подписка2'), null, () => logAll('multicast подписка2-закрыта'));

// multicast$.connect();

/**
 * share
 * подписывается на входящий поток share1, когда подписываются на него share$
 * отписывается, если все отписались от него share$
 * делает поток горячим - новые подписчики получают значения только с момента своей подписки
 * используется для websocket
 * 
 * 
Hello World!
получил1:  0-1
получил1:  101-1
получил1:  202-1
получил1:  303-1
получил1:  404-1
получил1:  505-1
получил1:  606-1
получил2:  606-1 // вместо 0 получили 606
получил1:  707-1
получил2:  707-1
получил1:  808-1
получил2:  808-1
получил1:  909-1
получил2:  909-1
получил1:  1-закрыто
получил2:  1-закрыто
share1 поток закрыт
share2 поток закрыт
 */
const share1$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	endWith('1-закрыто')
);

const share$ = share1$.pipe(
	share(),
	// tap(logAll),
)

//!!! контрольный подписчик
// share$.subscribe((item) => logAll('получил1: ', item), null, () => logAll('share1 поток закрыт'));

const shareTimeout = setTimeout(() => {
	// опаздываем на 700
	// share$.subscribe((item) => logAll('получил2: ', item), null, () => logAll('share2 поток закрыт'));
	clearInterval(shareTimeout);
}, 700);

/**
 * shareReply
 * подписывается на входящий поток share1, когда подписываются на него share$
 * отписывается, если все отписались от него share$
 * делает поток горячим - новые подписчики получают значения только с момента своей подписки, включая буфер из указанного количества значений shareReplayBufferSize
 * используется для websocket
 * 
 * Hello World!
получил1:  0-1
получил1:  101-1
получил1:  202-1
получил1:  303-1
получил1:  404-1
получил1:  505-1
получил2:  303-1 // вместо 606 получили 303
получил2:  404-1
получил2:  505-1
получил1:  606-1
получил2:  606-1
получил1:  707-1
получил2:  707-1
получил1:  808-1
получил2:  808-1
получил1:  909-1
получил2:  909-1
получил1:  1-закрыто
получил2:  1-закрыто
shareReplay1 поток закрыт
shareReplay2 поток закрыт
 */
const shareReplay1$ = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	endWith('1-закрыто')
);
const shareReplayBufferSize = 3;

const shareReplay$ = shareReplay1$.pipe(
	shareReplay(shareReplayBufferSize),
	// tap(logAll),
)

//!!! контрольный подписчик
// shareReplay$.subscribe((item) => logAll('получил1: ', item), null, () => logAll('shareReplay1 поток закрыт'));

const shareReplayTimeout = setTimeout(() => {
	// опаздываем на 700
	// shareReplay$.subscribe((item) => logAll('получил2: ', item), null, () => logAll('shareReplay2 поток закрыт'));
	clearInterval(shareReplayTimeout)
}, 700);

/**
 * publish
 * Конвертирует поток в ConnectableObservable
 * Позволяет одновременно стартовать все потоки через методом connect()
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * ! в примере нет эмуляции задержки старта одного из входных потоков
 * в отличии от multicast нет аргумента-прокси
 * 
 * 
Hello World!
новый подписчик!
генерируем: 0
0-подписка1
генерируем: 1
1-подписка1
генерируем: 2
2-подписка1
генерируем: 3
3-подписка1
генерируем: 4
остановка генератора
0-подписка2
1-подписка2
2-подписка2
3-подписка2

 */

// традиционный подход, который работает без костылей
const publishObserver = observer => {
	logAll('новый подписчик!');
	let countItem = 0;
	const interval1 = setInterval(
		() => {
			logAll('генерируем: ' + countItem);
			if (countItem <= 3) {
				observer.next(countItem++);
			} else {
				logAll('остановка генератора publish');
				clearInterval(interval1);
			}
		}, 101);
}

const publish$ = new Observable(publishObserver).pipe(
	// tap(logAll),
	publish(), //если закомментировать, потоки стартуют по .subscribe вместо .connect
);

publish$.subscribe((item) => logAll(item + '-подписка1'), null, () => logAll('publish подписка1-закрыта'));
publish$.pipe(delay(1000)).subscribe((item) => logAll(item + '-подписка2'), null, () => logAll('publish подписка2-закрыта'));

// publish$.connect();



/**
 * publishBehavior
 * Конвертирует поток в ConnectableObservable
 * Имитирует вначале итогового потока указанное значение publishBehaviorInitialValue
 * Позволяет одновременно стартовать все потоки через методом connect()
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * ! имитирует  указанное значение publishBehaviorInitialValue раньше .connect
 * 
 * Hello World!
новый подписчик!
start-подписка1
новый подписчик!
генерируем: 0
0-подписка1
генерируем: 0
0-подписка1
генерируем: 1
1-подписка1
генерируем: 1
1-подписка1
генерируем: 2
2-подписка1
генерируем: 2
2-подписка1
генерируем: 3
3-подписка1
генерируем: 3
3-подписка1
генерируем: 4
остановка генератора
генерируем: 4
остановка генератора
start-подписка2
0-подписка2
0-подписка2
1-подписка2
1-подписка2
2-подписка2
2-подписка2
3-подписка2
3-подписка2
 */
const publishBehaviorObserver = observer => {
	logAll('новый подписчик!');
	let countItem = 0;
	const interval1 = setInterval(
		() => {
			logAll('генерируем: ' + countItem);
			if (countItem <= 3) {
				observer.next(countItem++);
			} else {
				logAll('остановка генератора publishBehavior');
				clearInterval(interval1);
			}
		}, 101);
}

const publishBehaviorInitialValue = 'publishBehaviorInitialValue'

const publishBehavior$ = new Observable(publishBehaviorObserver).pipe(
	// tap(logAll),
	publishBehavior(publishBehaviorInitialValue), //если закомментировать, потоки стартуют по .subscribe вместо .connect
);

// ! раскомментировать 3 строки
// publishBehavior$.subscribe((item) => logAll(item + '-подписка1'), null, () => logAll('publishBehavior подписка1-закрыта'));
// publishBehavior$.pipe(delay(1000)).subscribe((item) => logAll(item + '-подписка2'), null, () => logAll('publishBehavior подписка2-закрыта'));
// publishBehavior$.connect();

/**
 * publishLast
 * Конвертирует поток в ConnectableObservable
 * Имитирует только крайнее значение входного потока
 * Позволяет одновременно стартовать все потоки через методом connect()
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * ! работает с pipe, но требуется указывать as ConnectableObservable<any>;
 * 
 * 
Hello World!
1-закрыт-подписка1
1-закрыт-подписка2
publishLast подписка1-закрыта
publishLast подписка2-закрыта
 */

const publishLast1$ = interval(101).pipe(
	// контрольный поток
	take(3),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const publishLast$ = of(publishLast1$).pipe(
	// tap(logAll),
	mergeAll(),
	publishLast(), //если закомментировать, потоки стартуют по .subscribe вместо .connect
) as ConnectableObservable<any>;

publishLast$.subscribe((item) => logAll(item + '-подписка1'), null, () => logAll('publishLast подписка1-закрыта'));
const publishLastTimeout = setInterval(() => {
	publishLast$.subscribe((item) => logAll(item + '-подписка2'), null, () => logAll('publishLast подписка2-закрыта'));
	clearInterval(publishLastTimeout);
}, 300);

// publishLast$.connect();

/**
 * publishReplay
 * Конвертирует поток в ConnectableObservable
 * Позволяет одновременно стартовать все потоки через методом connect()
 * После .connect имитирует все значения входного потока для подписчика
 * Если .connect после закрытия входного потока, то имитирует только указанное количество значений publishReplayCount входного потока
 * косяк rxjs - https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md#observable-classes
 * pipe всегда возвращает Observable https://github.com/ReactiveX/rxjs/issues/3595
 * 
 * Hello World!
0-1-подписка1
101-1-подписка1
0-1-подписка2
101-1-подписка2
202-1-подписка1
202-1-подписка2
1-закрыт-подписка1
1-закрыт-подписка2
publishReplay подписка1-закрыта
publishReplay подписка2-закрыта
0-1-подписка3
101-1-подписка3
202-1-подписка3
1-закрыт-подписка3
publishReplay подписка3-закрыта
 */

const publishReplay1$ = interval(101).pipe(
	// контрольный поток
	take(3),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const publishReplay$ = of(publishReplay1$).pipe(
	// tap(logAll),
	mergeAll(),
	publishReplay(), //если закомментировать, потоки стартуют по .subscribe вместо .connect
) as ConnectableObservable<any>;

publishReplay$.subscribe((item) => logAll(item + '-подписка1'), null, () => logAll('publishReplay подписка1-закрыта'));

const publishReplayTimeout1 = setInterval(() => {
	publishReplay$.subscribe((item) => logAll(item + '-подписка2'), null, () => logAll('publishReplay подписка2-закрыта'));
	clearInterval(publishReplayTimeout1);
}, 300);

const publishReplayTimeout2 = setInterval(() => {
	publishReplay$.subscribe((item) => logAll(item + '-подписка3'), null, () => logAll('publishReplay подписка3-закрыта'));
	clearInterval(publishReplayTimeout2);
}, 500);

// publishReplay$.connect();

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

// count$.subscribe((item) => logAll('получил: ',item), null, ()=> logAll('count поток закрыт'));

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

// every$.subscribe((item) => logAll('получил: ', item), null, () => logAll('every поток закрыт'));

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

// isEmpty$.subscribe((item) => logAll('получил: ', item), null, () => logAll('isEmpty поток закрыт'));

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


const sequenceEqual1Control$ = interval(101).pipe(
	take(3),
	map(item => item * 101 + '-1'),
	tap(logAll)
);

const sequenceEqual1$ = interval(202).pipe( // !время разное
	take(3),
	map(item => item * 101 + '-1'),
	tap(logAll),
	sequenceEqual(sequenceEqual1Control$),
	endWith('1-закрыто')
);

const sequenceEqual2Control$ = interval(101).pipe(
	take(3),
	map(item => item * 101 + '-2'),
	tap(logAll)
);

const sequenceEqual2$ = interval(101).pipe(
	take(3),
	map(item => item * 101 + '-2другой'),
	tap(logAll),
	sequenceEqual(sequenceEqual2Control$),
	endWith('2-закрыто')
);

const sequenceEqual$ = of(sequenceEqual1$, sequenceEqual2$).pipe(
	// tap(logAll),
	mergeAll()
)

// sequenceEqual$.subscribe((item) => logAll('получил: ', item), null, () => logAll('sequenceEqual поток закрыт'));

//====


/**
 * forkJoin, merge, concat, race, zip, iif
 */
