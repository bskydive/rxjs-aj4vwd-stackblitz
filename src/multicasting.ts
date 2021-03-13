import { IRunListItem, logAll } from './utils';
import { interval, Subject, Observable, of, ConnectableObservable, from } from 'rxjs';
import { take, map, endWith, multicast, delay, share, shareReplay, publish, publishBehavior, mergeAll, publishLast, publishReplay } from 'rxjs/operators';


/**
 * Операторы асинхронного запуска потоков
 * Примеры пока не приведены к запуску по .subscribe, и требуют раскомментирования по несколько строк для ручной проверки
 * соответственно, нельзя рефакторить к единому виду `$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll(`
 * 
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 * 
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
export const multicastingOperatorList: IRunListItem[] = [];


//========================================================================================================================
//==================================================MULTICAST=============================================================
//========================================================================================================================
//

/**
 * multicast
 * 
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
multicastingOperatorList.push({ observable$: of('multicast не может быть запущен одним subscribe !') });

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

multicastingOperatorList.push({ observable$: of('share не может быть запущен одним subscribe !') });

/**
 * shareReply
 * подписывается на входящий поток share1, когда подписываются на него share$
 * отписывается, если все отписались от него share$
 * делает поток горячим - новые подписчики получают значения только с момента своей подписки, включая буфер из указанного количества значений shareReplayBufferSize
 * используется для websocket, кэширования
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

multicastingOperatorList.push({ observable$: of('shareReply не может быть запущен одним subscribe !') });

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
multicastingOperatorList.push({ observable$: of('publish не может быть запущен одним subscribe !') });


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

multicastingOperatorList.push({ observable$: of('publishBehavior не может быть запущен одним subscribe !') });

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
multicastingOperatorList.push({ observable$: of('publishLast не может быть запущен одним subscribe !') });

/**
 * publishReplay
 * TODO переписать на rxjs interval
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
multicastingOperatorList.push({ observable$: of('publishReplay не может быть запущен одним subscribe !') });
