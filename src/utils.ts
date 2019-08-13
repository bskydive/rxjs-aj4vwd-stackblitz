import { Observable } from 'rxjs';


/**
 * Чтобы обойти ошибку TS2496: The 'arguments' object cannot be referenced in an arrow function in ES3 and ES5. Consider using a standard function expression.
 * https://github.com/microsoft/TypeScript/issues/1609
 * Чтобы не светились ошибки использования console.log
 * Здесь такое логирование применимо, на проде - нет
 */
export function logAll(...values) {
	console.log(...values); // ...arguments
}

export type TTypeItem = 'observable' | 'observable' | 'primitive' | 'function' | 'object';
export type TOperationItem = 'filter' | 'sort' | 'parse' | 'reply' | 'exhaust' | 'merge' | 'last' | 'debounce' | 'time' | 'accumulate' | 'recursion' | 'switch' | 'array/concat' | 'flattening' | 'missing' | 'unsubscribing';

/**
 * Интерфейс для построения модулей, поиска и тестирования операторов
 */
export interface IRunListItem {
	observable$: Observable<any>;
	inputTypeList?: TTypeItem[];
	outputTypeList?: TTypeItem[];
	operationTypeList?: TOperationItem[];
	result?: any;
}
