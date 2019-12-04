var HTML = {
    get: (name) => {
        return {
            filename: `${name}-component.html`,
            content: `<div>${name}-component worked</div>`
        }
    }
}

module.exports = HTML;