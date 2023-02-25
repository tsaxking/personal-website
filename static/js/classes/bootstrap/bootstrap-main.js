class CustomBootstrap {
    static replaceAllInEl(el, parameters) {
        // replaces every instance of {{param}} with the value of parameters[param]
        // runs recursively on all children of el
        // returns el
        if (typeof el == 'string') {
            Object.entries(parameters).forEach(([key, value]) => {
                el = el.replace(
                    new RegExp(`{{${key}}}`, 'g'),
                    `<span data-card-param="card-${this.cardId}-${key}">${value}</span>`
                );
            });
        } else {
            if (el.children) {
                Array.from(el.children).forEach(child => {
                    this.replaceAllInEl(child, parameters);
                });
            }
        }

        return el;
    }
}