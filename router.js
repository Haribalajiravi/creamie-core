import Routes from '../creamie-project/src/routes';

export default class Router {

    constructor(name) {
        this.tag = name;
        this.params = {};
        this.errorParam = '**';
        this.routeAttribute = 'route-to';
    };

    init() {
        this.render(this.getCurrentPath());
        window.onpopstate = () => {
            this.render(this.getCurrentPath());
        }
        let elements = document.querySelectorAll(`[${this.routeAttribute}]`);
        elements.forEach((element) => {
            let path = element.getAttribute(this.routeAttribute);
            element.onclick = () => {
                this.render(path);
            }
        });
    }

    render(path, params = {}) {
        let _this = this;
        let matchedPath = this.matchPath(path);
        if (Routes[this.errorParam] && !matchedPath || matchedPath == this.errorParam) {
            document.querySelector('body').innerHTML = '';
            document.querySelector('body').appendChild(new Routes[this.errorParam]());
        } else if (matchedPath) {
            let routeLet = document.querySelector(_this.tag);
            routeLet.innerHTML = '';
            routeLet.appendChild(_this.getElement(matchedPath));
        }
        this.parseVariable(matchedPath, path);
        window.history.pushState(params, path, window.location.origin + path);
    }

    parseVariable(matchedPath, path) {
        let _this = this;
        if (matchedPath && path) {
            let paths = matchedPath.split('/');
            let absolutePaths = path.split('/');
            paths.shift();
            absolutePaths.shift();
            if (paths.length) {
                paths.forEach((param, index) => {
                    if ((param[0] == '{' && param[param.length - 1] == '}')) {
                        let paramName = param.replace('{', '').replace('}', '');
                        _this.params[paramName] = absolutePaths[index];
                    }
                });
            }
        }
    }

    matchPath(path) {
        let absolutePaths = path.split('/');
        absolutePaths.shift();
        let routes = Object.keys(Routes);
        for (let i = 0; i < routes.length; i++) {
            let route = routes[i];
            let paths = route.split('/');
            paths.shift();
            let processedRoute = '';
            for (let j = 0; j < paths.length; j++) {
                if (absolutePaths[j] == paths[j] || (paths[j][0] == '{' && paths[j][paths[j].length - 1] == '}' && absolutePaths[j])) {
                    processedRoute += `/${paths[j]}`;
                }
            }
            if (processedRoute == route) {
                return route;
            }
        }
        return false;
    }

    navigateTo(path) {
        this.render(path);
    }

    getElement(path) {
        let _this = this;
        let routePath = (path) ? path : this.getCurrentPath();
        return (Routes[routePath]) ? new Routes[routePath]() : _this.errorPage();
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