const localDb = {};

function create(entry) {
    const id = Object.values(localDb).length + 1;
    localDb[id] = {
        id,
        ...entry
    };
    return id;
}

module.exports = {
    create
}
