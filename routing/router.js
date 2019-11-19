export default class Router {

    constructor(routes) {
        this.routes = routes;
        this.tag = 'route-let';
        this.render(this.getCurrentPath());
    };

    _init() {
        let _this = this;
        window.onpopstate = () => {
            _this.render(_this.getCurrentPath());
        }
    }

    render(path) {
        let _this = this;
        if (_this.routes['**'] && !_this.routes[path] && path != '/') {
            document.querySelector('body').innerHTML = '';
            document.querySelector('body').appendChild(document.createElement(_this.routes['**'].tag));
        } else if (_this.routes[path]) {
            let routeLet = document.querySelector(this.tag);
            routeLet.appendChild(this.getElement(path));
        }
    }

    navigateTo(path, params = {}) {
        window.history.pushState(params, path, window.location.origin + path);
        this.render(path);
    }

    getElement(path) {
        let _this = this;
        let routePath = (path) ? path : this.getCurrentPath();
        return (_this.routes[routePath]) ? document.createElement(_this.routes[routePath].tag) : this.errorPage();
    }

    errorPage() {
        let div = document.createElement('div');
        let h1 = document.createElement('h1');
        let h1Text = document.createTextNode('404 page not found!');
        h1.appendChild(h1Text);
        let div1 = document.createElement('div');
        let div1Text = document.createTextNode('error page is not configured!');
        div1.appendChild(div1Text);
        div.appendChild(h1);
        div.appendChild(div1);
        return div;
    }

    getCurrentPath() {
        return window.location.pathname;
    }
};