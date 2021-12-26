export interface Option {
  value: string;
  textContent: string;
  className?: string;
  disabled?: string;
  ariaSelected?: boolean;
}

export interface Params {
  placeholder?: string;
  replacePropElement?: boolean;
  useSearch?: boolean;
}

type EventHandler<T> = (target: T) => void;

export class Auslesen {
  protected ausContent: HTMLSpanElement;
  protected ausWrapper: HTMLDivElement;
  protected ausSelect: HTMLDivElement;
  protected ausOptions: HTMLUListElement;
  protected ausSearch: HTMLInputElement;

  private tabIndex: number;
  private optionsList: HTMLLIElement[];
  private selectedOption: HTMLLIElement | null;

  constructor(protected element: HTMLSelectElement | HTMLElement, protected params: Params = {}) {
    // Init passed parameters.
    this.element = element;
    this.params = params;

    // Default help parameters.
    this.tabIndex = 1;
    this.optionsList = [];
    this.selectedOption = null;

    // Create and render the custom Select according to type of the using element.
    this.ausWrapper = document.createElement("div");
    this.ausSelect = document.createElement("div");
    this.ausOptions = document.createElement("ul");
    this.ausContent = document.createElement("span");
    this.ausSearch = document.createElement("input");
    this.render();
  }

  get currentOptionsList() {
    return this.optionsList;
  }

  get currentSelectedOption() {
    return this.selectedOption;
  }

  /**
   * Convert insert options to Option elements.
   * Push elements to the custom Options list.
   */
  useOptions(optionsList: (Option | HTMLOptionElement)[]): void {
    optionsList.forEach((option) => {
      // Init the Option element.
      const ausOption = document.createElement("li");
      ausOption.dataset.role = "option";
      ausOption.dataset.value = option.value;
      ausOption.textContent = option.textContent;

      // Add and update the tab index.
      ausOption.tabIndex = this.tabIndex;
      this.tabIndex++;

      // Conditions for additional parameters.
      if (option.className) ausOption.className = option.className;
      if (option.ariaSelected) this.updateSelectedState(ausOption);

      // Conditin for update and render the Options list.
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
    this.selectedOption?.classList.remove("selected");
    this.selectedOption = option;
    this.selectedOption.classList.add("selected");

    // Save values to the input field.
    if (this.params.useSearch) this.connectInput();
  }

  /**
   * Remove all elements from the custom Options list.
   */
  clear(): void {
    this.tabIndex = 1;
    this.optionsList.length = 0;
    this.ausOptions.innerHTML = "";
  }

  /**
   * Listener for changing the selected option.
   */
  onSelect(handler: EventHandler<HTMLLIElement>): ReturnType<typeof handler> {
    this.ausWrapper.addEventListener("click", (event) => {
      const target = event.target as HTMLLIElement;
      if (target.dataset.role === "option") {
        return handler(target);
      }
    });
  }

  /**
   * Listener for changing in the Input element.
   */
  onInput(handler: EventHandler<HTMLInputElement>): ReturnType<typeof handler> {
    if (this.params.useSearch) {
      this.ausSearch.addEventListener("input", (event) => {
        const target = event.target as HTMLInputElement;
        return handler(target);
      });
    }
  }

  private render(): void {
    // Fill the roles of custom elements.
    this.ausWrapper.dataset.role = "wrapper";
    this.ausSelect.dataset.role = "select";
    this.ausOptions.dataset.role = "options";

    // Fill settings of custom elements.
    this.ausSelect.className = this.element.className;
    this.ausContent.dataset.value = "";
    this.ausContent.textContent = this.params.placeholder ?? "";

    // Settings for using the input field.
    if (this.params.useSearch) {
      // Fill settings of the Search element.
      this.ausSearch.dataset.role = "search";
      this.ausSearch.name = "aus-search";
      this.ausSearch.type = "search";

      // Preparing the environment for using the Search element.
      this.ausContent.hidden = true;
      this.ausSelect.append(this.ausSearch);
      this.connectInput();

      // Init of the input selection event.
      this.onInput((target) => {
        this.ausOptions.innerHTML = "";
        const filterOptionsList = this.optionsList
          .filter((option) => option.textContent!.toLowerCase().includes(target.value.toLowerCase()));
        this.ausOptions.append(...filterOptionsList);
      });
    }

    // Init of the option selection event.
    this.onSelect((target) => {
      this.updateSelectedState(target);

      // Condition for updating the Options list.
      if (this.params.useSearch && this.ausOptions.children.length !== this.optionsList.length) {
        this.ausOptions.innerHTML = "";
        this.ausOptions.append(...this.optionsList);
      }
    });

    // Call the function for render the Options list.
    if (this.element instanceof HTMLSelectElement) {
      this.useOptions(Array.from(this.element.options));
    }

    // Insert related elements.
    this.ausWrapper.append(this.ausSelect, this.ausOptions);
    this.ausSelect.append(this.ausContent);
    this.ausOptions.append(...this.optionsList);

    // Insert ready-made custom Select.
    if (this.params.replacePropElement) {
      this.element.replaceWith(this.ausWrapper);
    } else {
      this.element.insertAdjacentElement("afterend", this.ausWrapper);
    }
  }

  private connectInput() {
    this.ausSearch.value = this.ausContent.textContent!;
    this.ausSearch.dataset.value = this.ausContent.dataset.value;
  }
}
