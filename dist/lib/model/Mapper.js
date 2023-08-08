"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Mapper_getThumbnail;
Object.defineProperty(exports, "__esModule", { value: true });
const soundcloud_fetch_1 = require("soundcloud-fetch");
class Mapper {
    static mapUser(data) {
        const { id, names, location, permalink } = data;
        let locationFull = '';
        if (location?.city) {
            locationFull = location.city;
            if (location.country) {
                locationFull += `, ${location.country}`;
            }
        }
        const result = {
            id,
            username: names?.username,
            fullname: names?.full,
            thumbnail: __classPrivateFieldGet(this, _a, "m", _Mapper_getThumbnail).call(this, data),
            permalink: permalink?.full,
            location: locationFull
        };
        return result;
    }
    static mapPlaylist(data) {
        const { id, permalink, user, trackCount } = data;
        let title, description;
        let type;
        if (data instanceof soundcloud_fetch_1.SystemPlaylist) {
            title = data.texts?.title?.full;
            description = data.texts?.description?.full;
            type = 'system-playlist';
        }
        else {
            title = data.texts?.title;
            description = data.texts?.description;
            type = 'playlist';
        }
        const result = {
            type,
            id,
            title,
            description,
            thumbnail: __classPrivateFieldGet(this, _a, "m", _Mapper_getThumbnail).call(this, data),
            permalink: permalink?.full,
            user: user ? this.mapUser(user) : null,
            tracks: [],
            trackCount: trackCount
        };
        return result;
    }
    static mapTrack(data) {
        const { id, texts, publisher, mediaInfo, user } = data;
        const album = publisher?.albumTitle || publisher?.releaseTitle || null;
        const playableState = data.isBlocked ? 'blocked' :
            data.isSnipped ? 'snipped' :
                'allowed';
        const transcodings = mediaInfo?.transcodings?.map((t) => ({
            url: t.url,
            protocol: t.protocol,
            mimeType: t.mimeType
        })) || [];
        const result = {
            type: 'track',
            id,
            title: texts?.title,
            album,
            thumbnail: __classPrivateFieldGet(this, _a, "m", _Mapper_getThumbnail).call(this, data),
            playableState,
            transcodings,
            user: user ? this.mapUser(user) : null
        };
        return result;
    }
    static mapAlbum(data) {
        const { id, permalink, user, trackCount } = data;
        const title = data.texts?.title;
        const description = data.texts?.description;
        const result = {
            id,
            type: 'album',
            title,
            description,
            thumbnail: __classPrivateFieldGet(this, _a, "m", _Mapper_getThumbnail).call(this, data),
            permalink: permalink?.full,
            user: user ? this.mapUser(user) : null,
            tracks: [],
            trackCount
        };
        return result;
    }
    static mapSelection(data) {
        const items = data.items.reduce((result, item) => {
            if (item instanceof soundcloud_fetch_1.Playlist || item instanceof soundcloud_fetch_1.SystemPlaylist) {
                result.push(this.mapPlaylist(item));
            }
            return result;
        }, []);
        const result = {
            type: 'selection',
            id: data.id,
            title: data.title,
            items
        };
        return result;
    }
}
exports.default = Mapper;
_a = Mapper, _Mapper_getThumbnail = function _Mapper_getThumbnail(data) {
    let artwork;
    if (data instanceof soundcloud_fetch_1.User) {
        artwork = data.avatar;
    }
    else if (data instanceof soundcloud_fetch_1.SystemPlaylist) {
        artwork = data.artwork?.original || data.artwork?.calculated;
    }
    else if (data instanceof soundcloud_fetch_1.Playlist || data instanceof soundcloud_fetch_1.Track) {
        artwork = data.artwork;
    }
    else {
        artwork = null;
    }
    if (artwork) {
        return artwork.t500x500;
    }
    if (!artwork && (data instanceof soundcloud_fetch_1.Track || data instanceof soundcloud_fetch_1.Playlist ||
        data instanceof soundcloud_fetch_1.SystemPlaylist || data instanceof soundcloud_fetch_1.Album) && data.user) {
        return __classPrivateFieldGet(this, _a, "m", _Mapper_getThumbnail).call(this, data.user);
    }
    return null;
};
//# sourceMappingURL=Mapper.js.map