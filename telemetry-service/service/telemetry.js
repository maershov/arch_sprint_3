const repo = require('../repo/telemetry')

function latestByDeviceId(deviceId) {
    return repo.latestByDeviceId(deviceId);
}

function listByDeviceIdAndPeriod(deviceId, from, until) {
    return repo.listByDeviceIdAndPeriod(deviceId, from, until);
}

function create(dto) {
    const entry = {
        ...dto,
        datetime: Date.now()
    };

    repo.create(entry);
}

module.exports = {
    create,
    latestByDeviceId,
    listByDeviceIdAndPeriod
};
