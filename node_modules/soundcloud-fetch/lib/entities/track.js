const BaseEntity = require('./base');
const User = require('./user');
const Publisher = require('./publisher');
const MediaTranscoding = require('./transcoding');
const { EOL } = require('os');

class Track extends BaseEntity {

    getId() {
        return this.getJSON('id');
    }

    getType() {
        return 'track';
    }

    getTexts() {
        let self = this;
        return self.lazyGet('texts', () => {
            return {
                title: self.getJSON('title'),
                description: self.getJSON('description'),
                caption: self.getJSON('caption')
            };
        });
    }

    getDates() {
        let self = this;
        return self.lazyGet('dates', () => {
            return {
                created: self.getJSON('created_at'),
                released: self.getJSON('release_date'),
                modified: self.getJSON('last_modified'),
                display: self.getJSON('display_date')
            };
        });
    }

    getDownloadInfo() {
        let self = this;
        return self.lazyGet('download', () => {
            return {
                downloadable: self.getJSON('downloadable'),
                downloadCount: self.getJSON('download_count'),
                hasDownloadsLeft: self.getJSON('has_downloads_left')
            };
        });
    }

    getSocialInfo() {
        let self = this;
        return self.lazyGet('social', () => {
            return {
                commentable: self.getJSON('commentable'),
                commentCount: self.getJSON('comment_count'),
                likesCount: self.getJSON('likes_count'),
                repostsCount: self.getJSON('reposts_count')
            };
        });
    }

    getSharingInfo() {
        let self = this;
        return self.lazyGet('sharing', () => {
            return {
                shareability: self.getJSON('sharing'),
                embeddableBy: self.getJSON('embeddable_by'),
                secretToken: self.getJSON('secret_token')
            };
        });
    }

    getPlaybackInfo() {
        let self = this;
        return self.lazyGet('playback', () => {
            return {
                playbackCount: self.getJSON('playback_count'),
                policy: self.getJSON('policy')
            };
        });
    }

    isBlocked() {
        return this.getPlaybackInfo().policy === 'BLOCK';
    }

    isSnipped() {
        return this.getPlaybackInfo().policy === 'SNIP';
    }

    getMediaInfo() {
        let self = this;
        return self.lazyGet('media', () => {
            return {
                trackFormat: self.getJSON('track_format'),
                encodingState: self.getJSON('state'),
                transcodings: self._parseTranscodings(self.getJSON('media').transcodings)
            };
        });
    }

    getPermalink() {
        let self = this;
        return self.lazyGet('permalink', () => {
            return {
                basic: self.getJSON('permalink'),
                full: self.getJSON('permalink_url')
            };
        });
    }

    getApiInfo() {
        let self = this;
        return self.lazyGet('api', () => {
            return {
                streamable: self.getJSON('streamable'),
                uri: self.getJSON('uri'),
                urn: self.getJSON('urn')
            };
        });
    }

    getPurchaseInfo() {
        let self = this;
        return self.lazyGet('purchase', () => {
            return {
                title: self.getJSON('purchase_title'),
                url: self.getJSON('purchase_url'),
            };
        });
    }

    getPublisher() {
        let self = this;
        return self.lazyGet('publisher', () => {
            if (self.getJSON('publisher_metadata')) {
                return new Publisher(self.getJSON('publisher_metadata'));
            }
            else {
                return null;
            }
        });
    }

    getDurations() {
        let self = this;
        return self.lazyGet('durations', () => {
            return {
                full: self.getJSON('full_duration'),
                playback: self.getJSON('duration')
            };
        });
    }

    getGenre() {
        return this.getJSON('genre');
    }

    getLicense() {
        return this.getJSON('license');
    }

    isPublic() {
        return this.getJSON('public');
    }

    getTags() {
        return this.getJSON('tag_list');
    }

    getLabel() {
        return this.getJSON('label_name');
    }

    getArtwork() {
        return this._getImageUrls(this.getJSON('artwork_url'));
    }

    getWaveform() {
        return this.getJSON('waveform_url');
    }

    getUser() {
        let self = this;
        return self.lazyGet('user', () => {
            return new User(self.getJSON('user'));
        })
    }

    _parseTranscodings(transcodings) {
        let t = [];
        if (transcodings) {
            transcodings.forEach( (tran) => {
                t.push(new MediaTranscoding(tran));
            });
        }
        return t;
    }

    toSnippet(indent = '') {
        return indent +
            `Type: ${this.getType()}${EOL}` + indent +
            `Track Id: ${this.getId()}${EOL}` + indent + 
            `Title: ${this.getTexts().title}${EOL}` + indent +
            `Duration: ${this.getDurations().full}${EOL}` + indent +
            `Created: ${this.getDates().created}${EOL}` + indent +
            `Downloadable: ${this.getDownloadInfo().downloadable}${EOL}` + indent +
            `Likes: ${this.getSocialInfo().likesCount}${EOL}` + indent +
            `Sharing: ${this.getSharingInfo().shareability}${EOL}` + indent +
            `Playback count: ${this.getPlaybackInfo().playbackCount}${EOL}` + indent +
            `Purchase URL: ${this.getPurchaseInfo().url}${EOL}` + indent +
            `API URI: ${this.getApiInfo().uri}${EOL}` + indent +
            `Permalink: ${this.getPermalink().full}${EOL}` + indent +
            `User:${EOL}` + this.getUser().toSnippet(indent + '  ') + indent +
            `Transcodings: ${this.getMediaInfo().transcodings}${EOL}` + indent +
            'Publisher:' + (this.getPublisher() !== null ? EOL + this.getPublisher().toSnippet(indent + '  ') : 'null');
    }

}

module.exports = Track;