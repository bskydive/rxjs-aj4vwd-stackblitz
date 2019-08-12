"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var utils_1 = require("./src/utils");
var filtering_1 = require("./src/filtering");
var buffering_1 = require("./src/buffering");
var erroring_1 = require("./src/erroring");
var grouping_1 = require("./src/grouping");
var multicasting_1 = require("./src/multicasting");
var timing_1 = require("./src/timing");
var transforming_1 = require("./src/transforming");
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
var operatorList = [];
operatorList.push.apply(operatorList, __spread(filtering_1.filteringOperatorList.map(function (item) { return item.observable$; })));
operatorList.push.apply(operatorList, __spread(buffering_1.bufferingOperatorList.map(function (item) { return item.observable$; })));
operatorList.push.apply(operatorList, __spread(erroring_1.erroringOperatorList.map(function (item) { return item.observable$; })));
operatorList.push.apply(operatorList, __spread(grouping_1.groupingOperatorList.map(function (item) { return item.observable$; })));
operatorList.push.apply(operatorList, __spread(multicasting_1.multicastingOperatorList.map(function (item) { return item.observable$; })));
operatorList.push.apply(operatorList, __spread(timing_1.timingOperatorList.map(function (item) { return item.observable$; })));
operatorList.push.apply(operatorList, __spread(transforming_1.transformingOperatorList.map(function (item) { return item.observable$; })));
// небольшая проверка, что все модули собраны
utils_1.logAll("\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u043E\u0432 RxJs. \u0418\u0442\u043E\u0433\u043E \u043F\u0440\u0438\u043C\u0435\u0440\u043E\u0432: " + operatorList.length + " \u0448\u0442.");
/**
 * Запуск операторов для автоматической проверки
 */
// of(...operatorList).pipe(mergeAll()).subscribe((item) => logAll('получил: ', item), err => logAll('ошибка:', err), () => logAll('поток закрыт'));
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
var count1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.endWith('1-закрыто'));
var count$ = count1$.pipe(
// tap(logAll),
operators_1.count());
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
var isEveryLess400 = function (item) {
    utils_1.logAll('isLess400', item);
    return item < 400;
};
var every1$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101; }), operators_1.tap(utils_1.logAll), operators_1.every(isEveryLess400), operators_1.endWith('1-закрыто'));
var every2$ = rxjs_1.interval(202).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 202; }), operators_1.tap(utils_1.logAll), operators_1.every(isEveryLess400), operators_1.endWith('2-закрыто'));
var every$ = rxjs_1.of(every1$, every2$).pipe(
// tap(logAll),
operators_1.mergeAll());
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
var isEmpty1$ = rxjs_1.interval(101).pipe(operators_1.take(0), operators_1.map(function (item) { return item * 101; }), operators_1.tap(utils_1.logAll), operators_1.isEmpty(), operators_1.endWith('1-закрыто'));
var isEmpty2$ = rxjs_1.interval(202).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 202; }), operators_1.tap(utils_1.logAll), operators_1.isEmpty(), operators_1.endWith('2-закрыто'));
var isEmpty$ = rxjs_1.of(isEmpty1$, isEmpty2$).pipe(
// tap(logAll),
operators_1.mergeAll());
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
var sequenceEqual1Control$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(utils_1.logAll));
var sequenceEqual1$ = rxjs_1.interval(202).pipe(// !время разное
operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-1'; }), operators_1.tap(utils_1.logAll), operators_1.sequenceEqual(sequenceEqual1Control$), operators_1.endWith('1-закрыто'));
var sequenceEqual2Control$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-2'; }), operators_1.tap(utils_1.logAll));
var sequenceEqual2$ = rxjs_1.interval(101).pipe(operators_1.take(3), operators_1.map(function (item) { return item * 101 + '-2другой'; }), operators_1.tap(utils_1.logAll), operators_1.sequenceEqual(sequenceEqual2Control$), operators_1.endWith('2-закрыто'));
var sequenceEqual$ = rxjs_1.of(sequenceEqual1$, sequenceEqual2$).pipe(
// tap(logAll),
operators_1.mergeAll());
// sequenceEqual$.subscribe((item) => logAll('получил: ', item), null, () => logAll('sequenceEqual поток закрыт'));
//====
/**
 * iif
 */
/**
  * scan
 */
