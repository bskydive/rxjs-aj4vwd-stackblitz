import { IRunListItem, logAll } from './utils';
import { throwError, of, interval } from 'rxjs';
import { catchError, throwIfEmpty, take, map, retry, retryWhen, scan, takeWhile, mergeAll, timeout, timeoutWith, onErrorResumeNext } from 'rxjs/operators';

/**
 * Операторы обработки ошибок
 * 
 * для массового выполнения тестов, комментировать не надо, запуск управляется из index.ts
 * filteringOperatorList.push({ observable$: xxx$ });
 * 
 * раскомментировать для ручного запуска
 * xxx$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('skip поток закрыт'));
 */
export const erroringOperatorList: IRunListItem[] = [];

//========================================================================================================================
//==================================================ERRORS================================================================
//========================================================================================================================


/**
 * catchError
 * Перехват потока при ошибке
 * Практическое применение: самописные обработчики ошибок, сервисы хранения ошибок типа ravenjs
 * 
Hello World!
словил: ошибка ошибковна источик: Observable { }
положь где взял: вернул взад ошибка ошибковна источик: Observable { }
получил:  янеошибка
error поток закрыт
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

//error$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('error поток закрыт'));
erroringOperatorList.push({ observable$: error$ });

//
/**
 * errorHandler
 * ошибка  при пустом потоке
 * Можно подменять ошибку
 * 
 * Hello World!
ошибка: { [EmptyError: no elements in sequence] message: 'no elements in sequence', name: 'EmptyError' }
 */
const errorHandler = () => logAll('ничоси');
const errorEmpty$ = of().pipe(
	throwIfEmpty()//без подмены
	//throwIfEmpty(errorHandler)//подмена ошибки
)

//errorEmpty$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('errorEmpty поток закрыт'));
erroringOperatorList.push({ observable$: errorEmpty$ });

//
/**
 * errorResumeNext
 * Новый поток при ошибке

Hello World!
получил:  0
получил:  101
получил:  202
получил:  303
получил:  0-next
получил:  202-next
получил:  404-next
errorSwitch поток закрыт
 */
const errorNext$ = interval(202).pipe(
	take(3),
	map(item => item * 202 + '-next')
);//резервный поток после ошибок

const errorSwitch$ = interval(101).pipe(
	take(5),
	map(item => item * 101),
	map(item => {
		if (item > 303) {
			throw new Error('ничоси');
		} else {
			return item;
		}
	}),
	onErrorResumeNext(errorNext$)
)

//errorSwitch$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('errorSwitch поток закрыт'));
erroringOperatorList.push({ observable$: errorSwitch$ });

/**
 * retry
 * 
 * Повторяет поток значений указанное количество раз при ошибке

Hello World!
получил:  0
получил:  101
получил:  202
получил:  303
получил:  0
получил:  101
получил:  202
получил:  303
получил:  0
получил:  101
получил:  202
получил:  303
получил:  0
получил:  101
получил:  202
получил:  303
получил:  404
получил:  505
получил:  606
получил:  707
получил:  808
получил:  909
errorRetry поток закрыт
 */

let errorRetryCountSuccess = 0;

const retry$ = interval(101).pipe(
	take(10),
	map(item => item * 101),
	map(item => {
		if (item > 303 && errorRetryCountSuccess <= 2) {
			errorRetryCountSuccess += 1; // эмулируем отсутствие ошибок после третьей попытки
			throw new Error('никогда не было, и вот опять');
		} else {
			return item;
		}
	}),
	retry(3)
)

//retry$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('retry поток закрыт'));
erroringOperatorList.push({ observable$: retry$ });

/**
 * retryWhen
 * повторяет поток пока не будет получен complete/error внутри аргумента наблюдателя retryCondition$

Hello World!
получил:  0
получил:  101
получил:  202
словили: Error: ничоси
получил:  0
получил:  101
получил:  202
словили: Error: ничоси
получил:  0
получил:  101
получил:  202
словили: Error: ничоси
retryWhen поток закрыт
 */

const retryWhen$ = interval(101).pipe(
	take(10),
	map(item => item * 101),
	map(item => {
		if (item === 303) {
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

//retryWhen$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('retryWhen поток закрыт'));
erroringOperatorList.push({ observable$: retryWhen$ });

/**
 * retryWhen более сложный пример
 * 
Hello World!
получил:  0
получил:  101
ошибка-данные: 2
повтор: 1
получил:  0
получил:  101
ошибка-данные: 2
остановка
retryWhen2 поток закрыт
*/

const retryWhen2$ = interval(101).pipe(
	take(10),
	map(x => {
		if (x === 2) {
			logAll('ошибка-данные: ' + x);
			throw new Error('errorN: ' + x);
		}
		return x;
	}),
	retryWhen(errors$ => {
		return errors$.pipe(
			// tap(err => logAll(err)),
			scan(acc => acc + 1, 0),
			map(retryCount => {
				if (retryCount === 2) {
					logAll('остановка')
				} else {
					logAll('повтор: ' + retryCount);
				}
				return retryCount;
			}),
			takeWhile(errCount => errCount < 2)
		)
	}),
	map(item => item * 101),
)

//retryWhen2$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('retryWhen2 поток закрыт'));
erroringOperatorList.push({ observable$: retryWhen2$ });

/**
 * timeout
 * прерывает поток ошибкой, если нет значения за время интервала
 * также можно указать дату вместо интервала, но можно наступить на локализацию
 * !!! работает асинхронно, учитывает задержку выполнения предыдущих операторов: для 101 мс надо 105 мс минимум таймаута

Hello World!
получил:  0-1
получил:  0-2
получил:  101-1
получил:  202-1
получил:  202-2
Таймер сработал
получил:  { [TimeoutError: Timeout has occurred] message: 'Timeout has occurred', name: 'TimeoutError' }
timeOut поток закрыт
 */

const timeOutSrc1$ = interval(101).pipe(take(3), map(item => item * 101 + '-1'));
const timeOutSrc2$ = interval(202).pipe(take(10), map(item => item * 202 + '-2'));

const timeOut$ = of(timeOutSrc1$, timeOutSrc2$).pipe(
	mergeAll(),
	timeout(111),
	catchError((err, caught$) => {
		if (err.name === 'TimeoutError') {
			// обрабатываем событие таймера
			logAll('Таймер сработал')
		};
		return of(err)
	})
)

//timeOut$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('timeOut поток закрыт'));
erroringOperatorList.push({ observable$: timeOut$ });

/**
 * timeoutWith
 * стартует новый поток, если нет значения за время интервала
 * также можно указать дату вместо интервала, но можно наступить на локализацию
Hello World!
получил:  0-1
получил:  0-2
получил:  101-1
получил:  202-1
получил:  202-2
получил:  0-3
получил:  101-3
получил:  202-3
timeOutWith поток закрыт
 */
const timeOutWithSrc1$ = interval(101).pipe(take(3), map(item => item * 101 + '-1'));
const timeOutWithSrc2$ = interval(202).pipe(take(10), map(item => item * 202 + '-2'));
const timeOutWithFallback$ = interval(103).pipe(take(3), map(item => item * 101 + '-3'));

const timeOutWith$ = of(timeOutWithSrc1$, timeOutWithSrc2$).pipe(
	mergeAll(),
	timeoutWith(111, timeOutWithFallback$),
	catchError((err, caught$) => {
		if (err.name === 'timeOutWithError') {
			// обрабатываем событие таймера
			logAll('Таймер сработал')
		};
		return of(err)
	})
)

//timeOutWith$.subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('timeOutWith поток закрыт'));
erroringOperatorList.push({ observable$: timeOutWith$ });

