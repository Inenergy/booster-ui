const App = require('./App.svelte').default;

const app = new App({
	target: document.getElementById('content'),
});

window.app = app;

module.exports = app;