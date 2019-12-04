import Boot from '../../../src/boot';

const TemplateConstants = {
    STYLE: 'style',
    TYPE: 'text/html'
}

export default class Template {

    constructor(template, style) {
        this.template = template;
        this.style = style;
    }

    getHTML() {
        console.log(this.template);
        return Boot[this.template];
    }

    getCSS() {
        return Boot[this.style];
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