const BaseEntity = require('./base');
const User = require('./user');

class BasePlaylist extends BaseEntity {

    getId() {
        return this.getJSON('id');
    }
    
    getUser() {
        let self = this;
        return self.lazyGet('user', () => {
            return new User(self.getJSON('user'));
        })
    }
    
    getPermalink() {
        return {
            basic: this.getJSON('permalink'),
            full: this.getJSON('permalink_url')
        }
    }

    async getTracks(options = {}) {
        let self = this;
        let offset = options.offset || 0;
        let keySuffix = '_' + offset;
        if (options.limit) {
            keySuffix += '-' + (offset + options.limit);
        }
        return self.lazyGetAsync(`tracks${keySuffix}`, async() => {
            let trackIds = await self._getTrackIds();
            if (options.limit) {
                trackIds = trackIds.slice(offset, options.limit + offset);
            }
            else if (offset) {
                trackIds = trackIds.slice(offset);
            }
            let tracks = await self.getClient().getTracks(trackIds);
            // Tracks do not appear in the same order as trackIds, so
            // we need to sort them ourselves
            let orderedTracks = [];
            tracks.forEach( (track) => {
                    let trackIndex = trackIds.indexOf(track.getId());
                    if (trackIndex >= 0) {
                        orderedTracks[trackIndex] = track;
                    }
            });
            // Make sure there are no 'gaps' in the array
            orderedTracks = orderedTracks.filter( t => t !== undefined );
            return orderedTracks;
        });
    }

    async _getTrackIds() {
        let self = this;
        return self.lazyGetAsync('trackIds', async () => {
            // Check if we already have tracks in JSON data.
            // If not, we need to refetch the playlist with full 
            // representation
            let tracks = this.getJSON('tracks');
            if (Array.isArray(tracks)) {
               return tracks.map( track => track.id );
            }
            else {
                let fullPlaylist = await self.getClient().getPlaylist(self.getId());
                let tracks = fullPlaylist.getJSON('tracks');
                if (Array.isArray(tracks)) {
                    return tracks.map( track => track.id );
                }
                else {
                    return [];
                }
            }
        });
    }
}

module.exports = BasePlaylist;