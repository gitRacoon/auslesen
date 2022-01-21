# Кастомный dropdown select
С помощью этой библиотеки можно создать или заменить стандартный HTML select на семантичный кастомный аналог. С гибкой настройкой и открытым исходным кодом.

## Базовое использование
Для инициализации необходимо создать экземпляр класса.
```javascript
const auslesen = new Auslesen(element [, params]);
```
> Поиграть с кодом можно здесь: [stackblitz](https://stackblitz.com/edit/typescript-zr3x3c?devtoolsheight=33&file=index.ts).

## Передаваемые параметры:

### element
Обязательный параметр, тип **HTMLElemnt**.
Для создания **auslesen** на основе существующего `select` элемента необходимо передать **HTMLSelectElement**.

### params
Необязательный параметр, кастомный тип **Params**.

## Кастомные типы

### Params
```javascript
placeholder?: string;
replacePropElement?: boolean;
useSearch?: boolean;
```

### Option
```javascript
value: string;
textContent: string;
className?: string;
disabled?: string;
ariaSelected?: boolean;
```

## Настаиваемые параметры

### placeholder
Элемент `Select` будет использовать переданную текст-заглушку, если не один из `Option` не был выбран.

### replacePropElement
Если `true` (по умолчанию - `false`) добавит `Select` вместо переданного элемента, иначе - после переданного элемента.

### useSearch
Элемент `Select` будет иметь `Input` с базовым фильтром (не чувствителен к регистру).

## Использование стандартного select элемента для создания auslesen
Для инициализации необходимо передать **HTMLSelectElement**.
В качестве опций будут использованы `option` элементы.
Чтобы `option` не попал в список кастомных `Option` необходимо добавить атрибут disabled.
Для определения `className`, `value` и `textContent` будут использованы атрибуты `class`, `name` и внутринний текст.

## Геттеры

### currentOptionsList
Список всех текущих кастомных опций `Option` типа **HTMLSpanElement**.

### currentSelectedOption
Текущее выбранное значение типа **HTMLLIElement**.
Если не один из `Option` не выбран, то значение - `null`.

## Методы

### clear
> (): **void**

Полностью очистит список `Option`.

### useOptions
> (optionsList: (**Option** | **HTMLOptionElement**)[]): **void**

Создаёт и отображает список `Option` на основе переданного списока.

### updateSelectedState
> (option: **HTMLLIElement**): **void**

Устанавливает переданный элемент как `selected`.

## Слушатели событий
### onSelect
> (target: **HTMLLIElement**) => **void**

Событие "click" по элементу списка. CallBack получает в аргументе элемент, но который было нажатие.

### onInput
> (target: **HTMLInputElement**) => **void**

Событие "Input" на поле ввода (только при `useSearch: true`). CallBack получает в аргументе `input` элемент.

## Структура HTML
```html
<div data-role="full-wrap">
  <div data-role="select-wrap">
    <input type="search" data-role="search" name="aus-search" /> <!-- For useSearch param -->
    <span data-role="content"  value="value">textContent</span>
  </div>
  <div data-role="options-wrap">
    <ul data-role="options">
      <li data-role="option" value="value">textContent</li>
      <!-- More options -->
    </ul>
  </div>
</div>
```
