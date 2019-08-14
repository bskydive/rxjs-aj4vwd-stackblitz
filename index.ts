
import { logAll } from './src/utils';
import { filteringOperatorList } from './src/filtering';
import { bufferingOperatorList } from './src/buffering';
import { erroringOperatorList } from './src/erroring';
import { groupingOperatorList } from './src/grouping';
import { multicastingOperatorList } from './src/multicasting';
import { timingOperatorList } from './src/timing';
import { transformingOperatorList } from './src/transforming';
import { toolingOperatorList } from './src/tooling';
import { Observable } from 'rxjs';
import { testingOperatorList } from './src/testing';

/**
 * ===============================================
 * ========== Библиотека живых примеров ==========
 * ===============================================
 * 
 * Ликбез

 * Observable - объект наблюдения - по сути генерирует поток значений. Есть метод подписки(subscribe) на значения потоков, а также метод последовательной обработки потока(pipe()). Может порождать несколько потоков значений.
 * Observer - наблюдатели - объекты(функции), которые обрабатывают(принимают/генерируют) поток значений. 
	next()
	error()
	complete()
 * Subscriber - вид наблюдателя. Объект(функция), которая обрабатывает конечные результаты потока. Передаётся внутрь метода Observable.subscribe(subscriber)
 * pipe(аргументы) - организует последовательную передачу значений потока между аргументами-наблюдателями. Сделано для избегания конфликтов с методами объектов, также помогает делать `tree-shaking`.
 * subscribe(item => logAll('значение потока', item), err => logAll('ошибка', err), () => logAll('поток закрыт штатно')); - запускает поток, принимает три аргумента для значений(next), ошибок(error), завершения потока(complete)
 
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
operatorList.push(...testingOperatorList.map(item => item.observable$));


// небольшая проверка, что все модули собраны
logAll(`Библиотека операторов RxJs. Итого примеров: ${operatorList.length} шт.`);

/**
 * Запуск операторов для автоматической проверки
 */
// of(...operatorList).pipe(mergeAll()).subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('поток закрыт'));

