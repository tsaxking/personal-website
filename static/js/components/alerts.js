const alertsDiv = document.querySelector('#alerts-container');
const alertsButton = document.querySelector('#alerts-button');
const numAlerts = document.querySelector('#num-alerts');

const alertRowTypes = {
    'student-request': (row) => {
        const manageCol = createElementFromSelector('div.col-4');
        let deleteBtn = createElementFromSelector('button.btn.btn-danger');
        let deleteI = createElementFromSelector('i.material-icons');
        deleteI.innerText = 'delete';
        deleteBtn.appendChild(deleteI);

        deleteBtn.addEventListener('click', () => {
            requestFromServer({
                url: '/student/confirm-class-request',
                method: 'POST',
                body: {
                    alertId: row.alertId,
                    confirm: false
                },
                func: getAlerts
            });
        });
        manageCol.appendChild(deleteBtn);


        let acceptBtn = createElementFromSelector('button.btn.btn-success');
        let acceptI = createElementFromSelector('i.material-icons');
        acceptI.innerText = 'check';
        acceptBtn.appendChild(acceptI);

        acceptBtn.addEventListener('click', () => {
            requestFromServer({
                url: '/student/confirm-class-request',
                method: 'POST',
                body: {
                    alertId: row.alertId,
                    confirm: true
                },
                func: getAlerts
            });
        });
        manageCol.appendChild(acceptBtn);
        return manageCol;
    },
    'part-request': (row) => {
        const {
            alertId,
            title,
            severity,
            msg,
            info
        } = row;


        const requestId = info.split(': ')[1];

        const manageCol = createElementFromSelector('div.col-4');
        let fulfillBtn = createElementFromSelector('button.btn.btn-success');
        let checkI = createElementFromSelector('i.material-icons');
        checkI.innerText = 'done';
        fulfillBtn.appendChild(checkI);

        fulfillBtn.addEventListener('click', () => {
            requestFromServer({
                url: '/part-request/fulfill-request',
                method: 'POST',
                body: {
                    requestId
                },
                func: () => {
                    getAlerts();
                    getRequests();
                }
            });
        });
        manageCol.appendChild(fulfillBtn);
        return manageCol;
    }
}


function getAlerts() {
    requestFromServer({
        url: '/alerts/get',
        method: 'post',
        func: (alerts) => {
            alertsDiv.innerHTML = '';
            if (alerts.length == 0) {
                hideElement(alertsButton);
                return;
            } else {
                showElement(alertsButton);
                numAlerts.innerText = alerts.length;
            }

            alerts.forEach(al => {
                const row = createElementFromSelector(`div.row.bg-${al.severity}.rounded.shadow.mb-3`);

                const container = createElementFromSelector('div.container-fluid');
                const titleRow = createElementFromSelector('div.row');
                const msgRow = createElementFromSelector('div.row');

                const msgCol = createElementFromSelector('div.col-8');

                const title = document.createElement('h4');
                title.innerText = al.title;
                titleRow.appendChild(title);

                const msg = document.createElement('p');
                msg.innerText = al.msg;
                msgCol.appendChild(msg);
                msgRow.appendChild(msgCol);
                msgRow.appendChild(alertRowTypes[al.type](al));
                container.appendChild(titleRow);
                container.appendChild(msgRow);
                row.appendChild(container);

                alertsDiv.appendChild(row);
            });
        }
    });
}

function haltAndCatchFire(msg) {
    alert(msg)
    throw new Error(msg);
}

// getAlerts();