class BaseCollection {

    constructor(json, client) {
        this.json = json;
        this.client = client;
        this._lazyValues = {};
    }

    getType() {
        throw new Error('getType() cannot be called on BaseCollection');
    }

    getJSON(prop) {
        if (prop === undefined || prop === null) {
            return this.json;
        }
        else if (typeof prop === 'string') {
            return this.json[prop] !== undefined ? this.json[prop] : null;
        }
        return null;
    }

    getClient() {
        return this.client;
    }

    getNextUri() {
        return this.getJSON('next_href');
    }

    lazyGet(key, getValue) {
        if (this._lazyValues[key] === undefined) {
            this._lazyValues[key] = getValue();
        }
        return this._lazyValues[key];
    }
}

module.exports = BaseCollection;