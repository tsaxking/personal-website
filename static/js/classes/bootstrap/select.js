CustomBootstrap.Selects = [];
CustomBootstrap.Select = class {
    constructor(el) {
        this.el = el;
        this.el.classList.add('form-select');
        CustomBootstrap.Selects.push(this);

        this.options = [];
    }

    addOption(text, value, selected = false) {
        const option = document.createElement('option');
        option.innerText = text;
        option.value = value;
        option.selected = selected;
        this.el.appendChild(option);
    }

    removeOption(value) {
        this.el.querySelector(`option[value="${value}"]`).remove();
    }

    get value() {
        return this.el.value;
    }

    set value(value) {
        this.el.value = value;
    }

    disableOption(value) {
        this.el.querySelector(`option[value="${value}"]`).disabled = true;
    }

    enableOption(value) {
        this.el.querySelector(`option[value="${value}"]`).disabled = false;
    }

    isDisabled(value) {
        return this.el.querySelector(`option[value="${value}"]`).disabled;
    }

    disable() {
        this.el.disabled = true;
    }

    enable() {
        this.el.disabled = false;
    }

    clearOptions() {
        this.el.innerHTML = '';
    }
}