const BaseEntity = require('./base');
const { EOL } = require('os');

class User extends BaseEntity {

    getId() {
        return this.getJSON('id');
    }

    getType() {
        return 'user';
    }

    getNames() {
        return {
            full: this.getJSON('full_name'),
            first: this.getJSON('first_name'),
            last: this.getJSON('last_name'),
            username: this.getJSON('username')
        }
    }

    getLastModified() {
        return this.getJSON('last_modified');
    }

    getPermalink() {
        return {
            basic: this.getJSON('permalink'),
            full: this.getJSON('permalink_url')
        }
    }

    getApiInfo() {
        return {
            uri: this.getJSON('uri'),
            urn: this.getJSON('urn')
        }
    }

    getLocation() {
        return {
            city: this.getJSON('city'),
            country: this.getJSON('country_code')
        }
    }

    isVerified() {
        return this.getJSON('verified');
    }

    getAvatar() {
        return this._getImageUrls(this.getJSON('avatar_url'), 'avatar');
    }

    getBadges() {
        let badges = this.getJSON('badges');
        return {
            pro: badges.pro,
            proUnlimited: badges.pro_unlimited,
            verified: badges.verified
        };
    }

    toSnippet(indent = '') {
        return indent +
            `Type: ${this.getType()}${EOL}` + indent +
            `User Id: ${this.getId()}${EOL}` + indent +
            `Full name: ${this.getNames().full}${EOL}` + indent +
            `Username: ${this.getNames().username}${EOL}` + indent +
            `Permalink: ${this.getPermalink().full}${EOL}` + indent +
            `getLocation: ${this.getLocation()}${EOL}`;
    }
}

module.exports = User;