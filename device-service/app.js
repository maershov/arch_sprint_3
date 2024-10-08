const rest = require('./rest');
const {run: kafka} = require('./kafka');

async function app() {
    await kafka();
    await rest();
}

app();
