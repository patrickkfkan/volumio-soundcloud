const Album = require('./album');
const Playlist = require('./playlist');
const Selection = require('./selection');
const SystemPlaylist = require('./system_playlist');
const Track = require('./track');
const User = require('./user');

const Entities = {
    Album, Playlist, Selection, SystemPlaylist, Track, User
};

Entities.buildByKind = (json, client) => {
    let _class;
    switch(json.kind) {
        case 'playlist':
            _class = json.is_album ? Album : Playlist;
            break;
        case 'selection':
            _class = Selection;
            break;
        case 'system-playlist':
            _class = SystemPlaylist;
            break;
        case 'track':
            _class = Track;
            break;
        case 'user':
            _class = User;
            break;
        default:
            _class = null;
    }
    if (_class) {
        return new _class(json, client);
    }
    return null;
}

module.exports = Entities;