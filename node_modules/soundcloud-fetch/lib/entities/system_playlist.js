const BasePlaylist = require('./base_playlist');
const { EOL } = require('os');

class SystemPlaylist extends BasePlaylist {

    getType() {
        return 'system-playlist';
    }

    isPublic() {
        return this.getJSON('is_public');
    }

    getApiInfo() {
        let self = this;
        return self.lazyGet('api', () => {
            return {
                urn: self.getJSON('urn'),
                queryUrn: self.getJSON('query_urn')
            };
        });
    }  

    getArtwork() {
        return {
            original: this._getImageUrls(this.getJSON('artwork_url')),
            calculated: this._getImageUrls(this.getJSON('calculated_artwork_url'))
        };
    }

    getPermalink() {
        return {
            basic: this.getJSON('permalink'),
            full: this.getJSON('permalink_url')
        }
    }

    getMadeFor() {
        return this.getJSON('made_for');
    }
      
    getLastUpdated() {
        return this.getJSON('last_updated');
    }

    getTexts() {
        let self = this;
        return self.lazyGet('texts', () => {
            return {
                title: {
                    full: this.getJSON('title'),
                    short: this.getJSON('short_title')
                },
                description: {
                    full: this.getJSON('description'),
                    short: this.getJSON('short_description')
                }
            };
        });
    }

    getTrackCount() {
        let tracks = this.getJSON('tracks');
        if (Array.isArray(tracks)) {
            return tracks.length;
        }
        return 0;
    }

    toSnippet(indent = '') {
        return indent +
            `Type: ${this.getType()}${EOL}` + indent +
            `Id: ${this.getId()}${EOL}` + indent + 
            `Title: ${this.getTexts().title.full}${EOL}` + indent +
            `Permalink: ${this.getPermalink().full}${EOL}` + indent +
            `API URN: ${this.getApiInfo().urn}${EOL}` + indent +
            `User:${EOL}` + this.getUser().toSnippet(indent + '  ');
    }
}

module.exports = SystemPlaylist;