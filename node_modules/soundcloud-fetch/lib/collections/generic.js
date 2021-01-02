const BaseCollection = require('./base');
const buildEntityByKind = require('../entities').buildByKind;

class GenericCollection extends BaseCollection{

    constructor(json, client) {
        super(json, client);

        if (Array.isArray(json)) {
            this._items = json;
        }
        else if (Array.isArray(json.collection)) {
            this._items = json.collection;
        }
        else {
            this._items = [];
        }
    }

    getType() {
        return this.getJSON('kind') || 'unknown-collection';
    }

    getItems() {
        let self = this;
        let client = self.getClient();
        return self.lazyGet('items', () => {
            let arr = [];
            self._items.forEach( (item) => {
                let entity = buildEntityByKind(item, client);
                if (entity !== null) {
                    arr.push(entity);
                }
            });
            return arr;
        });
    }

}

module.exports = GenericCollection;