const repo = require('../repo/device-type')

function create(dto) {
    return repo.create(dto);
}

module.exports = {
    create
};
