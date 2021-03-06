import { clickOutside } from 'lib/events';

export interface Option {
  value: string;
  textContent: string;
  className?: string;
  disabled?: string;
  ariaSelected?: boolean;
}

export interface ComponentClass {
  mainWrap?: string;
  selectWrap?: string;
  search?: string;
  content?: string;
  optionsWrap?: string;
  optionsList?: string;
}

export interface Params {
  componentClass?: ComponentClass;
  id?: string;
  placeholder?: string;
  replacePropElement?: boolean;
  showOnInit?: boolean;
  useSearch?: boolean;
}

type EventHandler<T> = (target: T) => void;

export class Auslesen {
  readonly ausSelectWrap: HTMLDivElement;

  readonly ausOptionsWrap: HTMLDivElement;

  readonly ausFullWrap: HTMLDivElement;

  readonly ausOptions: HTMLUListElement;

  protected ausContent: HTMLSpanElement;

  protected ausSearch: HTMLInputElement;

  protected readonly optionsList: HTMLLIElement[];

  protected selectedOption: HTMLLIElement | null;

  constructor(protected element: HTMLSelectElement | HTMLElement, protected params: Params = {}) {
    // Init passed parameters.
    this.element = element;
    this.params = params;

    // Default help parameters.
    this.optionsList = [];
    this.selectedOption = null;

    // Create and render the custom Select according to type of the using element.
    this.ausFullWrap = document.createElement('div');
    this.ausSelectWrap = document.createElement('div');
    this.ausOptionsWrap = document.createElement('div');
    this.ausOptions = document.createElement('ul');
    this.ausContent = document.createElement('span');
    this.ausSearch = document.createElement('input');

    // Fill custom class for custom elements.
    if (this.params.componentClass) {
      const customClass = this.params.componentClass;
      if (customClass.mainWrap) this.ausFullWrap.className = customClass.mainWrap;
      if (customClass.selectWrap) this.ausSelectWrap.className = customClass.selectWrap;
      if (customClass.search) this.ausSearch.className = customClass.search;
      if (customClass.content) this.ausContent.className = customClass.content;
      if (customClass.optionsWrap) this.ausOptionsWrap.className = customClass.optionsWrap;
      if (customClass.optionsList) this.ausOptions.className = customClass.optionsList;
    }

    this.render();
  }

  get currentOptionsList() {
    return this.optionsList;
  }

  /**
   * Convert insert options to Option elements.
   * Push elements to the custom Options list.
   */
  useOptions(optionsList: (Option | HTMLOptionElement)[]): void {
    optionsList.forEach((option) => {
      // Init the Option element.
      const ausOption = document.createElement('li');
      ausOption.dataset.role = 'option';
      ausOption.dataset.value = option.value;
      ausOption.textContent = option.textContent;

      // Conditions for additional parameters.
      if (option.className) ausOption.className = option.className;
      if (option instanceof HTMLOptionElement && option.selected) this.updateSelectedState(ausOption);
      if (option.ariaSelected) this.updateSelectedState(ausOption);

      // Condition for update and render the Options list.
      if (!option.disabled) {
        this.optionsList.push(ausOption);
        this.ausOptions.append(ausOption);
      }
    });
  }

  /**
   * Saves the passed parameter as the current selection.
   */
  updateSelectedState(option: HTMLLIElement): void {
    // Save values to the Select element.
    this.ausContent.dataset.value = option.dataset.value;
    this.ausContent.textContent = option.textContent;

    // Update the selected state.
    this.selectedOption?.classList.remove('selected');
    this.selectedOption = option;
    this.selectedOption.classList.add('selected');

    // Save values to the input field.
    if (this.params.useSearch) this.connectInput();
  }

  /**
   * Remove all elements from the custom Options list.
   */
  clear(): void {
    this.optionsList.length = 0;
    this.ausOptions.innerHTML = '';
  }

  /**
   * Listener for changing the selected option.
   */
  onSelect(handler: EventHandler<HTMLLIElement>): ReturnType<typeof handler> {
    this.ausFullWrap.addEventListener('click', (event) => {
      const target = event.target as HTMLLIElement;
      if (target.dataset.role === 'option') {
        return handler(target);
      }
      return undefined;
    });
  }

  /**
   * Listener for changing in the Input element.
   */
  onInput(handler: EventHandler<HTMLInputElement>): ReturnType<typeof handler> {
    if (this.params.useSearch) {
      this.ausSearch.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        return handler(target);
      });
    }
  }

  private render(): void {
    // Fill the roles with custom elements.
    this.ausFullWrap.dataset.role = 'full-wrap';
    this.ausSelectWrap.dataset.role = 'select-wrap';
    this.ausOptionsWrap.dataset.role = 'options-wrap';
    this.ausOptions.dataset.role = 'options';
    this.ausContent.dataset.role = 'content';

    // Fill settings of custom elements.
    this.ausFullWrap.id = this.params.id || `aus-${String(Math.random()).slice(2, 15)}`;
    this.ausContent.dataset.value = '';
    this.ausContent.textContent = this.params.placeholder ?? '';
    this.ausFullWrap.dataset.show = this.params.showOnInit ? String(this.params.showOnInit) : 'init';

    // Settings for using the input field.
    if (this.params.useSearch) {
      // Fill settings of the Search element.
      this.ausSearch.dataset.role = 'search';
      this.ausSearch.name = 'aus-search';
      this.ausSearch.type = 'search';

      // Preparing the environment for using the Search element.
      this.ausContent.hidden = true;
      this.ausSelectWrap.append(this.ausSearch);
      this.connectInput();

      // Init of the input selection event.
      this.onInput((target) => {
        this.ausOptions.innerHTML = '';
        const filterOptionsList = this.optionsList
          .filter((option) => option.textContent?.toLowerCase().includes(target.value.toLowerCase()));
        this.ausOptions.append(...filterOptionsList);
      });
    }

    // Init of the option selection event.
    this.onSelect((target) => {
      this.updateSelectedState(target);

      // Condition for updating the Options list.
      if (this.params.useSearch && this.ausOptions.children.length !== this.optionsList.length) {
        this.ausOptions.innerHTML = '';
        this.ausOptions.append(...this.optionsList);
      }
    });

    // Call the function for render the Options list.
    if (this.element instanceof HTMLSelectElement) {
      this.useOptions(Array.from(this.element.options));
    }

    // Insert related elements.
    this.ausFullWrap.append(this.ausSelectWrap, this.ausOptionsWrap);
    this.ausOptionsWrap.append(this.ausOptions);
    this.ausSelectWrap.append(this.ausContent);
    this.ausOptions.append(...this.optionsList);

    // Insert ready-made custom Select.
    if (this.params.replacePropElement) {
      this.element.replaceWith(this.ausFullWrap);
    } else {
      this.element.insertAdjacentElement('afterend', this.ausFullWrap);
      this.ausFullWrap.prepend(this.element);
    }

    // Create event listeners for opening and closing.
    this.ausFullWrap.addEventListener('click', () => {
      if (this.ausFullWrap.dataset.show === 'open') {
        this.ausFullWrap.dataset.show = 'close';
      } else {
        this.ausFullWrap.dataset.show = 'open';
      }
    });
    clickOutside(`[data-role="full-wrap"]#${this.ausFullWrap.id}`, () => {
      if (this.ausFullWrap.dataset.show === 'open') this.ausFullWrap.dataset.show = 'close';
    });
  }

  private connectInput() {
    this.ausSearch.value = this.ausContent.textContent;
    this.ausSearch.dataset.value = this.ausContent.dataset.value;
  }
}
