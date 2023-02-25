CustomBootstrap.confirm = (message, options) => {
    return new Promise((res, rej) => {
        const shake = (el) => {
            el.classList.add('animate__animated', 'animate__shakeX');
            el.addEventListener('animationend', () => {
                el.classList.remove('animate__animated', 'animate__shakeX', 'animate__fast');
            });
        }

        const confirm = new CustomBootstrap.ConfirmModal(message, options);

        confirm.modal.el.addEventListener('hidden.bs.modal', () => {
            confirm.modal.el.remove();
            res(false);
        });

        confirm.modal.el.querySelector('.confirm-btn').addEventListener('click', () => {
            if (confirm.options.password) {
                if (confirm.modal.el.querySelector('input').value !== confirm.options.password) {
                    return shake(confirm.modal.el);
                }
            }

            if (confirm.options.enterText) {
                if (confirm.modal.el.querySelector('input').value !== confirm.options.enterText) {
                    return shake(confirm.modal.el);
                }
            }


            res(true);
            $(confirm.modal.el).modal('hide');
        });

        confirm.modal.el.querySelector('.cancel-btn').addEventListener('click', () => {
            res(false);
            $(confirm.modal.el).modal('hide');
        });

        confirm.modal.show();

        confirm.modal.el.querySelector('.confirm-btn').focus();
    });
}
CustomBootstrap.ConfirmModal = class {
    constructor(message, {
        title = '<span class="no-select">Confirm</span>',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmClass = 'btn-primary',
        cancelClass = 'btn-secondary',
        password = false,
        enterText = false,
        buttons = []
    } = {}) {
        this.message = message;
        this.options = {
            title,
            confirmText,
            cancelText,
            confirmClass,
            cancelClass,
            password,
            enterText,
            buttons
        };

        this.render();
    }

    render() {
        const {
            title,
            confirmText,
            cancelText,
            confirmClass,
            cancelClass,
            password,
            enterText,
            buttons
        } = this.options;

        const body = document.createElement('div');
        const p = document.createElement('p');
        p.innerHTML = this.message;
        body.append(p);

        if (password) {
            const input = document.createElement('input');
            input.type = 'password';
            input.classList.add('form-control');
            input.placeholder = 'Password';
            body.append(input);
        }

        if (enterText) {
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('form-control');
            input.placeholder = 'Type: ' + enterText;
            body.append(input);
        }

        this.modal = new CustomBootstrap.Modal({
            title,
            body,
            footer: `
                <button type="button" class="btn ${confirmClass} confirm-btn" data-dismiss="modal">${confirmText}</button>
                <button type="button" class="btn ${cancelClass} cancel-btn" data-dismiss="modal">${cancelText}</button>
            `
        });
    }
}