import PlaylistEntity from '../../../entities/PlaylistEntity';
import { LoopFetchResult } from '../../../model/BaseModel';
import MusicFolderViewHandler, { MusicFolderView, MusicFolderViewHandlerGetFoldersParams } from './MusicFolderViewHandler';
import BaseRenderer from './renderers/BaseRenderer';
export interface PlaylistView extends MusicFolderView {
    name: 'playlists';
    playlistId?: string;
    type?: 'system';
}
export default class PlaylistViewHandler extends MusicFolderViewHandler<PlaylistView, string | number, PlaylistEntity> {
    #private;
    protected getFolderIdFromView(): string | number | null | undefined;
    protected getFolder(id: string | number): Promise<{
        folder: PlaylistEntity;
        tracksOffset?: number;
        tracksLimit?: number;
    }>;
    protected getFolders(modelParams: MusicFolderViewHandlerGetFoldersParams): Promise<LoopFetchResult<PlaylistEntity>>;
    protected getFoldersListTitle(): string;
    protected getFolderRenderer(): BaseRenderer<PlaylistEntity, PlaylistEntity>;
    protected getExplodedTrackInfoFromParamName(): 'fromAlbumId' | 'fromPlaylistId';
    protected getVisitLinkTitle(): string;
}
//# sourceMappingURL=PlaylistViewHandler.d.ts.map