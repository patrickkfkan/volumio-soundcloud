import ExplodableViewHandler, { ExplodedTrackInfo } from './ExplodableViewHandler';
import View from './View';
import { RenderedPage } from './ViewHandler';
import BaseRenderer from './renderers/BaseRenderer';
import MusicFolderEntity from '../../../entities/MusicFolderEntity';
import { LoopFetchResult } from '../../../model/BaseModel';
export interface MusicFolderView extends View {
    search?: string;
    userId?: string;
    title?: string;
    combinedSearch?: '1';
}
export interface MusicFolderViewHandlerGetFoldersParams {
    userId?: number;
    search?: string;
    pageToken?: string;
    pageOffset?: number;
    limit?: number;
}
export default abstract class MusicFolderViewHandler<T extends MusicFolderView, ID extends string | number, E extends MusicFolderEntity> extends ExplodableViewHandler<T> {
    protected abstract getFolderIdFromView(): ID | null | undefined;
    protected abstract getFolder(id: ID): Promise<{
        folder: E;
        tracksOffset?: number;
        tracksLimit?: number;
    }>;
    protected abstract getFolders(modelParams: MusicFolderViewHandlerGetFoldersParams): Promise<LoopFetchResult<E>>;
    protected abstract getFoldersListTitle(): string;
    protected abstract getFolderRenderer(): BaseRenderer<E>;
    protected abstract getExplodedTrackInfoFromParamName(): 'fromAlbumId' | 'fromPlaylistId';
    protected abstract getVisitLinkTitle(): string;
    browse(): Promise<RenderedPage>;
    protected browseSearch(query: string): Promise<RenderedPage>;
    protected browseByUser(userId: number): Promise<RenderedPage>;
    protected browseFolder(id: ID): Promise<RenderedPage>;
    protected getTracksOnExplode(): Promise<ExplodedTrackInfo | ExplodedTrackInfo[]>;
}
//# sourceMappingURL=MusicFolderViewHandler.d.ts.map