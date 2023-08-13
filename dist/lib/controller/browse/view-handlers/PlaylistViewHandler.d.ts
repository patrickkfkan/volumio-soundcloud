import PlaylistEntity from '../../../entities/PlaylistEntity';
import { LoopFetchResult } from '../../../model/BaseModel';
import SetViewHandler, { SetView, SetViewHandlerGetSetsParams } from './SetViewHandler';
import BaseRenderer from './renderers/BaseRenderer';
export interface PlaylistView extends SetView {
    name: 'playlists';
    playlistId?: string;
    type?: 'system';
}
export default class PlaylistViewHandler extends SetViewHandler<PlaylistView, string | number, PlaylistEntity> {
    #private;
    protected getSetIdFromView(): string | number | null | undefined;
    protected getSet(id: string | number): Promise<{
        folder: PlaylistEntity;
        tracksOffset?: number;
        tracksLimit?: number;
    }>;
    protected getSets(modelParams: SetViewHandlerGetSetsParams): Promise<LoopFetchResult<PlaylistEntity>>;
    protected getSetsListTitle(): string;
    protected getSetRenderer(): BaseRenderer<PlaylistEntity, PlaylistEntity>;
    protected getExplodedTrackInfoFromParamName(): 'fromAlbumId' | 'fromPlaylistId';
    protected getVisitLinkTitle(): string;
}
//# sourceMappingURL=PlaylistViewHandler.d.ts.map