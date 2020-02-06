export default class Events {
    constructor(dom) {
        this.dom = (dom) ? dom : document;
        this.eventAttribute = 'e';
        this.domevents = {
            afterprint: 'onafterprint',
            beforeprint: 'onbeforeprint',
            beforeunload: 'onbeforeunload',
            error: 'onerror',
            hashchange: 'onhashchange',
            load: 'onload',
            message: 'onmessage',
            offline: 'onoffline',
            online: 'ononline',
            pagehide: 'onpagehide',
            pageshow: 'onpageshow',
            popstate: 'onpopstate',
            resize: 'onresize',
            storage: 'onstorage',
            unload: 'onunload',
            blur: 'onblur',
            change: 'onchange',
            contextmenu: 'oncontextmenu',
            focus: 'onfocus',
            input: 'oninput',
            invalid: 'oninvalid',
            reset: 'onreset',
            search: 'onsearch',
            select: 'onselect',
            submit: 'onsubmit',
            keydown: 'onkeydown',
            keypress: 'onkeypress',
            keyup: 'onkeyup',
            click: 'onclick',
            dblclick: 'ondblclick',
            mousedown: 'onmousedown',
            mousemove: 'onmousemove',
            mouseout: 'onmouseout',
            mouseover: 'onmouseover',
            mouseup: 'onmouseup',
            mousewheel: 'onmousewheel',
            wheel: 'onwheel',
            drag: 'ondrag',
            dragend: 'ondragend',
            dragenter: 'ondragenter',
            dragleave: 'ondragleave',
            dragover: 'ondragover',
            dragstart: 'ondragstart',
            drop: 'ondrop',
            scroll: 'onscroll',
            copy: 'oncopy',
            cut: 'oncut',
            paste: 'onpaste',
            abort: 'onabort',
            canplay: 'oncanplay',
            canplaythrough: 'oncanplaythrough',
            cuechange: 'oncuechange',
            durationchange: 'ondurationchange',
            emptied: 'onemptied',
            ended: 'onended',
            error: 'onerror',
            loadeddata: 'onloadeddata',
            loadedmetadata: 'onloadedmetadata',
            loadstart: 'onloadstart',
            pause: 'onpause',
            play: 'onplay',
            playing: 'onplaying',
            progress: 'onprogress',
            ratechange: 'onratechange',
            seeked: 'onseeked',
            seeking: 'onseeking',
            stalled: 'onstalled',
            suspend: 'onsuspend',
            timeupdate: 'ontimeupdate',
            volumechange: 'onvolumechange',
            waiting: 'onwaiting',
            toggle: 'ontoggle'
        }
    }

    init(methods) {
        let _this = this;
        let elements = _this.dom.querySelectorAll(`[${_this.eventAttribute}]`);
        elements.forEach((element) => {
            let values = element.getAttribute(_this.eventAttribute).split(':');
            let eventName = values[0];
            let methodName = values[1];
            if(_this.domevents[eventName] && methods && methods[methodName]) {
                element[_this.domevents[eventName]] = methods[methodName];
            } else {
                if(!_this.domevents[eventName]) {
                    throw _this.getError('NO_EVENT_FOUND', eventName);
                }
                if(!methods[methodName]) {
                    throw _this.getError('NO_METHOD_FOUND', methodName);
                }
            }
        });
    }

    getError(key, name) {
        let errors = {
            NO_EVENT_FOUND: `There is no event called '${name}'`,
            NO_METHOD_FOUND: `There is no method called '${name}'`
        };
        return `Error[creamie]: ${errors[key]}`;
    }
}