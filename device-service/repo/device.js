const localDb = {};

function create(entry) {
    const id = Object.values(localDb).length + 1;
    localDb[id] = {
        id,
        ...entry
    };
    return id;
}

function read(id) {
    return localDb[id];
}

function changeStatus(id, status) {
    const entry = read(id);
    if (!!entry) {
        localDb[id] = {
            ...entry,
            status
        };
        return true;
    }

    return false;
}

module.exports = {
    create,
    read,
    changeStatus
};
