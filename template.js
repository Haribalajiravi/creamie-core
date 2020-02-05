const TemplateConstants = {
    STYLE: 'style',
    TYPE: 'text/html'
}

export default class Template {

    constructor(template, style, boot) {
        this.template = template;
        this.style = style;
        this.boot = boot;
    }

    getHTML() {
        return this.boot[this.template];
    }

    getCSS() {
        return this.boot[this.style];
    }

    get() {
        const template = document.createDocumentFragment();
        const style = document.createElement(TemplateConstants.STYLE);
        const styleContent = document.createTextNode(this.getCSS());
        const parser = new DOMParser();
        const templateContent = parser.parseFromString(this.getHTML(), TemplateConstants.TYPE);
        style.appendChild(styleContent);
        template.appendChild(style);
        template.appendChild(templateContent.body);
        return template;
    }
}