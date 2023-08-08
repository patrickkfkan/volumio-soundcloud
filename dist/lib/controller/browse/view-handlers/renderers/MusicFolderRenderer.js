"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SoundCloudContext_1 = __importDefault(require("../../../../SoundCloudContext"));
const BaseRenderer_1 = __importDefault(require("./BaseRenderer"));
class MusicFolderRenderer extends BaseRenderer_1.default {
    renderToListItem(data) {
        if (data.id === undefined || data.id === null || data.id === '' || !data.title) {
            return null;
        }
        const result = {
            service: 'soundcloud',
            type: 'folder',
            title: data.title,
            artist: data.user?.username,
            album: SoundCloudContext_1.default.getI18n('SOUNDCLOUD_PLAYLIST_PARSER_ALBUM'),
            albumart: data.thumbnail || this.getSoundCloudIcon(),
            uri: this.getListItemUri(data)
        };
        return result;
    }
    renderToHeader(data) {
        return {
            'uri': this.uri,
            'service': 'soundcloud',
            'type': 'album',
            'title': data.title,
            'artist': data.user?.username,
            'year': data.user?.fullname !== data.user?.username ? data.user?.fullname : null,
            'duration': data.user?.location,
            'albumart': data.thumbnail || this.getSoundCloudIcon()
        };
    }
}
exports.default = MusicFolderRenderer;
//# sourceMappingURL=MusicFolderRenderer.js.map