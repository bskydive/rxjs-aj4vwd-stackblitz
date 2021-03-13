# Бибиотека операторов RxJs

 * [Развёрнутая статья](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9)
	* [Полезные ссылки](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9#876f)
	* [Список того, к чему вы сами можете приложить руку(TODO)](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9#e1af)
	* [Автоматическая проверка кода](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9#0558)
	* [Как использовать](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9#5eb6)
	* [Что хорошо](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9#5eb6)
	* [Группировка операторов](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9#6f8a)
	* [Что плохо](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9#b817)
	* [Типовой пример](https://medium.com/@stepanovv.ru/100-rxjs-operators-fab1338ef3b9#ecfd)
 * [облачный сервис с развёрнутым кодом](https://stackblitz.com/edit/rxjs-aj4vwd?file=index.ts)

Это в большей степени конструктор, чем учебное пособие. Прочитав код, вы вряд ли его запомните. Лучше добавить или поменять в этом коде что-то на свой лад. 

Вот список того, что ещё предстоит реализовать, и к чему вы сами можете приложить руку:
* TODO заполнить для всех примеров: запуск, результат, тэги, описание, аналоги, кэширует/теряет, стартует/конвеер, сохраняет порядок/сортирует
* TODO сделать конфигуратор операторов: тип входных значений, выходных, преобразования, аналоги
* TODO заменить жаргонизмы на точное обозначение "подписывается, имитирует, ..."(рытьё исходников)
* TODO добавить ссылки на https://www.learnrxjs.io/ и https://rxmarbles.com/ в описания всех операторов
* TODO привести примеры `multicasting` к массовому варианту запуска в `index.ts`
* TODO заполнить примерами новый файл `testing.ts` https://medium.com/@kevinkreuzer/marble-testing-with-rxjs-testing-utils-3ae36ac3346a
* TODO написать тесты для для всех примеров
* TODO добавить в описания операторов их более простые аналоги/комбинации
* TODO сделать вывод времени получения значений, чтобы подчеркнуть ждунирование `.subscribe((item) => logAll('получил: ', timeNow(), item),`
* TODO проверить, что все .push и .subscribe строки содержат корректные имена переменных, можно пихнуть/подписаться на соседний оператор

## Как использовать

* примеры разбиты на файлы, чтобы не сводить с ума линтеры, и собраны в index.ts через экспорт массивов для реализации в будущем автотестов.
* запуск всех примеров выключен(закомментирован). Чтобы их запустить - надо раскомментировать подписку `subscribe`
* для генерации входного потока данных вручную сделана кнопка `<button id="id-tight-button">` в `index.html`
* можно [открыть в IDE](https://github.com/bskydive/rxjs-aj4vwd-stackblitz), а можно через chrome в облаке [stackblitz](https://stackblitz.com/edit/rxjs-aj4vwd)
* Необходимые операторы ищутся ctrl+f, в конце добавляем $ к названию оператора. Например `switchMap$`. Также операторы видны в "структуре кода" - специальном окне IDE. 
* Перед каждым примером есть небольшое описание и результат выполнения
* В облаке stackblitz:
	 * обновить страницу(stackblitz)
	 * раскомментировать `*$.subscribe(*` строку необходимого оператора
	 * открыть консоль встроенного браузера(stackblitz)
 * Локально в IDE:
	```bash
		git clone https://github.com/bskydive/rxjs-aj4vwd-stackblitz.git
		cd rxjs-aj4vwd-stackblitz
		npm i
		npm run b
	```
* Список плагинов VSCode, которые относятся к теме:
	* [tslint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) 
	* [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 
	* [учёт времени с привязкой к git wakatime](https://marketplace.visualstudio.com/items?itemName=WakaTime.vscode-wakatime)
	* [открытый аналог локально](https://marketplace.visualstudio.com/items?itemName=hangxingliu.vscode-coding-tracker)
	* [открытый аналог локально для подсчёта эффективности без привязки к веткам и комитам](https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-vscode)
 * чтобы заглушить ненужный входной поток достаточно дописать в начеле `*.pipe(*` оператор `take(0)`

## Список основных ресурсов, на основе которых написана библиотека

* [Платный курс](https://app.pluralsight.com/library/courses/rxjs-operators-by-example-playbook), который можно посмотреть за время бесплатного доступа. Главное вспомнить отвязать банковскую карту до его окончания. Из этого курса я взял список операторов и их группировку.
* [Примеры операторов RxJs](https://www.learnrxjs.io/). Не все рабочие.
* [Графические примеры операторов RxJs](https://rxmarbles.com/ )
* [ReactiveX документация](http://reactivex.io/documentation/operators.html)
* [RxJs документация](https://rxjs-dev.firebaseapp.com/api)

## Автоматическая проверка кода

По ходу дела я прикрутил в проект два линтера и несколько наборов правил:
* сорян, но табы. Они позволяют настраивать каждому своё отображение, не меняя код в репе.
* именование файлов в шашлычном стиле
* именование интерфейсов с префиксом `I`
* многие правила `es/ts lint` дублируются, часть отключено в одном из двух, но большинство оставлено, т.к. непонятно как конкретно работают правила, и непонятно что лучше.
* правила форматирования переведены в `severity: warn`.
* нельзя оставлять в коде `console.log()`
* [Финская нотация](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b). Да, она через линтер помогает, например, не проглядеть тип значений внутри операторов `map(item=>item... | map(item$=>item$...` , т.к. вместо объекта может прилететь `Observable`, и это не всегда отлавливается tslint.
* перелопатил [все правила eslint](https://eslint.org/docs/rules/), и добавил что добавилось. Искал правило для [сложного](https://github.com/bskydive/angular-docdja) [случая](https://stackblitz.com/edit/angular-docdja), который периодически трепал мне нервы. Не нашёл :(.
* [rxjs-tslint-rules](https://github.com/cartant/rxjs-tslint-rules#rules)
* [codelyzer for Angular](https://github.com/mgechev/codelyzer)
* [angular-tslint-rules: a configuration preset for both TSLint & codelyzer](https://medium.com/burak-tasci/angular-tslint-rules-a-configuration-preset-for-both-tslint-codelyzer-8b5fa1455908)
* [RxJS: Avoiding takeUntil Leaks](https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef)
* [Best practices for a clean and performant Angular application](https://medium.com/free-code-camp/best-practices-for-a-clean-and-performant-angular-application-288e7b39eb6f)

## Виды операторов по типу операций со значеними

 * `buffering.ts` — Операторы буферизации buffer*, window*
 * `erroring.ts` — Операторы обработки ошибок
 * `filtering.ts` — Операторы фильтрации
 * `grouping.ts` — Операторы группировки потоков и значений
 * `multicasting.ts` — Операторы асинхронного запуска потоков(распыления)
 * `testing.ts` — Операторы тестирования. Не реализовано.
 * `timing.ts` — Операторы времени, продолжительности и значений
 * `tooling.ts` — Операторы вспоможения в трудах
 * `transforming.ts` — Операторы трансформации потоков и значений
 * `utils.ts` — Интерфейсы и служебные функции

## Типовой пример

```ts
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

```
