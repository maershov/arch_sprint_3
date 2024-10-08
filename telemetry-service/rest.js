const express = require('express');
const app = express();
const port = 3000;

const service = require('./service/telemetry');

app.get('/telemetry/latest', (req, res) => {
    try {
        const {device_id} = req.query;
        const latest = service.latestByDeviceId(Number(device_id));
        if (!!latest) {
            res.json(latest);
        } else {
            res.status(404);
            res.send();
        }
    } catch (e) {
        console.error(e);
        res.status(500);
        res.send();
    }
});

app.get('/telemetry', (req, res) => {
    try {
        const {device_id, from, until} = req.query;
        const list = service.listByDeviceIdAndPeriod(Number(device_id), from, until);
        res.json(list);
    } catch (e) {
        console.error(e);
        res.status(500);
        res.send();
    }
});


async function run() {
    return new Promise((resolve) => {
        app.listen(port, () => {
            resolve();
            console.log(`Example app listening on port ${port}`);
        });
    })
}

module.exports = run;
