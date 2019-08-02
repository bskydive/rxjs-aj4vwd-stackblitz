import { of, interval, timer, throwError, Observable, forkJoin, fromEvent, combineLatest, merge, concat, race, zip, iif, asyncScheduler, asapScheduler, queueScheduler, animationFrameScheduler, VirtualTimeScheduler, empty, Notification } from 'rxjs';
import { map, buffer, take, bufferCount, bufferTime, tap, bufferToggle, bufferWhen, switchMap, toArray, window, windowCount, windowTime, windowToggle, windowWhen, catchError, throwIfEmpty, onErrorResumeNext, retry, scan, takeWhile, retryWhen, timeout, timeoutWith, skip, skipLast, skipUntil, skipWhile, takeLast, takeUntil, distinct, distinctUntilChanged, distinctUntilKeyChanged, filter, sample, audit, throttle, first, last, min, max, elementAt, find, findIndex, single, combineAll, concatAll, exhaust, delay, mergeAll, switchAll, withLatestFrom, groupBy, mergeMap, pairwise, exhaustMap, pluck, endWith, zipAll, repeat, repeatWhen, ignoreElements, finalize, auditTime, sampleTime, observeOn, subscribeOn, debounce, debounceTime, delayWhen, throttleTime, timeInterval, timestamp, concatMap, concatMapTo, defaultIfEmpty, startWith, expand, mapTo, mergeScan, reduce, mergeMapTo, switchMapTo, materialize, dematerialize } from 'rxjs/operators';


const source = of('World').pipe(
	map(x => `Hello ${x}!`)
);
source.subscribe(x => console.log(x));

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
 * унифицированные постфиксы '-1' | '-$' | '-dynamic' помогают в чтении вывода
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
 * subscribe(item => console.log('значение потока', item), err => console.log('ошибка', err), () => console.log('поток закрыт штатно')); - запускает поток, принимает три аргумента для значений(next), ошибок(error), завершения потока(complete)
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
 */
function logAll() {
	console.log(...arguments);
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
	tap(item => ['фига с два: ', item]),//не возвращает ничего
	tap(item => console.log('отладь меня: ', item)),//используется для отладки
)

/**
 * Три работающих варианта подписки
 * разведены во времени, чтобы не перемешивать вывод в консоль
 */
//map$.subscribe(item => console.log('раз:', item));//без задержек

/*
setTimeout(() => {
  map$.subscribe(item => console.log('два', item), err => console.log('два', err), () => console.log('два', 'конец'));
}, 1000);//с задержкой в 1 сек
*/
/*
setTimeout(() => {
  map$.subscribe({
    next: item => console.log('три', item),
    error: err => console.log('три', err),
    complete: () => console.log('три', 'конец')
  })
}, 2000);//с задержкой в 2 сек
*/

//========================================================================================================================
//==================================================BUFFER================================================================
//========================================================================================================================

/**
 * Кэширует и возвращает пачку значений
 */
//[0, 1, 2, 3, 4, 5, 6, 7, 8]
//[9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
//[9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const buffer$ = interval(100).pipe(
	buffer(interval(1000)),
	take(3),
	map(item => ['bufferInterval', ...item])
)
//buffer$.subscribe(a => console.log(a));

//[0, 1, 2]
//[3, 4, 5]
//[6, 7, 8]
const bufferCount$ = interval(100).pipe(
	bufferCount(3),
	take(3),
	map(item => ['bufferCount', ...item])
)
//bufferCount$.subscribe(a => console.log(a));

//[0, 1, 2]
//[2, 3, 4]
//[4, 5, 6]
//стартует новый буфер каждое второе значение
const bufferCountLength$ = interval(100).pipe(
	bufferCount(3, 2),
	take(3),
	map(item => ['bufferCountFork', ...item])
)
//bufferCountLength$.subscribe(a => console.log(a));

//["bufferTime", 0]
//["bufferTime", 0, 1, 2]
//["bufferTime", 1, 2, 3]
const bufferTime$ = interval(100).pipe(
	bufferTime(200, 100),
	take(3),
	map(item => ['bufferTime', ...item])
)
//bufferTime$.subscribe(a => console.log(a));

