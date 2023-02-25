const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
const mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');

// Test new-password security
document.querySelectorAll('.new-password').forEach(el => {
    console.log(el);
    el.addEventListener('input', () => { testPassword(el) });

    testPassword(el);
});

function testPassword(input) {
    const { value } = input;
    let testValidation = strongPassword.test(value) ? 'success' : (mediumPassword.test(value) ? 'warning' : 'danger');

    let validationElement = document.querySelector(input.dataset.validation);

    validationElement.innerHTML = `<span class="text-${testValidation}">${testValidation == 'success' ? 'Very Strong':(testValidation == 'warning' ? 'Weak' : 'Very Weak')}</span>`;
}


document.querySelectorAll('form').forEach(form => {
    if (form.classList.contains('reload')) return; // Sets for each form to not reload on submit

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData();
        let containsFile = false;
        form.querySelectorAll('input').forEach(input => {

            // Changes formData.append() based on input type
            switch (input.type) {
                case 'file':
                    containsFile = true;
                    if (input.files.length > 1) input.files.forEach(f => formData.append(input.name, f));
                    else formData.append(input.name, input.files[0]);
                    break;
                case 'checkbox':
                    formData.append(input.name, input.checked);
                    break;
                default:
                    formData.append(input.name, input.value);
            }
        });

        let obj = {};
        for (var [name, data] of formData.entries()) obj[name] = data;

        requestFromServer({
            url: form.action,
            method: 'POST',
            body: containsFile ? formData : obj,
            noHeaders: containsFile
        });
    });
});