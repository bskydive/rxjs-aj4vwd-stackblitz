# Трудно быть стартапом. Часть 2 - учёба.

## Лирика

 * [Оружейник Гаук демонстрирует работу книгопечатной машины. Кадр из фильма “Трудно быть богом”](./гаук.jpg)

Итак, настало время второй статьи цикла "Трудно быть стартапом". [Предыдущая часть](https://medium.com/@stepanovv.ru/trudno-byt-startapom-gvozdi-2a95cf74ff31) завершена призывом бесплатно делиться знаниями. Сам предложил - сам сделал. Позади примерно 40 часов труда, впереди - неувядаемая слава и почёт труженника. Поехали!

Для торопливых сразу ссылка на [код библиотеки операторов](https://github.com/bskydive/rxjs-aj4vwd-stackblitz), а для самых торопливых - ссылка на [облачный сервис с развёрнутым кодом](https://stackblitz.com/edit/rxjs-aj4vwd?file=index.ts).

Для тех, кто ещё остался, кратенько попытаюсь обосновать зачем я потратил своё время. Итак, вначале был гугл. Можно долго и увлекательно бултыхаться в пёстрых статьях, но чем дальше заплываешь, тем больше тонешь.

Чёткое и выверенное изложение материала, как правило, доступно за деньги. А кроме того, обёрнуто увесистой программой обучения для увеличения стоимости. И при этом никто не даёт гарантий того, что это поможет решить ваши задачи. Ну то есть обещают, но на самом деле - нет. Ведь никто не знает какие конкретно задачи вам предстоит решить ;).

Вот мы и пришли к задаче. Она простая - надо приспособить код фронта к генератору случайных контрактов апи. Т.е. крепко изучить комбинацию потоков наблюдаемых значений - Observables. По пути, конечно, эти значения надо обложить обработчиками ошибок, интерфейсами, тестами, заглушками, авторизацией, нарезкой для листалки, и, конечно же, классной крутилкой "ваше мнение очень важно для нас". И это не считая линтеров, соглашений по коду, архитектуры модулей и сервисов. Забегая вперёд, хочу отметить - мой стек Angular/TypeScript, потому техническая часть будет именно оттуда.

В основе этого "простейшего" действия - получить данные с сервера лежат операторы RxJS. Их задача облегчить разработку и сопровождение нашего кода, но у них есть и "тёмная" сторона. Операторов много, очень-очень много. И вариантов их использования, и параметров, и особенностей исполнения тоже очень много.

При попытке решить практическую задачу находишь пример. Он, конечно же, написан с использованием техник и операторов, которые не знакомы, а зачастую с ошибками. Ну или код примера банально устарел, и в текущей версии RxJS не работает. Да, более старые, "накликанные" и "нацитированные" годами ссылки будут всегда верхними в выдаче. И тогда начинается сборка коллекции кодовелосипедов в "свободное" время. 

После укрепляющих лоб прыжков по граблям, у меня устоялся подход написания базы знаний и библиотек кода. Т.е. подготовки примеров кода ДО того момента, когда они понадобятся, а главное - сохранения полезного кода, на который я безвозвратно потратил своё время. Вот это и есть та самая библиотека, мой увесистый гранитный "кирпич" знаний. 

Исходя из практического опыта родился лейтмотив библиотеки примеров: они должны быть максимально похожи друг на друга, чтобы их можно было быстро понимать и комбинировать. В практических задачах именно комбинация операторов отнимает больше всего времени. Их подбор и отладка - вот это вот то, ради чего написано 100+ примеров.

Список основных ресурсов, на основе которых написана библиотека:
	* [Платный курс](https://app.pluralsight.com/library/courses/rxjs-operators-by-example-playbook), который можно посмотреть за время бесплатного доступа. Главное вспомнить отвязать банковскую карту до его окончания. Из этого курса я взял список операторов и их группировку.
	* [Примеры операторов RxJs](https://www.learnrxjs.io/). Не все рабочие.
	* [Графические примеры операторов RxJs](https://rxmarbles.com/ )
	* [ReactiveX документация](http://reactivex.io/documentation/operators.html)
	* [RxJs документация](https://rxjs-dev.firebaseapp.com/api)

 Это в большей степени конструктор, чем учебное пособие. Прочитав код, вы вряд ли его запомните. Лучше добавить или поменять в этом коде что-то на свой лад. 

 Вот список того, что ещё предстоит реализовать, и к чему вы сами можете приложить руку:
	* TODO заполнить для всех примеров к объект: запуск, результат, тэги, описание, аналоги
	* TODO сделать конфигуратор операторов: тип входных значений, выходных, преобразования, аналоги
	* TODO заменить жаргонизмы на точное обозначение "подписывается, имитирует, ..."(рытьё исходников)
	* TODO добавить ссылки на https://www.learnrxjs.io/ и https://rxmarbles.com/ в описания всех операторов
	* TODO привести примеры multicasting к массовому варианту запуска в index.ts
	* TODO заполнить примерами новый файл testing.ts https://medium.com/@kevinkreuzer/marble-testing-with-rxjs-testing-utils-3ae36ac3346a
	* TODO написать тесты для для всех примеров
	* TODO добавить в описания операторов их более простые аналоги/комбинации

## Автоматическая проверка кода

По ходу дела я прикрутил в проект два линтера и несколько наборов правил:
	* сорян, но табы. Они позволяют настраивать каждому своё отображение, не меняя код в репе.
	* именование файлов в шашлычном стиле
	* именование интерфейсов с префиксом `I`
	* многие правила es/ts lint дублируются, часть отключено в одном из двух, но большинство оставлено, т.к. непонятно как конкретно работают правила, и непонятно что лучше.
	* правила форматирования переведены в `severity: warn`.
	* нельзя оставлять в коде console.log()
	* [Финская нотация](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b). Да, она через линтер помогает, например, не проглядеть тип значений внутри операторов `map(item=>item... | map(item$=>item$...` , т.к. вместо объекта может прилететь `Observable`, и это не всегда отлавливается tslint.
	* перелопатил [все правила eslint](https://eslint.org/docs/rules/), и добавил что добавилось. Искал правило для [сложного](https://github.com/bskydive/angular-docdja) [случая](https://stackblitz.com/edit/angular-docdja), который периодически трепал мне нервы. Не нашёл :(.
	* [rxjs-tslint-rules](https://github.com/cartant/rxjs-tslint-rules#rules)
	* [codelyzer for Angular](https://github.com/mgechev/codelyzer)
	* [angular-tslint-rules: a configuration preset for both TSLint & codelyzer](https://medium.com/burak-tasci/angular-tslint-rules-a-configuration-preset-for-both-tslint-codelyzer-8b5fa1455908)
	* [https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef](https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef)
	* [https://medium.com/free-code-camp/best-practices-for-a-clean-and-performant-angular-application-288e7b39eb6f](https://medium.com/free-code-camp/best-practices-for-a-clean-and-performant-angular-application-288e7b39eb6f)

## Как использовать

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

## Вкусняшки

 * Содержит полный список правильных способов import {}. Вроде бы мелочь, но автоимпорт не всегда работает корректно.
 * входные значения всегда потоки с интервалами, изредка - простые значения. Это имитирует боевые условия. Во многих примерах даются of(1,2,3), которые работают совсем иначе, чем interval(). Например, в примерах со switchMap - простые значения не дают понять, что предыдущий поток может быть закрыт. `src/transforming.ts:881(switchMap3$)`
 * Выводится ожидаемое время имитации значения в потоке `interval(101).pipe(map(item=>item*101))`.
 * Интервалы имитации разведены на милисекунду: 101, 102, 202, 203. Всегда понятно когда и в каком порядке должно быть имитировано значение.
 * К значениям из одного потока добавляются унифицированные постфиксы '-1' | '-2' | '-dynamic', чтобы легче было читать вывод в консоли.
 * В примерах оставлены закоментированные операторы логирования для отладки tap(logAll)
 * Строка `mergeMapSrc2$.subscribe((item) => logAll('получил: ', item), null, () => logAll('mergeMap2 поток закрыт'));` унифицирована для облегчения рефакторинга
  * операторы endWith('...') помогают понять когда происходит завершение(отписка) потока
 * выполняется как в консоли, так и в онлайн редакторе. Некоторые примеры работают только в браузере, когда необходимо его API, например, `src/timing.ts:144(observeOn$)` или `src/filtering.ts:225(takeUntil$)`
 * большое, очень большое количество операторов. 101 оператор разобран в 108 примерах
 * все примеры рабочие и готовы к копипасту
 * примеры многопоточные
 * Виды операторов по типу операций со значеними: 
	* buffering.ts - Операторы буферизации buffer*, window*
	* erroring.ts - Операторы обработки ошибок
	* grouping.ts - Операторы группировки потоков и значений
	* multicasting.ts - Операторы асинхронного запуска потоков(распыления)
	* timing.ts - Операторы времени, продолжительности и значений
	* tooling.ts - Операторы вспоможения в трудах
	* utils.ts - Интерфейсы и служебные функции

## Какашки

 * Не весь код универсально-одинаковый. Самый неодинаковый в примерах распыления `multicasting.ts`. Также в некоторых местах необходимо делать `JSON.stringify` в типовых `*$.subscribe(*`
 * Объём работы конский, потому, извиняйте, не всё сделано идеально. Было несколько подходов к рефакторингу, после которых я не выверял заново все примеры. Да, они рабочие, но вывод может отличаться от написанного в [JSDoc](https://github.com/jsdoc/jsdoc)
 * Описания операторов в тексте могут быть не вполне корректны. Главное здесь - рабочий код, а не его описание. Чтобы выверить описание необходимо в разы больше примеров, и перелопачивание исходников.

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
	
	)
```

## Послесловие

 Это был не только конструктор, но и пример создания таких конструкторов. Полезных себе и другим. Кроме того, здесь есть что ещё поделать, это хорошая основа для крутых учебников, конфигураторов или библиотек с примерами.
 Впереди более сложный вид конструктора - приложение с библиотекой компонентов и хранилищем ngrx. Для затравки - [годная статья](https://itnext.io/choosing-a-highly-scalable-folder-structure-in-angular-d987de65ec7). 
