const qs = require('querystring');
const sckey = require('soundcloud-key-fetch');
const fetch = require('node-fetch');
const Collections = require('./collections');
const Entities = require('./entities');
const {API_BASE_URL, QUERY_MAX_LIMIT} = require('./constants');

class SoundCloud {

    constructor(args = {}) {
        if (args.clientId !== undefined) this.clientId = clientId;
        if (args.locale !== undefined) this.locale = locale;
    }

    async getClientId() {
        let self = this;
        if (self.clientId) {
            return self.clientId;
        }
        else {
            return SoundCloud.generateClientId().then( (clientId) => {
                self.clientId = clientId;
                return clientId;
            });
        }
    }

    static async generateClientId() {
        return sckey.fetchKey();
    }

    getLocale() {
        return this.locale;
    }

    setLocale(locale) {
        if (locale !== undefined) {
            this.locale = locale;
        }
        else {
            delete this.locale;
        }
    }

    /************************************************************/
    /* Selection                                                */
    /************************************************************/

    async getMixedSelections(options) {
        let params = await this._getCommonParams(options);
        let endpoint = '/mixed-selections';
        return this._fetchCollection(endpoint, params);
    }

    /************************************************************/
    /* Playlist / Album                                         */
    /************************************************************/

    async getPlaylist(id) {
        let params = await this._getCommonParams();
        params.representation = 'full';
        let endpoint = `/playlists/${id}`;
        return this._fetchEntity(endpoint, params);
    }

    async getSystemPlaylist(id) {
        let params = await this._getCommonParams();
        let endpoint = `/system-playlists/${id}`;
        return this._fetchEntity(endpoint, params);
    }

    async getPlaylistsByUser(id, options) {
        let params = await this._getCommonParams(options);
        let endpoint = `/users/${id}/playlists_without_albums`;
        return this._fetchCollection(endpoint, params);
    }

    async getAlbum(id) {
        return this.getPlaylist(id);
    }

    async getAlbumsByUser(id, options) {
        let params = await this._getCommonParams(options);
        let endpoint = `/users/${id}/albums`;
        return this._fetchCollection(endpoint, params);
    }

    /************************************************************/
    /* Track                                                    */
    /************************************************************/

    async getTopFeaturedTracks(options) {
        let params = await this._getCommonParams(options);
        let genre =  options && options.genre ? options.genre : 'all-music';
        let endpoint = `/featured_tracks/top/${genre}`;
        return this._fetchCollection(endpoint, params);
    }

    async getTracks(ids) {
        const limit = QUERY_MAX_LIMIT;
        let params = await this._getCommonParams();
        params.linked_partitioning = 0;
        let endpoint = '/tracks';
        if (!Array.isArray(ids) || ids.length <= limit) {
            params.ids = Array.isArray(ids) ? ids.join(',') : ids;
            let collection = await this._fetchCollection(endpoint, params);
            return collection.getItems();
        }
        else {
            let promises = [];
            let offset = 0;
            while(offset < ids.length) {
                let slice = ids.slice(offset, offset + limit);
                promises.push(this.getTracks(slice));
                offset += limit;
            }
            return Promise.all(promises).then( (results) => {
                let items = [];
                results.forEach( (result) => {
                    items = items.concat(result);
                });
                return items;
            });
        }
    }

    async getTracksByUser(id, options) {
        let params = await this._getCommonParams(options);
        params.representation = 'full';
        let endpoint = `/users/${id}/tracks`;
        return this._fetchCollection(endpoint, params);
    }

    async getTrack(id) {
        let tracks = await this.getTracks(id);
        return tracks[0] || null;
    }

    async getRealMediaUrl(transcodingUrl) {
        let params = await this._getCommonParams();
        let url = transcodingUrl + '?' + qs.encode(params);
        let json = await fetch(url).then(res => res.json());
        return json.url;
    }

    /************************************************************/
    /* User                                                     */
    /************************************************************/

    async getUser(id) {
        let params = await this._getCommonParams();
        let endpoint = `/users/${id}`;
        return this._fetchEntity(endpoint, params);
    }

    /************************************************************/
    /* Search                                                   */
    /************************************************************/

    async search(q, options) {
        let params = await this._getCommonParams(options);
        params.q = q;
        let type = 'all';
        if (options && options.type) {
            type = options.type;
        }
        let endpoint = '/search';
        switch(type) {
            case 'playlist':
                endpoint += '/playlists_without_albums';
                break;
            case 'album':
                endpoint += '/albums';
                break;
            case 'track':
                endpoint += '/tracks';
                break;
            case 'user':
                endpoint += '/users';
                break;
            default:
                // Do nothing
        }
        return this._fetchCollection(endpoint, params);
    }

    /************************************************************/
    /* Internal                                                 */
    /************************************************************/

    async _getCommonParams(options = {}) {
        let clientId = await this.getClientId();
        let params = {
            client_id: clientId
        };
        if (options) {
            if (options.limit) params.limit = options.limit;
            if (options.offset) params.offset = options.offset;
        }
        if (this.locale !== undefined) {
            params.app_locale = this.locale;
        }
        return params;
    }

    async _fetchCollection(endpoint, params) {
        if (params.linked_partitioning === undefined) {
            params.linked_partitioning = 1;
        }
        let json = await this._fetchEndpoint(endpoint, params);
        return Collections.build(json, this);
    }

    async _fetchEntity(endpoint, params) {
        let json = await this._fetchEndpoint(endpoint, params);
        return Entities.buildByKind(json, this);
    }

    async _fetchEndpoint(endpoint, params) {
        let url = API_BASE_URL + endpoint + '?' + qs.encode(params);
        return fetch(url).then(res => res.json());
    }

}

SoundCloud.Constants = require('./constants');

module.exports = SoundCloud;