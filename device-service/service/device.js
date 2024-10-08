const repo = require('../repo/device');
const kafka = require('../kafka');
const {produceDeviceCommand} = require("../kafka");

function create(dto) {
    const entry = {
        ...dto,
        status: 'off'
    }
    return repo.create(entry);
}

function read(id) {
    return repo.read(id);
}

function changeStatus(id, status) {
    kafka.produceDeviceChangeStatus(id, status);
    return repo.changeStatus(id, status);
}

function sendCommand(id, command) {
    if (!!repo.read(id)) {
        produceDeviceCommand(id, command);
        return true;
    }
    return false;
}

module.exports = {
    create,
    read,
    changeStatus,
    sendCommand
};
