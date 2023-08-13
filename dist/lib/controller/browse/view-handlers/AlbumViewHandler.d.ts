import AlbumEntity from '../../../entities/AlbumEntity';
import { LoopFetchResult } from '../../../model/BaseModel';
import SetViewHandler, { SetView, SetViewHandlerGetSetsParams } from './SetViewHandler';
import BaseRenderer from './renderers/BaseRenderer';
export interface AlbumView extends SetView {
    name: 'albums';
    albumId?: string;
}
export default class AlbumViewHandler extends SetViewHandler<AlbumView, number, AlbumEntity> {
    #private;
    protected getSetIdFromView(): number | null | undefined;
    protected getSet(id: number): Promise<{
        folder: AlbumEntity;
        tracksOffset?: number;
        tracksLimit?: number;
    }>;
    protected getSets(modelParams: SetViewHandlerGetSetsParams): Promise<LoopFetchResult<AlbumEntity>>;
    protected getSetsListTitle(): string;
    protected getSetRenderer(): BaseRenderer<AlbumEntity, AlbumEntity>;
    protected getExplodedTrackInfoFromParamName(): 'fromAlbumId' | 'fromPlaylistId';
    protected getVisitLinkTitle(): string;
}
//# sourceMappingURL=AlbumViewHandler.d.ts.map