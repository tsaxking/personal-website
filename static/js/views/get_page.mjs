import AbstractView from "./AbstractView.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
    }
    async getHtml(path) {
        return fetch(path, {
            method: "GET",
            headers: {
                "index_loaded": "true"
            }
        }).then(response => {
            return response.text();
        }).then(html => {
            try {
                let obj = JSON.parse(html);
                if (obj.status == 'blocked') alert(obj.msg);
            } catch (err) {}
            return this.removeDoctype(html, 'body');
        });
    }
    removeDoctype(htmlStr, htmlClass) {
        var htmlObject = document.createElement('html');
        htmlObject.innerHTML = htmlStr;
        var html = htmlObject.querySelector(htmlClass).innerHTML;
        return html;
    }
}