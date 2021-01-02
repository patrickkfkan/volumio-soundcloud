const BaseEntity = require('./base');
const { EOL } = require('os');

class Publisher extends BaseEntity {

    getId() {
        return this.getJSON('id');
    }

    getType() {
        return 'publisher';
    }

    getArtist() {
        return this.getJSON('artist');
    }

    getAlbumTitle() {
        return this.getJSON('album_title');
    }

    containsMusic() {
        return this.getJSON('contains_music');
    }

    getUPCOrEAN() {
        return this.getJSON('upc_or_ean');
    }

    getISRC() {
        return this.getJSON('isrc');
    }

    isExplicit() {
        return this.getJSON('explicit');
    }

    getReleaseTitle() {
        return this.getJSON('release_title');
    }

    getCopyrightText() {
        let self = this;

        return self.lazyGet('copyright', () => {
            return {
                general: {
                    p: this.getJSON('p_line'),
                    c: this.getJSON('c_line')
                },
                display: {
                    p: this.getJSON('p_line_for_display'),
                    c: this.getJSON('c_line_for_display')
                }
            };
        });
    }

    getApiInfo() {
        let self = this;
        return self.lazyGet('api', () => {
            return {
                urn: self.getJSON('urn'),
            };
        });
    }  

    toSnippet(indent = '') {
        return indent +
            `Type: ${this.getType()}${EOL}` + indent +
            `Publisher Id: ${this.getId()}${EOL}` + indent + 
            `Album: ${this.getAlbumTitle()}${EOL}` + indent +
            `Copyright: ${this.getCopyrightText().general.c}${EOL}`;
    }
}

module.exports = Publisher;