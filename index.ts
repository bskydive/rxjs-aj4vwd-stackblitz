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
import { toolingOperatorList } from './src/tooling';

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
operatorList.push(...filteringOperatorList.map(item => item.observable$));
operatorList.push(...bufferingOperatorList.map(item => item.observable$));
operatorList.push(...erroringOperatorList.map(item => item.observable$));
operatorList.push(...groupingOperatorList.map(item => item.observable$));
operatorList.push(...multicastingOperatorList.map(item => item.observable$));
operatorList.push(...timingOperatorList.map(item => item.observable$));
operatorList.push(...transformingOperatorList.map(item => item.observable$));
operatorList.push(...toolingOperatorList.map(item => item.observable$));


// небольшая проверка, что все модули собраны
logAll(`Библиотека операторов RxJs. Итого примеров: ${operatorList.length} шт.`);

/**
 * Запуск операторов для автоматической проверки
 */
// of(...operatorList).pipe(mergeAll()).subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('поток закрыт'));

