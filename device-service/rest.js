const express = require('express');
const app = express();
const port = 3000;

const deviceService = require('./service/device');
const moduleService = require('./service/module');
const deviceTypeService = require('./service/device-type');

app.use(express.json());

app.post('/devices', (req, res) => {
    try {
        const id = deviceService.create(req.body);
        res.json({id});
    } catch (e) {
        console.error(e);
        res.status(500);
        res.send();
    }
});

app.get('/device/:id', (req, res) => {
    try {
        const {id} = req.params;
        const device = deviceService.read(Number(id));
        if (!!device) {
            res.json(device);
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

app.post('/device/:id/command', (req, res) => {
    try {
        const {id} = req.params;
        const ok = deviceService.sendCommand(Number(id), req.body.command);
        if (!!ok) {
            res.json(ok);
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

app.put('/device/:id/status', (req, res) => {
    try {
        const {id} = req.params;
        const device = deviceService.changeStatus(Number(id), req.body.status);
        if (!!device) {
            res.json(device);
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

app.post('/modules', (req, res) => {
    try {
        const id = moduleService.create(req.body);
        res.json({id});
    } catch (e) {
        console.error(e);
        res.status(500);
        res.send();
    }
});

app.post('/device-types', (req, res) => {
    try {
        const id = deviceTypeService.create(req.body);
        res.json({id});
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
