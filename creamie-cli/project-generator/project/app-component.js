var App = {
    get: function(version) {
        return `
<div class="sample">
    <div>
        <img src="assets/cream.png" width="300" height="300" />
    </div>
    <div>v${version}</div>
    <div class="creamieFont lobster dark-brown" data="name">Creamie</div>
    <input type="text" data="name" placeholder="type anything here">
</div>
`
    }
}

module.exports = App;