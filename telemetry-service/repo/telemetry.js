
const localDb = {};

function latestByDeviceId(deviceId) {
    return Object.values(localDb).filter(e => e.device_id === deviceId).sort((a, b) => {
        return new Date(a.datetime).getTime() < new Date(b.datetime).getTime() ? 1 : -1;
    }).find(() => true);
}

function listByDeviceIdAndPeriod(deviceId, from, until) {
    const fromTime = Date.parse(from);
    const untilTime = Date.parse(until);
    return Object.values(localDb).filter(e => {
        const entryTime = new Date(e.datetime).getTime();
        return e.device_id === deviceId && entryTime >= new Date(fromTime).getTime() && entryTime < new Date(untilTime).getTime();
    });
}

function create(entry) {
    const id = Object.values(localDb).length + 1;
    localDb[id] = {
        id,
        ...entry
    };
    return id;
}

module.exports = {
    create,
    latestByDeviceId,
    listByDeviceIdAndPeriod
}