/*
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
//асинхронный старт и стоп буфера
let count = 0;
const bufferOpen$ = interval(400).pipe(tap(() => console.log('bufferOpen', count)))
const bufferClose$ = () => interval(300).pipe(tap(() => console.log('bufferClose', count++)))

const bufferToggle$ = interval(100).pipe(
	tap(item => console.log(item)),
	bufferToggle(bufferOpen$, bufferClose$),
	take(3),
	map(item => ['bufferToggle', ...item])
)
//bufferToggle$.subscribe(a => console.log(a));

//выбор времени закрытия буфера
/*
["bufferWhen", 0]
["bufferWhen", 1, 2, 3]
["bufferWhenElse", 4, 5]
["bufferWhenElse", 6]
["bufferWhenElse", 7]
["bufferWhenElse", 8]
["bufferWhenElse", 9]
*/
count = 0;
const bufferWhen$ = interval(500).pipe(
	take(10),
	map(item => (count = item)),
	bufferWhen(() => {
		if (count < 5) {
			return interval(1000)
		}
		else { return interval(500) }
	}),
	map(item => {
		if (count < 5) {
			return ['bufferWhen', ...item]
		} else {
			return ['bufferWhenElse', ...item]
		}
	})
)
//bufferWhen$.subscribe(a => console.log(a));


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
	switchMap(item => item.pipe(
		toArray(),
		map(item => ['window', ...item]))
	),
)
//window$.subscribe(a => console.log(a));


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
	switchMap(item => item.pipe(
		toArray(),
		map(item => ['windowCount', ...item]))
	),
)
//windowCount$.subscribe(a => console.log(a));



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
		switchMap(item => item.pipe(
			toArray(),
			map(item => ['windowTime', ...item]))
		),
	)
//windowTime$.subscribe(a => console.log(a));

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
count = 0;
const windowOpen$ = timer(0, 400).pipe(map(() => console.log('windowOpen', count)))
const windowClose$ = () => timer(300).pipe(map(() => console.log('windowClose', count++)))

const windowToggle$ = timer(0, 100).pipe(
	take(10),
	tap(item => console.log(item)),
	windowToggle(windowOpen$, windowClose$),
	switchMap(item => item.pipe(
		toArray(),
		map(item => ['windowToggle', ...item]))
	),
)
//windowToggle$.subscribe(a => console.log(a));


/**
 * windowWhen
 * выбор времени закрытия буфера 
 
*/
count = 0;
const windowWhen$ = interval(500).pipe(
	take(10),
	map(item => (count = item)),
	windowWhen(() => {
		if (count < 5) {
			return interval(1000)
		}
		else { return interval(500) }
	}),
	switchMap(item => item
		.pipe(
			toArray(),
			map(item => {
				if (count < 5) {
					return ['windowWhen', ...item]
				} else {
					return ['windowWhenElse', ...item]
				}
			})
		)
	)
)
//windowWhen$.subscribe(a => console.log(a));

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
		catchError((err, caught) => {
			console.log('словил:', err, 'источик:', caught);//перехватчик ошибок
			return throwError(`вернул взад ${err}`);//генерируем новую ошибку вместо текущей
		}),
		catchError((err, caught) => {
			console.log('положь где взял:', err, 'источик:', caught);//перехватчик ошибок работает последовательно
			return of('янеошибка');//подмена ошибки значением
		}),
	)
//error$.subscribe(a => console.log(a), err => console.log('ошибка:', err), ()=>console.log('норм'));


//
/**
 * errorHandler
 * ошибка  при пустом потоке
 * Можно подменять ошибку
 * Error {message: "no elements in sequence", name: "EmptyError"}
 */
const errorHandler = () => console.log(`ничоси`);
const errorEmpty$ = of().pipe(
	throwIfEmpty()//без подмены
	//throwIfEmpty(errorHandler)//подмена ошибки
)

//errorEmpty$.subscribe(a => console.log(a), err=>console.log(err));


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
const errorNext$ = of(`едем дальше`);//резервный поток после ошибок
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

//errorSwitch$.subscribe(a => console.log(a), err=>console.log(err));

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

//errorRetry$.subscribe(a => console.log(a));

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
				console.log('словили: ' + item)
			}),
			take(3)//отправляет complete после 3 повторов
		)
	})
)
//errorRetryWhen$.subscribe(a => console.log(a));

//retryWhen
const swallow = false;
const swallow$ = interval(200).pipe(
	map(x => {
		console.log('try: ' + x);
		if (x === 1) {
			throw 'error: ' + x;
		}
		return x;
	}),
	retryWhen(errors => {
		if (swallow) {
			return errors.pipe(
				tap(err => console.log(err)),
				scan(acc => acc + 1, 0),
				tap(retryCount => {
					if (retryCount === 2) {
						console.log('swallowing error and stop')
					} else {
						console.log('retry all: ' + retryCount);
					}
					return retryCount;
				}),
				takeWhile(errCount => errCount < 2)
			)
		} else {
			return errors.pipe(
				tap(err => console.log(err)),
				scan(acc => acc + 1, 0),
				tap(retryCount => {
					if (retryCount === 2) {
						console.log('fail');
						throw 'error';
					} else {
						console.log('retry whole source: ' + retryCount);
					}
				})
			)
		}

	})
)

//swallow$.subscribe(  a => console.log('success: ' + a),  err => console.log('error: ' + err),  () => console.log('swallow completed'))


