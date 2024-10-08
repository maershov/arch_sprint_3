const repo = require('../repo/module')

function create(dto) {
    return repo.create(dto);
}

module.exports = {
    create
};
