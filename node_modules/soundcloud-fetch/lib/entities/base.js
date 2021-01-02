const {ARTWORK_FORMATS, AVATAR_FORMATS} = require('../constants');

class BaseEntity {

    constructor(json, client) {
        this.json = json;
        this.client = client;
        this._lazyValues = {};
    }

    getType() {
        throw new Error('getType() cannot be called on BaseEntity');
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

    lazyGet(key, getValue) {
        if (this._lazyValues[key] === undefined) {
            this._lazyValues[key] = getValue();
        }
        return this._lazyValues[key];
    }

    async lazyGetAsync(key, getValueAsync) {
        if (this._lazyValues[key] !== undefined) {
            return this._lazyValues[key];
        }
        return getValueAsync().then( (value) => {
            this._lazyValues[key] = value;
            return value;
        });
    }

    _getImageUrls(defaultImageUrl, type = 'artwork') {
        if (defaultImageUrl === null) {
            return null;
        }
        else if (defaultImageUrl.indexOf('large.jpg') < 0) {
            return defaultImageUrl;
        }

        const formats = type === 'avatar' ? AVATAR_FORMATS : ARTWORK_FORMATS;

        let formatUrls = {
            default: defaultImageUrl
        };
        formats.forEach( (format) => {
            formatUrls[format] = defaultImageUrl.replace('large.jpg', `${format}.jpg`);
        });
        return formatUrls;
    }
}

module.exports = BaseEntity;