/**
 * timeout
 * прерывает поток ошибкой, если нет значения за время интервала
 * также можно указать дату вместо интервала, но можно наступить на локализацию
Таймер сработал
Error {message: "Timeout has occurred", name: "TimeoutError"}
Observable {_isScalar: false, source: {…}, operator: {…}}
complete
 */
const errorMsg = () => console.log('error');
const timeOut$ = interval(102).pipe(
	take(5),
	tap(value => console.log(value * 102)),
	timeout(100), // таймер
	catchError((err, caught) => {
		if (err.name === 'TimeoutError') {
			// обрабатываем событие таймера
			console.log('Таймер сработал')
		};
		return of(err, caught)
	})
)

//timeOut$.subscribe(a => console.log(a), err => (console.log('ошибка: ' + err)), () => console.log('complete'));

/**
 * timeoutWith
 * стартует новый поток, если нет значения за время интервала
 * также можно указать дату вметсо интервала, но можно наступить на локализацию
ещё 0
ещё 100
1
2
3
complete
 */
const timeOutWithFallback$ = of(1, 2, 3);
const timeOutWith$ = Observable.create(observer => {
	observer.next('ещё 0');
	setTimeout(() => observer.next('ещё 100'), 100);
	setTimeout(() => observer.next('ещё 202'), 202);//заменить на 200, чтобы не было прерывания
	setTimeout(() => observer.complete('ещё 300'), 300);
}).pipe(timeoutWith(101, timeOutWithFallback$))

//timeOutWith$.subscribe(a => console.log(a), err=>(console.log('ошибка: '+err)), ()=>console.log('complete'));


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

//skip$.subscribe(a => console.log(a));


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

//skipLast$.subscribe(a => console.log(a));

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

//skipUntil$.subscribe(a => console.log(a));

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

//skipWhile$.subscribe(a => console.log(a));


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

//take$.subscribe(a => console.log(a));


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

//takeLast$.subscribe(a => console.log(a));

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

//takeUntil$.subscribe(a => console.log(a), err => console.log('error', err), () => console.log('поток закрыт')); */


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

//takeWhile$.subscribe(a => console.log(a));

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
//distinct$.subscribe(a => console.log(a));

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
//distinctFunc$.subscribe(a => console.log(a));

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
//distinctUntilChanged$.subscribe(a => console.log(a));

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
//distinctUntilKeyChanged$.subscribe(a => console.log(a));

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

//filter$.subscribe(a => console.log(a));

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
	tap(item => console.log('получил: ' + item)),
	sample(sampleProbe$)
)

//sample$.subscribe(a => console.log(a), err=>(console.log('ошибка: '+err)), ()=>console.log('complete'));

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
	console.log('обработал: ' + item);
	return interval(300);
}
const audit$ = timer(0, 102).pipe(
	take(10),
	map(item => item * 102),
	tap(item => console.log('получил: ' + item)),
	audit(auditProbe$)
)

//audit$.subscribe(a => console.log(a));

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
	console.log('обработал: ' + item);
	return timer(300);
}
const throttle$ = timer(0, 102).pipe(
	take(10),
	map(item => item * 102),
	tap(item => console.log('получил: ' + item)),
	throttle(throttleProbe$)
)

//throttle$.subscribe(a => console.log(a));


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
	tap(item => console.log('получил: ' + item)),
	first()
	//first(item=>item % 2 === 0)//вернёт первое чётное число
)

//first$.subscribe(a => console.log(a));

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
	tap(item => console.log('получил: ' + item)),
	last()
	//last(item=>item % 2 === 0)//вернёт первое чётное число
)

//last$.subscribe(a => console.log(a));

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
	tap(item => console.log('получил: ' + item)),
	//min()//вернёт минимальное число -2
	min((item1, item2) => {
		if (Math.abs(item1) > Math.abs(item2)) { return 1 } else { return -1 };
	})
)
//min$.subscribe(a => console.log(a));


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
	tap(item => console.log('получил: ' + item)),
	max()//вернёт максиимальное число 6
	//max((item1, item2) => {
	//    if (Math.abs(item1) < Math.abs(item2)) { return 1 } else { return -1 };
	//  })
)
//max$.subscribe(a => console.log(a));


/**
 * возвращает элемент по индексу в потоке
4
 */
const elementAt$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => console.log('получил: ' + item)),
	elementAt(3)

)
//elementAt$.subscribe(a => console.log(a));


/**
 * возвращает элемент потока, если функция аргумент findProbe возвращает true
0
 */
const findProbe = item => item === 0;
const find$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => console.log('получил: ' + item)),
	find(findProbe)
)
//find$.subscribe(a => console.log(a));

/**
 * возвращает индекс элемента потока, если функция аргумент findIndexProbe возвращает true
2
 */
