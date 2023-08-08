import AlbumEntity from '../../../entities/AlbumEntity';
import { LoopFetchResult } from '../../../model/BaseModel';
import MusicFolderViewHandler, { MusicFolderView, MusicFolderViewHandlerGetFoldersParams } from './MusicFolderViewHandler';
import BaseRenderer from './renderers/BaseRenderer';
export interface AlbumView extends MusicFolderView {
    name: 'albums';
    albumId?: string;
}
export default class AlbumViewHandler extends MusicFolderViewHandler<AlbumView, number, AlbumEntity> {
    #private;
    protected getFolderIdFromView(): number | null | undefined;
    protected getFolder(id: number): Promise<{
        folder: AlbumEntity;
        tracksOffset?: number;
        tracksLimit?: number;
    }>;
    protected getFolders(modelParams: MusicFolderViewHandlerGetFoldersParams): Promise<LoopFetchResult<AlbumEntity>>;
    protected getFoldersListTitle(): string;
    protected getFolderRenderer(): BaseRenderer<AlbumEntity, AlbumEntity>;
    protected getExplodedTrackInfoFromParamName(): 'fromAlbumId' | 'fromPlaylistId';
    protected getVisitLinkTitle(): string;
}
//# sourceMappingURL=AlbumViewHandler.d.ts.map