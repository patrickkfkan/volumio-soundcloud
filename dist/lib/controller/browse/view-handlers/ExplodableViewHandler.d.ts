import TrackEntity from '../../../entities/TrackEntity';
import BaseViewHandler from './BaseViewHandler';
import View from './View';
export interface QueueItem {
    service: 'soundcloud';
    uri: string;
    albumart?: string;
    artist?: string;
    album?: string;
    name: string;
    title: string;
    duration?: number;
    samplerate?: string;
}
export interface ExplodedTrackInfo extends TrackEntity {
    fromAlbumId?: number;
    fromPlaylistId?: number;
}
export default abstract class ExplodableViewHandler<V extends View> extends BaseViewHandler<V> {
    explode(): Promise<QueueItem[]>;
    protected abstract getTracksOnExplode(): Promise<ExplodedTrackInfo | ExplodedTrackInfo[]>;
}
//# sourceMappingURL=ExplodableViewHandler.d.ts.map