const findIndexProbe = item => item === 0;
const findIndex$ = of(-2, -1, 0, 4, 5, 6).pipe(
	tap(item => console.log('получил: ' + item)),
	findIndex(findIndexProbe)
)
//findIndex$.subscribe(a => console.log(a));

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
	tap(item => console.log('получил: ' + item)),
	single(singleProbe)
)
//single$.subscribe(a => console.log(a));


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
	tap(logAll),//возвращает три потока наблюдателей
	combineAll()
)

//combineAll$.subscribe(() => console.log( ...arguments))

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
const concat1 = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const concat2 = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const concat3 = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const concatAll$ = of(concat1, concat2, concat3).pipe(
	tap(logAll),//возвращает три потока наблюдателей
	concatAll()
)

//concatAll$.subscribe((item) => console.log('получил: ',item))

/**
 * exhaust
 * Возвращает значения потока, который первый их прислал. Остальные потоки блокируются, пока первый поток не закончися
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
const exhaust1 = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const exhaust2 = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const exhaust3 = interval(2000).pipe(take(3), map(item => item * 303 + '-3'));
const exhaust4 = of(1, 2, 3).pipe(delay(2000));
const exhaust$ = of(exhaust1, exhaust2, exhaust3, exhaust4).pipe(
	tap(logAll),//возвращает три потока наблюдателей
	exhaust()
)

//exhaust$.subscribe((item) => console.log('получил: ',...arguments))

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
const mergeAll1 = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeAll2 = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeAll3 = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeAll4 = of(1, 2, 3).pipe(delay(2000));
const mergeAll$ = of(mergeAll1, mergeAll2, mergeAll3, mergeAll4).pipe(
	tap(logAll),//возвращает три потока наблюдателей
	mergeAll()
)

//mergeAll$.subscribe((item) => console.log('получил: ',item))

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
const withLatestFrom1 = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const withLatestFrom2 = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const withLatestFrom3 = of(1);
//const withLatestFrom3 = of(1).pipe(delay(1000));
const withLatestFrom$ = interval(303).pipe(
	take(3),
	map(item => item * 303 + '-3'),
	withLatestFrom(withLatestFrom1, withLatestFrom2, withLatestFrom3),
	//map(([item1,item2,item3,item4])=>console.log([item1,item2,item3,item4]))
)

//withLatestFrom$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('поток закрыт'));


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
const mergeMap1 = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeMap2 = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeMap3 = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeMap4 = of(1, 2, 3).pipe(delay(2000));
const mergeMapArray = item$ => item$.pipe(toArray())
const mergeMap$ = of(mergeMap1, mergeMap2, mergeMap3, mergeMap4).pipe(
	tap(logAll),//возвращает три потока наблюдателей
	mergeMap(mergeMapArray)
)

//mergeMap$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('mergeMap поток закрыт'));

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

//groupBy$.subscribe((item) => console.log(JSON.stringify(item)))

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

//pairwise$.subscribe((item) => console.log(JSON.stringify(item)))

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
const switchAll0 = of(1, 2, 3).pipe(map(item => item * 1 + '-0'), tap(logAll), endWith('0-закрыт'));
const switchAll1 = interval(101).pipe(delay(1000), take(5), map(item => item * 101 + '-1'), tap(logAll), endWith('1-закрыт'));
const switchAll2 = interval(202).pipe(delay(1000), take(5), map(item => item * 202 + '-2'), tap(logAll), endWith('2-закрыт'));
const switchAll$ = of(switchAll0, switchAll1, switchAll2).pipe(
	// mergeAll(), // для проверки асинхронности
	switchAll()
)

// switchAll$.subscribe(item => console.log(item), null, () => console.log('switchAll поток закрыт'));

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
const zipAll0 = of(1, 2, 3).pipe(map(item => item * 1 + '-0'), tap(logAll), endWith('0-закрыт'));
const zipAll1 = interval(101).pipe(delay(1000), take(5), map(item => item * 101 + 1000 + '-1'), tap(logAll), endWith('1-закрыт'));
const zipAll2 = interval(202).pipe(delay(1000), take(5), map(item => item * 202 + 1000 + '-2'), tap(logAll), endWith('2-закрыт'));
const zipAll$ = of(zipAll0, zipAll1, zipAll2).pipe(
	// mergeAll(), // для проверки асинхронности
	zipAll()
)

// zipAll$.subscribe(item => console.log(item), null, () => console.log('zipAll поток закрыт'));

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
const repeat1 = interval(101).pipe(take(5), map(item => item * 101 + '-1'), endWith('1-закрыт'));

const repeat$ = repeat1.pipe(
	repeat(3)
)

// repeat$.subscribe(item => console.log(item), null, () => console.log('repeat поток закрыт'));

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
const repeatWhen1 = interval(101).pipe(take(10), map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'));
const repeatWhenControl = () => interval(202).pipe(
	delay(1000),
	take(3),
	map(item => item * 202 + 1000 + '-control'),
	tap(logAll),
	endWith('control-закрыт')
);
const repeatWhen$ = repeatWhen1.pipe(
	repeatWhen(repeatWhenControl)
)

// repeatWhen$.subscribe(item => console.log(item), null, () => console.log('repeatWhen поток закрыт'));


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
const ignoreElements1 = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	// mergeAll(), ignoreElements(),
	endWith('1-закрыт'));

const ignoreElementsErr2 = interval(404).pipe(
	take(3),
	map(item => item * 404 + '-2'),
	tap(logAll),
	map(item => throwError(item)),
	mergeAll(), ignoreElements(),
	endWith('err-закрыт'));

const ignoreElementsErr3 = interval(505).pipe(
	take(3),
	map(item => item * 505 + '-3'),
	tap(logAll),
	map(item => throwError(item)),
	mergeAll(), ignoreElements(),
	endWith('err2-закрыт'));

const ignoreElements$ = of(ignoreElements1, ignoreElementsErr2, ignoreElementsErr3).pipe(
	mergeAll(),
)

//ignoreElements$.subscribe(item => console.log(item), err => console.log('ошибка:', err), () => console.log('ignoreElements поток закрыт'));

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
const finalizeFn = item => () => console.log('fin', item);//обёртка для вывода названия завершающегося потока

const finalizeErr1 = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	tap(logAll),
	// map(item => throwError(item)),
	// mergeAll(),
	endWith('err1-закрыт'),
	finalize(finalizeFn('1')),
);

const finalizeErr2 = interval(505).pipe(
	take(3),
	map(item => item * 505 + '-2'),
	tap(logAll),
	map(item => throwError(item)),
	mergeAll(),
	endWith('err2-закрыт'),
	finalize(finalizeFn('2')),
);

const finalize$ = of(finalizeErr1, finalizeErr2).pipe(
	mergeAll(),
	finalize(finalizeFn('main')),
)

//finalize$.subscribe(item => console.log(item), err => console.log('ошибка:', err), () => console.log('finalize поток закрыт'));

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
const auditTime1 = interval(101).pipe(take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'));
const auditTime2 = interval(202).pipe(take(10),
	map(item => item * 202 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'));

const auditTime$ = of(auditTime1, auditTime2).pipe(
	mergeAll(),
	auditTime(500),
	map(item => item + '-audit500')
)

// auditTime$.subscribe(item => console.log(item), null, () => console.log('auditTime поток закрыт'));


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
const sampleTime1 = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'));
const sampleTime5 = interval(505).pipe(
	take(5),
	map(item => item * 505 + '-5'),
	// tap(logAll),
	endWith('5-закрыт'));

const sampleTime$ = of(sampleTime1, sampleTime5).pipe(
	mergeAll(),
	sampleTime(500),
	// map(item => item+'-sample500')
)

// sampleTime$.subscribe(item => console.log(item), null, () => console.log('sampleTime поток закрыт'));

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
const observeOn1 = interval(101).pipe(
	take(3),
	// observeOn(asyncScheduler),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
);

const observeOn2 = interval(102).pipe(
	take(3),
	// observeOn(asapScheduler),
	map(item => item * 102 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
);

const observeOn3 = interval(103).pipe(
	take(3),
	// observeOn(queueScheduler),
	map(item => item * 103 + '-3'),
	// tap(logAll),
	endWith('3-закрыт'),
);

const observeOn4 = interval(104).pipe(
	take(3),
	// observeOn(animationFrameScheduler),
	map(item => item * 104 + '-4'),
	// tap(logAll),
	endWith('4-закрыт')
);

const observeOn5 = interval(105).pipe(
	// без observeOn считается, что приоритет immediate
	take(3),
	map(item => item * 105 + '-5'),
	// tap(logAll),
	endWith('5-закрыт')
);

const observeOn$ = of(observeOn1, observeOn2, observeOn3, observeOn4, observeOn5).pipe(
	mergeAll(),
	// map(item => item+'-observe')
)

// observeOn$.subscribe(item => console.log(item), null, () => console.log('observeOn поток закрыт'));

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
const subscribeOn1 = interval(101).pipe(
	take(3),
	// subscribeOn(asyncScheduler),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
);

const subscribeOn2 = interval(102).pipe(
	take(3),
	// subscribeOn(asapScheduler),
	map(item => item * 102 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
);

const subscribeOn3 = interval(103).pipe(
	take(3),
	// subscribeOn(queueScheduler),
	map(item => item * 103 + '-3'),
	// tap(logAll),
	endWith('3-закрыт'),
);

const subscribeOn4 = interval(104).pipe(
	take(3),
	// subscribeOn(animationFrameScheduler),
	map(item => item * 104 + '-4'),
	// tap(logAll),
	endWith('4-закрыт')
);

const subscribeOn5 = interval(105).pipe(
	// без subscribeOn считается, что приоритет immediate
	take(3),
	map(item => item * 105 + '-5'),
	// tap(logAll),
	endWith('5-закрыт')
);

const subscribeOn$ = of(subscribeOn1, subscribeOn2, subscribeOn3, subscribeOn4, subscribeOn5).pipe(
	mergeAll(),
	// map(item => item+'-subscribe')
)

// subscribeOn$.subscribe(item => console.log(item), null, () => console.log('subscribeOn поток закрыт'));

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

const debounceSignalOver = interval(2000)
const debounceSignalNorm = interval(50)
const debounceSignalDynamic = item => {
	const TIMER = 5; // interval имитирует 0,1,2,3,4...
	if (item > TIMER) {
		return interval(500)
	} else {
		return interval(0)
	}
}

const debounceOver = interval(101).pipe(
	take(10),
	debounce(item => debounceSignalOver),
	map(item => item * 101 + '-over'),
	// tap(logAll),
	endWith('over-закрыт'),
);

const debounceNorm = interval(102).pipe(
	take(10),
	debounce(item => debounceSignalNorm),
	map(item => item * 102 + '-norm'),
	// tap(logAll),
	endWith('norm-закрыт'),
);

const debounceDynamic = interval(103).pipe(
	take(10),
	debounce(item => debounceSignalDynamic(item)),
	map(item => item * 103 + '-dynamic'),
	// tap(logAll),
	endWith('dynamic-закрыт'),
);

const debounce$ = of(debounceOver, debounceNorm, debounceDynamic).pipe(
	mergeAll(),
	// map(item => item+'-subscribe')
)

//debounce$.subscribe(item => console.log(item + '-$'), null, () => console.log('debounce поток закрыт'));

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

const debounceTimeOver = interval(101).pipe(
	take(10),
	map(item => item * 101 + '-over'),
	// tap(logAll),
	debounceTime(1000),
	endWith('over-закрыт'),
);

const debounceTimeNorm = interval(102).pipe(
	take(10),
	map(item => item * 102 + '-norm'),
	// tap(logAll),
	debounceTime(50),
	endWith('norm-закрыт'),
);

const debounceTime$ = of(debounceTimeOver, debounceTimeNorm).pipe(
	mergeAll(),
	// map(item => item+'-subscribe')
)

// debounceTime$.subscribe(item => console.log(item + '-$'), null, () => console.log('debounceTime поток закрыт'));

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
const delay1 = interval(101).pipe(
	delay(1000),
	take(3),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const delay2 = interval(102).pipe(
	delay(new Date(Date.now() + 1000)),
	take(3),
	map(item => item * 102 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
)

const delay3 = interval(103).pipe(
	// контрольный поток без задержек
	take(10),
	map(item => item * 103 + '-3'),
	// tap(logAll),
	endWith('3-закрыт'),
)

const delay$ = of(delay1, delay2, delay3).pipe(
	mergeAll()
)

//delay$.subscribe(item => console.log(item + '-$'), null, () => console.log('delay поток закрыт'));

/**
 * delayWhen
 * Задерживает мимтацию значений потока на указанный интервал
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
const delayWhen1 = interval(101).pipe(
	// контрольный поток без задержек
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const delayWhen2 = interval(102).pipe(
	delayWhen((item, index) => interval(200)),
	take(10),
	map(item => item * 102 + 200 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
)

const delayWhen$ = of(delayWhen1, delayWhen2).pipe(
	mergeAll()
)

//delayWhen$.subscribe(item => console.log(item + '-$'), null, () => console.log('delayWhen поток закрыт'));


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
const throttleTime1 = interval(101).pipe(
	// контрольный поток без задержек
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const throttleTime2 = interval(102).pipe(
	throttleTime(300),
	take(10),
	map(item => item * 102 + 300 + '-2'),
	// tap(logAll),
	endWith('2-закрыт'),
)

const throttleTime$ = of(throttleTime1, throttleTime2).pipe(
	mergeAll()
)

//throttleTime$.subscribe(item => console.log(item + '-$'), null, () => console.log('throttleTime поток закрыт'));

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
const timeInterval1 = interval(102).pipe(
	take(5),
	map(item => item * 102 + '-2'),
	timeInterval(),
	// tap(logAll),
	endWith('2-закрыт'),
)

const timeInterval$ = of(timeInterval1).pipe(
	mergeAll()
)

//timeInterval$.subscribe(item => console.log(JSON.stringify(item) + '-$'), null, () => console.log('timeInterval поток закрыт'));

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
const timestamp1 = interval(101).pipe(
	take(5),
	map(item => item * 101 + '-1'),
	timestamp(),
	// tap(logAll),
	endWith('1-закрыт'),
)

const timestamp2 = interval(102).pipe(
	// добавим немного человекочитаемости к дате
	take(5),
	map(item => item * 102 + '-2'),
	timestamp(),
	map(item => { return { value: item.value, timestamp: new Date(item.timestamp) } }),
	// tap(logAll),
	endWith('2-закрыт'),
)

const timestamp$ = of(timestamp1, timestamp2).pipe(
	mergeAll()
)

//timestamp$.subscribe(item => console.log(JSON.stringify(item) + '-$'), null, () => console.log('timestamp поток закрыт'));

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
const concatMap1 = interval(101).pipe(
	// контрольный поток
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const concatMap2 = interval(102).pipe(
	// просто меняем значение на массив
	take(5),
	map(item => item * 102 + '-2'),
	concatMap((item, index) => [item, item + 1000]),
	// tap(logAll),
	endWith('2-закрыт'),
)

const concatMap3 = interval(103).pipe(
	// добавляем задержку
	take(5),
	map(item => item * 103 + '-3'),
	concatMap((item, index) => of([item, 'delay200']).pipe(delay(200))),
	// tap(logAll),
	endWith('3-закрыт'),
)

const concatMap$ = of(concatMap1, concatMap2, concatMap3).pipe(
	mergeAll()
)

// concatMap$.subscribe(item => console.log(JSON.stringify(item) + '-$'), null, () => console.log('concatMap поток закрыт'));

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
const concatMapTo1 = interval(101).pipe(
	// контрольный поток
	take(10),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const concatMapToInternal = interval(102).pipe(
	// внутренний поток для concatMap
	take(3),
	map(item => item * 102 + '-Internal'),
	// tap(logAll),
	endWith('Internal-закрыт'),
)

const concatMapToSignal = interval(103).pipe(
	// имитируем значения из внутреннего потока 
	take(5),
	map(item => item * 103 + '-Signal'),
	concatMapTo(concatMapToInternal),
	// tap(logAll),
	endWith('Signal-закрыт'),
)

const concatMapTo$ = of(concatMapTo1, concatMapToSignal).pipe(
	mergeAll()
)

// concatMapTo$.subscribe(item => console.log(item + '-$'), null, () => console.log('concatMapTo поток закрыт'));

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

const defaultIfEmpty1 = interval(103).pipe(
	// имитируем значения из внутреннего потока 
	take(0),
	map(item => item * 103 + '-1'),
	// tap(logAll),
	defaultIfEmpty(defaultIfEmptyInternal),
	endWith('1-закрыт'),
)

const defaultIfEmpty$ = of(defaultIfEmpty1).pipe(
	mergeAll()
)

//defaultIfEmpty$.subscribe(item => console.log(item + '-$'), null, () => console.log('defaultIfEmpty поток закрыт'));


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

const endWith1 = interval(101).pipe(
	map(item => item * 101 + '-1'),
	take(3),
	// tap(logAll),
	endWith('1-закрыт'),
)

const endWith2 = interval(102).pipe(
	//неправильное положение оператора
	map(item => item * 102 + '-2'),
	endWith('2-закрыт'),
	take(3)
	// tap(logAll),
)

const endWith$ = of(endWith1, endWith2).pipe(
	mergeAll()
)

//endWith$.subscribe(item => console.log(item + '-$'), null, () => console.log('endWith поток закрыт'));

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
const startWith1 = interval(101).pipe(
	map(item => item * 101 + '-1'),
	startWith('1-открыт'),
	take(3),
	endWith('1-закрыт'),
	// tap(logAll),
)

const startWith2 = interval(102).pipe(
	//неправильное положение оператора
	map(item => item * 102 + '-2'),
	take(3),
	endWith('2-закрыт'),
	startWith('2-открыт'),
	// tap(logAll),
)

const startWith$ = of(startWith1, startWith2).pipe(
	mergeAll()
)

//startWith$.subscribe(item => console.log(item + '-$'), null, () => console.log('startWith поток закрыт'));


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
//exhaustMap$.subscribe(item => console.log(item), null, ()=> console.log('exhaustMap поток закрыт'));

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

const expand1 = interval(501).pipe(
	take(3),
	expand(parserRecursive1),
	endWith('2-закрыт'),
	// tap(logAll),
)

const expand$ = of(expand1).pipe(
	mergeAll()
)

//expand$.subscribe(item => console.log(item + '-$'), null, () => console.log('expand поток закрыт'));

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

const mapTo1 = interval(101).pipe(
	// контрольный поток
	take(5),
	map(item => item * 101 + '-1'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const mapToSignal = interval(103).pipe(
	take(3),
	map(item => item * 103 + '-Signal'),
	mapTo('mapToInternal'),
	// tap(logAll),
	endWith('Signal-закрыт'),
)

const mapTo$ = of(mapTo1, mapToSignal).pipe(
	mergeAll()
)

//mapTo$.subscribe(item => console.log(item + '-$'), null, () => console.log('mapTo поток закрыт'));

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
	console.log(`time: ${item*101}; item: ${item}; accumulator: ${accumulator}`);
	return item + accumulator
};
const scanAccumulatorInitial = 0;

const scan1 = interval(101).pipe(
	take(5),
	scan(scanAccumulator, scanAccumulatorInitial),
	// tap(logAll),
	endWith('1-закрыт'),
)

const scan$ = of(scan1).pipe(
	mergeAll()
)

//scan$.subscribe(item => console.log(item + '-$'), null, () => console.log('scan поток закрыт'));


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
const mergeScanInternal = interval(11).pipe(
	take(3),
	map(item => item * 11 + '-internal'),
	// tap(logAll),
	endWith('1-закрыт'),
)

const mergeScanAccumulator = (accumulator, item) => {
	console.log(`time: ${item*101}; item: ${item}; accumulator: ${accumulator}`);
	// return of(item + accumulator)
	return mergeScanInternal
};

const mergeScanAccumulatorInitial = 0;

const mergeScan1 = interval(102).pipe(
	take(5),
	mergeScan(mergeScanAccumulator, mergeScanAccumulatorInitial),
	// tap(logAll),
	endWith('2-закрыт'),
)

const mergeScan$ = of(mergeScan1).pipe(
	mergeAll()
)

//mergeScan$.subscribe(item => console.log(item + '-$'), null, () => console.log('mergeScan поток закрыт'));

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
		map(item => { return { single: item, double: item * 2, nested: { triple: item * 3 } } }),//переделываем число в объект
		//pluck('nested','triple'),//возвращаем в поток только item.nested.triple
		pluck('double')//возвращаем в поток только item.double
	);

//pluck$.subscribe(item => console.log(item), null, ()=> console.log('pluck поток закрыт'));

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
	console.log(`time: ${item*101}; item: ${item}; accumulator: ${accumulator}`);
	return item + accumulator
};
const reduceAccumulatorInitial = 0;

const reduce1 = interval(101).pipe(
	take(5),
	reduce(reduceAccumulator, reduceAccumulatorInitial),
	// tap(logAll),
	endWith('1-закрыт'),
)

const reduce$ = of(reduce1).pipe(
	mergeAll()
)

//reduce$.subscribe(item => console.log(item + '-$'), null, () => console.log('reduce поток закрыт'));


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

//switchMap$.subscribe(item => console.log(item), null, ()=> console.log('switchMap поток закрыт'));

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
const mergeMapTo1 = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const mergeMapTo2 = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const mergeMapTo3 = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const mergeMapTo4 = of(1, 2, 3).pipe(delay(2000));

const mergeMapToInternal = interval(11).pipe(take(3), map(item => item * 11 + '-internal'));


const mergeMapTo$ = of(mergeMapTo1, mergeMapTo2, mergeMapTo3, mergeMapTo4).pipe(
	tap(logAll),//возвращает три потока наблюдателей
	mergeMapTo(mergeMapToInternal)
)

// mergeMapTo$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('mergeMapTo поток закрыт'));

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

const switchMapTo1 = interval(101).pipe(take(10), map(item => item * 101 + '-1'));
const switchMapTo2 = interval(202).pipe(take(5), map(item => item * 202 + '-2'));
const switchMapTo3 = interval(303).pipe(take(3), map(item => item * 303 + '-3'));
const switchMapTo4 = of(1, 2, 3).pipe(delay(2000));

const switchMapToInternal = interval(11).pipe(take(3), map(item => item * 11 + '-internal'));


const switchMapTo$ = of(switchMapTo1, switchMapTo2, switchMapTo3, switchMapTo4).pipe(
	tap(logAll),//возвращает три потока наблюдателей
	switchMapTo(switchMapToInternal)
)

//switchMapTo$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('switchMapTo поток закрыт'));

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

const materialize1 = interval(101).pipe(take(3), map(item => item * 101 + '-1'), endWith('1-закрыто'));
const materialize2 = of(1).pipe(map(item => throwError('ошибка')));

const materialize$ = of(materialize1, materialize2).pipe(
	// tap(logAll),
	materialize()
)

// materialize$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('materialize поток закрыт'));


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

const dematerialize1 = interval(101).pipe(take(3), map(item => item * 101 + '-1'), endWith('1-закрыто'));
const dematerialize2 = of(1).pipe(map(item => throwError('ошибка')), endWith('2-закрыто'));
const dematerialize3 = of(Notification.createNext(0), Notification.createComplete()).pipe(endWith('3-закрыто'));

const dematerialize$ = of(dematerialize1, dematerialize2, dematerialize3).pipe(
	// tap(logAll),
	materialize(),
	dematerialize(),
	mergeAll()
)

//dematerialize$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('dematerialize поток закрыт'));



/**
 * forkJoin, merge, concat, race, zip, iif
 */