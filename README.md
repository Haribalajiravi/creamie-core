# Creamie

![enter image description here](https://raw.githubusercontent.com/Haribalajiravi/creamie/master/creamie.png)

[![Build Status](https://travis-ci.org/Haribalajiravi/creamie.svg?branch=master)](https://travis-ci.org/Haribalajiravi/creamie) [![CodeFactor](https://www.codefactor.io/repository/github/haribalajiravi/creamie/badge/master)](https://www.codefactor.io/repository/github/haribalajiravi/creamie/overview/master) [![version](https://img.shields.io/npm/v/creamie.svg)](https://www.npmjs.com/package/creamie) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Gitter](https://badges.gitter.im/creamie-cli/community.svg)](https://gitter.im/creamie-cli/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Haribalajiravi/creamie)

If you find this framework more useful

[![Buy me a coffee](https://cdn.buymeacoffee.com/buttons/default-orange.png)](https://www.buymeacoffee.com/7xcFqmn)

It is a front-end javascript bundle which you can import in your client project.

To use this as library try below command:

```npm install creamie```

 If you don't want to create project manually, we'll recommend you to install [creamie-cli](https://www.npmjs.com/package/creamie-cli) globally. 
 [Read more](https://github.com/Haribalajiravi/creamie-cli/blob/master/README.md) to access auto-project generation CLI tool.

## Check out official framework docs below

**[https://creamie.now.sh](https://creamie.now.sh/)**

## Feature currently available

1. [Web components & Custom elements](#web-components)
2. [Two Binder (Binding between DOM & Object)](#binder)
3. [Router](#router)
4. [Events](#events)

### Web components

We have used common web component elements to achieve custom element which is convenient with [callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

Example:

appConfig.js:

```javascript
export default {
    template: `app.html`,
    style: `app.css`,
    tag: 'app',
    isShadowDom: false,
    shadowMode: 'open',
    binder: 'data',
    boot: {
        'app.html': `<div class="text-center">App component working!</div>`,
        'app.css': `.text-center { text-align: center; }`
    }
}
```

App.js:

```javascript
import Creamie from 'creamie';
import  AppConfig  from  './appConfig.js';

class App extends Creamie {

    constructor() {
        super(AppConfig);
    }

    /**
     * create your methods below
     */
}

window.customElements.define(AppConfig.tag, App);
```

index.html:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>App</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script module='type' src='./App.js'></script>
</head>
<body>
    <app></app>
</body>
</html>
```

## Binder

Binder will make the data sync between a HTMLElement and Object.

Example:

In your component html try will below code:

```html
    <input type="text" data="name" placeholder="Type anything">
    <div data="name">Previous data!</div>
    <button id="change">Change</button>
```

App.js:

```javascript
import Creamie from 'creamie';
import  AppConfig  from  './appConfig.js';

class App extends Creamie {

    constructor() {
        super(AppConfig);
        let _this = this;
        change.onclick = function() {
            _this.data.name = 'Data changed!';
        }
    }

    /**
     * create your methods below
     */
}

window.customElements.define(AppConfig.tag, App);
```

## Router

Router will replace the particular component on a route placeholder without refreshing the page.

Example:

App.js:

```javascript
import Creamie from 'creamie';
import  AppConfig  from  './appConfig.js';
import Router from 'creamie/router.js';
import Home from './home.js';
import Tab from './tab.js';

class App extends Creamie {

    constructor() {
        super(AppConfig);
        let router = new Router('route-app', {
            '/home' : Home,
            '/tab/{tabId}' : Tab
        });
        router.init();
        // To route in js
        // router.navigateTo('/tab');
        // console.log(router.params.tabId);
    }

    /**
     * create your methods below
     */
}

window.customElements.define(AppConfig.tag, App);
```

index.html:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>App</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script module='type' src='./App.js'></script>
</head>
<body>
    <a route-to="/home">Home</a>
    <a route-to="/tab/{tabId}">Tab</a>
    <route-app></route-app>
</body>
</html>
```

## Events

Example:

App.js:

```javascript
import Creamie from 'creamie';
import  AppConfig  from  './appConfig.js';

class App extends Creamie {

    constructor() {
        super(AppConfig);
        this.events.init({
            execute: function (e) {
                console.log(this, e);
                alert('Execute method fired!');
            }
        });
    }

    /**
     * create your methods below
     */
}

window.customElements.define(AppConfig.tag, App);
```

index.html:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>App</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script module='type' src='./App.js'></script>
</head>
<body>
    <button e="click:execute"></button>
</body>
</html>
```

## Contributors
- [HBR](https://twitter.com/haribalaji_o_0)
- [Ahilesh](https://twitter.com/KumarAhilesh)

## Copyrights
(c) 2020, [Haribalaji Raviprakash](https://twitter.com/haribalajiravi1)
