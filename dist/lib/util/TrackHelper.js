"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SoundCloudContext_1 = __importDefault(require("../SoundCloudContext"));
class TrackHelper {
    static cacheTracks(tracks, cacheKeyGen) {
        const cache = SoundCloudContext_1.default.getCache();
        tracks.forEach((track) => {
            const keyData = { trackId: track.id };
            const key = cacheKeyGen(keyData);
            cache.put(key, track);
        });
    }
    static getPreferredTranscoding(track) {
        let transcodingUrl = null;
        const preferred = [
            { protocol: 'progressive', mimeType: 'audio/mpeg' },
            { protocol: 'hls', mimeType: 'audio/ogg; codecs="opus"' },
            { protocol: 'hls', mimeType: 'audio/mpeg' } // This one will probably not play well, but leaving it here anyway
        ];
        while (transcodingUrl === null && preferred.length > 0) {
            const p = preferred.shift();
            if (p) {
                const s = track.transcodings.find((t) => t.protocol === p.protocol && t.mimeType === p.mimeType);
                if (s) {
                    transcodingUrl = s.url;
                }
            }
        }
        return transcodingUrl;
    }
}
exports.default = TrackHelper;
//# sourceMappingURL=TrackHelper.js.map