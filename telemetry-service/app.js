const rest = require('./rest');
const kafka = require('./kafka');

async function app() {
    await kafka();
    await rest();
}

app();
