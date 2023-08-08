import sc from '../SoundCloudContext';
import TrackEntity from '../entities/TrackEntity';

export default class TrackHelper {

  static cacheTracks(tracks: TrackEntity[], cacheKeyGen: (keyData: Record<string, any>) => string) {
    const cache = sc.getCache();
    tracks.forEach((track) => {
      const keyData = { trackId: track.id };
      const key = cacheKeyGen(keyData);
      cache.put(key, track);
    });
  }

  static getPreferredTranscoding(track: TrackEntity) {
    let transcodingUrl = null;
    const preferred = [
      { protocol: 'progressive', mimeType: 'audio/mpeg' },
      { protocol: 'hls', mimeType: 'audio/ogg; codecs="opus"' },
      { protocol: 'hls', mimeType: 'audio/mpeg' } // This one will probably not play well, but leaving it here anyway
    ];
    while (transcodingUrl === null && preferred.length > 0) {
      const p = preferred.shift();
      if (p) {
        const s = track.transcodings.find(
          (t) => t.protocol === p.protocol && t.mimeType === p.mimeType);
        if (s) {
          transcodingUrl = s.url;
        }
      }
    }
    return transcodingUrl;
  }
}
