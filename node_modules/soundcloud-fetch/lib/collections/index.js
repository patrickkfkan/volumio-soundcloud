const GenericCollection = require('./generic');

let Collections = {
    GenericCollection
};

Collections.build = (json, client) => {
    return new GenericCollection(json, client);
}

module.exports = Collections;