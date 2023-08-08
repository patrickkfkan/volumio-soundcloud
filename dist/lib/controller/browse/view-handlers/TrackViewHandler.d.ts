import ExplodableViewHandler, { ExplodedTrackInfo } from './ExplodableViewHandler';
import View from './View';
import { RenderedPage } from './ViewHandler';
export interface TrackView extends View {
    name: 'tracks' | 'track';
    search?: string;
    userId?: string;
    topFeatured?: '1';
    combinedSearch?: '1';
    title?: string;
    trackId?: string;
}
export default class TrackViewHandler extends ExplodableViewHandler<TrackView> {
    browse(): Promise<RenderedPage>;
    protected getTracksOnExplode(): Promise<ExplodedTrackInfo | ExplodedTrackInfo[]>;
}
//# sourceMappingURL=TrackViewHandler.d.ts.map