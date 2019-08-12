import { of, interval, timer, throwError, Observable, forkJoin, fromEvent, combineLatest, merge, concat, race, zip, iif, asyncScheduler, asapScheduler, queueScheduler, animationFrameScheduler, VirtualTimeScheduler, empty, Notification, Subject, from, ConnectableObservable } from 'rxjs';
import { map, buffer, take, bufferCount, bufferTime, tap, bufferToggle, bufferWhen, switchMap, toArray, window, windowCount, windowTime, windowToggle, windowWhen, catchError, throwIfEmpty, onErrorResumeNext, retry, scan, takeWhile, retryWhen, timeout, timeoutWith, skip, skipLast, skipUntil, skipWhile, takeLast, takeUntil, distinct, distinctUntilChanged, distinctUntilKeyChanged, filter, sample, audit, throttle, first, last, min, max, elementAt, find, findIndex, single, combineAll, concatAll, exhaust, delay, mergeAll, switchAll, withLatestFrom, groupBy, mergeMap, pairwise, exhaustMap, pluck, endWith, zipAll, repeat, repeatWhen, ignoreElements, finalize, auditTime, sampleTime, observeOn, subscribeOn, debounce, debounceTime, delayWhen, throttleTime, timeInterval, timestamp, concatMap, concatMapTo, defaultIfEmpty, startWith, expand, mapTo, mergeScan, reduce, mergeMapTo, switchMapTo, materialize, dematerialize, multicast, publish, share, shareReplay, publishBehavior, publishLast, publishReplay, count, every, isEmpty, sequenceEqual } from 'rxjs/operators';
import { logAll } from './src/utils';
import { filteringOperatorList } from './src/filtering';
import { bufferingOperatorList } from './src/buffering';
import { erroringOperatorList } from './src/erroring';
import { groupingOperatorList } from './src/grouping';
import { multicastingOperatorList } from './src/multicasting';
import { timingOperatorList } from './src/timing';
import { transformingOperatorList } from './src/transforming';

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
 * выводится время появления значения в потоке. Интервалы имитации разведены на милисекунду: 101, 102, 202, 203. Всегда понятно когда и в каком порядке имитировано значение.
 * к значениям из одного потока добавляются унифицированные постфиксы '-1' | '-2' | '-dynamic'
 * в примерах расставлены закоментированные операторы логирования для отладки tap(logAll)
 * выходная строка subscribe унифицирована для облегчения отладки
 * унифицированные постфиксы '-$' помогают в чтении вывода https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b
 * операторы endWith('...') помогают понять когда происходит завершение(отписка) потока
 * выполняется как в консоли, так и в онлайн редакторе. Некоторые примеры работают только в браузере, когда необходимо его API
 * просто один файл. Суровый "кирпич", который обусловлен стартовым шаблоном stackblitz. Легко искать, скачивать, отправлять. Трудно модифицировать совместно, долго запускать. Нет оглавления, но его можно построить поиском ctrl+shift+f '$.subscribe('. Любое другое удобство усложнит код, и потребует ещё более могучего времени на рефакторинг, поиск компромиссов. Таким образом я подсократил огромное количество убитого на это пособие времени. И это - начальный этап, сбор примеров, создание методики.
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
 * 
 * Типовой пример:

const auditProbe$ = item => { // функция-аргумент для передачи в оператор
	logAll('проверка: ' + item); // для отладки пишем полученное значение
	return interval(300).pipe(take(3)); // возвращаем наблюдатель. В данном случае - для имитации трёх значений. 
	//.pipe(take(X)) - хорошее правило для ограничения утечек памяти
}

const audit2$ = interval(102).pipe( // поток для отладки оператора
	take(10), // ограничиваем количество значений
	map(item => item * 102), // делаем значения человеко-понятными, выводим время их имитации в мсек, выбрали 102 вместо 100 чтобы не было случайных гонок асинхронных потоков(перестраховка)
	tap(logAll), // выводим сырые значения перед отправкой в недра исследуемого оператора
	audit(auditProbe$) // исследуемый оператор
)

const audit1$ = interval(101).pipe( // контрольный поток для сравнения, без оператора для исследования
	take(10),
	map(item => item * 101 + '-control'), // добавляем постфикс для облегчения чтения отладки
)

const audit$ = of(audit1$, audit2$).pipe( // одновременно запускаем два потока
	mergeAll(), // собираем значения потоков в один, "конвертируем" потоки в значения
);

//запускаем потоки и выводим всё в консоль. префиксы нужны, чтобы понимать, что значение долетело до конца
audit$.subscribe((item) => 
	logAll('получил: ', item), // пишем всё, что получили по сигналу next().
	err => logAll('ошибка:', err), // пишем что прилетело по сигналу error()
	() => logAll('audit поток закрыт') // пишем когда прилетело complete(). Отдельно указываем какой именно оператор закончил тестирование, чтобы быстрее ловить другие ошибочно не закоментированные операторы
);
 
)
 */

/**
 * Облегчение автоматизации запуска операторов
 */
const operatorList: Observable<any>[] = [];
operatorList.push(
	...filteringOperatorList.map(item => item.observable$),
	...bufferingOperatorList.map(item => item.observable$),
	...erroringOperatorList.map(item => item.observable$),
	...groupingOperatorList.map(item => item.observable$),
	...multicastingOperatorList.map(item => item.observable$),
	...timingOperatorList.map(item => item.observable$),
	...transformingOperatorList.map(item => item.observable$),
);

logAll(`Библиотека операторов RxJs: ${operatorList.length} шт.`);

/**
 * Запуск операторов для проверки
 */
of(
	...operatorList
).pipe(
	mergeAll()
).subscribe(
	(item) => logAll('получил: ', item),
	err => logAll('ошибка:', err),
	() => logAll('поток закрыт')
);

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
	map(item => ['преобразуй это: ', item]), //используется для конвертирования значений счётчиков в милисекунды имитации значений
	tap(item => ['фига с два: ', item]), //не возвращает ничего
	tap(item => logAll('отладь меня: ', item)), //используется для отладки
)

/**
 * Три работающих варианта подписки
 * разведены во времени, чтобы не перемешивать вывод в консоль
 */
//map$.subscribe(item => logAll('самый простой, значение:', item));

/* 
const mapTimeout1 = setTimeout(() => {
	map$.subscribe(
		item => logAll(
			'стрелочные функции, значение:', item),
		err => logAll('стрелочные функции, ошибка:', err),
		() => logAll('стрелочные функции, закрытие:', 'конец')
	);
	clearInterval(mapTimeout1)
}, 1000);
 */

/* 
const mapTimeout2 = setTimeout(() => {
	map$.subscribe({
		next: item => logAll('объект, значение:', item),
		error: err => logAll('объект, ошибка', err),
		complete: () => logAll('объект, закрытие', 'конец')
	})
	clearInterval(mapTimeout2);
}, 2000);
 */

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
 * forkJoin
 */


/**
 * merge
 */

/**
 * concat
 */

/**
 * race
 */

/**
 * zip
 */

/**
 * iif
 */

/**
  * scan
 */

