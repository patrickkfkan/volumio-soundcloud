const BasePlaylist = require('./base_playlist');
const { EOL } = require('os');

class Playlist extends BasePlaylist {
    
    getType() {
        return 'playlist';
    }

    isPublic() {
        return this.getJSON('public');
    }

    getApiInfo() {
        let self = this;
        return self.lazyGet('api', () => {
            return {
                uri: self.getJSON('uri'),
            };
        });
    }

    getArtwork() {
        return this._getImageUrls(this.getJSON('artwork_url'));
    }

    getSetType() {
        return this.getJSON('set_type');
    }

    getDuration() {
        return this.getJSON('duration');
    }
   
    getDates() {
        let self = this;
        return self.lazyGet('dates', () => {
            return {
                created: self.getJSON('created_at'),
                published: self.getJSON('published_at'),
                modified: self.getJSON('last_modified'),
                display: self.getJSON('display_date')
            };
        });
    }

    getSharingInfo() {
        let self = this;
        return self.lazyGet('sharing', () => {
            return {
                shareability: self.getJSON('sharing'),
                secretToken: self.getJSON('secret_token')
            };
        });
    }

    getTexts() {
        let self = this;
        return self.lazyGet('texts', () => {
            return {
                title: this.getJSON('title'),
                description: this.getJSON('description')
            };
        });
    }

    getTrackCount() {
        return this.getJSON('track_count');
    }

    getSocialInfo() {
        let self = this;
        return self.lazyGet('social', () => {
            return {
                likesCount: self.getJSON('likes_count'),
                repostsCount: self.getJSON('reposts_count'),
                managedByFeeds: self.getJSON('managed_by_feeds')
            };
        });
    }

    toSnippet(indent = '') {
        return indent +
            `Type: ${this.getType()}${EOL}` + indent +
            `Id: ${this.getId()}${EOL}` + indent + 
            `Title: ${this.getTexts().title}${EOL}` + indent +
            `Tracks: ${this.getTrackCount()}${EOL}` + indent +
            `Permalink: ${this.getPermalink().full}${EOL}` + indent +
            `User:${EOL}` + this.getUser().toSnippet(indent + '  ');
    }
}

module.exports = Playlist;