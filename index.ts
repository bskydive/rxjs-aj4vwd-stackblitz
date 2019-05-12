import { of, interval, timer, throwError, Observable, forkJoin, fromEvent, combineLatest, merge, concat, race, zip, iif } from 'rxjs';
import { map, buffer, take, bufferCount, bufferTime, tap, bufferToggle, bufferWhen, switchMap, toArray, window, windowCount, windowTime, windowToggle, windowWhen, catchError, throwIfEmpty, onErrorResumeNext, retry, scan, takeWhile, retryWhen, timeout, timeoutWith, skip, skipLast, skipUntil, skipWhile, takeLast, takeUntil, distinct, distinctUntilChanged, distinctUntilKeyChanged, filter, sample, audit, throttle, first, last, min, max, elementAt, find, findIndex, single, combineAll, concatAll, exhaust, delay, mergeAll, switchAll, withLatestFrom, groupBy, mergeMap, pairwise, partition, exhaustMap, pluck } from 'rxjs/operators';


const source = of('World').pipe(
  map(x => `Hello ${x}!`)
);
source.subscribe(x => console.log(x));

/**
 * ЧАВО
 * Это библиотека живых примеров
 * Сделано как конспект при изучении различных материалов. 
 * https://www.learnrxjs.io/ 
 * http://reactivex.io/documentation/operators.html 
 * https://rxmarbles.com/ 
 * https://rxjs-dev.firebaseapp.com/api
 * https://app.pluralsight.com/library/courses/rxjs-operators-by-example-playbook
 * Конструктивная помощь приветствуется: https://stepanovv.ru/#id-contacts
 * 
 * Поможет при изучении, как справочник.
 * А также разобраться почему не работает оператор, как живой код.
 * Содержит полный список правильных способов import {}
 * 
 * Необходимые операторы ищутся ctrl+f, в конце добавляем $ к названию оператора
 * Перед каждым примером есть небольшое описание и результат выполнения
 * Если надо поменять поведение оператора необходимо:
 * * обновить страницу stackblitz
 * * раскомментировать subscribe строку необходимого оператора
 * * открыть консоль встроенного браузера stackblitz
 * 
 * TODO сделать юнит-тесты
 * 
 * ЛИКБЕЗ
 * $ - символ в конце для интеллигентного обозначения наблюдателя
 * Observable - объект наблюдения - по сути генерирует поток значений. Есть метод подписки(subscribe) на значения потоков, а также метод последовательной обработки потока(pipe()). Может порождать несколько потоков значений.
 * Observer - наблюдатели - объекты(функции), которые обрабатывают(принимают/генерирут) поток значений. 
 * * next()
 * * error()
 * * complete()
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
 * Возвращает новые поток(буфер) по таймеру, предыдущий закрывает
 */
/*
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


/*
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



/*
 * Дополнительный способ timer вместо interval
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

//выбор времени закрытия буфера
/*

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
 * Можно подменять ошибку при пустом потоке
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

//
/**
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
const sw$ = interval(200).pipe(
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

//sw$.subscribe(  a => console.log('success: ' + a),  err => console.log('error: ' + err),  () => console.log('completed'))

//
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
const takeUntilButtonElement = document.getElementById('id-tight-button');
const takeUntilComplete$ = fromEvent(takeUntilButtonElement, 'click');//прерывание потока по кнопке

//const takeUntilComplete$ = timer(3000);//прерывание потока по таймеру

const takeUntil$ = timer(0, 1000).pipe(
  take(6),
  takeUntil(takeUntilComplete$)
)

//takeUntil$.subscribe(a => console.log(a), err => console.log('error', err), () => console.log('поток закрыт'));

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
  tap(() => console.log(...arguments)),//возвращает три потока наблюдателей
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
//combineLatest$.subscribe(() => console.log(...arguments))

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
  tap(() => console.log(...arguments)),//возвращает три потока наблюдателей
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
  tap(() => console.log(...arguments)),//возвращает три потока наблюдателей
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
  tap(() => console.log(...arguments)),//возвращает три потока наблюдателей
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
 * Преобразует каждый поток функцией аргументом mapTo
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
const mapTo = item$ => item$.pipe(toArray())
const mergeMap$ = of(mergeMap1, mergeMap2, mergeMap3, mergeMap4).pipe(
  tap(() => console.log(...arguments)),//возвращает три потока наблюдателей
  mergeMap(mapTo)
)

//mergeMap$.subscribe((item) => console.log('получил: ',item), null, ()=> console.log('поток закрыт'));

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

//========================================================================================================================
//==================================================TRANSFORM VALUES======================================================
//========================================================================================================================
//

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
//exhaustMap$.subscribe(item => console.log(item), null, ()=> console.log('поток закрыт'));

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

//pluck$.subscribe(item => console.log(item), null, ()=> console.log('поток закрыт'));

/**
 * switchMap 
 * после каждого нового значения входящего потока interval(302)
 * выполняет функцию аргумент switchMapFork$, который возвращает новый поток
 * предыдущий поток из switchMapFork$ закрывается, потому рекомендуется только для чтения значений
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

//switchMap$.subscribe(item => console.log(item), null, ()=> console.log('поток закрыт'));
